import { 
  Component,
  ChangeDetectorRef,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject, 

 } from '@angular/core';

import { NgClass } from '@angular/common';
import { IListItems } from '../../interface/IListItens.interface';

@Component({
  selector: 'app-input-add-item',
  standalone: true,
  imports: [NgClass],
  templateUrl: './input-add-item.component.html',
  styleUrl: './input-add-item.component.scss'
})
export class InputAddItemComponent {
  #cdr = inject(ChangeDetectorRef);

  @ViewChild('inputText') public inputText!: ElementRef;
  public dataSelecionada: string = '';

  @Input({ required: true }) public inputListItems: IListItems[] = [];

  @Output() public outputAddListItem = new EventEmitter<IListItems>();
  public focusAndAddItem(value: string) {
    if (value) {
      this.#cdr.detectChanges();
      this.inputText.nativeElement.value = '';

      const id = `ID ${Date.now()}`;

      this.outputAddListItem.emit({
        id,
        checked: false,
        value,
        date: this.dataSelecionada
      });

      this.dataSelecionada = ''; // limpa o campo data
      return this.inputText.nativeElement.focus();
    }
  }
    }
