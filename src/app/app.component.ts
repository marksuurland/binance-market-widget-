import { Component, OnDestroy, OnInit } from '@angular/core';
import { Categories, IProduct } from 'src/types/products.interface';
import { BinanceService } from 'src/services/binance.service';
import { Subscription } from 'rxjs';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  public loading = true;
  public searchterm = '';
  public categoriesALTS: string[] = [Categories.ETH, Categories.TRX, Categories.XRP];
  public categoriesFAIT: string[] = [Categories.USDT, Categories.BKRW, Categories.BUSD,
    Categories.EUR, Categories.TUSD, Categories.USDC, Categories.TRY, Categories.PAX,
    Categories.AUD, Categories.BIDR, Categories.BRL, Categories.DAI, Categories.GBP,
    Categories.IDRT, Categories.NGN, Categories.RUB, Categories.ZAR, Categories.UAH];
  private subscriptions: Subscription[] = [];

  constructor(public binanceService: BinanceService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    const subscription = this.binanceService.getProducts().subscribe({
      next: (products: IProduct[]) => {
        this.binanceService.allproducts = products;
        this.binanceService.formatData(products);
      },
      error: err => {
        this.openSnackBar(err);
      },
      complete: () => {
        console.log('complete');
        this.loading = false;
      }
    });
    this.subscriptions.push(subscription);

    this.binanceService.openWebSocket();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  public applyFilter(event: Event) {
    this.searchterm = (event.target as HTMLInputElement).value;
  }

  private openSnackBar(message: string) {
    this.snackBar.open(message, '', {
      duration: 1000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
