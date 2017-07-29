let stage;

function maxSize() {
  let maxWidth = window.innerWidth;
  let maxHeight = window.innerHeight;
  let width;
  let height;
  let tryWidth = maxHeight * (9 / 16);
  let tryHeight = maxWidth * (16 / 9);
  if (tryWidth < maxWidth) {
    width = tryWidth;
    height = maxHeight;
  } else {
    width = maxWidth;
    height = tryHeight;
  }
  stage.canvas.setAttribute('width', width);
  stage.canvas.setAttribute('height', height);
}

function init() {
  stage = new createjs.Stage('game');
  maxSize();
  if (stage.canvas.webkitRequestFullscreen) {
    stage.canvas.webkitRequestFullscreen();
  } else if (stage.canvas.mozRequestFullScreen) {
    stage.canvas.mozRequestFullScreen();
  } else if (stage.canvas.requestFullscreen) {
    stage.canvas.requestFullscreen();
  }
  stage.canvas.style.backgroundColor = 'green';
}

init();

window.addEventListener('resize', () => {
  maxSize();
});

let button = document.getElementById('play');
button.addEventListener('click', () => {
  if (stage.canvas.webkitRequestFullscreen) {
    stage.canvas.webkitRequestFullscreen();
  } else if (stage.canvas.mozRequestFullScreen) {
    stage.canvas.mozRequestFullScreen();
  } else if (stage.canvas.requestFullscreen) {
    stage.canvas.requestFullscreen();
  }
});
