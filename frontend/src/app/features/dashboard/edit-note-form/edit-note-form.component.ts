import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-note-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <input
      [ngModel]="title"
      (ngModelChange)="titleChange.emit($event)"
      class="p-2 border border-zinc-300 rounded w-full mb-2"
    />
    <textarea
      [ngModel]="content"
      (ngModelChange)="contentChange.emit($event)"
      class="p-2 border border-zinc-300 rounded w-full mb-2"
    ></textarea>
    <div class="flex gap-2">
      <button
        (click)="save.emit({ title, content })"
        class="px-2 py-1 text-xs bg-black text-white rounded hover:bg-zinc-800"
      >
        Guardar
      </button>
      <button
        (click)="cancelClick.emit()"
        class="px-2 py-1 text-xs bg-zinc-200 rounded hover:bg-zinc-300"
      >
        Cancelar
      </button>
    </div>
  `,
  styles: ``,
})
export class EditNoteFormComponent {
  @Input() title = '';
  @Input() content = '';
  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @Output() save = new EventEmitter<{ title: string; content: string }>();
  @Output() cancelClick = new EventEmitter<void>();
}
