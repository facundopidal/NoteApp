import {
  Component,
  Input,
  Output,
  EventEmitter,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import '@dile/editor/editor.js';

@Component({
  selector: 'app-edit-note-form',
  standalone: true,
  imports: [FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="flex flex-col gap-4">
      <h2
        #titleElement
        contenteditable=""
        class="font-epilogue-extrabold text-2xl text-center"
      >
        {{ title }}
      </h2>
      <dile-editor #editor disableToolbarItems="image|link"></dile-editor>
    </div>
  `,
  styles: ``,
})
export class EditNoteFormComponent implements AfterViewInit {
  @Input() title = '';
  @Input() content = '';
  @Output() titleChange = new EventEmitter<string>();
  @Output() contentChange = new EventEmitter<string>();
  @ViewChild('editor') editor!: ElementRef;
  @ViewChild('titleElement') titleElement!: ElementRef;

  ngAfterViewInit(): void {
    if (this.editor && this.editor.nativeElement) {
      this.editor.nativeElement.value = this.content;
      this.editor.nativeElement.addEventListener('input', () => {
        this.content = this.editor.nativeElement.value;
        this.contentChange.emit(this.content);
      });
      // Forzar altura del editor interno en el shadowRoot
      const shadow = this.editor.nativeElement.shadowRoot;
      if (shadow) {
        const style = document.createElement('style');
        style.textContent = `
          .ProseMirror {
            height: 50vh !important;
            min-height: 400px !important;
            max-height: 100%;
            box-sizing: border-box;
          }
        `;
        shadow.appendChild(style);
      }
    }
    if (this.titleElement && this.titleElement.nativeElement) {
      this.titleElement.nativeElement.textContent = this.title;
      this.titleElement.nativeElement.addEventListener('input', () => {
        this.title = this.titleElement.nativeElement.textContent;
        this.titleChange.emit(this.title);
      });
    }
  }
}
