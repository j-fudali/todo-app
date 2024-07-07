import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-task',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>Update task</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Text</mat-label>
        <input type="text" matInput [(ngModel)]="text" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
      <button mat-button [mat-dialog-close]="text">Update</button>
    </mat-dialog-actions>
  `,
  styleUrl: './update-task.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateTaskComponent {
  text = '';
}
