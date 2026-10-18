import { ComponentFixture, TestBed } from "@angular/core/testing"
import { SpielfeldgroesseForm } from "./spielfeldgroesse.form"
import { By } from "@angular/platform-browser"

describe('SpielfeldgroesseForm', () => {

  let component: SpielfeldgroesseForm
  let fixture: ComponentFixture<SpielfeldgroesseForm>

  function spielerZeilenInput() {
    return fixture.debugElement.query(By.css("[formControlName='anzahlZeilen']")).nativeElement as HTMLInputElement
  }
  function spielerSpaltenInput() {
    return fixture.debugElement.query(By.css("[formControlName='anzahlSpalten']")).nativeElement as HTMLInputElement
  }

  function button() {
    return fixture.nativeElement.querySelector("button") as HTMLButtonElement
  }


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpielfeldgroesseForm],
    }).compileComponents()

    fixture = TestBed.createComponent(SpielfeldgroesseForm)
    component = fixture.componentInstance
    await fixture.whenStable()
  })

  it("sollte definiert werden", () => {
    expect(component).toBeDefined()
  })

  it("formGroup mit dem Controls soll existieren", () => {
    const controls = component.controls

    expect(controls.anzahlZeilen).toBeDefined()
    expect(controls.anzahlSpalten).toBeDefined()
  })

  it("formGroup soll invalid sein und die Controls Standardwerte besitzen", () => {
    const controls = component.controls

    expect(controls.anzahlZeilen.valid).toBeTruthy()
    expect(controls.anzahlSpalten.valid).toBeTruthy()

    expect(controls.anzahlZeilen.value).toBe(6)
    expect(controls.anzahlSpalten.value).toBe(7)
  })

  it("sollte ein Pflichtfeld sein", () => {
    const control = component.controls

    control.anzahlZeilen.setValue(null)
    expect(control.anzahlZeilen.hasError("required")).toBe(true)

    control.anzahlZeilen.setValue(1)
    expect(control.anzahlZeilen.hasError("required")).toBe(false)

  })

  it("sollte den min und max Wert validieren", () => {
    const control = component.controls

    //methode 1 - optimal
    spielerZeilenInput().value = "3"
    spielerZeilenInput().dispatchEvent(new Event("input"))
    fixture.detectChanges()

    expect(control.anzahlZeilen.hasError("min")).toBe(true)

    //methode 2 - manuell
    control.anzahlZeilen.setValue(7)
    expect(control.anzahlZeilen.hasError('min')).toBe(false)
    expect(control.anzahlZeilen.hasError("max")).toBe(false)

    control.anzahlZeilen.setValue(22)
    expect(control.anzahlZeilen.hasError("max")).toBe(true)
  })

  it("sollte den Output event mit korrekten werten erwarten", () => {

    spielerZeilenInput().value = "8"
    spielerZeilenInput().dispatchEvent(new Event("input"))

    spielerSpaltenInput().value = "9"
    spielerSpaltenInput().dispatchEvent(new Event("input"))
    fixture.detectChanges()
    const emit = vi.spyOn(component.onSubmitClicked, "emit")

    expect(button()).toBeDefined()
    expect(button().disabled).toEqual(false)

    button().click()

    expect(emit).toHaveBeenCalled()
    expect(emit).toHaveBeenCalledTimes(1)
    expect(emit).toHaveBeenCalledWith({anzahlZeilen: 8, anzahlSpalten: 9})
  })

  it("sollte ungültig sein, wenn eine Dezimalzahl eingegeben wird", () => {
    const controls = component.controls

    spielerZeilenInput().value = "6.5"
    spielerZeilenInput().dispatchEvent(new Event("input"))

    expect(controls.anzahlZeilen.valid).toBe(false)
    expect(controls.anzahlZeilen.hasError("pattern")).toBe(true)
  })
})
