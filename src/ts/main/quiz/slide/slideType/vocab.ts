import { isRandom, shuffleMap } from '../../../utilities';
import { Slide } from '../../slide';
import type { MakeSlidesTypeVocab } from '../strategies/makeSlidesStrategy';
import { SetWidths } from '../strategies/setWidthsStrategy';
export class Vocab extends Slide<Array<string>> {
  list = new Map<string, string>();
  res = new Array<string>();
  processJson(json: Vocab): void {
    this.list = new Map(Object.entries(json.list));
    // console.log(json.list)
    // console.log(Object.entries(json.list))
    // console.log(this.list)
    this.txt = Array.from(this.list.values());
    this.ans = Array.from(this.list.keys());
    this.isExercise = json.isExercise;
  }
  makeSlides(doc: Document): void {
    if (isRandom()) this.list = shuffleMap(this.list);
    const list = this.list;
    const maxWidthStrategy = SetWidths.SIMPLE;
    const res = this.res;
    const setValues = this.getSetValues();
    const createHtml = this.createHtml;
    const makeSlidesStrategy = this.makeSlidesStrategy as MakeSlidesTypeVocab;
    makeSlidesStrategy(list, res, createHtml, maxWidthStrategy, doc, setValues);
  }
}
