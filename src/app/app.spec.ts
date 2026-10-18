import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  let fixture: ComponentFixture<App>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
})

//   it('should render title', async () => {
//     fixture = TestBed.createComponent(App);
//     await fixture.whenStable();
//     const compiled = fixture.nativeElement as HTMLElement;
//     // - expect(compiled.querySelector('h1')?.textContent).toContain('Hello, erstesprojekt_4gewinnt');
//     const items = compiled.querySelectorAll('h2')
//     expect(items.length).toBe(2)
//     expect(items[0]?.textContent).toContain("Spieler am Zug ")
//     expect(items[0]?.textContent).toContain("Test")
//   });
// });
