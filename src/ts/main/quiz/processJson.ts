import { shuffle, isRandom } from '../utilities';
import { Course } from './course';
import { SlideInterface } from './slide';
import { getInstance } from './slide/slideFactory';
//////////////// Phase 1: process Json
export function processJson(course: Course) {
  let slides = new Array<SlideInterface>();
  addNewInfoSlide(course.name, slides);
  course.units.forEach((unit, unit_ctr) => {
    addNewInfoSlide(titleSlideText('Unit', unit_ctr, unit.name), slides);
    unit.lessons.forEach((lesson, lesson_ctr) => {
      addNewInfoSlide(titleSlideText('Lesson', lesson_ctr, lesson.name), slides);
      lesson.modules.forEach((module, module_ctr) => {
        addNewInfoSlide(titleSlideText('Module', module_ctr, module.name), slides);
        slides = loadQuestions(slides, module.inst, false);
        slides = loadQuestions(slides, module.exercises, true);
      });
    });
  });
  return slides;
}
function titleSlideText(type: string, counter: number, name: string) {
  counter++;
  return `${type} ${counter}:<br>${name}`;
}
function loadQuestions(slides: Array<SlideInterface>, questions: Array<SlideInterface>, isExercise: boolean): Array<SlideInterface> {
  if (typeof questions !== 'undefined') {
    questions.forEach((item) => {
      item.isExercise = isExercise;
    });
    if (isRandom() && isExercise)
      questions = shuffle(questions);
      slides = slides.concat(questions);
  }
  return slides;
}
function addNewInfoSlide(text: string, slides: SlideInterface[]) {
  const slide = (getInstance('info') as SlideInterface);
  slide.txt = text;
  slides.push(slide);
}

