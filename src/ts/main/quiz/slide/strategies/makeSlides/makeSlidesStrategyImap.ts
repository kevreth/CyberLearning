import { SVGInjector } from '@tanem/svg-injector';
import { getChildIds, removeListener } from '../../../../utilities';
import { showButton } from '../../../makeSlides';
import type { SlideInterface } from '../../../slideInterface';
import { playAudio } from '../../audio';
import { createPageContent } from '../../createPageContent';
// import type { SetValues } from '../../setValues';
import type { CreateHtmlTypeImap } from '../createHtmlStrategy';
export function makeSlidesStrategyImap(
  txt: string,
  img: string,
  createHtml: CreateHtmlTypeImap,
  doc: Document,
  setValues: SlideInterface
) {
  const html = createHtml(txt, img);
  createPageContent(html, doc);
  const picture = doc.getElementById('imagemap');
  //inject SVG into page so it is part of DOM
  SVGInjector(picture, {
    afterAll() {
      addEventListener(setValues, doc, txt);
    },
  });
}
function addEventListener(
  setValues: SlideInterface,
  doc: Document,
  txt: string
) {
  const ids = getChildIds(doc, 'imagemap');
  ids.forEach((id) => {
    const element = doc.getElementById(id) as HTMLElement;
    element.addEventListener('click', () => {
      conclude(doc, setValues, id, txt);
    });
  });
}
function conclude(
  doc: Document,
  setValues: SlideInterface,
  id: string,
  txt: string
) {
  setValues.setRes(id);
  setValues.saveData();
  const isCorrect = decorate(setValues, doc);
  playAudio(isCorrect);
  showButton(doc, txt);
}
function decorate(setValues: SlideInterface, doc: Document) {
  const ids = getChildIds(doc, 'imagemap');
  ids.forEach((id) => {
    const element = doc.getElementById(id) as HTMLElement;
    element.classList.remove('shape');
    removeListener(element);
  });
  const isCorrect = setValues.result() as boolean;
  mark(isCorrect, setValues.getRes() as string, doc);
  return isCorrect;
}
function mark(isCorrect: boolean, id: string, doc: Document) {
  const classname = isCorrect ? 'shape_correct' : 'shape_incorrect';
  const element = doc.getElementById(id) as HTMLElement;
  element.classList.add(classname);
}
