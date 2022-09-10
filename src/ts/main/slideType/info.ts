import { Evaluation } from '../evaluation';
import { Slide } from '../slide';
import type { info } from '../course';
import { showSlides } from '../quiz';
import type { ResultReturnType } from '../result';
import { SaveData } from '../saveData';
import { makeButton } from '../utilities';
export class Info extends Slide<string> {
  txt = '';
  subtype = '';
  processJson(json: info): void {
    this.txt = json.txt;
    this.subtype = json.subtype;
  }
  makeSlides(doc: Document): void {
    const html = `\n${this.txt}`;
    this.createPageContent(html, doc);
    this.saveData();
    this.showButton(doc);
  }
  evaluate(): Evaluation {
    return new Evaluation(0, 0, '');
  }
  result(ans: string, res: string): ResultReturnType {
    throw new Error(`Method not implemented. +${ans} ${res}`);
  }
  //don't record CCQ results
  getSaveData(): SaveData {
    return new SaveData(this.txt, this.subtype, null);
  }
  //info has it's own showButton because the continue button
  //appears immediately upon page load and can be in the wrong
  //place because dynamic content in course files may cause it
  //to overlap. It gets placed before the dynamic content loads.

  //The continue button is placed inside #content here, unlike
  //other slide types where doing so causes the content to re-center
  //vertically.
  showButton(doc: Document): void {
    const button = makeButton('btn', 'continue-button', 'continue');
    const content = doc.getElementById('content') as HTMLElement;
    content.insertAdjacentHTML('beforeend', '<br>' + button);
    const continue_btn = doc.getElementById('btn') as HTMLElement;
    continue_btn?.addEventListener('click', (): void => {
      showSlides(doc);
    });
  }
}
