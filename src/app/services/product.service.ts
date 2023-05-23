import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { map , catchError, tap} from 'rxjs/operators'
import { Product } from "../model/product";
import { formatDate, registerLocaleData } from "@angular/common";
import localerES from '@angular/common/locales/es'


@Injectable({
    providedIn: 'root',
 })
export class ProductService {
    
    private urlEnpoint:string = 'http://localhost:30030/products'
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
    constructor(private http: HttpClient) { }

    getProducts(): Observable<Product[]> {
      return this.http.post(this.urlEnpoint.concat("/getAll"),{headers: this.httpHeaders}).pipe(
        map( response => {
          let products = response as Product[];
          return products.map(product => {
            registerLocaleData(localerES,'es')
            product.date_added = formatDate(product.date_added,'dd/MM/yyyy','es');
            return product;
          });
        })
      );
    }

    getProduct( product: Product): Observable<Product>{
      return this.http.post(this.urlEnpoint.concat("/get"), product, {headers: this.httpHeaders}).pipe(
      //   tap(response => {
      //     let product = response as Product;
      //     console.log(product);
      //   }),
        map( response => {
          let product = response as Product;
          // registerLocaleData(localerES,'es')
          // product.date_added = formatDate(product.date_added,'dd/MM/yyyy','es');
          return product;
        }),
        catchError(e => {
          console.error(e.error.status+":"+e.error.error);
          return throwError(() => e);
        })
      );
    }

    updateProduct( product: Product): Observable<Product>{
      return this.http.put(this.urlEnpoint.concat("/update"), product, {headers: this.httpHeaders}).pipe(
        map( response => {
          let product = response as Product;
          return product;
        }),
        catchError(e => {
          console.error(e.error.status+":"+e.error.error);
          return throwError(() => e);
        })
      );
    }

    deleteProduct( product: Product): Observable<Product>{
      const options = {headers: this.httpHeaders,body: {id: product.id}};
      return this.http.delete(this.urlEnpoint.concat("/delete"), options).pipe(
        map( response => {
          return response as Product;
        }),
        catchError(e => {
          console.error(e.error.status+":"+e.error.error);
          return throwError(() => e);
        })
      );
    }

    addProduct( product: Product): Observable<Product>{
      return this.http.post(this.urlEnpoint.concat("/add"), product, {headers: this.httpHeaders}).pipe(
        map( response => {
          let product = response as Product;
          return product;
        }),
        catchError(e => {
          console.error(e.error.status+":"+e.error.error);
          return throwError(() => e);
        })
      );
    }
}