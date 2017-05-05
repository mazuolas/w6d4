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
