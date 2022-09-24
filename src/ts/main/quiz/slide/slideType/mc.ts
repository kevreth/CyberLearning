import { removeListener, isRandom, shuffle } from '../../../utilities';
import { SetWidths } from '../strategies/setWidths';
import { showButton } from '../../makeSlides';
import { Evaluation } from '../../evaluate';
import { Slide } from '../../slide';
import { Result } from '../strategies/result';
import { CreateHtml } from '../strategies/createHtml';
import { Evaluate } from '../strategies/evaluate';
export class Mc extends Slide<string> {
  constructor() {
    super('mc');
  }
  o: string[] = [];
  resultType = Result.SIMPLE;
  maxWidthStrategy = SetWidths.SIMPLE;
  createHtml = CreateHtml.MC;
  evaluateStrategy = Evaluate.SIMPLE;
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
    const shuffleFlag = this.isExercise && isRandom();
    let options = this.o;
    if (shuffleFlag) options = shuffle(options);
    const html = this.createHtml(this.txt, options);
    this.createPageContent(html, doc);
    options.forEach((option, optionCtr) => {
      this.addBehavior(doc, option, options.length, optionCtr);
    });
    this.maxWidthStrategy(options.length,'btn', doc);
  }

  addBehavior(
    doc: Document,
    option: string,
    length: number,
    optionCtr: number
  ): void {
    const element = doc.getElementById('btn' + optionCtr) as HTMLElement;
    element.addEventListener('click', () => {
      for (let i = 0; i < length; i++)
        removeListener(doc.getElementById('btn' + i) as HTMLElement);
      const optionButton = doc.getElementById('btn' + optionCtr) as HTMLElement;
      let color = 'red';
      this.res = option;
      if (this.result()) color = 'green';
      optionButton.style.backgroundColor = color;
      this.res = option;
      this.saveData();
      showButton(doc);
    });
  }
  public evaluate(): Evaluation {
    const txt = this.txt;
    const res = this.res;
    const ans = this.ans;
    const result = this.result();
    return this.evaluateStrategy(txt, res, ans, result);
  }
}
// function evaluate(txt: string, res: AnswerType, ans: AnswerType, result: ResultReturnType) {
//   let correctCtr = 0;
//   const text = makeRow(txt, (res as string) , (ans as string));
//   if (result) correctCtr++;
//   return new Evaluation(1, correctCtr, text);
// }

