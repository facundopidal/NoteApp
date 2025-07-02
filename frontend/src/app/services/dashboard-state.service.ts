import { Injectable, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from './group.service';
import { NoteService } from './note.service';
import { AuthService } from './auth.service';
import { Group } from '../types/group';
import { Note } from '../types/note';

@Injectable({
  providedIn: 'root',
})
export class DashboardState {
  private groupService = inject(GroupService);
  private noteService = inject(NoteService);
  private authService = inject(AuthService);
  private router = inject(Router);
  // Grupos y grupo seleccionado
  groups = signal<Group[]>([]);
  selectedGroup = signal<Group | null>(null);

  // Formulario de grupo
  newGroupName = signal<string>('');

  // Estado de notas
  editNote = signal<{
    id: string | null;
    title: string;
    content: string;
    note: Note | null;
  }>({ id: null, title: '', content: '', note: null });
  noteToDelete = signal<Note | null>(null);

  // Estado de eliminación de grupo
  groupToDelete = signal<Group | null>(null);

  // Estados de modales
  isSidebarVisible = signal<boolean>(false);
  showCreateNoteModal = signal<boolean>(false);
  showLogoutModal = signal<boolean>(false);
  showEditNoteModal = signal<boolean>(false);
  showDeleteNoteModal = signal<boolean>(false);
  showDeleteGroupModal = signal<boolean>(false);
  errorModal = signal<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private errorTimer: any = null;

  // Señal para error de edición de grupo
  editGroupError = signal<{ id: string; message: string } | null>(null);

  // Métodos de ciclo de vida
  loadGroups() {
    this.groupService.getGroups().subscribe({
      next: (groups) => {
        this.groups.set(groups);
        if (groups.length > 0 && !this.selectedGroup()) {
          this.selectGroup(groups[0]);
        }
      },
      error: (error) => {
        console.error('Error loading groups:', error);
      },
    });
  }

  selectGroup(group: Group) {
    this.selectedGroup.set(group);
    this.loadNotesForGroup(group.id);
  }

  loadNotesForGroup(groupId: string) {
    this.noteService.getNotesByGroup(groupId).subscribe({
      next: (notes) => {
        if (this.selectedGroup()) {
          this.selectedGroup.update((currentGroup) => ({
            ...currentGroup!,
            notes,
          }));
        }
      },
      error: (error) => {
        console.error('Error loading notes:', error);
        if (this.selectedGroup()) {
          this.selectedGroup.update((currentGroup) => ({
            ...currentGroup!,
            notes: [],
          }));
        }
      },
    });
  }

  // Métodos para CRUD de Grupos
  addGroup(name: string) {
    if (name.trim()) {
      const currentUser = this.authService.currentUser();
      if (!currentUser || !currentUser.id) {
        console.error('No hay usuario autenticado');
        return;
      }
      const groupData = { name: name.trim(), userId: currentUser.id };
      this.groupService.createGroup(groupData).subscribe({
        next: (newGroup) => {
          this.groups.update((groups) => [...groups, newGroup]);
          this.newGroupName.set('');
        },
        error: (error) => {
          this.showError(error.error.message || 'Error al crear el grupo');
        },
      });
    }
  }

  updateGroup(group: Group) {
    this.groupService.updateGroup(group.id, { name: group.name }).subscribe({
      next: (updatedGroup) => {
        this.groups.update((groups) =>
          groups.map((g) => (g.id === updatedGroup.id ? updatedGroup : g))
        );
        if (this.selectedGroup()?.id === updatedGroup.id) {
          this.selectedGroup.update((sg) => ({
            ...sg!,
            name: updatedGroup.name,
          }));
        }
        this.editGroupError.set(null);
      },
      error: (err) => {
        this.showError(err.error.message || 'Error al actualizar el grupo');
        this.editGroupError.set({
          id: group.id,
          message: err.error.message || 'Error al actualizar el grupo',
        });
        this.loadGroups();
      },
    });
  }

  prepareDeleteGroup(group: Group) {
    this.noteService.getNotesByGroup(group.id).subscribe({
      next: (notes) => {
        if (notes.length > 0) {
          this.showError('No se puede eliminar un grupo que contiene notas.');
        } else {
          this.groupToDelete.set(group);
          this.showDeleteGroupModal.set(true);
        }
      },
      error: () => {
        this.showError('Ocurrió un error al verificar las notas del grupo.');
      },
    });
  }

  cancelDeleteGroup() {
    this.groupToDelete.set(null);
    this.showDeleteGroupModal.set(false);
  }

  confirmDeleteGroup() {
    const group = this.groupToDelete();
    if (group) {
      this.groupService.deleteGroup(group.id).subscribe({
        next: () => {
          this.groups.update((groups) =>
            groups.filter((g) => g.id !== group.id)
          );
          if (this.selectedGroup()?.id === group.id) {
            this.selectGroup(
              this.groups().length > 0 ? this.groups()[0] : null!
            );
          }
          this.cancelDeleteGroup();
        },
        error: (err) =>
          this.showError(err.error.message || 'Error al eliminar el grupo'),
      });
    }
  }

  // Métodos para CRUD de Notas
  createNote(noteData: { title: string; content: string }) {
    const group = this.selectedGroup();
    const user = this.authService.currentUser();
    if (group && user) {
      const newNote = { ...noteData, groupId: group.id, userId: user.id };
      this.noteService.createNote(newNote).subscribe({
        next: (createdNote) => {
          this.selectedGroup.update((sg) => ({
            ...sg!,
            notes: [...sg!.notes, createdNote],
          }));
          this.closeCreateNoteModal();
        },
        error: (err) =>
          this.showError(err.error.message || 'Error al crear la nota'),
      });
    }
  }

  startEditNote(note: Note) {
    this.editNote.set({
      id: note.id,
      title: note.title,
      content: note.content,
      note: note,
    });
    this.showEditNoteModal.set(true);
  }

  updateEditNote(data: { title?: string; content?: string }) {
    this.editNote.update((current) => ({ ...current, ...data }));
  }

  saveNoteUpdate() {
    const noteState = this.editNote();
    if (noteState.id && noteState.title && noteState.content) {
      this.noteService
        .updateNote(noteState.id, {
          title: noteState.title,
          content: noteState.content,
        })
        .subscribe({
          next: (updatedNote) => {
            this.selectedGroup.update((sg) => {
              const notes = sg!.notes.map((n) =>
                n.id === updatedNote.id ? { ...n, ...updatedNote } : n
              );
              return { ...sg!, notes };
            });
            this.cancelEditNote();
          },
          error: (err) =>
            this.showError(err.error.message || 'Error al actualizar la nota'),
        });
    }
  }

  cancelEditNote() {
    this.editNote.set({ id: null, title: '', content: '', note: null });
    this.showEditNoteModal.set(false);
  }

  prepareDeleteNote(note: Note) {
    this.noteToDelete.set(note);
    this.showDeleteNoteModal.set(true);
  }

  confirmDeleteNote() {
    const note = this.noteToDelete();
    if (note) {
      this.noteService.deleteNote(note.id).subscribe({
        next: () => {
          this.selectedGroup.update((sg) => ({
            ...sg!,
            notes: sg!.notes.filter((n) => n.id !== note.id),
          }));
          this.cancelDeleteNote();
        },
        error: (err) =>
          this.showError(err.error.message || 'Error al eliminar la nota'),
      });
    }
  }

  cancelDeleteNote() {
    this.noteToDelete.set(null);
    this.showDeleteNoteModal.set(false);
  }

  openCreateNoteModal() {
    this.showCreateNoteModal.set(true);
  }

  closeCreateNoteModal() {
    this.showCreateNoteModal.set(false);
  }

  openLogoutModal() {
    this.showLogoutModal.set(true);
  }

  closeLogoutModal() {
    this.showLogoutModal.set(false);
  }

  toggleSidebar() {
    this.isSidebarVisible.update((value) => !value);
  }

  // Autenticación
  logout() {
    this.closeLogoutModal();
    this.authService.logout();
    this.reset();
    this.router.navigate(['/login']);
  }

  reset() {
    this.groups.set([]);
    this.selectedGroup.set(null);
    this.newGroupName.set('');
    this.editNote.set({ id: null, title: '', content: '', note: null });
    this.noteToDelete.set(null);
    this.groupToDelete.set(null);
    this.showCreateNoteModal.set(false);
    this.showLogoutModal.set(false);
    this.showEditNoteModal.set(false);
    this.showDeleteNoteModal.set(false);
    this.showDeleteGroupModal.set(false);
  }

  // Utilidad para mostrar error con fade
  showError(message: string, duration = 3000) {
    this.errorModal.set(message);
    if (this.errorTimer) {
      clearTimeout(this.errorTimer);
    }
    this.errorTimer = setTimeout(() => {
      setTimeout(() => {
        this.errorModal.set(null);
        console.log(this.errorModal());
      }, 400); // Espera el fade
    }, duration);
  }
}
