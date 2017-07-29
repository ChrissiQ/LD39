let stage;
let circle;
let scale;
let population = 100;
let populationTimer = 0;
const POPULATION_SPEED = 10;
let demand = 1;
let demandTimer = 0;
const DEMAND_SPEED = 60;
let power = 1100;
let powerScale = 1;
let textPopulation;
let textDemand;
let textPower;
let textFPS;
let circleScale = 3;
let unit = 1;
let unitText;
let filter;

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
  if (!createjs.Ticker.getPaused()) {
    populationTimer += 1;
    if (populationTimer > POPULATION_SPEED) {
      let amount = Math.pow(population, 1.02) / 1000;
      if (amount < Number.MAX_SAFE_INTEGER) {
        console.log(amount);
      }
      population += amount;
      populationTimer = 0;
      demand = (Math.pow(population / 100, 3) * 1000);

      filter = new createjs.ColorFilter(0, 1, 0, 1);
      circle.filters = [filter];
      circle.cache(-scale, -scale, scale * 2, scale * 2, (power / 1000) * circleScale);
    }
    // createjs.Ticker.setPaused(true);
  }
  if (unit === 1) {
    unitText = 'W';
  }
  textPopulation.text = `Population: ${parseInt(population, 10)}`;
  textDemand.text = `Demand: ${demand.toFixed(1)} ${unitText}`;
  textPower.text = `Power: ${power} ${unitText}`;
  textFPS.text = `FPS: ${createjs.Ticker.getMeasuredFPS().toFixed(1)}`;
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
    scaleX: (power / 1000) * circleScale,
    scaleY: (power / 1000) * circleScale,
  });
  circle.addEventListener('mousedown', (event) => {
    if (!createjs.Ticker.getPaused()) {
      power += 100;
    }
    createjs.Tween.removeAllTweens(circle);
    createjs.Tween.get(circle, { loop: false })
      .to({
        scaleX: (power / 1000) * circleScale,
        scaleY: (power / 1000) * circleScale,
      }, 200);
    circle.cache(-scale, -scale, scale * 2, scale * 2, (power / 1000) * circleScale);
  });
  filter = new createjs.ColorFilter(0, 1, 0, 1);
  circle.filters = [filter];
  stage.addChild(circle);
  circle.cache(-scale, -scale, scale * 2, scale * 2, (power / 1000) * circleScale);

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
