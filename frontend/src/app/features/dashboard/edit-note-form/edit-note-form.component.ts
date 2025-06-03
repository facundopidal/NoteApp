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
    <div class="flex flex-col gap-4 h-[80lvh]">
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

  ngAfterViewInit(): void {
    if (this.editor && this.editor.nativeElement) {
      this.editor.nativeElement.value = this.content;
      this.editor.nativeElement.addEventListener('input', () => {
        this.content = this.editor.nativeElement.value;
        this.contentChange.emit(this.content);
      });
    }
  }
}
