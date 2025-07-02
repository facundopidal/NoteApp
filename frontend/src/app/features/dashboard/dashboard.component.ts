import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GroupSidebarComponent } from './group-sidebar/group-sidebar.component';
import { NotesListComponent } from './notes-list/notes-list.component';
import { CreateNoteFormComponent } from './create-note-form/create-note-form.component';
import { AppModalComponent } from '../../shared/components/app-modal.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';
import { DashboardState } from '../../services/dashboard-state.service';
import { EditNoteFormComponent } from './edit-note-form/edit-note-form.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    GroupSidebarComponent,
    NotesListComponent,
    CreateNoteFormComponent,
    AppModalComponent,
    ConfirmModalComponent,
    EditNoteFormComponent,
  ],
  standalone: true,
  template: `
    <div class="dashboard-container flex h-screen font-epilogue">
      <app-group-sidebar
        [groups]="state.groups()"
        [selectedGroup]="state.selectedGroup()"
        [newGroupName]="state.newGroupName()"
        (selectGroup)="state.selectGroup($event)"
        (addGroup)="state.addGroup($event)"
        (newGroupNameChange)="state.newGroupName.set($event)"
        (editGroup)="state.updateGroup($event)"
        (deleteGroup)="state.prepareDeleteGroup($event)"
        class="mr-4"
      />
      <main class="flex-1 p-8 bg-white overflow-scroll">
        <div class="flex justify-between items-center mb-4">
          <!-- Hamburger Menu for Mobile -->
          <button
            (click)="state.toggleSidebar()"
            (keydown.enter)="state.toggleSidebar()"
            class="lg:hidden p-2"
            role="button"
            aria-label="Toggle sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="#181818"
            >
              <path
                d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"
              />
            </svg>
          </button>

          <div class="flex-grow"></div>
          <!-- Spacer -->

          <button
            (click)="state.openLogoutModal()"
            class="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-sm transition-colors"
          >
            Cerrar sesión
          </button>
        </div>

        @if(state.showLogoutModal()) {
        <app-confirm-modal
          title="¿Seguro que quieres cerrar sesión?"
          message=""
          (confirm)="state.logout()"
          (cancelClick)="state.closeLogoutModal()"
        />
        } @if(state.errorModal()) {
        <div class="fixed inset-0 m-2 flex items-start justify-center z-50">
          <div
            class="bg-red-600 starting:opacity-100 opacity-0 text-white p-4 rounded-md shadow-md transition-opacity duration-3000"
          >
            <span>
              {{ state.errorModal() }}
            </span>
            <button (click)="state.errorModal.set(null)" class="text-3xl">
              &times;
            </button>
          </div>
        </div>
        } @if(state.selectedGroup()) {
        <header>
          <h1 class="text-3xl font-bold mb-2">
            {{ state.selectedGroup()!.name || 'Selecciona un grupo' }}
          </h1>
          <button
            (click)="state.openCreateNoteModal()"
            class="text-md rounded-lg bg-zinc-800 text-white py-1 px-2 mb-4 cursor-pointer"
          >
            <span class="text-2xl">+</span> Nueva nota
          </button>
        </header>
        <section>
          <app-notes-list
            [notes]="state.selectedGroup()!.notes"
            (startEditNote)="state.startEditNote($event)"
            (deleteNote)="state.prepareDeleteNote($event)"
          />
        </section>

        @if(state.showCreateNoteModal()) {
        <app-modal (closeEvent)="state.closeCreateNoteModal()">
          <app-create-note-form (create)="state.createNote($event)" />
        </app-modal>
        } @if(state.showEditNoteModal()) {
        <app-modal (closeEvent)="state.cancelEditNote()">
          <app-edit-note-form
            [title]="state.editNote().title"
            [content]="state.editNote().content"
            (titleChange)="state.updateEditNote({ title: $event })"
            (contentChange)="state.updateEditNote({ content: $event })"
          />
          <div class="flex justify-end mt-4">
            <button
              (click)="state.saveNoteUpdate()"
              class="bg-black text-white font-semibold py-2 px-4 rounded hover:bg-zinc-800 transition-colors"
            >
              Guardar cambios
            </button>
          </div>
        </app-modal>
        } @if(state.showDeleteNoteModal()) {
        <app-confirm-modal
          title="¿Estas seguro de eliminar esta nota?"
          message="Esta acción es irreversible."
          (confirm)="state.confirmDeleteNote()"
          (cancelClick)="state.cancelDeleteNote()"
        />
        } @if(state.showDeleteGroupModal()) {
        <app-confirm-modal
          title="¿Estas seguro de eliminar este grupo?"
          message="Se eliminaran todas las notas asociadas."
          (confirm)="state.confirmDeleteGroup()"
          (cancelClick)="state.cancelDeleteGroup()"
        />
        } } @else {
        <p>Ocurrio un error al seleccionar el grupo</p>
        }
      </main>
    </div>
  `,
  styles: ``,
})
export class DashboardComponent implements OnInit {
  constructor(public state: DashboardState) {}

  ngOnInit() {
    this.state.loadGroups();
  }
}
