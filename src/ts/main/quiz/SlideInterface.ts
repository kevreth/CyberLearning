import type { Evaluation } from './evaluate/evaluate';
import type { SaveData } from './slide/saveData';
import type { CreateHtmlTypeIntersection } from './slide/strategies/createHtmlStrategy';
import type { EvaluateType } from './slide/strategies/evaluateStrategy';
import type { MakeSlidesType } from './slide/strategies/makeSlidesStrategy';
import type {
  AnswerType,
  ResultReturnType,
  ResultType,
} from './slide/strategies/resultStrategy';

export interface SlideInterface {
  txt: AnswerType;
  type: string;
  cont: boolean;
  isExercise: boolean;
  pageTemplate: string;
  createHtml: CreateHtmlTypeIntersection;
  makeSlidesStrategy: MakeSlidesType;
  evaluateStrategy: EvaluateType;
  resultType: ResultType;
  //Transform human-created YML into computer-friendly JSON
  //Run before quiz starts
  processJson(json: SlideInterface): void;
  //Create slide HTML during quiz
  makeSlides(doc: Document): void;
  //Evaluate user responses at the end of quiz
  //evaluation during quiz is NOT here
  evaluate(): Evaluation;
  setResults(res: AnswerType): void;
  result(): ResultReturnType;
  getAnswerCount(): number;
  getSlideSavedIndex(arr: Array<SaveData>): number;
  setContinue(): void;
}
