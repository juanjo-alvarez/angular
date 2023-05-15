import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss']
})


export class ProductlistComponent implements OnInit {
  
  products : Product[];
  displayedColumns: string[] = ['name', 'stock', 'price', 'active', 'date_added','edit'];

  constructor(private productService: ProductService) { }

  ngOnInit(){
    this.productService.getProducts().subscribe(
      products => this.products = products
    );
  }
}


