import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableFooterPaginationComponent } from './table-footer-pagination.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler';

describe('TableFooterPaginationComponent', () => {
	let component: TableFooterPaginationComponent;
	let fixture: ComponentFixture<TableFooterPaginationComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [TableFooterPaginationComponent],
			imports: [],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
		}).compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(TableFooterPaginationComponent);
		component = fixture.componentInstance;

		fixture.detectChanges();
	});

	it('deberia crear componente', () => {
		expect(component).toBeTruthy();
	});

	it('deberia comenzar en pagina 1', () => {
		component.page = 1;
		component.pageSize = 10;
		component.totalItemsPerPage = 10;

		component.ngOnChanges({});

		expect(component.to).toEqual(1);
	});

	it('deberia mostrar 10 registros en pagina 1', () => {
		component.page = 1;
		component.pageSize = 10;
		component.totalItemsPerPage = 10;

		component.ngOnChanges({});

		expect(component.from).toEqual(10);
	});

	it('deberia actualizar paginado cuando pageSize cambia', () => {
		// para el output
		spyOn(component.changePaginate, 'emit');

		// primer elemento a seleccionar
		const indicePrimerItem = 0;
		component.onChangePageSize(2);

		expect(component.changePaginate.emit).toHaveBeenCalled();
	});

	it('deberia actualizar paginado cuando page cambia', () => {
		// para el output
		spyOn(component.changePaginate, 'emit');

		// primer elemento a seleccionar
		const indicePrimerItem = 0;
		component.onChangePaginate(2);

		expect(component.changePaginate.emit).toHaveBeenCalled();
	});
});
