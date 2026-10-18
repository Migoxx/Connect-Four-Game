import { Component, output } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from "@angular/forms";

export interface FormResultSpieler {
  speichernSpieler1: string
  speichernSpieler2: string
}

@Component({
  selector: 'app-spielername-form',
  templateUrl: './spielername.form.html',
  styleUrl: './spielername.form.css',
  imports: [FormsModule, ReactiveFormsModule],
})

export class SpielernameEingabe {

  public onSubmitClicked = output<FormResultSpieler>()

  public formSpielerName = new FormGroup({
    speichernSpieler1: new FormControl<string>("", [Validators.required]),
    speichernSpieler2: new FormControl<string>("", [Validators.required])
  })

  public get controls() {
    return this.formSpielerName.controls
  }

  public onSubmit() {
    const result: FormResultSpieler = this.formSpielerName.getRawValue() as FormResultSpieler
    this.onSubmitClicked.emit(result)
  }

}
