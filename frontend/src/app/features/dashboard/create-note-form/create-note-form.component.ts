import { Component, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-note-form',
  standalone: true,
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()" class="mt-8 flex flex-col gap-3 max-w-md">
      <input
        [(ngModel)]="title"
        name="noteTitle"
        placeholder="Título de la nota"
        required
        class="p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400"
      />
      <textarea
        [(ngModel)]="content"
        name="noteContent"
        placeholder="Contenido"
        required
        class="p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400"
      ></textarea>
      <button
        type="submit"
        class="bg-black text-white font-semibold py-2 rounded hover:bg-zinc-800 transition-colors"
      >
        Agregar nota
      </button>
    </form>
  `,
  styles: ``,
})
export class CreateNoteFormComponent {
  title = '';
  content = '';
  @Output() create = new EventEmitter<{ title: string; content: string }>();

  onSubmit() {
    if (this.title && this.content) {
      this.create.emit({ title: this.title, content: this.content });
      this.title = '';
      this.content = '';
    }
  }
}
