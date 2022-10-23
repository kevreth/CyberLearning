import reloadPage from '../../../composables/startOver';
import { Json } from '../globals';
import { isEqual, makeButton } from '../utilities';
import { evaluate } from './evaluate/evaluate.support';
import { SaveData } from './slide/saveData';
import type { SetValues } from './slide/setValues';
import type { SlideInterface } from './slideInterface';
const { get: getSavedDataArray } = SaveData;
///////////////// PHASE 3: make slides
export class MakeSlides {
  public static showSlides(doc: Document): void {
    const slide = Json.getSlide();
    let idx = 0;
    const saves = getSavedDataArray();
    if (typeof slide === 'undefined') MakeSlides.endQuiz(doc);
    //"txt" identifies slides, which may be in random order.
    //TODO: factor out code in common with Score.exercise() and Slide.getSlideSavedIndex()
    else if ((idx = slide.getSlideSavedIndex(saves)) > -1) {
      if (Array.isArray(slide.txt)) {
        //if all slide questions answered
        const results = Array<string>();
        for (const saved of saves) {
          const idx2 = slide.txt.findIndex((x) =>
            isEqual(x, saved.txt as string)
          );
          if (idx2 > -1) {
            results.push(saved.result as string);
          }
        }
        if (isEqual(results.length, slide.txt.length)) {
          MakeSlides.reloadSlide(slide, idx, doc);
        }
        //not all slide questions answered
        else {
          const saves = getSavedDataArray();
          const results = Array<string>();
          for (const saved of saves) {
            const idx2 = slide.txt.findIndex((x) =>
              isEqual(x, saved.txt as string)
            );
            if (idx2 > -1) {
              results.push(saved.result as string);
            }
          }
          slide.setResults(results);
          slide.makeSlides(doc);
        }
      } else {
        MakeSlides.reloadSlide(slide, idx, doc);
      }
    } else slide.makeSlides(doc);
  }
  //The slide has already been presented to the user, as will happen on reload.
  private static reloadSlide(
    slide: SlideInterface,
    idx: number,
    doc: Document
  ) {
    const saves = getSavedDataArray();
    if (Array.isArray(slide.txt)) {
      const results = Array<string>();
      for (const saved of saves) {
        const idx2 = slide.txt.findIndex((x) =>
          isEqual(x, saved.txt as string)
        );
        if (idx2 > -1) {
          results.push(saved.result as string);
        }
      }
      slide.setResults(results);
      MakeSlides.showSlides(doc);
    } else {
      const result = saves[idx].result;
      slide.setResults(result);
      MakeSlides.showSlides(doc);
    }
  }

  private static endQuiz(doc: Document) {
    Json.reset();
    const json = Json.get();
    doc.body.innerHTML = evaluate(json); //EXECUTION ENDS
    startOverButton(doc);
  }
}
export function showButton(doc: Document, setValues: SetValues): HTMLElement {
  const continue_btn = continueButton(doc);
  continue_btn?.addEventListener('click', (): void => {
    setValues.setContinue();
    MakeSlides.showSlides(doc);
  });
  return continue_btn;
}
export function continueButton(doc: Document): HTMLElement {
  const container = 'slide';
  const continue_btn = createContinueButton(doc, container, '');
  //as an HTMLElement we can assign styles
  //this wouldn't work when using a stylesheet, not sure why.
  continue_btn.style.position = 'absolute';
  continue_btn.style.marginTop = 10 + 'px';
  continue_btn.style.marginLeft = -2.3 + 'em';
  return continue_btn;
}
export function createContinueButton(
  doc: Document,
  container: string,
  prefix: string
) {
  const button = makeButton('continueBtn', 'continueBtn', 'continue');
  const slide = doc.getElementById(container) as HTMLElement;
  slide.insertAdjacentHTML('beforeend', prefix + button);
  const continue_btn = doc.getElementById('continueBtn') as HTMLElement;
  return continue_btn;
}
export function startOverButton(doc: Document) {
  const startOverText = makeButton('startOver', 'startOver', 'Start Over');
  doc.body.insertAdjacentHTML('beforeend', '<br>' + startOverText);
  const startOver = document.getElementById('startOver') as HTMLElement;
  startOver.addEventListener('click', () => {
    reloadPage();
  });
}
