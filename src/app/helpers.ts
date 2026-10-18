// Konstante
export const SPIELER_1 = 1
export const SPIELER_2 = 2
export const LEERESSFELD = 0
export const GEWONNEN_OFFSET = 2


export function gewinnPruefungVertikal(spielfeld: number[][], aktuellerSpieler: number, hoehe: number, spalte: number, zeile: number): boolean {
    if (zeile + 3 >= hoehe) {
      return false
    }
    if (
      spielfeld[zeile][spalte] === aktuellerSpieler &&
      spielfeld[zeile + 1][spalte] === aktuellerSpieler &&
      spielfeld[zeile + 2][spalte] === aktuellerSpieler &&
      spielfeld[zeile + 3][spalte] === aktuellerSpieler
    ) {

      spielfeld[zeile][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile + 1][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile + 2][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile + 3][spalte] += GEWONNEN_OFFSET
      return true
    }
    return false
  }



export function gewinnPruefungHorizontal(spielfeld: number[][], aktuellerSpieler: number, spalte: number, zeile: number): boolean {
    if (spalte + 3 >= spielfeld[zeile].length) {
      return false
    }
    if (
      spielfeld[zeile][spalte] === aktuellerSpieler &&
      spielfeld[zeile][spalte + 1] === aktuellerSpieler &&
      spielfeld[zeile][spalte + 2] === aktuellerSpieler &&
      spielfeld[zeile][spalte + 3] === aktuellerSpieler
    ) {

      spielfeld[zeile][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile][spalte + 1] += GEWONNEN_OFFSET
      spielfeld[zeile][spalte + 2] += GEWONNEN_OFFSET
      spielfeld[zeile][spalte + 3] += GEWONNEN_OFFSET
      return true

    }
    return false
  }


 export function gewinnPruefungDiagonalNegativ(spielfeld: number[][], aktuellerSpieler: number, zeile: number, hoehe: number, spalte: number): boolean {
    if (zeile + 3 >= hoehe) {
      return false
    }

    if (
      spielfeld[zeile][spalte] === aktuellerSpieler &&
      spielfeld[zeile + 1][spalte + 1] === aktuellerSpieler &&
      spielfeld[zeile + 2][spalte + 2] === aktuellerSpieler &&
      spielfeld[zeile + 3][spalte + 3] === aktuellerSpieler
    ) {

      spielfeld[zeile][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile + 1][spalte + 1] += GEWONNEN_OFFSET
      spielfeld[zeile + 2][spalte + 2] += GEWONNEN_OFFSET
      spielfeld[zeile + 3][spalte + 3] += GEWONNEN_OFFSET
      return true
    }
    return false
  }

  export function gewinnPruefungDiagonalPositiv(spielfeld: number[][], aktuellerSpieler: number, zeile: number, hoehe: number, spalte: number): boolean {
    if (zeile + 3 >= hoehe) {
      return false
    }
    if (
      spielfeld[zeile][spalte] === aktuellerSpieler &&
      spielfeld[zeile + 1][spalte - 1] === aktuellerSpieler &&
      spielfeld[zeile + 2][spalte - 2] === aktuellerSpieler &&
      spielfeld[zeile + 3][spalte - 3] === aktuellerSpieler
    ) {

      spielfeld[zeile][spalte] += GEWONNEN_OFFSET
      spielfeld[zeile + 1][spalte - 1] += GEWONNEN_OFFSET
      spielfeld[zeile + 2][spalte - 2] += GEWONNEN_OFFSET
      spielfeld[zeile + 3][spalte - 3] += GEWONNEN_OFFSET
      return true
    }
    return false
  }
