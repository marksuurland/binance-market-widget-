import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BinanceService } from './binance.service';
import { ParentMarkets } from 'src/types/products.interface';
import * as MockService from '../mocks/mocks';

describe('BinanceService', () => {
    let binanceService: BinanceService;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
            ],
            providers: []
        });
        binanceService = TestBed.inject(BinanceService);
        binanceService.allproducts = [{...MockService.mockProduct}, {...MockService.mockProduct}, {...MockService.mockProduct},
            {...MockService.mockProduct}, {...MockService.mockProduct}];
        binanceService.bnbproducts = [{...MockService.mockProduct}];
        binanceService.btcproducts = [{...MockService.mockProduct}, {...MockService.mockProduct}];
        binanceService.altsproducts = [{...MockService.mockProduct}, {...MockService.mockProduct}, {...MockService.mockProduct}];
        binanceService.faitproducts = [{...MockService.mockProduct},
            {...MockService.mockProduct},
            {...MockService.mockProduct},
            {...MockService.mockProduct}];
    });

    it('should be created', () => {
        expect(BinanceService).toBeTruthy();
    });

    it('get the products based on the given parentmarket', () => {
        expect(binanceService.getProductsByParentMarket(ParentMarkets.BNB).length).toEqual(1);
        expect(binanceService.getProductsByParentMarket(ParentMarkets.BTC).length).toEqual(2);
        expect(binanceService.getProductsByParentMarket(ParentMarkets.ALTS).length).toEqual(3);
        expect(binanceService.getProductsByParentMarket(ParentMarkets.FAIT).length).toEqual(4);
    });
});
