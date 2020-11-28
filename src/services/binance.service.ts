import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { webSocket } from "rxjs/webSocket";
import { IGetProducts, IProduct, IProductMessage, ParentMarkets, Trend } from 'src/types/products.interface';

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

  public getProducts(): Observable<IProduct[]> {
    const subject = new Subject<IProduct[]>();
    let result: IProduct[] = [];

    this.http.get(
      `https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products`
    ).subscribe({
      next: (response: IGetProducts) => {
        result = response.data;
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {
        subject.next(result);
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

  public openWebSocket() {
    // const subject = webSocket('wss://stream.binance.com/stream?streams=!miniTicker@arr');

    // subject.subscribe(
    //   (event: any) => {
    //     const data = event.data;
    //     if (Array.isArray(data)) {
    //       for (const msg of data) {
    //         this.handleMessage(msg);
    //       }
    //     } else {
    //       this.handleMessage(data);
    //     }
    //   },
    //   err => console.log(err), // Called if at any point WebSocket API signals some kind of error.
    //   () => console.log('complete') // Called when connection is closed (for whatever reason).
    // );
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

  private seperateByParentMarket(element: IProduct) {
    this.getProductsByParentMarket(element.pm).push(element);
  }

  private handleMessage(message: IProductMessage) {
    const lastThree = message.s.slice(-3);
    const lastFour = message.s.slice(-4);
    const parentMarket = lastFour === ParentMarkets.ALTS ? lastFour : lastThree;
    const productsToCheck: IProduct[] = this.getProductsByParentMarket(parentMarket);

    const symbol = productsToCheck.find(symbolToCheck => {
      return symbolToCheck.s === message.s;
    });
    if (symbol) {
      console.log('symbol to update', symbol);
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
