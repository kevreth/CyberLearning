import { Slide } from '../../slide';
import { Result } from '../strategies/result';
import { CreateHtml } from '../strategies/createHtml';
import { Evaluate } from '../strategies/evaluate';
import { MakeSlides, MakeSlidesSortType } from '../strategies/makeSlides';
export class Sort extends Slide<Array<string>> {
  constructor() {
    super('sort', MakeSlides.SORT, Evaluate.SIMPLE,Result.LIST);
  }
  createHtml = CreateHtml.SORT;
  processJson(json: Sort): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    const txt = this.txt;
    const ans = this.ans;
    const createHtml = this.createHtml;
    const setValues = this.getSetValues();
    const makeSlidesStrategy = (this.makeSlidesStrategy as MakeSlidesSortType);
    makeSlidesStrategy(txt, ans, createHtml, doc, setValues);
  }
}

