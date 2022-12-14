import { isEqual } from '../utilities';
import type { Course } from './course';
import { percentCorrect } from './evaluate';
import { SaveData } from './slide/saveData';
import { initSlide } from './slideFactory';
import type { SlideInterface } from './slideInterface';
const { get: getSavedDataArray } = SaveData;
interface ISummaryLine {
  name: string;
  score: number;
  complete: number;
  pctCorrect: string;
  count: number;
  pctComplete: string;
  children?: Array<ISummaryLine>;
  add(child: ISummaryLine): void;
  calculate(): void;
}
class SummaryLine implements ISummaryLine {
  name = '';
  score = 0;
  complete = 0;
  pctCorrect = '';
  count = 0;
  pctComplete = '';
  children?: ISummaryLine[] = new Array<SummaryLine>();
  add(child: ISummaryLine): void {
    this.score += child.score;
    this.complete += child.complete;
    this.count += child.count;
    this.calculate();
    this.children?.push(child);
  }
  calculate(): void {
    this.pctComplete = percentCorrect(this.complete, this.count) + '%';
    this.pctCorrect = percentCorrect(this.score, this.complete) + '%';
  }
}
export class Score {
  public static getScore(slide: SlideInterface): number {
    const result = slide.result();
    let count = 0;
    const isArray = Array.isArray(result);
    if (isArray) {
    } //count = exerciseGroupScore2(result);
    else count = result ? 1 : 0;
    return count;
  }
  public static summary(_course: Course): Array<SummaryLine> {
    const courseLine: ISummaryLine = new SummaryLine();
    courseLine.name = _course.name;
    _course.units.forEach((unit) => {
      const unitLine: ISummaryLine = new SummaryLine();
      unitLine.name = unit.name;
      unit.lessons.forEach((lesson) => {
        const lessonLine: ISummaryLine = new SummaryLine();
        lessonLine.name = lesson.name;
        lesson.modules.forEach((module) => {
          const moduleLine: ISummaryLine = new SummaryLine();
          moduleLine.name = module.name;
          delete moduleLine['children'];
          module.exercises.forEach((exercise) => {
            Score.exercise(exercise, moduleLine, getSavedDataArray());
          }); //exercise
          moduleLine.calculate();
          lessonLine.add(moduleLine);
        }); //module
        lessonLine.calculate();
        unitLine.add(lessonLine);
      }); //lesson
      unitLine.calculate();
      courseLine.add(unitLine);
    }); //unit
    //course
    courseLine.calculate();
    const courseLines = new Array<SummaryLine>();
    courseLines.push(courseLine);
    return courseLines;
  }
  //correlated SavedData with Exercises; not 1 to 1 in the case of vocab
  private static exercise(
    exercise: SlideInterface,
    moduleLine: ISummaryLine,
    saves: SaveData[]
  ) {
    const slides = initSlide(exercise);
    const isArray = Array.isArray(slides);
    if (isArray) {
      slides.forEach((slide) => {
        createLine(saves, slide, moduleLine);
      });
    } else {
      createLine(saves, slides, moduleLine);
    }
  }
}
function createLine(
  saves: SaveData[],
  slides: SlideInterface,
  moduleLine: ISummaryLine
) {
  const idx = saves.findIndex((x) => isEqual(x.txt, slides.txt as string));
  if (idx > -1) {
    const results = saves[idx].result;
    slides.setResults(results);
    const evaluation = slides.evaluate();
    moduleLine.count += slides.getAnswerCount();
    moduleLine.score += evaluation.correct;
    moduleLine.complete += evaluation.responses;
  }
}
