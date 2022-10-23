import { createContinueButton, MakeSlides } from '../../../makeSlides';
import { createPageContent } from '../../createPageContent';
import type { SetValues } from '../../setValues';
import type { CreateHtmlTypeInfo } from '../createHtmlStrategy';
export function makeSlidesStrategyInfo(
  txt: string,
  createHtml: CreateHtmlTypeInfo,
  doc: Document,
  setValues: SetValues
) {
  const html = createHtml(txt);
  createPageContent(html, doc);
  setValues.saveData();
  showButton(doc);
}
//info has it's own showButton because the continue button
//appears immediately upon page load and can be in the wrong
//place because dynamic content in course files may cause it
//to overlap. It gets placed before the dynamic content loads.
//The continue button is placed inside #content here, unlike
//other slide types where doing so causes the content to re-center
//vertically.
function showButton(doc: Document): void {
  const container = 'content';
  const continue_btn = createContinueButton(doc, container, '<br>');
  continue_btn.addEventListener('click', (): void => {
    MakeSlides.showSlides(doc);
  });
}
