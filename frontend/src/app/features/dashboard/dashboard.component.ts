import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupSidebarComponent } from './group-sidebar/group-sidebar.component';
import { Group } from '../../types/group';
import { Note } from '../../types/note';
import { NotesListComponent } from './notes-list/notes-list.component';
import { CreateNoteFormComponent } from './create-note-form/create-note-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    GroupSidebarComponent,
    NotesListComponent,
    CreateNoteFormComponent,
  ],
  standalone: true,
  template: `
    <div class="dashboard-container flex h-screen font-epilogue">
      <app-group-sidebar
        [groups]="groups"
        [selectedGroup]="selectedGroup"
        [newGroupName]="newGroupName"
        (selectGroup)="selectGroup($event)"
        (addGroup)="addGroup($event)"
        (onGroupKeydown)="
          onGroupKeydown($any($event).event, $any($event).group)
        "
        (newGroupNameChange)="newGroupName = $event"
        class="mr-4"
      />
      <main class="main-content flex-1 p-8 bg-white">
        <h1 class="text-3xl font-bold mb-6">
          {{ selectedGroup?.name || 'Selecciona un grupo' }}
        </h1>
        @if(selectedGroup) {
        <div>
          <h3 class="text-xl font-semibold mb-2">Notas</h3>
          <app-notes-list
            [notes]="selectedGroup.notes"
            [editNoteId]="editNoteId"
            [editNoteTitle]="editNoteTitle"
            [editNoteContent]="editNoteContent"
            (startEditNote)="startEditNote($event)"
            (saveEditNote)="onSaveEditNote($event)"
            (cancelEditNote)="cancelEditNote()"
            (deleteNote)="onDeleteNote($event)"
          />
          <app-create-note-form (create)="onCreateNote($event)" />
        </div>
        }
      </main>
    </div>
  `,
  styles: ``,
})
export class DashboardComponent {
  groups: Group[] = [
    {
      id: '1',
      name: 'Grupo 1',
      notes: [
        {
          id: '1',
          title: 'Nota 1',
          content: 'Contenido de la nota 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: '1',
          userId: 'user1',
        },
      ],
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Grupo 2',
      notes: [
        {
          id: '2',
          title: 'Nota 4',
          content: 'Contenido de la nota 1',
          createdAt: new Date(),
          updatedAt: new Date(),
          groupId: '1',
          userId: 'user1',
        },
      ],
      userId: 'user1',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  selectedGroup: Group | null = this.groups[0];
  newNoteTitle = '';
  newNoteContent = '';
  editNoteId: string | null = null;
  editNoteTitle = '';
  editNoteContent = '';
  newGroupName = '';

  selectGroup(group: Group) {
    this.selectedGroup = group;
  }

  startEditNote(note: Note) {
    this.editNoteId = note.id;
    this.editNoteTitle = note.title;
    this.editNoteContent = note.content;
  }

  onSaveEditNote(event: { note: Note; title: string; content: string }) {
    if (this.selectedGroup && event.title && event.content) {
      event.note.title = event.title;
      event.note.content = event.content;
      this.cancelEditNote();
    }
  }

  cancelEditNote() {
    this.editNoteId = null;
    this.editNoteTitle = '';
    this.editNoteContent = '';
  }

  onDeleteNote(note: Note) {
    if (this.selectedGroup) {
      const idx = this.selectedGroup.notes.findIndex((n) => n.id === note.id);
      if (idx > -1) {
        this.selectedGroup.notes.splice(idx, 1);
      }
    }
  }

  deleteNote(index: number) {
    if (this.selectedGroup) {
      this.selectedGroup.notes.splice(index, 1);
    }
  }

  onGroupKeydown(event: KeyboardEvent, group: Group) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectGroup(group);
    }
  }

  addGroup(newGroupName?: string) {
    const name = newGroupName !== undefined ? newGroupName : this.newGroupName;
    if (name.trim()) {
      const newGroup: Group = {
        id: Date.now().toString(),
        name: name.trim(),
        notes: [],
        userId: '',
        createdAt: '',
        updatedAt: '',
      };
      this.groups.push(newGroup);
      this.newGroupName = '';
    }
  }

  onCreateNote(event: { title: string; content: string }) {
    if (this.selectedGroup && event.title && event.content) {
      const newNote: Note = {
        id: Date.now().toString(),
        title: event.title,
        content: event.content,
        createdAt: new Date(),
        updatedAt: new Date(),
        groupId: this.selectedGroup.id,
        userId: 'user1',
      };
      this.selectedGroup.notes.push(newNote);
    }
  }
}
