import {slides} from './quiz';
import '../../../src/css/style1.css'
sessionStorage.clear();
//===========================================================================
// un-comment for TESTING
sessionStorage.setItem("random","false");
//===========================================================================
// const file = './history.json';
const file = '../../../src/courses/english.json';
slides(file, document);
