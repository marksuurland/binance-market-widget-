import { Component, OnInit } from '@angular/core';
import { Categories, IProduct } from 'src/types/products.interface';
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
      this.binanceService.allsymbols = products;
      this.binanceService.formatData(products);
      this.loading = false;
    });
    this.binanceService.openWebSocket();
  }

  public applyFilter(event: Event) {
    this.searchterm = (event.target as HTMLInputElement).value;
  }
}
