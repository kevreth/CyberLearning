import { isRandom, removeListener, shuffle } from '../../../../utilities';
import { showButton } from '../../../makeSlides';
import { createPageContent } from '../../createPageContent';
import type { SetValues } from '../../setValues';
import type { CreateHtmlTypeMc } from '../createHtmlStrategy';
import type { SetWidthTypeSimple } from '../setWidthsStrategy';

export function makeSlidesStrategyMc(
  txt: string,
  options: string[],
  isExercise: boolean,
  createHtml: CreateHtmlTypeMc,
  maxWidthStrategy: SetWidthTypeSimple,
  doc: Document,
  setValues: SetValues
) {
  const shuffleFlag = isExercise && isRandom();
  if (shuffleFlag) options = shuffle(options);
  const html = createHtml(txt, options);
  createPageContent(html, doc);
  options.forEach((option, optionCtr) => {
    addBehavior(doc, option, options.length, optionCtr, setValues);
  });
  maxWidthStrategy(options.length, 'btn', doc);
}
function addBehavior(
  doc: Document,
  option: string,
  length: number,
  optionCtr: number,
  setValues: SetValues
): void {
  const element = doc.getElementById('btn' + optionCtr) as HTMLElement;
  element.addEventListener('click', () => {
    optionButtonEventListener(length, doc, setValues, option, optionCtr);
  });
}
function optionButtonEventListener(
  length: number,
  doc: Document,
  setValues: SetValues,
  option: string,
  optionCtr: number
) {
  for (let i = 0; i < length; i++)
    removeListener(doc.getElementById('btn' + i) as HTMLElement);
  setValues.setRes(option);
  setValues.saveData();
  decorateOptionButton(setValues, doc, optionCtr);
  showButton(doc, setValues);
}
function decorateOptionButton(
  setValues: SetValues,
  doc: Document,
  optionCtr: number
) {
  const result = setValues.result();
  const optionButton = doc.getElementById('btn' + optionCtr) as HTMLElement;
  let color = 'red';
  if (result) color = 'green';
  optionButton.style.backgroundColor = color;
}
