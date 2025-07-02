import {
  Component,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import '@dile/editor/editor.js';

@Component({
  selector: 'app-create-note-form',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [FormsModule],
  template: `
    <h2 class="text-center text-2xl">Nueva nota</h2>
    <form
      (ngSubmit)="onSubmit()"
      class="mt-8 flex flex-col gap-3 max-w-md mx-auto"
    >
      <input
        [(ngModel)]="title"
        name="noteTitle"
        placeholder="Título de la nota"
        required
        class="p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400 placeholder:text-zinc-400"
      />
      @if (titleError) {
      <p class="text-red-500 text-sm">El título es requerido</p>
      }
      <dile-editor #editor disableToolbarItems="image|link"></dile-editor>
      @if (contentError) {
      <p class="text-red-500 text-sm">El contenido es requerido</p>
      }
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
export class CreateNoteFormComponent implements AfterViewInit {
  title = '';
  content = '';
  titleError = false;
  contentError = false;
  @Output() create = new EventEmitter<{ title: string; content: string }>();
  @ViewChild('editor') editor!: ElementRef;

  ngAfterViewInit(): void {
    // Forzar altura del editor interno en el shadowRoot
    const shadow = this.editor.nativeElement.shadowRoot;
    if (shadow) {
      const style = document.createElement('style');
      style.textContent = `
          .ProseMirror {
            height: 50vh !important;
            min-height: 400px !important;
            max-height: 100%;
            box-sizing: border-box;
          }
        `;
      shadow.appendChild(style);
    }
  }

  onSubmit() {
    this.content = this.editor.nativeElement.value;
    if (this.title && this.content) {
      this.create.emit({ title: this.title, content: this.content });
      this.title = '';
      this.content = '';
    }
    this.titleError = !this.title;
    this.contentError = !this.content;
  }
}
