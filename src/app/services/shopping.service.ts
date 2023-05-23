import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { ShoppingItem } from "../model/shopingItem";


@Injectable({
    providedIn: 'root',
 })
export class ShoppingService {

  private shoppingCart: BehaviorSubject<ShoppingItem[]> = new BehaviorSubject<ShoppingItem[]>([]);

    constructor() { }

    getShoppingItems():Observable<ShoppingItem[]>{
      return this.shoppingCart.asObservable();
    }

    addShoppingItem(item: ShoppingItem){
      let items = this.shoppingCart.getValue()
      let stored = items[item.id];
      if(!stored){
        items[item.id]=item;
      }else{
        item.number=item.number+stored.number;
        items[item.id]=item;
      }
      this.shoppingCart.next(items);
    }

    clearShoppingCart(){
      this.shoppingCart.next([]);
    }
}