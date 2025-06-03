import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Note } from '../../../types/note';
import { EditNoteFormComponent } from '../edit-note-form/edit-note-form.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { AppModalComponent } from '../../../shared/components/app-modal.component';

@Component({
  selector: 'app-notes-list',
  standalone: true,
  imports: [EditNoteFormComponent, ConfirmModalComponent, AppModalComponent],
  template: `
    <ul class="list-none p-0">
      @for(note of notes; track note.id) {
      <li
        class="mb-3 p-4 border border-zinc-200 rounded shadow-sm cursor-pointer"
        (click)="openEditModal(note)"
        (keyup.enter)="openEditModal(note)"
        tabindex="0"
        role="button"
        aria-label="Editar nota"
      >
        <div>
          <strong>{{ note.title }}</strong>
          <p class="mt-1">{{ note.content }}</p>
          <div class="flex gap-2 mt-2">
            <button
              (click)="openEditModal(note); $event.stopPropagation()"
              (keyup.enter)="openEditModal(note); $event.stopPropagation()"
              class="px-2 py-1 text-xs bg-zinc-200 rounded hover:bg-zinc-300"
            >
              Editar
            </button>
            <button
              (click)="openDeleteModal(note); $event.stopPropagation()"
              (keyup.enter)="openDeleteModal(note); $event.stopPropagation()"
              class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              Eliminar
            </button>
          </div>
        </div>
      </li>
      }
    </ul>
    @if(showEditModal && noteToEdit) {
    <app-modal (closeEvent)="onModalClose()">
      <app-edit-note-form
        [title]="editNoteTitle"
        [content]="editNoteContent"
        (titleChange)="editNoteTitle = $event"
        (contentChange)="editNoteContent = $event"
      />
    </app-modal>
    } @if(showConfirmModal) {
    <app-confirm-modal
      title="Delete Note"
      message="¿Estas seguro de eliminar esta nota?"
      (confirm)="confirmDelete()"
      (cancelClick)="cancelDelete()"
    />
    }
  `,
  styles: ``,
})
export class NotesListComponent {
  @Input() notes: Note[] = [];
  @Input() editNoteId: string | null = null;
  @Input() editNoteTitle = '';
  @Input() editNoteContent = '';
  @Output() startEditNote = new EventEmitter<Note>();
  @Output() saveEditNote = new EventEmitter<{
    note: Note;
    title: string;
    content: string;
  }>();
  @Output() cancelEditNote = new EventEmitter<void>();
  @Output() deleteNote = new EventEmitter<Note>();

  showConfirmModal = false;
  noteToDelete: Note | null = null;
  showEditModal = false;
  noteToEdit: Note | null = null;

  openDeleteModal(note: Note) {
    this.noteToDelete = note;
    this.showConfirmModal = true;
  }

  confirmDelete() {
    if (this.noteToDelete) {
      this.deleteNote.emit(this.noteToDelete);
      this.noteToDelete = null;
      this.showConfirmModal = false;
    }
  }

  cancelDelete() {
    this.noteToDelete = null;
    this.showConfirmModal = false;
  }

  openEditModal(note: Note) {
    this.noteToEdit = note;
    this.editNoteTitle = note.title;
    this.editNoteContent = note.content;
    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.noteToEdit = null;
    this.editNoteTitle = '';
    this.editNoteContent = '';
  }

  onModalClose() {
    if (
      this.noteToEdit &&
      (this.editNoteTitle !== this.noteToEdit.title ||
        this.editNoteContent !== this.noteToEdit.content)
    ) {
      this.saveEditNote.emit({
        note: this.noteToEdit,
        title: this.editNoteTitle,
        content: this.editNoteContent,
      });
    }
    this.closeEditModal();
  }
}
