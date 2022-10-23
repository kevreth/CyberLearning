import { Slide } from '../../slide';
import type { MakeSlidesTypeSort } from '../strategies/makeSlidesStrategy';
export class Sort extends Slide {
  processJson(json: Sort): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    const txt = this.txt as string;
    const ans = this.ans;
    const createHtml = this.createHtml;
    const setValues = this.getSetValues();
    const makeSlidesStrategy = this.makeSlidesStrategy as MakeSlidesTypeSort;
    makeSlidesStrategy(txt, ans, createHtml, doc, setValues);
  }
}
