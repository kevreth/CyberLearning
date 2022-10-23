import { polyfill } from 'mobile-drag-drop';
import { isRandom, shuffle } from '../../../utilities';
import { Slide } from '../../slide';
//Despite the documentation, "scroll behaviour" is required, not optional,
//for basic mobile drag-and-drop ability.
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import type { MakeSlidesTypeGap } from '../strategies/makeSlidesStrategy';
import { SetWidths } from '../strategies/setWidthsStrategy';
polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
export class Gap extends Slide {
  processJson(json: Gap): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    const setValues = this.getSetValues();
    const txt = this.txt as string;
    const maxWidthStrategy = SetWidths.TARGETED;
    const createHtml = this.createHtml;
    let ans = this.ans;
    if (isRandom()) ans = shuffle(ans as string[]);
    const makeSlidesStrategy = this.makeSlidesStrategy as MakeSlidesTypeGap;
    makeSlidesStrategy(txt, ans, createHtml, maxWidthStrategy, doc, setValues);
  }
  getAnswerCount(): number {
    return this.ans.length;
  }
}
