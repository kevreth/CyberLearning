import _ from 'lodash';
import $ from 'jquery';
import type { Course } from './quiz/course';
import * as yaml from 'js-yaml';
import { SaveData } from './quiz/slide/saveData';

export function makeButton(id: string, clazz: string, content: string): string {
  return `<button id="${id}" class="${clazz}" type="button">${content}</button>`;
}
export function removeListener(element: Node): void {
  const elClone = element.cloneNode(true) as Node;
  const parent = element.parentNode as Node;
  parent.replaceChild(elClone, element);
  element.addEventListener(
    'click',
    (event) => {
      event.stopImmediatePropagation();
    },
    true
  );
}
export function isRandom(): boolean {
  const val = sessionStorage.getItem('random');
  let retval = false;
  if (val === null || val === 'true') retval = true;
  return retval;
}
export function shuffleMap<K, V>(map: Map<K, V>): Map<K, V> {
  let keys: K[] = [];
  map.forEach((value, key) => {
    keys.push(key);
  });
  keys = shuffle(keys);
  const newmap: Map<K, V> = new Map();
  for (const key of keys) {
    const value = map.get(key) as V;
    newmap.set(key, value);
  }
  return newmap;
}
export function getChildIds(doc: Document, parent: string): Array<string> {
  const predicate = '#' + parent + ' [id]';
  const list: NodeListOf<Element> = doc.querySelectorAll(predicate);
  return Array.from(list).map(({ id }) => id);
}
export function getNumberedProperties(
  obj: object,
  propName: string
): Array<object> {
  const retval: Array<object> = new Array<object>();
  for (const [key, value] of Object.entries(obj)) {
    if (key.startsWith(propName)) retval.push([key, value]);
  }
  return retval.sort();
}
export function getSavedDataArray(): Array<SaveData> {
  const data = localStorage.getItem('savedata') as string;
  const data1 = JSON.parse(data);
  const arr: Array<SaveData> = extend<Array<SaveData>>(
    new Array<SaveData>(),
    data1
  );
  return arr;
}
//Will be used to check course file for duplicate txt fields
export function hasDuplicates<T>(arr: Array<T>): boolean {
  return new Set(arr).size != arr.length;
}
// =========================== Lodash wrappers ================================
export function random(min: number, max: number): number {
  return _.random(min, max);
}
export function isEqual<T>(obj1: T, obj2: T): boolean {
  return _.isEqual(obj1, obj2);
}
export function difference<T>(arrA: Array<T>, arrB: Array<T>): Array<T> {
  return _.difference(arrA, arrB);
}
export function intersection<T>(arrA: Array<T>, arrB: Array<T>): Array<T> {
  return _.intersection(arrA, arrB);
}
export function shuffle<T>(data: Array<T>): Array<T> {
  return _.shuffle(data);
}
export function escape(data: string): string {
  return _.escape(data);
}
// =========================== Jquery wrappers ================================
export function extend<T>(obj1: T, obj2: object) {
  return $.extend(obj1, obj2);
}
//Required only for JQuery load() methods in course data files, usually for tables.
export function append(elem: string, content: string) {
  $(elem).append(content);
}
export function empty(elem: string) {
  $(elem).empty();
}
export function getYaml(filename: string, f: (data: Course) => void) {
  fetch(filename)
    .then((res) => res.blob())
    .then((blob) => blob.text())
    .then((yamlAsString) => {
      const yml = yaml.load(yamlAsString) as Course;
      f(yml);
    })
    .catch((err) => console.log('yaml err:', err));
}
