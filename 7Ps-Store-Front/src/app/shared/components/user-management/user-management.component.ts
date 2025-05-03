import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    this.fetchPendingUsers();
    this.fetchAllUsers();
  }

  async fetchPendingUsers(): Promise<void> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.usersService.getPendingUsers().subscribe({
        next: (data) => {
          this.pendingUsers = data.users;
          this.loading = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          this.notificationService.error('فشل في جلب المستخدمين المعلقين');
          console.error('Error fetching pending users:', error);
          this.loading = false;
          this.cdr.detectChanges();
          reject(error);
        }
      });
    });
  }

  async fetchAllUsers(): Promise<void> {
    this.loading = true;
    return new Promise((resolve, reject) => {
      this.usersService.getAllUsers().subscribe({
        next: (data) => {
          this.allUsers = data.users;
          this.loading = false;
          this.cdr.detectChanges();
          resolve();
        },
        error: (error) => {
          this.notificationService.error('فشل في جلب المستخدمين');
          console.error('Error fetching all users:', error);
          this.loading = false;
          this.cdr.detectChanges();
          reject(error);
        }
      });
    });
  }

  async refreshData(): Promise<void> {
    this.loading = true;
    try {
      await this.fetchPendingUsers();
      if (this.showSearch) {
        await this.fetchAllUsers();
        if (this.searchTerm) {
          this.handleSearch();
        }
      }
    } catch (error) {
      this.notificationService.error('فشل في تحديث البيانات');
      console.error('Error refreshing data:', error);
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private updateUserInLists(updatedUser: AuthResponse): void {
    // تحديث pendingUsers
    const pendingIndex = this.pendingUsers.findIndex(u => u._id === updatedUser._id);
    if (pendingIndex !== -1) {
      if (updatedUser.status !== 'pending') {
        this.pendingUsers.splice(pendingIndex, 1);
      } else {
        this.pendingUsers[pendingIndex] = updatedUser;
      }
    } else if (updatedUser.status === 'pending') {
      this.pendingUsers.push(updatedUser);
    }

    // تحديث allUsers
    const allUsersIndex = this.allUsers.findIndex(u => u._id === updatedUser._id);
    if (allUsersIndex !== -1) {
      this.allUsers[allUsersIndex] = updatedUser;
    } else {
      this.allUsers.push(updatedUser);
    }

    // تحديث searchResults إذا كان البحث مفعلاً
    if (this.showSearch && this.searchTerm) {
      this.handleSearch();
    }

    this.cdr.detectChanges();
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;
    this.searchTerm = '';
    this.searchResults = [];

    if (this.showSearch && this.allUsers.length === 0) {
      this.fetchAllUsers();
    }
    this.cdr.detectChanges();
  }

  handleSearch(): void {
    if (!this.searchTerm.trim()) {
      this.searchResults = [];
      this.cdr.detectChanges();
      return;
    }

    this.searchResults = this.allUsers.filter(user =>
      user.userName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.phone?.includes(this.searchTerm)
    );
    this.cdr.detectChanges();
    this.fetchAllUsers();
  }

  editUser(user: AuthResponse): void {
    this.editingUser = { ...user };
    this.userForm.patchValue({
      userName: user.userName,
      phone: user.phone,
      status: user.status
    });
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editingUser = null;
    this.userForm.reset({
      status: 'pending'
    });
    this.cdr.detectChanges();
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.notificationService.error('يرجى إدخال بيانات صحيحة');
      return;
    }

    const userData = this.userForm.value;

    if (this.editingUser && this.editingUser._id) {
      // تحديث مستخدم موجود
      this.loading = true;
      this.usersService.updateUser(this.editingUser._id, userData).subscribe({
        next: (updatedUser) => {
          this.notificationService.success('تم تحديث المستخدم بنجاح');
          this.updateUserInLists(updatedUser);
          this.cancelEdit();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.notificationService.error('فشل في تحديث المستخدم');
          console.error('Error updating user:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      // إنشاء مستخدم جديد
      this.loading = true;
      this.usersService.createUser(userData).subscribe({
        next: (newUser) => {
          this.notificationService.success('تم إنشاء المستخدم بنجاح');
          if (newUser.status === 'pending') {
            this.pendingUsers.push(newUser);
          }
          this.allUsers.push(newUser);
          if (this.showSearch && this.searchTerm) {
            this.handleSearch();
          }
          this.cancelEdit();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.notificationService.error('فشل في إنشاء المستخدم');
          console.error('Error creating user:', error);
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  deleteUser(user: AuthResponse): void {
    if (!confirm('هل أنت متأكد من حذف هذا المستخدم؟') || !user._id) {
      return;
    }

    this.loading = true;
    this.usersService.deleteUser(user._id).subscribe({
      next: () => {
        this.notificationService.success('تم حذف المستخدم بنجاح');
        this.pendingUsers = this.pendingUsers.filter(u => u._id !== user._id);
        this.allUsers = this.allUsers.filter(u => u._id !== user._id);
        this.searchResults = this.searchResults.filter(u => u._id !== user._id);
        if (this.editingUser && this.editingUser._id === user._id) {
          this.cancelEdit();
        }
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error('فشل في حذف المستخدم');
        console.error('Error deleting user:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  approveUser(user: AuthResponse): void {
    if (!user._id) return;

    this.loading = true;
    this.usersService.updateUser(user._id, { status: 'approved' }).subscribe({
      next: (updatedUser) => {
        this.notificationService.success('تم قبول المستخدم بنجاح');
        this.updateUserInLists(updatedUser);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error('فشل في قبول المستخدم');
        console.error('Error approving user:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejectUser(user: AuthResponse): void {
    if (!user._id) return;

    this.loading = true;
    this.usersService.updateUser(user._id, { status: 'rejected' }).subscribe({
      next: (updatedUser) => {
        this.notificationService.success('تم رفض المستخدم بنجاح');
        this.updateUserInLists(updatedUser);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.notificationService.error('فشل في رفض المستخدم');
        console.error('Error rejecting user:', error);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  addNewUser(): void {
    this.editingUser = {} as AuthResponse;
    this.userForm.reset({
      status: 'pending'
    });
    this.cdr.detectChanges();
  }
}
