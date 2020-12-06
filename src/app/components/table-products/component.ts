import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriesALTS, categoriesFIAT, IProduct } from 'src/types/products.interface';
import { Columns } from 'src/types/table.interface';
@Component({
    selector: 'app-table-products',
    styleUrls: ['./component.scss'],
    templateUrl: './component.html',
    changeDetection: ChangeDetectionStrategy.Default
})
export class TableProductsComponent implements OnInit, OnChanges, AfterViewInit {
    public dataSource = new MatTableDataSource<IProduct>([]);

    public displayedColumns: string[] = [Columns.Pair, Columns.LastPrice, Columns.TwentyFourHourChange];

    private selectedCategories: string[] = [];

    @ViewChild(MatSort) sort: MatSort;

    @Input() products: IProduct[];
    @Input() categories: CategoriesALTS[] | categoriesFIAT[];
    @Input() searchterm: string;

    constructor() {}

    ngOnInit() {
        this.setTableData();
        this.overrideFilter();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.searchterm && !changes.searchterm?.firstChange && changes.searchterm?.currentValue) {
            this.dataSource.filter = changes.searchterm.currentValue;
        }
    }

    ngAfterViewInit() {
        this.overrideSort();
        this.dataSource.sort = this.sort;
    }

    public filterCategories(category: string): void {
        const categoryIndex = this.selectedCategories.findIndex((c) => c === category);
        categoryIndex === -1 ? this.selectedCategories.push(category) : this.selectedCategories.splice(categoryIndex, 1);
        this.dataSource.filter = this.selectedCategories.join(',');
    }

    private setTableData(): void {
        this.dataSource.data = this.products;
    }

    private overrideSort(): void {
        this.dataSource.sortingDataAccessor = (data: IProduct, sortHeaderId: string) => {
            switch (sortHeaderId) {
                case Columns.Pair: return data.b;
                case Columns.LastPrice: return data.c;
                case Columns.TwentyFourHourChange: return ((data.c - data.o) / data.o * 100);
            }
        };
    }

    private overrideFilter(): void {
        if (this.categories) {
            this.dataSource.filterPredicate = (data: any, filter: string) => {
                const filters: string[] = filter.split(',');
                return filters.includes(data.q);
            };
        }
    }
}
