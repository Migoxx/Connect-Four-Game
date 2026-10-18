import { gewinnPruefungVertikal, gewinnPruefungHorizontal, gewinnPruefungDiagonalPositiv, gewinnPruefungDiagonalNegativ } from './helpers';

describe('gewinnPruefungVertikal', () => {
  const feldleer = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]

  it('leeres Spielfeld sollte false sein', () => {
    feldleer.forEach((items, zeile) => {
      items.forEach((_, spalte) => {
        const result = gewinnPruefungVertikal(feldleer, 1, 6, spalte, zeile)
        expect(result).toBe(false)
      })
    })
  })
})



describe('gewinnPruefungHorizontal', () => {
  const feldleer = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]

  it('leeres Spielfeld sollte false sein', () => {
    feldleer.forEach((items, zeile) => {
      items.forEach((_, spalte) => {
        const result = gewinnPruefungHorizontal(feldleer, 1, spalte, zeile)
        expect(result).toBe(false)
      })
    })
  })
})



describe('gewinnPruefungDiagonalPositiv', () => {
  const feldleer = [
/**  0  1  2  3  4  5  6 */
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]

  it('leeres Spielfeld sollte false sein', () => {
    feldleer.forEach((items, zeile) => {
      items.forEach((_, spalte) => {
        const result = gewinnPruefungDiagonalPositiv(feldleer, 1, zeile, 6, spalte)
        expect(result).toBe(false)
      })
    })
  })
})



describe('gewinnPruefungDiagonalNegativ', () => {
  const feldleer = [
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0],
  ]

  it('leeres Spielfeld sollte false sein', () => {
    feldleer.forEach((items, zeile) => {
      items.forEach((_, spalte) => {
        const result = gewinnPruefungDiagonalNegativ(feldleer, 1, zeile, 6, spalte)
        expect(result).toBe(false)
      })
    })
  })
})



