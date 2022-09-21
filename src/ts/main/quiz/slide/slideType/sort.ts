import type { sort } from '../../course';
import { Evaluation } from '../../evaluate';
import { Slide } from '../../slide';
import { showButton } from '../../makeSlides';
import { makeRow } from '../../evaluate';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/dist/Draggable';
import { makeButton, shuffle, isRandom } from '../../../utilities';
import { Result } from '../../slide/result';
export class Sort extends Slide<Array<string>> {
  resultType = Result.LIST;
  processJson(json: sort): void {
    ({ txt: this.txt, ans: this.ans, isExercise: this.isExercise } = json);
  }
  makeSlides(doc: Document): void {
    const html = this.createHtml(this.txt, this.ans);
    this.createPageContent(html, doc);
    this.addBehavior(doc);
  }
  createHtml(inst: string, ans: string[]): string {
    const retval = inst + '<br>\n';
    let rev = '<div id="selection"></div>\n<section class="container">\n';
    let list = ans;
    /////////  for testing
    if (isRandom()) list = shuffle(list);
    else list = ['b', 'a', 'c', 'd'];
    //////////////////////////////////
    list.forEach((item) => {
      rev = rev.concat(`  <div class="list-item">${item}</div>\n`);
    });
    rev = rev.trimRight();
    rev = rev.concat('\n</section>');
    return retval + rev + '\n</div><br>\n' + makeButton('btn', 'done', 'done');
  }
  evaluate(): Evaluation {
    let correctCtr = 0;
    const text = makeRow(this.txt, this.res.toString(), this.ans.toString());
    if (this.result()) correctCtr++;
    return new Evaluation(1, correctCtr, text);
  }
  addBehavior(doc: Document): void {
    gsap.registerPlugin(Draggable);
    const rowSize = 100; // => container height / number of items
    const container = doc.querySelector('.container');
    const listItems = Array.from(doc.querySelectorAll('.list-item')); // Array of elements
    const sortables = listItems.map(Sortable); // Array of sortables
    const total = sortables.length;
    gsap.to(container, { duration: 0.5, autoAlpha: 1 });
    const done = doc.getElementById('btn') as HTMLElement;
    done.addEventListener('click', () => {
      this.res = sortables.map((x) => x.element.innerHTML);
      let msg = 'incorrect';
      if (this.result()) msg = 'correct';
      const content = doc.getElementById('content') as HTMLElement;
      content.insertAdjacentHTML('beforeend', msg);
      done.remove();
      this.saveData();
      showButton(doc);
    });
    function Sortable(element: Element, index: number) {
      const animation = gsap.to(element, {
        duration: 0.3,
        boxShadow: 'rgba(0,0,0,0.2) 0px 16px 32px 0px',
        force3D: true,
        scale: 1.1,
        paused: true,
      });
      const dragger = new Draggable(element, {
        onDragStart: downAction,
        onRelease: upAction,
        onDrag: dragAction,
        cursor: 'inherit',
        type: 'y',
      });
      // Public properties and methods
      const sortable = {
        dragger: dragger,
        element: element,
        index: index,
        setIndex: setIndex,
      };
      gsap.set(element, { y: index * rowSize });
      function setIndex(index: number) {
        sortable.index = index;
        // Don't layout while dragging
        if (!dragger.isDragging) layout();
      }
      function downAction(this:Draggable) {
        animation.play();
        this.update();
      }
      function dragAction(this:Draggable) {
        // Calculate the current index based on element's position
        const index = clamp(Math.round(this.y / rowSize), 0, total - 1);
        if (index !== sortable.index) changeIndex(sortable, index);
      }
      function upAction() {
        animation.reverse();
        layout();
      }
      function layout() {
        gsap.to(element, { duration: 0.3, y: sortable.index * rowSize });
      }
      function changeIndex(item: typeof sortable, to: number) {
        // Change position in array
        arrayMove(sortables, item.index, to);
        // Set index for each sortable
        sortables.forEach((sortable, index) => {
          sortable.setIndex(index);
        });
      }
      // Changes an elements's position in array
      function arrayMove(
        array: Array<typeof sortable>,
        from: number,
        to: number
      ) {
        array.splice(to, 0, array.splice(from, 1)[0]);
      }
      // Clamps a value to a min/max
      function clamp(value: number, a: number, b: number) {
        return value < a ? a : value > b ? b : value;
      }
      return sortable;
    }
  }
}
