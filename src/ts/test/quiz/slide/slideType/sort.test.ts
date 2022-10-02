import { beforeEach, it } from 'vitest';
import { Slide } from '../../../../main/quiz/slide';
import { SORT } from '../../../../main/quiz/slideFactory';
import { SlideTest } from '../../slide.test';
class Test extends SlideTest<string[]> {
  protected factory(): Slide<string[]> {
    return SORT();
  }
}
const test = new Test();
beforeEach(() => {
  test.setUp();
});
it('getSetValues', () => {
  test.getSetValues();
});
