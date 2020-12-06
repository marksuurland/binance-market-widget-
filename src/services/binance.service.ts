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

  public setTrend(element: IProduct) {
    const percentage = (element.c - element.o) / element.o * 100;
    if (percentage > 0) {
      element.trend = Trend.UP;
    } else if (percentage < 0) {
      element.trend = Trend.DOWN;
    } else {
      element.trend = Trend.NEUTRAL;
    }
  }

  public seperateByParentMarket(element: IProduct) {
    this.getProductsByParentMarket(element.pm).push(element);
  }

  public handleProductMessage(message: IProductMessage) {
    const lastThree = message.s.slice(-3);
    const lastFour = message.s.slice(-4);
    const parentMarket = lastFour === ParentMarkets.ALTS ? lastFour : lastThree;
    const productsToCheck: IProduct[] = this.getProductsByParentMarket(parentMarket);

    // TODO: N time for each message, improve this.
    const symbol = productsToCheck.find(symbolToCheck => {
      return symbolToCheck.s === message.s;
    });
    if (symbol) {
      const messageC = parseFloat(message.c);
      const messageO = parseFloat(message.o);
      if (symbol.c > messageC) {
        symbol.trend = Trend.UP;
      } else if (symbol.c < messageC) {
        symbol.trend = Trend.DOWN;
      } else {
        symbol.trend = Trend.NEUTRAL;
      }

      symbol.c = messageC;
      symbol.o = messageO;
    }
  }

}
