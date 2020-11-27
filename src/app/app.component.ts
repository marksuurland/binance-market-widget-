import { Component, OnInit } from '@angular/core';
import { Categories, IGetProducts, IProduct, IProductMessage } from 'src/types/products.interface';
import { webSocket } from "rxjs/webSocket";
import { BinanceService } from 'src/services/binance.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public loading = true;
  public searchterm = '';
  public categoriesALTS: string[] = [Categories.ETH, Categories.TRX, Categories.XRP];
  public categoriesFAIT: string[] = [Categories.USDT, Categories.BKRW, Categories.BUSD,
    Categories.EUR, Categories.TUSD, Categories.USDC, Categories.TRY, Categories.PAX,
    Categories.AUD, Categories.BIDR, Categories.BRL, Categories.DAI, Categories.GBP,
    Categories.IDRT, Categories.NGN, Categories.RUB, Categories.ZAR, Categories.UAH];

  constructor(public binanceService: BinanceService) {
  }

  ngOnInit() {
    this.binanceService.getProducts().subscribe((products: IProduct[]) => {
      this.binanceService.formatData(products);
      this.loading = false;
    });
    this.openWebSocket();
  }

  public applyFilter(event: Event) {
    this.searchterm = (event.target as HTMLInputElement).value;
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


  private getSymbolsByParentMarket(parentMarket: string): IProduct[] {
    switch (parentMarket) {
      case 'BTC':
        return this.binanceService.btcsymbols;
      case 'BNB':
        return this.binanceService.bnbsymbols;
      case 'ALTS':
        return this.binanceService.altssymbols;
      default:
        return this.binanceService.faitsymbols;
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
