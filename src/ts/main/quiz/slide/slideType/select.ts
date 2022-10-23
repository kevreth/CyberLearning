import { Slide } from '../../slide';
import type { MakeSlidesTypeSelect } from '../strategies/makeSlidesStrategy';
export class Select extends Slide {
  inst = '';
  processJson(json: Select): void {
    ({
      inst: this.inst,
      txt: this.txt,
      ans: this.ans,
      isExercise: this.isExercise,
    } = json);
  }
  makeSlides(doc: Document): void {
    const inst = this.inst;
    const txt = this.txt as string;
    const ans = this.ans;
    const setValues = this.getSetValues();
    const createHtml = this.createHtml;
    const makeSlidesStrategy = this.makeSlidesStrategy as MakeSlidesTypeSelect;
    makeSlidesStrategy(inst, ans, txt, createHtml, doc, setValues);
  }
}
