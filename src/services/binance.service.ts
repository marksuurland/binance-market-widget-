import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';
import { IGetProducts, IProduct } from 'src/types/products.interface';

@Injectable({
  providedIn: 'root'
})

export class BinanceService {
  public allsymbols: IProduct[] = [];
  public bnbsymbols: IProduct[] = [];
  public btcsymbols: IProduct[] = [];
  public altssymbols: IProduct[] = [];
  public faitsymbols: IProduct[] = [];

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

  private setTrend(element: IProduct) {
    const percentage = (element.c - element.o) / element.o * 100;
    if (percentage > 0) {
      element.trend = 'up';
    } else if (percentage < 0) {
      element.trend = 'down';
    } else {
      element.trend = 'neutral';
    }
  }

  private seperateByParentMarket(element: IProduct) {
    this.getSymbolsByParentMarket(element.pm).push(element);
  }

  private getSymbolsByParentMarket(parentMarket: string): IProduct[] {
    switch (parentMarket) {
      case 'BTC':
        return this.btcsymbols;
      case 'BNB':
        return this.bnbsymbols;
      case 'ALTS':
        return this.altssymbols;
      default:
        return this.faitsymbols;
    }
  }
}
