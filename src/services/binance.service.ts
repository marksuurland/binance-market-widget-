import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from '../environments/environment';
import { IGetProducts, IProduct, IProductMessage, ParentMarkets, Trend } from 'src/types/products.interface';
const ENDPOINT = environment.productsEndpoint;

@Injectable({
  providedIn: 'root'
})

export class BinanceService {
  public allproducts: IProduct[] = [];
  public bnbproducts: IProduct[] = [];
  public btcproducts: IProduct[] = [];
  public altsproducts: IProduct[] = [];
  public faitproducts: IProduct[] = [];

  constructor(private http: HttpClient) { }

  public getProducts(): Observable<void> {
    const subject = new Subject<void>();

    this.http.get(ENDPOINT).subscribe({
      next: (response: IGetProducts) => {
        this.allproducts = response.data;
        this.formatData(this.allproducts);
      },
      error: err => {
        subject.error(err);
      },
      complete: () => {
        subject.complete();
      },
    });
    return subject.asObservable();
  }

  public formatData(products: IProduct[]) {
    products.forEach((product: IProduct) => {
      this.seperateByParentMarket(product);
      this.setTrend(product);
    });
  }

  public getProductsByParentMarket(parentMarket: string): IProduct[] {
    switch (parentMarket) {
      case ParentMarkets.BTC:
        return this.btcproducts;
      case ParentMarkets.BNB:
        return this.bnbproducts;
      case ParentMarkets.ALTS:
        return this.altsproducts;
      default:
        return this.faitproducts;
    }
  }

  public setTrend(product: IProduct) {
    const percentage = (product.c - product.o) / product.o * 100;
    if (percentage > 0) {
      product.trend = Trend.UP;
    } else if (percentage < 0) {
      product.trend = Trend.DOWN;
    } else {
      product.trend = Trend.NEUTRAL;
    }
  }

  public seperateByParentMarket(product: IProduct) {
    this.getProductsByParentMarket(product.pm).push(product);
  }

  // TODO: this function is doing more than 1 thing, split it up.
  public handleProductMessage(productMessage: IProductMessage) {
    const lastThree = productMessage.s.slice(-3);
    const lastFour = productMessage.s.slice(-4);
    const parentMarket = lastFour === ParentMarkets.ALTS ? lastFour : lastThree;
    const productsToCheck: IProduct[] = this.getProductsByParentMarket(parentMarket);

    // TODO: N time for each message, improve this.
    const symbol = productsToCheck.find(symbolToCheck => {
      return symbolToCheck.s === productMessage.s;
    });
    if (symbol) {
      const productMessageC = parseFloat(productMessage.c);
      const productMessageO = parseFloat(productMessage.o);
      if (symbol.c > productMessageC) {
        symbol.trend = Trend.UP;
      } else if (symbol.c < productMessageC) {
        symbol.trend = Trend.DOWN;
      } else {
        symbol.trend = Trend.NEUTRAL;
      }

      symbol.c = productMessageC;
      symbol.o = productMessageO;
    }
  }

}
