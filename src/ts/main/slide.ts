import type { Evaluation } from './evaluation';
import type { SlideType } from './course';
import type { ResultReturnType, AnswerType } from './result';
import { extend, append, empty } from './utilities';
import { mathjax } from 'mathjax-full/ts/mathjax';
import { TeX } from 'mathjax-full/ts/input/tex';
import { CHTML } from 'mathjax-full/ts/output/chtml';
import { browserAdaptor } from 'mathjax-full/ts/adaptors/browserAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/ts/handlers/html';
import hljs from 'highlight.js';
RegisterHTMLHandler(browserAdaptor());
export interface SlideInterface {
  txt: string;
  isExercise: boolean;
  pageTemplate: string;
  //Transform human-created JSON into computer-friendly form
  //Run before quiz starts
  processJson(json: SlideType): void;
  //Create slide HTML during quiz
  makeSlides(doc: Document): void;
  // response():Responses;
  //Evaluate user responses at the end of quiz
  //evaluation during quiz is NOT here
  evaluate(): Evaluation;
  createPageContent(html: string, doc: Document): void;
}
export abstract class Slide<T extends AnswerType> implements SlideInterface {
  txt = '';
  ans!: T;
  res!: T;
  pageTemplate = `
        <div id="slide">
            <div id="content">
            </div>
        </div>
    `;
  isExercise = false;
  abstract processJson(json: SlideType): void;
  abstract makeSlides(doc: Document): void;
  abstract evaluate(): Evaluation;
  abstract result(ans: T, res: T): ResultReturnType;
  createPageContent(html: string, doc: Document): void {
    const element = doc.getElementById('btn') as HTMLElement | null;
    if (element != null) element.remove(); // Removes the div with the 'div-02' id
    empty('#content');
    append('#content', html);
    this.postRendering(document);
  }
  postRendering(doc: Document) {
    hljs.highlightAll();
    const html = mathjax.document(doc, {
      InputJax: new TeX({
        inlineMath: [
          ['$', '$'],
          ['\\(', '\\)'],
        ],
        packages: ['base', 'ams', 'noundefined', 'newcommand', 'boldsymbol'],
      }),
      OutputJax: new CHTML({
        //   fontURL: 'https://cdn.rawgit.com/mathjax/mathjax-v3/3.0.0-beta.1/mathjax2/css'
      }),
    });
    html.findMath().compile().getMetrics().typeset().updateDocument();
  }
  saveData() {
    const save = this.res;
    const arr: Array<AnswerType> = this.getSaveDataList();
    arr.push(save);
    localStorage.setItem('savedata', JSON.stringify(arr));
  }
  private getSaveDataList():Array<AnswerType> {
    const data = localStorage.getItem('savedata') as string;
    const data1 = JSON.parse(data);
    const arr: Array<AnswerType> = extend<Array<AnswerType>>(
      new Array<AnswerType>(),
      data1
    );
    return arr;
  }
}
//CCQ, IMAP, MC
export abstract class Slide1 extends Slide<string> {
  result(ans: string, res: string): ResultReturnType {
    return ans === res;
  }
}
