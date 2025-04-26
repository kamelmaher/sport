import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { AuthResponse } from '../../../models/user.model';
import { NotificationService } from '../../../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-user-management',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  pendingUsers: AuthResponse[] = [];
  allUsers: AuthResponse[] = [];
  searchResults: AuthResponse[] = [];
  showSearch = false;
  searchTerm = '';
  editingUser: AuthResponse | null = null;
  userForm: FormGroup;
  loading = false;

  constructor(
    private usersService: AuthService,
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPendingUsers();
    console.log('search Term:', this.searchTerm);
    console.log('searchResults:', this.searchResults);
  }

  fetchPendingUsers(): void {
    this.loading = true;
    this.usersService.getPendingUsers().subscribe({
      next: (data) => {
        this.pendingUsers = data.users;
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('فشل في جلب المستخدمين المعلقين');
        console.error('Error fetching pending users:', error);
        this.loading = false;
      }
    });
  }

  fetchAllUsers(): void {
    this.loading = true;
    this.usersService.getAllUsers().subscribe({
      next: (data) => {
        this.allUsers = data.users;
        console.log('All users:', this.allUsers);
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('فشل في جلب المستخدمين');
        console.error('Error fetching all users:', error);
        this.loading = false;
      }
    });
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    this.searchTerm = '';
    this.searchResults = [];

    if (this.showSearch && this.allUsers.length === 0) {
      this.fetchAllUsers();
    }
  }

  handleSearch(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.allUsers.filter(user =>
      user.userName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.phone.includes(this.searchTerm)
    );
    console.log('Search results:', this.searchResults);
  }

  editUser(user: AuthResponse): void {
    this.editingUser = { ...user };
    this.userForm.patchValue({
      userName: user.userName,
      phone: user.phone,
      status: user.status
    });
    this.refreshData();
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset({
      status: 'pending'
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.notificationService.error('يرجى إدخال بيانات صحيحة');
      return;
    }

    const userData = this.userForm.value;

    if (this.editingUser && this.editingUser._id) {
      // Update existing user
      this.loading = true;
      this.usersService.updateUser(this.editingUser._id, userData).subscribe({
        next: () => {
          this.notificationService.success('تم تحديث المستخدم بنجاح');
          this.refreshData();
          this.cancelEdit();
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('فشل في تحديث المستخدم');
          console.error('Error updating user:', error);
          this.loading = false;
        }
      });
    } else {
      // Create new user
      this.loading = true;
      this.usersService.createUser(userData).subscribe({
        next: () => {
          this.notificationService.success('تم إنشاء المستخدم بنجاح');
          this.refreshData();
          this.cancelEdit();
          this.loading = false;
        },
        error: (error) => {
          this.notificationService.error('فشل في إنشاء المستخدم');
          console.error('Error creating user:', error);
          this.loading = false;
        }
      });
    }
  }

  deleteUser(user: AuthResponse): void {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟')) {
      return;
    }

    if (!user._id) {
      return;
    }

    this.loading = true;
    this.usersService.deleteUser(user._id).subscribe({
      next: () => {
        this.notificationService.success('تم حذف المستخدم بنجاح');
        this.refreshData();
        if (this.editingUser && this.editingUser._id === user._id) {
          this.cancelEdit();
        }
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('فشل في حذف المستخدم');
        console.error('Error deleting user:', error);
        this.loading = false;
      }
    });
  }

  approveUser(user: AuthResponse): void {
    if (!user._id) return;

    console.log(' user ID:', user._id);
    this.loading = true;
    this.usersService.updateUser(user._id, { status: 'approved' }).subscribe({
      next: () => {
        this.notificationService.success('تم قبول المستخدم بنجاح');
        this.refreshData();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('فشل في قبول المستخدم');
        console.error('Error approving user:', error);
        this.loading = false;
      }
    });
  }

  rejectUser(user: AuthResponse): void {
    if (!user._id) return;

    this.loading = true;
    this.usersService.updateUser(user._id, { status: 'rejected' }).subscribe({
      next: () => {
        this.notificationService.success('تم رفض المستخدم بنجاح');
        this.refreshData();
        this.loading = false;
      },
      error: (error) => {
        this.notificationService.error('فشل في رفض المستخدم');
        console.error('Error rejecting user:', error);
        this.loading = false;
      }
    });
  }

  refreshData(): void {
    if (this.showSearch) {
      this.fetchAllUsers();
      if (this.searchTerm) {
        this.handleSearch();
      }
    }
    this.fetchPendingUsers();
  }

  addNewUser(): void {
    this.editingUser = {} as AuthResponse;
    this.userForm.reset({
      status: 'pending'
    });
  }
}
