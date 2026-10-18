import { TestBed, ComponentFixture } from "@angular/core/testing";
import { SpielernameEingabe } from "./spielername.form";
import { By } from "@angular/platform-browser";


describe('SpielernameEingabe', () => {

  let component: SpielernameEingabe
  let fixture: ComponentFixture<SpielernameEingabe>

  function spieler1Input() {
    return fixture.debugElement.query(By.css("[formControlName='speichernSpieler1']")).nativeElement as HTMLInputElement
  }
  function button() {
    return fixture.nativeElement.querySelector("button") as HTMLButtonElement
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpielernameEingabe],
    }).compileComponents()

    fixture = TestBed.createComponent(SpielernameEingabe)
    component = fixture.componentInstance
    await fixture.whenStable()
  })


  it('sollte definiert werden', () => {

    expect(component).toBeDefined()
  })

  it('formGroup mit dem Controls soll existieren', () => {

    const controls = component?.controls

    expect(controls?.speichernSpieler1).toBeDefined()
    expect(controls?.speichernSpieler2).toBeDefined()
  })

  it('formGroup soll invalid sein', () => {

    const controls = component?.controls

    expect(controls.speichernSpieler1.invalid).toBeTruthy()
    expect(controls.speichernSpieler2.invalid).toBeTruthy()

    expect(controls.speichernSpieler1.value).toBe("")
    expect(controls.speichernSpieler2.value).toBe("")
  })

  it('sollte Validierungsfehler anzeigen, wenn Pflichtfelder fehlen', () => {
    const spieler1Control = component.controls.speichernSpieler1

    spieler1Control.setValue('')
    expect(spieler1Control.hasError('required')).toBe(true)
  })

  it('sollte das Output-Event mit den korrekten Namen auslösen, wenn onSubmit aufgerufen wird', () => {

    expect(button()).toBeDefined()
    expect(button().disabled).toEqual(true)

    spieler1Input().value = "test1"
    spieler1Input().dispatchEvent(new Event("input"))

    component.formSpielerName.controls.speichernSpieler2.setValue("test2")
    component.formSpielerName.updateValueAndValidity()
    expect(component.formSpielerName.valid).toBe(true)

    fixture.detectChanges()

    const emit = vi.spyOn(component.onSubmitClicked, "emit")

    expect(button()).toBeDefined()
    expect(button().disabled).toEqual(false)
    button().click()

    expect(emit).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({speichernSpieler1: "test1", speichernSpieler2: "test2"})
  })
})

