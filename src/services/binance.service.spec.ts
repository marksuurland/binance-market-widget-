import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BinanceService } from './binance.service';
import { ParentMarkets, Trend } from 'src/types/products.interface';
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

    it('set the product trend, based on the percentage of increase/decrease of the current price against the opening price', () => {
        const upProduct = {...MockService.mockProduct, c: 0.0016441, o: 0.0016100 };
        binanceService.setTrend(upProduct);
        expect(upProduct.trend).toEqual(Trend.UP);

        const downProduct = {...MockService.mockProduct, c: 0.0016441, o: 0.0016500 };
        binanceService.setTrend(downProduct);
        expect(downProduct.trend).toEqual(Trend.DOWN);

        const neutralProduct = {...MockService.mockProduct, c: 0.0016441, o: 0.0016441 };
        binanceService.setTrend(neutralProduct);
        expect(neutralProduct.trend).toEqual(Trend.NEUTRAL);
    });

    it('based on the product parent market, add it to the parentmarket list of products', () => {
        const bnbProduct = {...MockService.mockProduct, pm: ParentMarkets.BNB };
        binanceService.seperateByParentMarket(bnbProduct);
        expect(binanceService.bnbproducts.length).toEqual(2);
    });
});
