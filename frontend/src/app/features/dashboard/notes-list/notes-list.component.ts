import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../types/note';
import { marked } from 'marked';
@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [],
  template: `
    <ul
      class="list-none p-0 grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center"
    >
      @for(note of notes; track note.id) {
      <li
        class="mb-3 p-4 border border-zinc-300 rounded shadow-sm group w-full max-w-xl hover:shadow-lg transition-shadow duration-200 cursor-pointer"
      >
        <article class="flex flex-col gap-6">
          <header class="flex justify-between items-end">
            <span class="inline-flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#27272a"
              >
                <path
                  d="M320-240h320v-80H320v80Zm0-160h320v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"
                />
              </svg>
              <strong class="text-xl">{{ note.title }}</strong>
            </span>
            <div
              class="flex pointer-fine:opacity-0 pointer-fine:pointer-events-none gap-1 group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200"
            >
              <button
                (click)="startEditNote.emit(note); $event.stopPropagation()"
                (keyup.enter)="
                  startEditNote.emit(note); $event.stopPropagation()
                "
                role="button"
                aria-label="Editar nota"
                class="px-2 py-1 text-xs bg-zinc-200 hover:bg-zinc-300 rounded cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#181818"
                >
                  <path
                    d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
                  />
                </svg>
              </button>
              <button
                (click)="deleteNote.emit(note); $event.stopPropagation()"
                (keyup.enter)="deleteNote.emit(note); $event.stopPropagation()"
                class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-700 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e3e3e3"
                >
                  <path
                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z"
                  />
                </svg>
              </button>
            </div>
          </header>
          <div
            class="styled mt-1 min-h-36 max-h-72 md:max-h-56 overflow-scroll"
            [innerHTML]="parse(note.content)"
          ></div>
        </article>
      </li>
      } @empty {
      <p class="text-zinc-800 text-2xl">
        No hay notas en el grupo seleccionado
      </p>
      }
    </ul>
  `,
  styles: `
    .styled > h1{
        @apply text-xl;
      
    }
  `,
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Output() startEditNote = new EventEmitter<Note>();
  @Output() deleteNote = new EventEmitter<Note>();

  parse(content: string) {
    return marked.parse(content);
  }
}
