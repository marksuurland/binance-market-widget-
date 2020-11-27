import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Categories, IGetProducts, IProduct, IProductMessage } from 'src/types/products.interface';
import { webSocket } from "rxjs/webSocket";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public data: IProduct[] = [];
  public bnbsymbols: IProduct[] = [];
  public btcsymbols: IProduct[] = [];
  public altssymbols: IProduct[] = [];
  public faitsymbols: IProduct[] = [];

  public loading = true;
  public searchterm = '';
  public categoriesALTS: string[] = [Categories.ETH, Categories.TRX, Categories.XRP];
  public categoriesFAIT: string[] = [Categories.USDT, Categories.BKRW, Categories.BUSD,
    Categories.EUR, Categories.TUSD, Categories.USDC, Categories.TRY, Categories.PAX,
    Categories.AUD, Categories.BIDR, Categories.BRL, Categories.DAI, Categories.GBP,
    Categories.IDRT, Categories.NGN, Categories.RUB, Categories.ZAR, Categories.UAH];

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.getProducts();
    this.webSocket();
  }

  public applyFilter(event: Event) {
    this.searchterm = (event.target as HTMLInputElement).value;
  }

  public getSymbols(parentMarket: string) {
    if (parentMarket === 'BTC') {
      return this.btcsymbols;
    } else if (parentMarket === 'BNB') {
      return this.bnbsymbols;
    } else {
      return this.altssymbols;
    }
  }

  public getProducts() {
    this.http.get(
      `https://www.binance.com/exchange-api/v1/public/asset-service/product/get-products`
    ).subscribe({
      next: (response: IGetProducts) => {
        this.data = response.data;
      },
      error: err => console.error('Observer got an error: ' + err),
      complete: () => {
        this.formatData();
      },
    });
  }

  private formatData() {
    this.data.forEach((element: IProduct) => {
      this.seperateByParentMarket(element);
      this.setTrend(element);
    });
    this.loading = false;
  }

  public webSocket() {
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

  private handleMessage(message: IProductMessage) {
    const lastThree = message.s.slice(-3);
    const lastFour = message.s.slice(-4);
    const parentMarket = lastFour === 'ALTS' ? lastFour : lastThree;
    const symbolsToCheck: IProduct[] = this.getSymbolsByParentMarket(parentMarket);

    const symbol = symbolsToCheck.find(symbolToCheck => {
      return symbolToCheck.s === message.s;
    });
    if (symbol) {
      const messageC = parseFloat(message.c);
      const messageO = parseFloat(message.o);
      if (symbol.c > messageC) {
        symbol.trend = 'up';
      } else if (symbol.c < messageC) {
        symbol.trend = 'down';
      } else {
        symbol.trend = 'neutral';
      }

      symbol.c = messageC;
      symbol.o = messageO;
    }
  }
}
