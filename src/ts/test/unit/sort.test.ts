import { expect, it } from 'vitest'
import {Sort} from '../../main/slideType/sort';
const inst = "instructions";
const ans = ['alpha','bravo','charlie','delta'];
const object = {
	"type":"sort",
	"inst":"sort",
	"ans":["a","b","c","d"]
}
it('createHtml', () => {
	// const result = new Sort().createHtml(inst,ans);
	// var count = (result.match(/list-item/g) || []).length;
	// expect(count).toBe(4);
	// expect(result).toContain("charlie");
});
it('makeSlides', () => {
	// const srt = new Sort();
	// srt.processJson(object);
	// srt.makeSlides();
});