import { Evaluation } from '../../evaluate';
import { SetValues, Slide } from '../../slide';
import { showButton } from '../../makeSlides';
import { SVGInjector } from '@tanem/svg-injector';
import { getChildIds, removeListener } from '../../../utilities';
import { Result } from '../strategies/result';
import { CreateHtml, ImapType } from '../strategies/createHtml';
import { Evaluate } from '../strategies/evaluate';
export class Imap extends Slide<string> {
  constructor() {
    super('imap',Evaluate.SIMPLE);
  }
  img = '';
  resultType = Result.SIMPLE;
  createHtml = CreateHtml.IMAP;
  evaluateStrategy = Evaluate.SIMPLE;
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
    const txt = this.txt;
    const img = this.img;
    const createHtml = this.createHtml;
    makeSlides2(createHtml, txt, img, setValues, doc);
  }
  public evaluate(): Evaluation {
    const txt = this.txt;
    const res = this.res;
    const ans = this.ans;
    const result = this.result();
    return this.evaluateStrategy(txt, res, ans, result);
  }
}
function makeSlides2(createHtml: ImapType, txt: string, img: string, setValues: SetValues<string>, doc: Document) {
  const html = createHtml(txt, img);
  setValues.createPageContent(html, doc);
  const picture = doc.getElementById('imagemap');
  //inject SVG into page so it is part of DOM
  SVGInjector(picture, { afterAll() { afterAll(setValues, doc); } });
}
function afterAll(setValues: SetValues<string>, doc: Document) {
  const ids = getChildIds(doc, 'imagemap');
  ids.forEach((id) => {
    const element = doc.getElementById(id) as HTMLElement;
    element.addEventListener('click', () => {
      ids.forEach((id) => {
        const element = doc.getElementById(id) as HTMLElement;
        element.classList.remove('shape');
        removeListener(element);
      });
      setValues.setRes(id);
      const element = doc.getElementById(id) as HTMLElement;
      let classname = 'shape_incorrect';
      if (setValues.result()) classname = 'shape_correct';
      element.classList.add(classname);
      setValues.saveData();
      showButton(doc);
    });
  });
}
