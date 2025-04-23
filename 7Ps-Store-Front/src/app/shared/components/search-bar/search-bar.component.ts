// src/app/shared/components/search-bar/search-bar.component.ts
import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ChannelService } from '../../../core/services/channel.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <input [formControl]="searchControl" placeholder="ابحث عن قناة..." />
    <ul *ngIf="searchResults.length">
      <li *ngFor="let channel of searchResults">
        {{ channel.channel_name }}
      </li>
    </ul>
  `
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  searchResults: any[] = []; // لتخزين نتايج البحث

  constructor(private channelService: ChannelService) {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(query => {
        if (query && typeof query === 'string') {
          this.channelService.searchChannels(query).subscribe({
            next: results => {
              this.searchResults = results; // تخزين النتايج
            },
            error: err => console.error('Search failed:', err)
          });
        } else {
          this.searchResults = []; // إفراغ النتايج لو الـ query فاضي
        }
      });
  }
}
