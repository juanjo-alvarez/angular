import { Component, OnInit } from '@angular/core';
import { Product } from '../model/product';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.scss']
})
export class ProductdetailComponent implements OnInit {
  public product:Product = new Product;
  public errores: string[];

  constructor(private productService: ProductService, private router: Router, private activatedRoute:ActivatedRoute){}

  ngOnInit() {
    this.load();
  }

  load(): void{
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if(id){
        let searchProduct = new Product;
        searchProduct.id=id;
        this.productService.getProduct(searchProduct).subscribe( resultProduct => {
          this.product = resultProduct;
        });
      }
    });
  }

  update(): void {
    this.productService.updateProduct(this.product)
      .subscribe({
        next: (product) => {
          this.router.navigate(['/products']);
          console.log("Producto "+product.name+" actualizado con éxito")
        },
        error: (err) => {
          this.errores = err.error.errors as string[];
          console.error('Código de error desde backend:'+err.status)
          console.error(err.error.errors);
        }
      }
    );
  }

}
