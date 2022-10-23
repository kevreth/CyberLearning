import type { SetValues } from '../setValues';
import type {
  CreateHtmlTypeGap,
  CreateHtmlTypeImap,
  CreateHtmlTypeInfo,
  CreateHtmlTypeMc,
  CreateHtmlTypeSelect as CreateHtmlSelectType,
  CreateHtmlTypeSort,
} from './createHtmlStrategy';
import { makeSlidesStrategyGap } from './makeSlides/makeSlidesStrategyGap';
import { makeSlidesStrategyImap } from './makeSlides/makeSlidesStrategyImap';
import { makeSlidesStrategyInfo } from './makeSlides/makeSlidesStrategyInfo';
import { makeSlidesStrategyMc } from './makeSlides/makeSlidesStrategyMc';
import { makeSlidesStrategySelect } from './makeSlides/makeSlidesStrategySelect';
import { makeSlidesStrategySort } from './makeSlides/makeSlidesStrategySort';
import { makeSlidesStrategyVocab } from './makeSlides/makeSlidesStrategyVocab';
import type { AnswerType } from './resultStrategy';
import type {
  SetWidthTypeComplex,
  SetWidthTypeSimple,
} from './setWidthsStrategy';
/////////////////////////////////////////////////////////////////////////////
//                             TYPES
/////////////////////////////////////////////////////////////////////////////
export type MakeSlidesTypeGap = (
  txt: string,
  ans: AnswerType,
  createHtml: CreateHtmlTypeGap,
  maxWidthStrategy: SetWidthTypeComplex,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeImap = (
  txt: string,
  img: string,
  createHtml: CreateHtmlTypeImap,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeInfo = (
  txt: string,
  createHtml: CreateHtmlTypeInfo,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeMc = (
  txt: string,
  options: string[],
  isExercise: boolean,
  createHtml: CreateHtmlTypeMc,
  maxWidthStrategy: SetWidthTypeSimple,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeSelect = (
  inst: string,
  ans: AnswerType,
  txt: string,
  createHtml: CreateHtmlSelectType,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeSort = (
  txt: string,
  ans: AnswerType,
  createHtml: CreateHtmlTypeSort,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesTypeVocab = (
  list: Map<string, string>,
  res: AnswerType,
  createHtml: CreateHtmlTypeMc,
  maxWidthStrategy: SetWidthTypeSimple,
  doc: Document,
  setValues: SetValues
) => void;
export type MakeSlidesType =
  | MakeSlidesTypeGap
  | MakeSlidesTypeImap
  | MakeSlidesTypeInfo
  | MakeSlidesTypeMc
  | MakeSlidesTypeSelect
  | MakeSlidesTypeSort
  | MakeSlidesTypeVocab;
export class MakeSlides {
  /////////////////////////////////////////////////////////////////////////////
  //                             GAP
  /////////////////////////////////////////////////////////////////////////////
  public static readonly GAP: MakeSlidesTypeGap = function (
    txt,
    ans,
    createHtml,
    maxWidthStrategy,
    doc,
    setValues
  ) {
    makeSlidesStrategyGap(
      txt,
      ans,
      createHtml,
      maxWidthStrategy,
      doc,
      setValues
    );
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             IMAP
  /////////////////////////////////////////////////////////////////////////////
  public static readonly IMAP: MakeSlidesTypeImap = function (
    txt: string,
    img: string,
    createHtml: CreateHtmlTypeImap,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategyImap(txt, img, createHtml, doc, setValues);
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             INFO
  /////////////////////////////////////////////////////////////////////////////
  public static readonly INFO = function (
    txt: string,
    createHtml: CreateHtmlTypeInfo,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategyInfo(txt, createHtml, doc, setValues);
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             MC
  /////////////////////////////////////////////////////////////////////////////
  public static readonly MC = function (
    txt: string,
    options: string[],
    isExercise: boolean,
    createHtml: CreateHtmlTypeMc,
    maxWidthStrategy: SetWidthTypeSimple,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategyMc(
      txt,
      options,
      isExercise,
      createHtml,
      maxWidthStrategy,
      doc,
      setValues
    );
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             SELECT
  /////////////////////////////////////////////////////////////////////////////
  public static readonly SELECT = function (
    inst: string,
    ans: AnswerType,
    txt: string,
    createHtml: CreateHtmlSelectType,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategySelect(inst, ans, txt, createHtml, doc, setValues);
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             SORT
  /////////////////////////////////////////////////////////////////////////////
  public static readonly SORT = function (
    txt: string,
    ans: AnswerType,
    createHtml: CreateHtmlTypeSort,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategySort(txt, ans, createHtml, doc, setValues);
  };
  /////////////////////////////////////////////////////////////////////////////
  //                             VOCAB
  /////////////////////////////////////////////////////////////////////////////
  public static readonly VOCAB = function (
    list: Map<string, string>,
    res: AnswerType,
    createHtml: CreateHtmlTypeMc,
    maxWidthStrategy: SetWidthTypeSimple,
    doc: Document,
    setValues: SetValues
  ) {
    makeSlidesStrategyVocab(
      list,
      res,
      createHtml,
      maxWidthStrategy,
      doc,
      setValues
    );
  };
}
