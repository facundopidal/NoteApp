import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Group } from '../../../types/group';

@Component({
  selector: 'app-group-sidebar',
  standalone: true,
  imports: [FormsModule],
  template: `
    <aside class="h-full w-56 bg-zinc-100 py-6 shadow-md flex flex-col">
      <h2 class="text-lg font-bold mb-4 px-6">Grupos</h2>
      <ul class="list-none p-0 m-0 flex-1 overflow-y-auto">
        @for(group of groups; track group.id) {
        <li
          tabindex="0"
          (click)="selectGroup.emit(group)"
          (keydown)="onKeydown($event, group)"
          [class]="
            selectedGroup?.id === group.id ? 'bg-zinc-200' : 'hover:bg-zinc-200'
          "
          class="px-6 py-3 cursor-pointer rounded transition-colors mb-1 focus:outline-none focus:ring-2 focus:ring-zinc-400"
          role="button"
        >
          {{ group.name }}
        </li>
        }
      </ul>
      <button
        type="button"
        (click)="showForm = !showForm"
        class="mx-auto mb-2 bg-zinc-200 hover:bg-zinc-300 rounded-full w-8 h-8 flex items-center justify-center text-xl font-bold transition-colors"
        title="Agregar grupo"
        aria-label="Agregar grupo"
      >
        {{ showForm ? '-' : '+' }}
      </button>
      @if(showForm) {
      <form (ngSubmit)="onAddGroup()" class="px-6 mb-6 flex flex-col gap-2">
        <input
          [(ngModel)]="groupName"
          (ngModelChange)="newGroupNameChange.emit($event)"
          name="groupName"
          placeholder="Nuevo grupo"
          required
          class="p-2 border border-zinc-300 rounded focus:outline-none focus:ring-2 focus:ring-zinc-400"
        />
        <button
          type="submit"
          class="bg-black text-white text-sm py-1 rounded hover:bg-zinc-800 transition-colors"
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
  @Output() selectGroup = new EventEmitter<Group>();
  @Output() addGroup = new EventEmitter<string>();
  @Output() groupKeydown = new EventEmitter<{
    event: KeyboardEvent;
    group: Group;
  }>();
  @Output() newGroupNameChange = new EventEmitter<string>();

  showForm = false;

  get groupName() {
    return this.newGroupName;
  }
  set groupName(val: string) {
    this.newGroupNameChange.emit(val);
  }

  onAddGroup() {
    this.addGroup.emit(this.newGroupName);
    this.showForm = false;
  }

  onKeydown(event: KeyboardEvent, group: Group) {
    this.groupKeydown.emit({ event, group });
  }
}
