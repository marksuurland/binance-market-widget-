import { Component, OnDestroy, OnInit } from '@angular/core';
import { CategoriesALTS, categoriesFIAT, IProductMessage } from 'src/types/products.interface';
import { BinanceService } from 'src/services/binance.service';
import { Subscription } from 'rxjs';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import { BinanceWebSocketService } from 'src/services/binance.websocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public loading = true;
  public searchterm = '';
  public categoriesALTS: string[] = [CategoriesALTS.ETH, CategoriesALTS.TRX, CategoriesALTS.XRP];
  public categoriesFIAT: string[] = [categoriesFIAT.USDT, categoriesFIAT.BKRW, categoriesFIAT.BUSD,
    categoriesFIAT.EUR, categoriesFIAT.TUSD, categoriesFIAT.USDC, categoriesFIAT.TRY, categoriesFIAT.PAX,
    categoriesFIAT.AUD, categoriesFIAT.BIDR, categoriesFIAT.BRL, categoriesFIAT.DAI, categoriesFIAT.GBP,
    categoriesFIAT.IDRT, categoriesFIAT.NGN, categoriesFIAT.RUB, categoriesFIAT.ZAR, categoriesFIAT.UAH];
  private subscriptions: Subscription[] = [];
  private succeedMessageGetProducts = 'Binance products succesfully retrieved';

  constructor(
    public binanceService: BinanceService,
    private binanceWebSocketService: BinanceWebSocketService,
    private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const binanceServiceSubscription = this.binanceService.getProducts().subscribe({
      next: () => {},
      error: err => {
        this.openSnackBar(err);
      },
      complete: () => {
        this.openSnackBar(this.succeedMessageGetProducts);
        this.loading = false;
      }
    });
    this.subscriptions.push(binanceServiceSubscription);

    this.binanceWebSocketService.connect();
    const binanceWebSocketServiceSubscription = this.binanceWebSocketService.messagesSubject.subscribe({
      next: (productMessage: IProductMessage) => {
        if (productMessage) {
          this.binanceService.handleProductMessage(productMessage);
        }
      },
      error: err => {
        this.openSnackBar(err);
      },
      complete: () => {}
    });
    this.subscriptions.push(binanceWebSocketServiceSubscription);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public applyFilter(event: Event) {
    this.searchterm = (event.target as HTMLInputElement).value;
  }

  public closeWebSocket() {
    this.binanceWebSocketService.close();
  }

  public reconnectWebSocket() {
    this.binanceWebSocketService.reconnect();
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
