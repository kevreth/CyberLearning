import {
  isEqual,
  isRandom,
  removeListener,
  shuffle,
  timestampNow,
} from '../../../../utilities';
import { continueButton, showButton } from '../../../makeSlides';
import { createPageContent } from '../../createPageContent';
import { SaveData } from '../../saveData';
import type { SetValues } from '../../setValues';
import type { CreateHtmlTypeMc } from '../createHtmlStrategy';
import type { AnswerType } from '../resultStrategy';
import type { SetWidthTypeSimple } from '../setWidthsStrategy';
const { get: getSavedDataArray } = SaveData;
const { set: saveData } = SaveData;
export const CHOICES = 4;
export type vocabTuplesType = [
  txt: string,
  ans: string,
  options: Array<string>
][];
export function getMissingSlides(
  arr: Array<SaveData>,
  txtArr: string[]
): string[] {
  const retval: string[] = [];
  for (const txt of txtArr) {
    const idx = arr.findIndex((x) => isEqual(x.txt, txt as AnswerType));
    if (idx < 0) retval.push(txt as string);
  }
  return retval;
}
export function makeSlidesStrategyVocab(
  map: Map<string, string>,
  res: AnswerType,
  createHtml: CreateHtmlTypeMc,
  maxWidthStrategy: SetWidthTypeSimple,
  doc: Document,
  setValues: SetValues
): void {
  const txtArr = Array.from(map.values());
  const savedData = getSavedDataArray();
  const missing = getMissingSlides(savedData, txtArr);
  const vocabTuples = generateQuestions(map, missing);
  const html_list = createHtmlLoop(vocabTuples, createHtml);
  paging(doc, html_list, vocabTuples, 0, maxWidthStrategy, res, setValues);
}
export function paging(
  doc: Document,
  html_list: string[],
  vocabTuples: vocabTuplesType,
  questionCtr: number,
  maxWidthStrategy: SetWidthTypeSimple,
  res: AnswerType,
  setValues: SetValues
): void {
  createPageContent(html_list[questionCtr], doc);
  const tuple = vocabTuples[questionCtr];
  const answer = tuple[1];
  const options = tuple[2];
  options.forEach((option, j) => {
    addOptionButtonEventListener(
      j,
      doc,
      answer,
      res,
      option,
      options,
      questionCtr,
      html_list,
      vocabTuples,
      setValues,
      maxWidthStrategy
    );
  });
  maxWidthStrategy(options.length, 'btn', doc);
}
export function addOptionButtonEventListener(
  j: number,
  doc: Document,
  answer: string,
  res: AnswerType,
  option: string,
  options: string[],
  questionCtr: number,
  html_list: string[],
  vocabTuples: vocabTuplesType,
  setValues: SetValues,
  maxWidthStrategy: SetWidthTypeSimple
) {
  const buttonId = 'btn' + j.toString();
  const button = doc.getElementById(buttonId) as HTMLElement;
  button.addEventListener('click', () => {
    (res as string[]).push(option);
    setButtonColor(option, answer, button);
    for (let i = 0; i < options.length; i++) {
      const button = doc.getElementById('btn' + i) as HTMLElement;
      removeListener(button);
    }
    if (questionCtr + 1 < html_list.length) {
      addContinueButtonListener(
        doc,
        html_list,
        vocabTuples,
        questionCtr,
        maxWidthStrategy,
        res,
        setValues
      );
      saveData(
        vocabTuples[questionCtr][0],
        (res as string[])[questionCtr],
        timestampNow(),
        true
      );
    } else {
      saveData(
        vocabTuples[questionCtr][0],
        (res as string[])[questionCtr],
        timestampNow(),
        true
      );
      showButton(doc, setValues);
    }
  });
}
export function setButtonColor(
  option: string,
  answer: string,
  button: HTMLElement
) {
  let color = 'red';
  if (option === answer) color = 'green';
  button.style.backgroundColor = color;
}
export function addContinueButtonListener(
  doc: Document,
  html_list: string[],
  vocabTuples: vocabTuplesType,
  questionCtr: number,
  maxWidthStrategy: SetWidthTypeSimple,
  res: AnswerType,
  setValues: SetValues
) {
  const element = continueButton(doc) as HTMLElement;
  element.addEventListener('click', (): void => {
    paging(
      doc,
      html_list,
      vocabTuples,
      questionCtr + 1,
      maxWidthStrategy,
      res,
      setValues
    );
  });
}
export function createHtmlLoop(
  vocabTuples: vocabTuplesType,
  createHtml: CreateHtmlTypeMc
): string[] {
  const retval: string[] = [];
  for (const tuple of vocabTuples) {
    const question = tuple[0];
    const options = tuple[2];
    const html = createHtml(question, options);
    retval.push(html);
  }
  return retval;
}
export function generateQuestions(
  map: Map<string, string>,
  missingValues: Array<string>
): vocabTuplesType {
  const missingKeys = new Array<string>();
  map.forEach((value, key) => {
    if (missingValues.includes(value)) missingKeys.push(key);
  });
  const keys = Array.from(map.keys());
  const vocabTuples: vocabTuplesType = [];
  for (const key of missingKeys) {
    let options = keys.slice(0, CHOICES);
    //if correct answer is not in "options",
    //replace the first entry with it.
    if (!options.includes(key)) options[0] = key;
    if (isRandom()) options = shuffle(options);
    const quest = map.get(key) as string;
    vocabTuples.push([quest, key, options]);
  }
  return vocabTuples;
}
