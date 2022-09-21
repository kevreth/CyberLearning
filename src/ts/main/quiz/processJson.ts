import { SlideType } from './course';
import { shuffle, isRandom } from '../utilities';
import { info, Course } from './course';
// import { SlideInterface } from './slide';
// import { getInstance } from './slide/slideFactory';
// import { ResultReturnType, AnswerType, Result, ResultType } from './slide/result';
//////////////// Phase 1: process Json
export function processJson(course: Course) {
  let slides = new Array<SlideType>();
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
function loadQuestions(slides: Array<SlideType>, questions: Array<SlideType>, isExercise: boolean): Array<SlideType> {
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
function addNewInfoSlide(text: string, slides: SlideType[]) {
  const slide = new info();
  slide.txt = text;
  slides.push(slide);
}
// export function summary(course: Course):Array<string> {
//   const lines = new Array<string>();
//   const responses = getSavedDataArray();
//   let course_score = 0;
//   course.units.forEach((unit, unit_ctr) => {
//     let unit_score = 0;
//     unit.lessons.forEach((lesson, lesson_ctr) => {
//       let lesson_score = 0;
//       lesson.modules.forEach((module, module_ctr) => {
//         module.exercises.forEach((exercise, exercise_ctr) => {
//           const slide = getInstance(exercise.type) as SlideInterface;
//           const idx = responses.findIndex((x: { txt: string; }) => x.txt === slide.txt);
//           slide.setResults(responses[idx].result);
//           const answer = slide.result();
//           if(1===1) {
//             course_score++;
//             unit_score++;
//             lesson_score++
//           } //scoring
//         }); //exercise
//       }); //lesson
//     }); //unit
//   }); //course
//   return lines;
// }
