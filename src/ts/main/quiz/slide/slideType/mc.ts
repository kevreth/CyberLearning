import { SetWidths } from '../strategies/setWidths';
import { Slide } from '../../slide';
import { Result } from '../strategies/result';
import { CreateHtml } from '../strategies/createHtml';
import { Evaluate } from '../strategies/evaluate';
import { MakeSlides, MakeSlidesMcType } from '../strategies/makeSlides';
export class Mc extends Slide<string> {
  constructor() {
    super('mc',MakeSlides.MC,Evaluate.SIMPLE,Result.SIMPLE,);
  }
  o: string[] = [];
  createHtml = CreateHtml.MC;
  processJson(json: Mc): void {
    ({
      txt: this.txt,
      o: this.o,
      ans: this.ans,
      isExercise: this.isExercise,
    } = json);
    this.ans = this.o[0];
  }
  makeSlides(doc: Document): void {
    const setValues = this.getSetValues();
    const isExercise = this.isExercise;
    const createHtml = this.createHtml;
    const maxWidthStrategy = SetWidths.SIMPLE;
    const txt = (this.txt as string);
    const options = this.o;
    const makeSlidesStrategy = (this.makeSlidesStrategy as MakeSlidesMcType);
    makeSlidesStrategy (txt, options, isExercise, createHtml, maxWidthStrategy, doc, setValues);
  }
}

