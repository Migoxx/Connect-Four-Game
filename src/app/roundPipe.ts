import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "roundPipe"})

export class roundPipe implements PipeTransform {

  public transform(value: number): number {
    return Math.round(value * 100) / 100
  }
}
