import type { SlideInterface } from './quiz/slide';
import { SlideFactory } from './quiz/slide/slideFactory';
import { getYaml } from './utilities';
import { Course } from './quiz/course';
import { Json } from './globals';
import { MakeSlides } from './quiz/makeSlides';
import { ProcessJson } from './quiz/processJson';
const PREFIX_COURSE_FILE = '../../../src/courses/';
const { processJson } = ProcessJson;
const {getInstance} = SlideFactory;
export class Quiz {
  public static slides(courseName: string, doc: Document): void {
    // Phase 1: process Json
    // Phase 2: process Slides
    // Phase 3: make slides
    // Phase 4: evaluate
    //TODO: add test for file existence
    const yaml = PREFIX_COURSE_FILE.concat(courseName, '/course.yml');
    getYaml(yaml, (course: Course) => {
      const slides = processJson(course);
      Json.set(Quiz.processSlides(slides));
      MakeSlides.showSlides(doc);
    });
  }
  //////////////// Phase 2: process Json
  static processSlides(data: Array<SlideInterface>): Array<SlideInterface> {
    const outJson: Array<SlideInterface> = new Array<SlideInterface>();
    Array.prototype.forEach.call(data, (currentQuestion: SlideInterface) => {
      const slide = getInstance(currentQuestion.type) as SlideInterface;
      slide.processJson(currentQuestion);
      outJson.push(slide);
    });
    Json.reset();
    return outJson;
  }
}
