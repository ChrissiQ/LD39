let stage;

function maxSize() {
  stage.canvas.setAttribute('width', window.innerWidth);
  stage.canvas.setAttribute('height', window.innerHeight);
}

function init() {
  stage = new createjs.Stage('game');
  maxSize();
}

init();
