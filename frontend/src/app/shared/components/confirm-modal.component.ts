import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 backdrop-blur-xs bg-zinc-800/70 bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded shadow-xl border border-zinc-800 p-6 min-w-[300px]"
      >
        <h2 class="text-lg font-semibold mb-4">{{ title }}</h2>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-center gap-2">
          <button
            (click)="cancelClick.emit()"
            class="px-4 py-2 rounded bg-zinc-200 hover:bg-zinc-300 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            (click)="confirm.emit()"
            class="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ConfirmModalComponent {
  @Input() title = 'Confirmar acción';
  @Input() message = '¿Estás seguro?';
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelClick = new EventEmitter<void>();
}
