let stage;
let circle;
let scale;
let population = 1;
let populationTimer = 0;
const POPULATION_SPEED = 10;
let demand = 1;
let demandTimer = 0;
const DEMAND_SPEED = 60;
let power = 10;
let powerScale = 1;
let textPopulation;
let textDemand;
let textPower;
let textFPS;
let circleScale = 3;

function resizeStage() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  let tryWidth = height * (9 / 16);
  let tryHeight = width * (16 / 9);
  if (tryWidth < width) {
    width = tryWidth;
  } else {
    height = tryHeight;
  }
  scale = width / 100;
  stage.canvas.setAttribute('width', width);
  stage.canvas.setAttribute('height', height);
  if (circle) {
    circle.set({
      x: stage.canvas.width / 2,
      y: stage.canvas.height / 2,
    });
  }
}

function tick(event) {
  demandTimer += 1;
  if (demandTimer > DEMAND_SPEED) {
    demand += 1;
    demandTimer = 0;
  }
  populationTimer += 1;
  if (populationTimer > POPULATION_SPEED) {
    population += 1;
    populationTimer = 0;
  }
  textPopulation.text = `Population: ${population}`;
  textDemand.text = `Demand: ${demand} W`;
  textPower.text = `Power: ${power} W`;
  textFPS.text = `FPS: ${createjs.Ticker.getMeasuredFPS()}`;
}

function init() {
  stage = new createjs.Stage('game');
  createjs.Touch.enable(stage);
  stage.canvas.style.backgroundColor = '#333';
  resizeStage();

  circle = new createjs.Shape();
  circle.graphics.beginFill('#ffffff').drawCircle(0, 0, scale);
  circle.set({
    x: stage.canvas.width / 2,
    y: stage.canvas.height / 2,
    scaleX: (power / 10) * circleScale,
    scaleY: (power / 10) * circleScale,
  });
  circle.addEventListener('mousedown', (event) => {
    power += 10;
    createjs.Tween.removeAllTweens(circle);
    createjs.Tween.get(circle, { loop: false })
      .to({
        scaleX: (power / 10) * circleScale,
        scaleY: (power / 10) * circleScale,
      }, 200);
  });
  let filter = new createjs.ColorFilter(1, 0, 0, 1);
  circle.filters = [filter];
  stage.addChild(circle);

  textPopulation = stage.addChild(new createjs.Text(`Population: ${population}`, '20px Arial', '#ffffff'));
  textPopulation.textBaseline = 'alphabetic';
  textPopulation.x = 10;
  textPopulation.y = textPopulation.getMeasuredLineHeight() + 5;

  textDemand = stage.addChild(new createjs.Text(`Demand: ${demand}`, '20px Arial', '#ffffff'));
  textDemand.textBaseline = 'alphabetic';
  textDemand.x = 10;
  textDemand.y = (textDemand.getMeasuredLineHeight() + 5) * 2;

  textPower = stage.addChild(new createjs.Text(`Power: ${power}`, '20px Arial', '#ffffff'));
  textPower.textBaseline = 'alphabetic';
  textPower.x = 10;
  textPower.y = (textPower.getMeasuredLineHeight() + 5) * 3;


  // Ticker
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', stage);
  createjs.Ticker.addEventListener('tick', tick);

  textFPS = stage.addChild(new createjs.Text('', '20px Arial', '#ffffff'));
  textFPS.textBaseline = 'alphabetic';
  textFPS.x = 10;
  textFPS.y = stage.canvas.height - (textFPS.getMeasuredLineHeight() + 5);
}

init();

window.addEventListener('resize', () => resizeStage());

let button = document.getElementById('play');
button.style.display = 'none';
button.addEventListener('click', () => {
  if (stage.canvas.webkitRequestFullscreen) {
    stage.canvas.webkitRequestFullscreen();
  } else if (stage.canvas.mozRequestFullScreen) {
    stage.canvas.mozRequestFullScreen();
  } else if (stage.canvas.requestFullscreen) {
    stage.canvas.requestFullscreen();
  }
});
