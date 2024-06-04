import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InicPage } from './inic.page';

describe('InicPage', () => {
  let component: InicPage;
  let fixture: ComponentFixture<InicPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InicPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
