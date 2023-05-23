import { Component, Inject, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ShoppingItem } from '../model/shopingItem';
import { ShoppingService } from '../services/shopping.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})


export class ProductlistComponent implements OnInit {
  
  products : Product[];
  displayedColumns: string[] = ['name', 'stock', 'price', 'active', 'date_added','edit','delete','shop'];

  constructor(private productService: ProductService,public dialog: MatDialog, private shoppingService: ShoppingService) { }

  ngOnInit(){
    this.load();
  }
  load(): void{
    this.productService.getProducts().subscribe(
      getProducts => this.products = getProducts
    );
  }

  delete(product: Product): void {
    this.dialog.open(DeleteDialog,{data:product}).afterClosed().subscribe(
      ()=> this.load()
    );
  }

  showShoppingCart(): void {
    this.dialog.open(ShoppingCartDialog);
  }

  add(): void {
    this.dialog.open(AddDialog).afterClosed().subscribe(
      ()=> this.load()
    );
  }

  addItemToCart(product: Product){
    let shoppingItem: ShoppingItem = new ShoppingItem;
    shoppingItem.id = product.id;
    shoppingItem.name = product.name;
    shoppingItem.number = 1;
    this.shoppingService.addShoppingItem(shoppingItem);
  }
}

@Component({
  selector: 'cancel-dialog',
  templateUrl: 'cancel.dialog.html',
})
export class DeleteDialog {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Product,public dialogRef: MatDialogRef<DeleteDialog>, private productService: ProductService) {}

  close(check: boolean): void{
    if(check){
      this.productService.deleteProduct(this.data).subscribe( response => {
        if(response.id != this.data.id){
          console.error("El producto no se ha eliminado");
          console.error(response);
        }
      })
    }
    this.dialogRef.close();
  }
}

@Component({
  selector: 'add-dialog',
  templateUrl: 'add.dialog.html',
})
export class AddDialog {

  public product:Product = new Product;

  constructor(public dialogRef: MatDialogRef<DeleteDialog>, private productService: ProductService) {}

  close(): void{
    this.dialogRef.close();
  }

  add(): void{
    this.productService.addProduct(this.product).subscribe( response => {
      if(response == null){
        console.error("El producto no se ha agregado");
        console.error(response);
      }
    })

    this.dialogRef.close();
  }
}

@Component({
  selector: 'shoppingcart-dialog',
  templateUrl: 'shoppingcart.dialog.html',
  styleUrls: ['./productlist.component.scss']
})
export class ShoppingCartDialog {

  public shoppingcart:ShoppingItem[] = [];
  displayedColumns: string[] = ['name', 'number'];
  constructor(public dialogRef: MatDialogRef<DeleteDialog>, private shoppingService: ShoppingService) {}

  close(): void{
    this.dialogRef.close();
  }

  ngOnInit(){
    this.load();
  }

  load(): void{
    this.shoppingService.getShoppingItems().subscribe(
      getItems => this.shoppingcart = getItems
    );
  }
}
