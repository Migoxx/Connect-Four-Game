import { Component, output } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";

export interface FormResultSpielfeld {
  anzahlZeilen: number
  anzahlSpalten: number
}

@Component({
  selector: 'app-spielfeldgroesse-form',
  templateUrl: './spielfeldgroesse.form.html',
  styleUrl: './spielfeldgroesse.form.css',
  imports: [FormsModule, ReactiveFormsModule],
})

export class SpielfeldgroesseForm {

  public onSubmitClicked = output<FormResultSpielfeld>()

  public formBrett = new FormGroup({
    anzahlZeilen: new FormControl<number | null>(6, [Validators.min(5), Validators.max(20), Validators.required, Validators.pattern(/^\d+$/)]),
    anzahlSpalten: new FormControl<number | null>(7, [Validators.min(6), Validators.max(20), Validators.required, Validators.pattern(/^\d+$/)])
  })

  public get controls() {
    return this.formBrett.controls
  }

  public onSubmit() {
    const result: FormResultSpielfeld = this.formBrett.getRawValue() as FormResultSpielfeld
    this.onSubmitClicked.emit(result)
  }
}
