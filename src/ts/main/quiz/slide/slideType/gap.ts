import { showButton } from '../../makeSlides';
import { polyfill } from 'mobile-drag-drop';
import { Result } from '../strategies/result';
import { Evaluation } from '../../evaluate';
import { makeRow } from '../../evaluate';
import { Slide } from '../../slide';
import { shuffle, isRandom } from '../../../utilities';
//Despite the documentation, "scroll behaviour" is required, not optional,
//for basic mobile drag-and-drop ability.
import { scrollBehaviourDragImageTranslateOverride } from 'mobile-drag-drop/scroll-behaviour';
import { SetWidths } from '../strategies/setWidths';
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
  processJson(json: Gap): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    let ans = this.ans;
    if (isRandom()) ans = shuffle(ans);
    const html = this.createHtml(ans, this.txt);
    this.createPageContent(html, doc);
    ans.forEach((currentFills, ctr) => {
      this.setfills(ctr, currentFills, doc);
      this.setgap(ctr, doc);
    });
    this.maxWidthStrategy(this.ans.length, 'fill', 'gap', doc);
  }
  createHtml(ans: string[], text: string): string {
    const fills_accum = this.fills(ans);
    const gaps_accum = this.gaps(ans.length, text);
    const remaining = ans.length.toString();
    const html =
      `\n<div id="fills">${fills_accum}\n</div>` +
      `\n<div id="gaps">${gaps_accum}\n</div>` +
      `\n<div id="remaining">${remaining}</div>` +
      '\n<div id="response"></div>';
    return html;
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
  setgap(ctr: number, doc: Document): void {
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
      this.drop(fillNumber, fillText, gapNumber, document);
      id.ondrop = null;
      (e.target as HTMLElement).style.removeProperty('background-color');
    };
  }
  drop(
    fillNumber: string,
    fillText: string,
    gapNumber: string,
    doc: Document
  ): void {
    const gap = doc.getElementById('gap' + gapNumber) as HTMLElement;
    gap.innerHTML = `<span id = "ans${gapNumber}" class="ans">${fillText}</span>`;
    const fill = doc.getElementById('fill' + fillNumber) as HTMLElement;
    fill.innerHTML = '&nbsp;';
    fill.removeAttribute('class');
    const fillsRemaining = doc.getElementsByClassName('fills').length;
    const remaining = doc.getElementById('remaining') as HTMLElement;
    remaining.innerHTML = fillsRemaining.toString();
    if (fillsRemaining === 0) {
      this.res = this.evaluateA(doc);
      this.saveData();
      showButton(doc);
    }
  }
  evaluateA(doc: Document): Array<string> {
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
      const answer = this.ans[ctr];
      if (answer === response) {
        color = 'green';
        correct++;
      }
      const id = 'ans' + ctr;
      const ans = doc.getElementById(id) as HTMLElement;
      ans.style.backgroundColor = color;
      ans.style.color = 'white';
    }
    const pctCorrect = ((correct / this.ans.length) * 100).toFixed(0);
    const response =
      `Number correct: ${correct} <br>\nNumber questions: ` +
      `${this.ans.length} <br>\n${pctCorrect}%`;
    const responseElem = doc.getElementById('response') as HTMLElement;
    responseElem.innerHTML = response;
    return responses;
  }
  evaluate(): Evaluation {
    const rows = new Array<string>();
    for (let i = 0; i < this.ans.length; i++) {
      const answer = this.ans[i];
      const response_ = this.res[i];
      const row_a = this.gapQuest(response_, answer, i, this.ans, this.txt);
      rows.push(row_a);
    }
    const correctCtr = (this.result() as Array<boolean>).filter(Boolean).length;
    return new Evaluation(this.ans.length, correctCtr, rows.join('\n'));
  }
  gapQuest(
    response: string,
    answer: string,
    i: number,
    ans: Array<string>,
    text: string
  ): string {
    let replaceValue = '';
    if (i === 0) replaceValue = `<td rowspan="${ans.length}">${text}</td>`;
    let row_a = makeRow(replaceValue, response, answer);
    row_a = row_a.replace(`<td>${replaceValue}</td>`, replaceValue);
    return row_a;
  }
}
