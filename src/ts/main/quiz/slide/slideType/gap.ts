import { showButton } from '../../makeSlides';
import { polyfill } from 'mobile-drag-drop';
import { Result } from '../strategies/result';
import { Evaluation } from '../../evaluate';
import { Slide } from '../../slide';
import { shuffle, isRandom } from '../../../utilities';
//Despite the documentation, "scroll behaviour" is required, not optional,
//for basic mobile drag-and-drop ability.
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { SetWidths } from '../strategies/setWidths';
import { CreateHtml } from '../strategies/createHtml';
import { Evaluate } from '../strategies/evaluate';
polyfill({
  dragImageTranslateOverride: scrollBehaviourDragImageTranslateOverride,
});
//===the main divs are
//fills: the strings to drag into the gaps
//gaps: the blanks to drag strings to
//remaining: the number of remaining gaps
//response: grading after the last drop
export class Gap extends Slide<Array<string>> {
  constructor() {
    super('gap');
  }
  resultType = Result.CORRELATED;
  maxWidthStrategy = SetWidths.TARGETED;
  createHtml = CreateHtml.GAP;
  evaluateStrategy = Evaluate.GAP;
  processJson(json: Gap): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    let ans = this.ans;
    if (isRandom()) ans = shuffle(ans);
    const fills = this.fills(ans);
    const gaps = this.gaps(ans.length, this.txt);
    const remaining = ans.length.toString();
    const html = this.createHtml(remaining, fills, gaps);
    this.createPageContent(html, doc);
    ans.forEach((currentFills, ctr) => {
      this.setfills(ctr, currentFills, doc);
      this.setgap(ctr, doc,this.ans);
    });
    this.maxWidthStrategy(this.ans.length, 'fill', 'gap', doc);
  }
  fills(ans: string[]): string {
    let fill_accum = '';
    ans.forEach((currentFills, ctr) => {
      const fill_html =
        `\n    <span id="fill${ctr}" ` +
        `class="fills" draggable="true">${currentFills} &nbsp;&nbsp;</span>`;
      fill_accum = fill_accum.concat(fill_html);
    });
    return fill_accum;
  }
  gaps(length: number, gaps: string): string {
    let gaps_accum = '';
    for (let ctr = 0; ctr < length; ctr++) {
      gaps = gaps.concat('\n'); //format generated code for easier debugging
      const gap_number = ctr + 1;
      const str = '(' + gap_number.toString() + ')';
      const pos = gaps.search(str);
      const text = gaps.substring(0, pos - 1);
      gaps = gaps.replace(text, '');
      const gap_html = `\n    <span id="gap${ctr}" draggable="false">&nbsp;</span>\n`;
      gaps_accum = gaps_accum.concat(text + gap_html);
    }
    //a remaining part of gaps is leftover, so we add it here.
    return gaps_accum + gaps;
  }
  setfills(ctr: number, currentFills: string, doc: Document): void {
    const id = doc.getElementById('fill' + ctr) as HTMLElement;
    id.dataset.number = ctr.toString();
    id.dataset.text = currentFills;
    id.ondragstart = (e) => {
      const number = (e.target as HTMLElement).dataset.number as string;
      const text = (e.target as HTMLElement).dataset.text as string;
      (e.dataTransfer as DataTransfer).setData('number', number);
      (e.dataTransfer as DataTransfer).setData('text', text);
    };
  }
  setgap(ctr: number, doc: Document, ans:string[]): void {
    const id = doc.getElementById('gap' + ctr) as HTMLElement;
    id.style.display = 'inline-block';
    id.style.borderBottom = '2px solid';
    id.dataset.number = ctr.toString();
    id.ondragstart = (e) => {
      e.preventDefault();
    };
    id.ondragenter = (e) => {
      e.preventDefault();
    };
    id.ondragover = (e) => {
      e.preventDefault();
      (e.target as HTMLElement).style.backgroundColor = 'grey';
      (e.dataTransfer as DataTransfer).dropEffect = 'move';
    };
    id.ondragleave = (e) => {
      e.preventDefault();
      (e.target as HTMLElement).style.removeProperty('background-color');
    };
    id.ondrop = (e) => {
      e.preventDefault();
      const fillNumber = (e.dataTransfer as DataTransfer).getData('number');
      const fillText = (e.dataTransfer as DataTransfer).getData('text');
      const gapNumber = (e.target as HTMLElement).dataset.number as string;
      this.drop(fillNumber, fillText, gapNumber, document,ans);
      id.ondrop = null;
      (e.target as HTMLElement).style.removeProperty('background-color');
    };
  }
  drop(
    fillNumber: string,
    fillText: string,
    gapNumber: string,
    doc: Document,
    ans:string[]
  ): void {
    const fillsRemaining = drop2(doc, gapNumber, fillText, fillNumber);
    if (fillsRemaining === 0) {
      this.res = evaluateA(doc,ans);
      this.saveData();
      showButton(doc);
    }
  }
  evaluate(): Evaluation {
    const txt = this.txt;
    const res = this.res;
    const ans = this.ans;
    const result = this.result();
    return this.evaluateStrategy(ans, res, txt, result);
  }
}
function evaluateA(doc: Document, ans:string[]): Array<string> {
  const responses: string[] = [];
  const ansId = doc.getElementsByClassName('ans');
  Array.prototype.forEach.call(ansId, (slide) => {
    const response = slide.innerText as never;
    responses.push(response);
  });
  let correct = 0;
  for (let ctr = 0; ctr < responses.length; ctr++) {
    const response = responses[ctr];
    let color = 'red';
    const answer = ans[ctr];
    if (answer === response) {
      color = 'green';
      correct++;
    }
    const id = 'ans' + ctr;
    const eAns = doc.getElementById(id) as HTMLElement;
    eAns.style.backgroundColor = color;
    eAns.style.color = 'white';
  }
  const pctCorrect = ((correct / ans.length) * 100).toFixed(0);
  const response =
    `Number correct: ${correct} <br>\nNumber questions: ` +
    `${ans.length} <br>\n${pctCorrect}%`;
  const responseElem = doc.getElementById('response') as HTMLElement;
  responseElem.innerHTML = response;
  return responses;
}
function drop2(doc: Document, gapNumber: string, fillText: string, fillNumber: string) {
  const gap = doc.getElementById('gap' + gapNumber) as HTMLElement;
  gap.innerHTML = `<span id = "ans${gapNumber}" class="ans">${fillText}</span>`;
  const fill = doc.getElementById('fill' + fillNumber) as HTMLElement;
  fill.innerHTML = '&nbsp;';
  fill.removeAttribute('class');
  const fillsRemaining = doc.getElementsByClassName('fills').length;
  const remaining = doc.getElementById('remaining') as HTMLElement;
  remaining.innerHTML = fillsRemaining.toString();
  return fillsRemaining;
}
