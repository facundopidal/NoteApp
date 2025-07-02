import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  template: `
    <div
      class="fixed inset-0 backdrop-blur-xs bg-zinc-800/70 bg-opacity-40 flex items-center justify-center z-50"
    >
      <div
        class="bg-white rounded shadow-xl border-[1px] border-zinc-800 py-10 px-6 w-[80lvw] md:w-xl relative 
        starting:scale-0 transition-transform duration-300 ease-in-out "
        [class]="{ 'scale-100': !isClosing, 'scale-0': isClosing }"
      >
        <button
          (click)="close()"
          class="absolute top-2 right-2 text-zinc-500 hover:text-black text-2xl cursor-pointer"
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
  isClosing = false;

  close() {
    this.isClosing = true;
    setTimeout(() => {
      this.closeEvent.emit();
      this.isClosing = false;
    }, 300);
  }
}
