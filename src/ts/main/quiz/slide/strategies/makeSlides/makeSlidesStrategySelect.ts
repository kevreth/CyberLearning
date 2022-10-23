import {
  difference,
  intersection,
  removeListener,
} from '../../../../utilities';
import { showButton } from '../../../makeSlides';
import { createPageContent } from '../../createPageContent';
import type { SetValues } from '../../setValues';
import type { CreateHtmlTypeSelect } from '../createHtmlStrategy';
import type { AnswerType } from '../resultStrategy';

export function makeSlidesStrategySelect(
  inst: string,
  ans: AnswerType,
  txt: string,
  createHtml: CreateHtmlTypeSelect,
  doc: Document,
  setValues: SetValues
) {
  const txtarr = txt.split(' ');
  const html = createHtml(inst, txtarr);
  createPageContent(html, doc);
  for (let ctr = 0; ctr < txtarr.length; ctr++) iter2(ctr + 1, doc);
  const element = doc.getElementById('btn') as HTMLElement;
  const numWords = txtarr.length;
  element.addEventListener('click', () => {
    const res = evaluate2(element, numWords, ans, doc);
    setValues.setRes(res);
    setValues.saveData();
    showButton(doc, setValues);
  });
}
function iter2(ctr: number, doc: Document): void {
  const element = doc.getElementById('w' + ctr) as HTMLElement;
  element.addEventListener('click', (event) => {
    selected((event.target as Element).id, doc);
  });
}
function selected(id: string, doc: Document): void {
  const element = doc.getElementById(id) as HTMLElement;
  let color = 'white';
  if (element.style.backgroundColor === 'blue') {
    element.style.removeProperty('background-color');
    color = 'black';
  } else element.style.backgroundColor = 'blue';
  element.style.color = color;
}
function evaluate2(
  element: Element,
  numWords: number,
  ans: AnswerType,
  doc: Document
): Array<number> {
  const responses: number[] = mark(doc);
  //remove event listeners from words to prevent selection after submission
  removeEventListeners(numWords, doc);
  decorate(ans, responses, doc);
  element.remove();
  return responses;
}
function mark(doc: Document) {
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
  return responses;
}
function decorate(ans: AnswerType, responses: AnswerType, doc: Document) {
  const _ans = ans as string[];
  const _responses = responses as string[];
  //items that were not selected but should have been
  let diff = difference(_ans, _responses);
  style(diff, 'underline', 'red', doc);
  //items that should not have been selected but were
  diff = difference(_responses, _ans);
  style(diff, 'line-through', 'red', doc);
  //correctly selected items
  diff = intersection(_responses, _ans);
  style(diff, 'underline', 'green', doc);
}
function style(
  diff: AnswerType,
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
function removeEventListeners(numWords: number, doc: Document) {
  for (let i = 1; i <= numWords; i++) {
    const element = doc.getElementById('w' + i.toString()) as HTMLElement;
    //disable word selection
    removeListener(element);
    element.style.removeProperty('background-color');
    element.style.color = 'white';
  }
}
