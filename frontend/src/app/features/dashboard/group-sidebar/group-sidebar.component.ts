import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  ElementRef,
  effect,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../types/group';
import { DashboardState } from '../../../services/dashboard-state.service';

@Component({
  selector: 'app-group-sidebar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <!-- Overlay for mobile -->
    @if(state.isSidebarVisible()) {
    <div
      tabindex="0"
      role="button"
      (click)="state.toggleSidebar()"
      (keydown)="onOverlayKeydown($event)"
      class="fixed inset-0 bg-black/50 z-10 lg:hidden"
      aria-label="Cerrar menú lateral"
    ></div>
    }
    <aside
      [class]="state.isSidebarVisible() ? 'translate-x-0' : '-translate-x-full'"
      class="fixed inset-y-0 left-0 h-full lg:w-56 bg-zinc-100 border-r border-zinc-200 py-6 shadow-md flex flex-col transform transition-transform duration-300 ease-in-out z-20 lg:relative lg:translate-x-0"
    >
      <h2 class="text-lg font-bold mb-4 px-6">Grupos</h2>
      <ul class="list-none p-0 m-0 flex-1 overflow-y-auto">
        @for(group of groups; track group.id; let i = $index) {
        <li
          [class]="
            selectedGroup?.id === group.id && editingGroup?.id !== group.id
              ? 'bg-zinc-200'
              : 'hover:bg-zinc-200'
          "
          class="rounded transition-colors mb-1 focus:outline-none flex justify-between items-center px-1 py-2 group"
          role="button"
        >
          <div
            #groupNameDiv
            tabindex="0"
            [contentEditable]="editingGroup?.id === group.id"
            (click)="editingGroup?.id !== group.id && selectGroup.emit(group)"
            (keydown)="onKeydown($event, group, i)"
            class="text-sm font-semibold cursor-pointer px-6 py-2 w-full outline-none"
            [class.bg-white]="editingGroup?.id === group.id"
            [class.cursor-text]="editingGroup?.id === group.id"
          >
            {{ group.name }}
          </div>
          @if(group.name !== 'Mis notas') { @if (editingGroup?.id === group.id)
          {
          <div class="flex gap-1">
            <button
              (click)="confirmEdit(i)"
              class="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-700"
            >
              ✓
            </button>
            <button
              (click)="cancelEdit(i)"
              class="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-700"
            >
              ✗
            </button>
          </div>
          } @else {
          <div
            class="flex gap-1 pointer-coarse:opacity-100 pointer-fine:opacity-0 pointer-fine:group-hover:opacity-100 transition-opacity ease-in-out duration-200 pointer-fine:group-hover:duration-500"
          >
            <button
              (click)="toggleEdit(i, group); $event.stopPropagation()"
              role="button"
              aria-label="Editar grupo"
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
              (click)="deleteGroup.emit(group); $event.stopPropagation()"
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
          } }
        </li>
        }
      </ul>
      <div class="mx-auto">
        <button
          type="button"
          (click)="showForm = !showForm"
          class="mx-auto mb-2 bg-zinc-200 hover:bg-zinc-300 rounded-full w-8 h-8 text-xl font-bold transition-colors cursor-pointer"
          [title]="showForm ? 'Contraer formulario' : 'Agregar Grupo'"
          [attr.aria-label]="showForm ? 'Contraer formulario' : 'Agregar Grupo'"
        >
          {{ showForm ? '-' : '+' }}
        </button>
        <span>
          {{ showForm ? 'Contraer formulario' : 'Agregar Grupo' }}
        </span>
      </div>

      @if(showForm) {
      <form (ngSubmit)="onAddGroup()" class="px-6 mb-6 flex flex-col gap-2">
        <input
          [(ngModel)]="newGroupName"
          name="groupName"
          placeholder="Nuevo grupo"
          required
          class="p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400 placeholder:text-zinc-500"
        />
        <button
          type="submit"
          class="bg-black text-white text-sm py-1 rounded hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          Crear grupo
        </button>
      </form>
      }
    </aside>
  `,
  styles: ``,
})
export class GroupSidebarComponent {
  @Input() groups: Group[] = [];
  @Input() selectedGroup: Group | null = null;
  @Input() newGroupName = '';

  onOverlayKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'Escape') {
      this.state.toggleSidebar();
    }
  }

  @Output() selectGroup = new EventEmitter<Group>();
  @Output() addGroup = new EventEmitter<string>();
  @Output() newGroupNameChange = new EventEmitter<string>();
  @Output() editGroup = new EventEmitter<Group>();
  @Output() deleteGroup = new EventEmitter<Group>();

  @ViewChildren('groupNameDiv') groupNameDivs!: QueryList<ElementRef>;

  constructor(public state: DashboardState) {
    effect(() => {
      if (state.editGroupError()) {
        const groupId = state.editGroupError()?.id;
        const groupIndex = this.groups.findIndex((g) => g.id === groupId);
        if (groupIndex !== -1) {
          const div = this.groupNameDivs.toArray()[groupIndex].nativeElement;
          div.textContent = this.originalGroupName;
        }
      }
    });
  }

  showForm = false;
  editingGroup: Group | null = null;
  originalGroupName = '';

  onAddGroup() {
    this.addGroup.emit(this.newGroupName);
    this.newGroupNameChange.emit('');
    this.showForm = false;
  }

  onKeydown(event: KeyboardEvent, group: Group, index: number) {
    if (this.editingGroup?.id === group.id) {
      if (event.key === 'Enter') {
        event.preventDefault();
        this.confirmEdit(index);
      } else if (event.key === 'Escape') {
        this.cancelEdit(index);
      }
    } else if (event.key === 'Enter') {
      this.selectGroup.emit(group);
    }
  }

  toggleEdit(index: number, group: Group) {
    this.editingGroup = { ...group };
    this.originalGroupName = group.name;
    setTimeout(() => {
      const div = this.groupNameDivs.toArray()[index].nativeElement;
      div.focus();
      const range = document.createRange();
      range.selectNodeContents(div);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    });
  }

  confirmEdit(index: number) {
    const div = this.groupNameDivs.toArray()[index].nativeElement;
    const newName = div.textContent.trim();
    if (this.editingGroup && newName && newName !== this.originalGroupName) {
      this.editGroup.emit({ ...this.editingGroup, name: newName });
      this.state.editGroupError.set(null);
    }
    this.editingGroup = null;
  }

  cancelEdit(index: number) {
    const div = this.groupNameDivs.toArray()[index].nativeElement;
    div.textContent = this.originalGroupName;
    this.editingGroup = null;
  }
}
