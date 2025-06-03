import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 backdrop-blur-xs bg-zinc-800/70 bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded shadow-xl border-[1px] border-zinc-800 p-6 w-[80lvw] md:w-xl relative"
      >
        <button
          (click)="closeEvent.emit()"
          class="absolute top-2 right-2 text-zinc-500 hover:text-black"
        >
          ✕
        </button>
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: ``,
})
export class AppModalComponent {
  @Output() closeEvent = new EventEmitter<void>();
}
