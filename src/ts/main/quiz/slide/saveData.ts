import { extend } from '../../utilities';
import type { AnswerType } from './strategies/resultStrategy';
const KEY = 'savedata';
export class SaveData {
  constructor(
    public readonly txt: AnswerType,
    public readonly result: AnswerType,
    public readonly ts: string,
    public readonly cont: boolean
  ) {}
  public static get(): Array<SaveData> {
    const data = localStorage.getItem(KEY) as string;
    const data1 = JSON.parse(data);
    const arr1 = new Array<SaveData>();
    const arr: Array<SaveData> = extend<Array<SaveData>>(arr1, data1);
    return arr;
  }
  public static set(
    txt: AnswerType,
    res: AnswerType,
    ts: string,
    cont: boolean
  ) {
    if (txt !== '') {
      const save = new SaveData(txt, res, ts, cont);
      const arr = SaveData.get();
      arr.push(save);
      const json = JSON.stringify(arr);
      localStorage.setItem(KEY, json);
    }
  }
}
