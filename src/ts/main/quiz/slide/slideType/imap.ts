import { Slide } from '../../slide';
import type { MakeSlidesTypeImap } from '../strategies/makeSlidesStrategy';
export class Imap extends Slide {
  img = '';
  processJson(json: Imap): void {
    ({
      txt: this.txt,
      img: this.img,
      ans: this.ans,
      isExercise: this.isExercise,
    } = json);
  }
  makeSlides(doc: Document): void {
    const setValues = this.getSetValues();
    const txt = this.txt as string;
    const img = this.img;
    const createHtml = this.createHtml;
    const makeSlidesStrategy = this.makeSlidesStrategy as MakeSlidesTypeImap;
    makeSlidesStrategy(txt, img, createHtml, doc, setValues);
  }
}
