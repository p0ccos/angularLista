import { Component, signal } from '@angular/core';
import Swal from 'sweetalert2';

import { IListItems } from '../../interface/IListItens.interface';
import { InputAddItemComponent } from '../../components/input-add-item/input-add-item.component';
import { InputListItemComponent } from '../../components/input-list-item/input-list-item.component';
import { ELocalStorage } from '../../enum/ELocalStorage.enum';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [InputAddItemComponent, InputListItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  public addItem = signal(true);

  #setListItems = signal<IListItems[]>(this.#parseItems());
  public getListItems = this.#setListItems.asReadonly();

  #parseItems() {
    const lista = JSON.parse(localStorage.getItem(ELocalStorage.MY_LIST) || '[]');
    return lista.sort((a: IListItems, b: IListItems) => {
      const aTime = a.date ? new Date(a.date).getTime() : Infinity;
      const bTime = b.date ? new Date(b.date).getTime() : Infinity;
      return aTime - bTime;
    });
  }

  #updateLocalStorage() {
    return localStorage.setItem(
      ELocalStorage.MY_LIST,
      JSON.stringify(this.#setListItems())
    );
  }
  public getInputAndAddItem(value: IListItems) {
    const novaLista = [...this.#setListItems(), value];

    novaLista.sort((a, b) => {
      const aTime = a.date ? new Date(a.date).getTime() : Infinity;
      const bTime = b.date ? new Date(b.date).getTime() : Infinity;
      return aTime - bTime;
    });

    localStorage.setItem(ELocalStorage.MY_LIST, JSON.stringify(novaLista));
    return this.#setListItems.set(novaLista);
  }
  

  public listItemsStage(value: 'pendente' | 'completo' | 'atrasado') {
    return this.getListItems().filter((res: IListItems) => {
      
      if (value === 'atrasado') {
        return res.date && new Date(res.date) < new Date();
      }
      
      if (value === 'pendente') {
        return !res.checked;
      }

      if (value === 'completo') {
        return res.checked;
      }
      

      return res;
    });
  }
  public updateItemCheckbox(newItem: { id: string; checked: boolean }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.checked = newItem.checked;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public updateItemText(newItem: { id: string; value: string }) {
    this.#setListItems.update((oldValue: IListItems[]) => {
      oldValue.filter((res) => {
        if (res.id === newItem.id) {
          res.value = newItem.value;
          return res;
        }

        return res;
      });

      return oldValue;
    });

    return this.#updateLocalStorage();
  }

  public deleteItem(id: string) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete o item',
    }).then((result) => {
      if (result.isConfirmed) {
        this.#setListItems.update((oldValue: IListItems[]) => {
          return oldValue.filter((res) => res.id !== id);
        });

        return this.#updateLocalStorage();
      }
    });
  }

  public deleteAllItems() {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você não poderá reverter isso!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, delete tudo',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem(ELocalStorage.MY_LIST);
        return this.#setListItems.set(this.#parseItems());
      }
    });
  }
}
