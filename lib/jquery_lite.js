/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

const DOMNodeCollection = __webpack_require__(1);

let queue = [];

Window.prototype.$l = function (selector) {

  if (selector instanceof HTMLElement) {
    return new DOMNodeCollection(selector);
  } else if (selector.constructor === String) {
    let nodeList = document.querySelectorAll(selector);
    return new DOMNodeCollection(Array.from(nodeList));
  } else if (selector instanceof Function) {
    if (document.readyState === 'complete') {
      selector();
    } else{
    queue.push(selector);
    }
  }
};

var readyStateCheckInterval = setInterval(function() {
    if (document.readyState === "complete") {
        clearInterval(readyStateCheckInterval);
        queue.forEach((el) => {
          el();
        });
    }
}, 10);


/***/ }),
/* 1 */
/***/ (function(module, exports) {

class DOMNodeCollection {
  constructor(htmlElements) {
    this.htmlElements = htmlElements;
  }

  html(string){
    if (string) {
      this.htmlElements.forEach((el) => {
        el.innerHTML = string;
      });
    } else {
      return this.htmlElements[0].innerHTML;
    }
  }

  empty(){
    this.htmlElements.forEach((el) => {
      el.innerHTML = "";
    });
  }

  append(newEl){

    if (newEl.constructor === String) {
      this.htmlElements.forEach((el) => {
        el.innerHTML += newEl;
      });
    } else if (newEl.constructor === DOMNodeCollection) {
      this.htmlElements.forEach((el) => {
        newEl.htmlElements.forEach((el2) => {
          el.innerHTML += el2.outerHTML;
        });
      });
    } else if (newEl instanceof HTMLElement) {
      this.htmlElements.forEach((el) => {
        el.innerHTML += newEl.outerHTML;
      });
    }
  }

  attr(attribute, value){
    if (value !== undefined) {
      this.htmlElements.forEach((el) => {
        el.setAttribute(attribute, value);
      });
    } else {
       return this.htmlElements[0].getAttribute(attribute);
    }
  }

  addClass(className){
    if (this.attr('class')) {
      let oldClass = this.attr('class');
      this.attr('class', oldClass + " " + className);
    } else {
      this.attr('class',className);
    }
  }

  removeClass(className){
    if (className) {
      className = className.split(" ");
      let oldclasses = this.attr('class');
      oldclasses = oldclasses.split(" ");
      let newclasses = [];
      oldclasses.forEach((el) => {
        if (!className.includes(el)) {
          newclasses.push(el);
        }
      });
      this.attr('class', newclasses.join(" "));
    } else{
      this.attr('class', '');
    }
  }

  children(){
    let childrenElements = [];
    this.htmlElements.forEach((el) => {
      childrenElements.push(el.children);
    });
    return new DOMNodeCollection(childrenElements);
  }

  parent(){
    let parentElements = [];
    this.htmlElements.forEach((el) => {
      if (!parentElements.includes(el.parentElement)) {
        parentElements.push(el.parentElement);
      }
    });
    return new DOMNodeCollection(parentElements);
  }

  find(selector){
    let found = [];
    this.htmlElements.forEach((el) => {
      // debugger
      found = found.concat(Array.from(el.querySelectorAll(selector)));
    });
    return new DOMNodeCollection(found);
  }

  remove(){
    this.htmlElements.forEach((el) => {
      el.outerHTML = "";
    });
  }

  on(type, callback){
    if (this[type] === undefined) {
      this[type] = [];
    }
    this.htmlElements.forEach((el) => {
      this[type].push(callback);
      el.addEventListener(type, callback);
    });
  }

  off(type){
    this.htmlElements.forEach((el) => {
      el.removeEventListener(type, this.__proto__[type]);
    });
  }
}
module.exports = DOMNodeCollection;


/***/ })
/******/ ]);