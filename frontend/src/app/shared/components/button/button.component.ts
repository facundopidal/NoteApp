import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  imports: [],
  template: `
    <button
      class="text-main-foreground rounded-base bg-main flex w-max cursor-pointer
      items-center gap-2.5 border-2 px-4 py-2 text-base shadow-[4px_4px_0px_0px] transition-all 
      hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none md:px-8 md:py-2 md:text-md"
      [type]="type"
      [disabled]="disabled"
    >
      {{ text }}
    </button>
  `,
  styles: ``,
})
export class ButtonComponent {
  @Input({ required: true }) text = ' ';
  @Input() type: 'button' | 'submit' = 'button';
  @Input() disabled = false;
}
