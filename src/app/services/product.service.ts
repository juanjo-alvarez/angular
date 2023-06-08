import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, throwError } from "rxjs";
import { map , catchError, tap} from 'rxjs/operators'
import { Product } from "../model/product";
import { OResponse } from "../model/response";
import { formatDate, registerLocaleData } from "@angular/common";
import localerES from '@angular/common/locales/es'


@Injectable({
    providedIn: 'root',
 })
export class ProductService {
    
    private urlEnpoint:string = 'http://localhost:30030/products'
    //private httpHeaders = new HttpHeaders({'Content-Type': 'application/json'})
    private httpHeaders = new HttpHeaders({'Content-Type': 'application/json','Authorization':"Basic " + btoa("demo:demouser")})
    constructor(private http: HttpClient) { }

    getProductsOld(): Observable<Product[]> {
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


    login(user: string, password: string): Observable<string>{
      let url = "http://localhost:33333/users/login";
      let headers = new HttpHeaders({'Content-Type': 'application/json','Authorization':"Basic " + btoa(user+":"+password)})
      return this.http.post(url,{headers: headers}).pipe(
        map(resp=>{
          sessionStorage.setItem('user', user);
          sessionStorage.setItem('password', password);
          return "ok";
        }),
        catchError(e => {
          if(e.error.status == "401"){
            alert("constraseña incorrecta");
            return "ko";
          }else{
            console.error(e.error.status+":"+e.error.error);
            return throwError(() => e);
          }
        })
      );
    }

    getProducts(): Observable<Product[]> {
      let getAllUrl = "http://localhost:33333/products/product?columns=id,name,stock,price,active,date_added";
      return this.http.get(getAllUrl,{headers: this.httpHeaders}).pipe(
        map( resp => {
          let resObject = resp as OResponse;
          let products = resObject.data as Product[];
          return products;
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