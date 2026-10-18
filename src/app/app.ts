import { Component, computed, linkedSignal, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { roundPipe } from "./roundPipe";
import { LEERESSFELD, SPIELER_1, SPIELER_2, GEWONNEN_OFFSET, gewinnPruefungVertikal, gewinnPruefungHorizontal, gewinnPruefungDiagonalNegativ, gewinnPruefungDiagonalPositiv } from './helpers';
import { FormResultSpielfeld, SpielfeldgroesseForm } from './forms/spielfeldgroesse.form';
import { FormResultSpieler, SpielernameEingabe } from './forms/spielername.form';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [roundPipe, FormsModule, ReactiveFormsModule, SpielfeldgroesseForm, SpielernameEingabe],
})
export class App {
  // standardwerte meines spielfeldes
  public anzahlZeilen = signal<number>(6)
  public anzahlSpalten = signal<number>(7)

  // spielfeld[zeile][spalte] // dynamisch anpassbarer array statt feste größe
  public spielfeld = linkedSignal<number[][]>(() => { // ähnlich wie ComputedSignal, man kann es aber auch überschreiben
    return Array.from({ length: this.anzahlZeilen() }, () => Array(this.anzahlSpalten()).fill(LEERESSFELD))
  })

  // Anzeigen / Menüs - Boolean
  public gewinnAnzeige = signal<boolean>(false)
  public vollSpalteAnzeige = signal<boolean>(false)
  public unentschieden = signal<boolean>(false)
  public spielernameEingabe = signal<boolean>(false)
  public modusAussuchen = signal<boolean>(false)
  public gegenKiSpielen = signal<boolean>(false)
  public spielfeldGroesseEingabe = signal<boolean>(false)
  public zugWurdeZurueckgesetztSpieler1 = signal<boolean>(false)
  public zugWurdeZurueckgesetztSpieler2 = signal<boolean>(false)

  public get spieler1IstDran() {
    return this.aktuellerSpieler() === SPIELER_1
  }


  // Addons
  public zeitKlasse = signal<string>("versteckt")
  public verbleibendeZeit = signal<number>(5)
  public zaehler = signal<number>(0)
  public gehoverteSpalte = signal<number>(-1)


  // Spielerdaten
  public aktuellerSpieler = signal<number>(SPIELER_1)
  public punkteSpieler1 = signal<number>(0)
  public punkteSpieler2 = signal<number>(0)
  public speichernSpieler1 = signal<string>("")
  public speichernSpieler2 = signal<string>("")
  public zufaelligeSpalte = signal<number>(0)


  // Daten für Localstorage die gespeichert und angezeigt werden
  public kiSiege = signal<number>(0)
  public spielerSiege = signal<number>(0)
  public rundenKi = signal<number>(0)

  public gewinnRate = computed(() => {
    const spielerSiege = this.spielerSiege()
    const rundenKi = this.rundenKi()
    if (rundenKi > 0) {
      return spielerSiege / rundenKi * 100
    }
    return 0
  })

  private zugTimer: number = 0
  private zugHistorie: number[] = []


  // Key und Value Getter für das Localstorage
  constructor() {
    this.kiSiege.set(Number(localStorage.getItem(`Ki gesamt gewonnen`)))
    this.spielerSiege.set(Number(localStorage.getItem(`Spieler gesamt gewonnen`)))
    this.rundenKi.set(Number(localStorage.getItem(`Runden gesamt`)))
  }



  // Button Funktion für die Reactive Forms als value
  public onSpielfeldSubmit(data: FormResultSpielfeld) {
    const zeilen = data.anzahlZeilen || 0
    const spalten = data.anzahlSpalten || 0
    this.spielfeldVergroessern(zeilen, spalten)
    // neuen Dialog anzeigen
    this.spielfeldGroesseEingabe.set(true)
    this.spielernameEingabe.set(true)
  }

  public onSubmitSpielerName(data: FormResultSpieler) {
    this.speichernSpieler1.set(data.speichernSpieler1 || "")
    this.speichernSpieler2.set(data.speichernSpieler2 || "")
    this.spielernameEingabe.set(false)
  }


  public spielfeldVergroessern(zeilen: number, spalten: number) {
    this.anzahlZeilen.set(zeilen)
    this.anzahlSpalten.set(spalten)
  }


  // Zellen nehmen eine CSS Klasse anhand einer nummer oder Variable an (Spieler1 = rot, Spieler2 = blau, base = leer), Offset ist die hervorhebung
  public getZellenName(status: number, spalte: number): string {

    let basisKlasse = ""

    switch (status) {
      case LEERESSFELD:
        basisKlasse = " zelle leer "
        if (this.gehoverteSpalte() === spalte) {
          if(this.aktuellerSpieler() === SPIELER_1) {
            basisKlasse += "vorschau-spieler1"
          }
          else if (this.aktuellerSpieler() === SPIELER_2) {
            basisKlasse += "vorschau-spieler2"
          }
        }
        break;
      case SPIELER_1:
        basisKlasse = "zelle rot"
        break;
      case SPIELER_2:
        basisKlasse = "zelle blau"
        break;
      case SPIELER_1 + GEWONNEN_OFFSET:
        basisKlasse = "zelle rot gewonnen"
        break;
      case SPIELER_2 + GEWONNEN_OFFSET:
        basisKlasse = "zelle blau gewonnen"
        break;
      default:
        basisKlasse = "zelle leer"

    }
    return basisKlasse
  }


  private spielerWechsel(): void {
    this.aktuellerSpieler.update((value) => value === SPIELER_1 ? SPIELER_2 : SPIELER_1)

    if (this.aktuellerSpieler() === SPIELER_2 && this.gegenKiSpielen()) {
      setTimeout(() => {
        this.kiZugAusfuehren()

      }, 500)
    }
  }



  private steinPlazieren(spalte: number): void {

    if (this.spielfeld()[0][spalte] !== LEERESSFELD) { // /wenn oberste Zeile voll
      this.vollSpalteAnzeige.set(true)
      return
    }

    for (let zeile = this.spielfeld().length - 1; zeile >= 0; zeile--) {
      if (this.spielfeld()[zeile][spalte] === LEERESSFELD) { // wird gefragt ob Zeile leer ist

        this.spielfeld.update((feld) => {
          feld[zeile][spalte] = this.aktuellerSpieler() // stein wird plaziert
          return [...feld]
        })


        this.zugHistorie.push(spalte)
        return // wichtig, weil sonst die schleife so lange durchläuft bis die spalte voll ist ohne zu stoppen
      }
    }
  }




  public spielZug(spalte: number, ki = false): void {

    if (this.gegenKiSpielen() && this.aktuellerSpieler() === SPIELER_2 && !ki) {
      return
    }

    this.steinPlazieren(spalte)
    this.zeigeErgebnis()

    if (this.gewinnAnzeige() || this.vollSpalteAnzeige() || this.unentschieden()) {
      return
    }
    this.zugZaehler()
    this.spielerWechsel()

    if (this.zeitKlasse() === "sichtbar") {
      this.starteTimer()
    }
  }
  //== lockerte Gleichheit: 5 == "5" ergibt true (text "5" wird zu einer Zahl)
  //=== Strikte Gleichheit: 5 === "5" ergibt false (Zahl ist nicht gleich text)



  // Prüfung ob obere Zeile voll ist oder nicht, wenn ja return true
  private istSpielfeldVoll(): boolean {
    const zeile = this.spielfeld()[0]

    if (zeile.find((item) => item === LEERESSFELD) == null) {
      return true
    }
    return false

  }

  // zählt die zuge in einer Runde
  private zugZaehler(): void {
    this.zaehler.update((value) => value + 1)
  }

  public steinZuruecksetzen(): void {

    if (this.aktuellerSpieler() === SPIELER_1 && this.zugWurdeZurueckgesetztSpieler1()) {
      return
    }

      if (this.aktuellerSpieler() === SPIELER_2 && this.zugWurdeZurueckgesetztSpieler2()) {
      return
    }


    const letzteSpalte = this.zugHistorie.pop()

    if ( letzteSpalte === undefined) {
      return
    }

    for (let zeile = 0; zeile < this.spielfeld().length; zeile++) {

      if (this.spielfeld()[zeile][letzteSpalte] !== LEERESSFELD) {

        this.spielfeld.update((feld) => {
          feld[zeile][letzteSpalte] = LEERESSFELD
          return [...feld]
        })

        this.zaehler.update((value) => value + 1)

        if (this.aktuellerSpieler() === SPIELER_1) {
          this.zugWurdeZurueckgesetztSpieler1.set(true)
        } else {
          this.zugWurdeZurueckgesetztSpieler2.set(true)
        }

        this.spielerWechsel()
        break
      }
    }
  }



  private zeigeErgebnis(): void {

    this.gewinnAnzeige.set(this.gewinnPruefungFunktion(this.spielfeld(), this.aktuellerSpieler()))

    if (this.gewinnAnzeige()) {
      this.aktuellerSpieler() === SPIELER_1 ? this.punkteSpieler1.update(value => value + 1) : this.punkteSpieler2.update(value => value + 1)

      this.speichernLocalStorage()
      this.meldung(`Es hat der ${this.aktuellerSpieler()} Spieler gewonnen`)
      this.stoppeTimer()
      return
    }

    this.unentschieden.set(this.istSpielfeldVoll())

    if (this.unentschieden()) {
      this.stoppeTimer()
      return
    }
  }



  private speichernLocalStorage(): void {

    if (this.gegenKiSpielen()) {
      this.rundenKi.update((value) => value + 1)
      localStorage.setItem(`Runden gesamt`, this.rundenKi().toString())

      this.aktuellerSpieler() === SPIELER_1 ? this.spielerSiege.update(value => value + 1) : this.kiSiege.update(value => value + 1)
      localStorage.setItem('Ki gesamt gewonnen', this.kiSiege().toString())
      localStorage.setItem(`Spieler gesamt gewonnen`, this.spielerSiege().toString())
    }
  }



  public localStorageReset(): void {
    localStorage.clear()
    this.rundenKi.set(0)
    this.kiSiege.set(0)
    this.spielerSiege.set(0)

  }



  private meldung(meldung: string): void {
    console.log(meldung)
  }

  private gewinnPruefungFunktion(spielfeld: number[][], aktuellerSpieler: number): boolean {

    for (let zeile = 0; zeile < this.anzahlZeilen(); zeile++) {
      for (let spalte = 0; spalte < this.anzahlSpalten(); spalte++) {

        if (gewinnPruefungVertikal(spielfeld, aktuellerSpieler, this.anzahlZeilen(), spalte, zeile) ||
          gewinnPruefungHorizontal(spielfeld, aktuellerSpieler, spalte, zeile) ||
          gewinnPruefungDiagonalNegativ(spielfeld, aktuellerSpieler, zeile, this.anzahlZeilen(), spalte) ||
          gewinnPruefungDiagonalPositiv(spielfeld, aktuellerSpieler, zeile, this.anzahlZeilen(), spalte)) {
          return true
        }
      }
    }
    return false
  }


  // Neustart Funktion, alles wird zurückgesetzt
  public seiteNeustart(): void {

    this.spielfeld.set(Array.from({ length: this.anzahlZeilen() }, () => Array(this.anzahlSpalten()).fill(LEERESSFELD)))

    this.gewinnAnzeige.set(false)
    this.vollSpalteAnzeige.set(false)
    this.unentschieden.set(false)

    this.zaehler.set(0)
    this.aktuellerSpieler.set(1)
    this.zugWurdeZurueckgesetztSpieler1.set(false)
    this.zugWurdeZurueckgesetztSpieler2.set(false)

    this.stoppeTimer()
  }



  private starteTimer(): void {
    this.stoppeTimer()
    this.verbleibendeZeit.set(5)

    this.zugTimer = setInterval(() => {
      this.verbleibendeZeit.update((value) => value - 1)
      console.log(`Noch ${this.verbleibendeZeit()} Sekunden`)

      if (this.verbleibendeZeit() <= 0) {
        this.spielerWechsel()
        this.starteTimer()
      }
    }, 1000)
  }

  private stoppeTimer(): void {
    clearInterval(this.zugTimer)
  }



  // Die Computer KI, führt auf erster Stelle zufällig ein zug, erkennt aber auch wenn sie blockieren und gewinnen kann und tut dies
  private kiZugAusfuehren(): void {

    let kopieSpielfeld: number[][] = [] // Klon erstellen von meinem Spielfeld

    for (let zeile = 0; zeile < this.spielfeld().length; zeile++) {
      kopieSpielfeld[zeile] = this.spielfeld()[zeile].slice() // slice kopiert jede Zeile als eigenständiges neues Array
    }

    for (let spalte = 0; spalte < this.anzahlSpalten(); spalte++) {
      for (let zeile = this.anzahlZeilen() - 1; zeile >= 0; zeile--) {
        if (kopieSpielfeld[zeile][spalte] === LEERESSFELD) {

          // setzt ein Stein von SPIELER_2 (KI) in die kopierte Spalte und führt die Gewinnprüfung durch
          kopieSpielfeld[zeile][spalte] = SPIELER_2
          let kiKannGewinnen = this.gewinnPruefungFunktion(kopieSpielfeld, SPIELER_2)

          if (kiKannGewinnen) {
            console.log(`Die KI gewinnt in Spalte ${spalte}, Zeile ${zeile}, ${kiKannGewinnen}`)
            this.spielZug(spalte, true) // Computer platziert Stein in die Spalte um zu gewinnen
            return
          }


          // setzt ein Stein von SPIELER_1 in die kopierte Spalte und führt die Gewinnprüfung durch
          kopieSpielfeld[zeile][spalte] = SPIELER_1
          let kiKannBlockieren = this.gewinnPruefungFunktion(kopieSpielfeld, SPIELER_1)

          if (kiKannBlockieren) {
            console.log(`Die KI blockiert in Spalte ${spalte}, Zeile ${zeile}, ${kiKannBlockieren}`)
            this.spielZug(spalte, true) // Computer platziert Stein in die Spalte um zu blockieren
            return
          }
          kopieSpielfeld[zeile][spalte] = LEERESSFELD //teststein rausnehmen
          break
        }
      }
    }

    // Die zufällige steinplatzierung durch den Computer
    do {
      this.zufaelligeSpalte.set(Math.floor(Math.random() * this.anzahlSpalten()))
    } while (this.spielfeld()[0][this.zufaelligeSpalte()] !== LEERESSFELD)

    this.spielZug(this.zufaelligeSpalte(), true)
  }



  public starteKiModus(): void {

    this.gegenKiSpielen.set(true)
    this.speichernSpieler1.set("Spieler")
    this.speichernSpieler2.set("Computer")
  }
}
































