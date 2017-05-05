const DOMNodeCollection = require("./dom_node_collection.js");

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
