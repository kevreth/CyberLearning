import type { select } from '../../course';
import {
  difference,
  intersection,
  makeButton,
  removeListener,
} from '../../../utilities';
import { showButton } from '../../makeSlides';
import { makeRow } from '../../evaluate';
import { Evaluation } from '../../evaluate';
import { Slide } from '../../slide';
import { Result } from '../../slide/result';
export class Select extends Slide<Array<number>> {
  inst = '';
  resultType = Result.LIST;
  processJson(json: select): void {
    ({
      inst: this.inst,
      txt: this.txt,
      ans: this.ans,
      isExercise: this.isExercise,
    } = json);
  }
  makeSlides(doc: Document): void {
    const html = this.createHtml(this.inst, this.txt.split(' '));
    this.createPageContent(html, doc);
    const res = this.txt.split(' ');
    for (let ctr = 0; ctr < res.length; ctr++) this.iter2(ctr + 1, doc);
    const element = doc.getElementById('btn') as HTMLElement;
    const numWords = res.length;
    element.addEventListener('click', () => {
      this.res = this.evaluate2(element, numWords, this.ans, doc);
      this.saveData();
      showButton(doc);
    });
  }
  public createHtml(instructions: string, res: string[]): string {
    const accum = new Array<string>(
      `${instructions}<span style="display: block; margin-bottom: .5em;"></span>\n<div id="text">\n`
    );
    res.forEach((item, idx) => {
      accum.push(`<span id="w${idx + 1}">${item}</span> `);
    });
    const button = makeButton('btn', 'done', 'done');
    accum.push(`</div><br>\n${button}\n`);
    return accum.join('\n');
  }
  iter2(ctr: number, doc: Document): void {
    const element = doc.getElementById('w' + ctr) as HTMLElement;
    element.addEventListener('click', (event) => {
      this.selected((event.target as Element).id, doc);
    });
  }
  selected(id: string, doc: Document): void {
    const element = doc.getElementById(id) as HTMLElement;
    let color = 'white';
    if (element.style.backgroundColor === 'blue') {
      element.style.removeProperty('background-color');
      color = 'black';
    } else element.style.backgroundColor = 'blue';
    element.style.color = color;
  }
  evaluate2(
    element: Element,
    numWords: number,
    ans: Array<number>,
    doc: Document
  ): Array<number> {
    let found = true;
    let ctr = 1;
    const responses: number[] = [];
    while (found) {
      const id = 'w' + ctr.toString();
      const element = doc.getElementById(id);
      if (element !== null) {
        if (element.style.backgroundColor === 'blue') responses.push(ctr);
      } else found = false;
      ctr++;
    }
    //remove event listeners from words to prevent selection after submission
    for (let i = 1; i <= numWords; i++) {
      const element = doc.getElementById('w' + i.toString()) as HTMLElement;
      //disable word selection
      removeListener(element);
      element.style.removeProperty('background-color');
      element.style.color = 'white';
    }
    //items that were not selected but should have been
    let diff = difference(ans, responses);
    this.style(diff, 'underline', 'red', doc);
    //items that should not have been selected but were
    diff = difference(responses, ans);
    this.style(diff, 'line-through', 'red', doc);
    //correctly selected items
    diff = intersection(responses, ans);
    this.style(diff, 'underline', 'green', doc);
    element.remove();
    return responses;
  }
  style(
    diff: Array<number>,
    decoration: string,
    color: string,
    doc: Document
  ): void {
    length = diff.length;
    for (let i = 0; i < length; i++) {
      const id = diff[i];
      const element = doc.getElementById('w' + id.toString()) as HTMLElement;
      element.style.textDecoration = decoration;
      element.style.textDecorationColor = color;
      element.style.removeProperty('background-color');
      element.style.color = 'white';
    }
  }
  evaluate(): Evaluation {
    const text = makeRow(this.txt, this.res.toString(), this.ans.toString());
    let correctCtr = 0;
    if (this.result()) correctCtr++;
    return new Evaluation(1, correctCtr, text);
  }
}
