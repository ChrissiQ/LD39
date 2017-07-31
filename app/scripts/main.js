const POPULATION_SPEED = 10;
const POWER_STARTING_VALUE = 9000;
const POPULATION_STARTING_VALUE = 200;
const DANGER = 1000;
const DEFAULT_BGM_VOL = 0.5;
const DEFAULT_SFX_VOL = 0.1;
let textFPS;
let textLose;
let stage;
let windowFactor;
let sceneScale = 3;
let checkLose;
let start;
let addTextFPS;
let setTextFPS;
let circleTween;
let circleSet;
let circleClick;
let bgm;
let sfx;
let mute;
let bgmVolume;
let sfxVolume;
let createCircle1;
let createCircle2;
let circles = [];

setTextFPS = function () {
  textFPS.text = `FPS: ${createjs.Ticker.getMeasuredFPS().toFixed(1)}`;
};

addTextFPS = function () {
  textFPS = stage.addChild(new createjs.Text(`FPS: ${createjs.Ticker.getMeasuredFPS().toFixed(1)}`, '20px Arial', '#ffffff'));
  textFPS.textBaseline = 'alphabetic';
  textFPS.x = 10;
  textFPS.y = stage.canvas.height - (textFPS.getMeasuredLineHeight() + 5);
};

checkLose = function () {

  if (textLose) {
    delete textLose.text;
  }
  let lose = false;
  circles.forEach(circle => {
    if (circle.demand > circle.power) {
      lose = true;
    }
  });
  if (lose) {
    createjs.Ticker.setPaused(true);
    textLose = stage.addChild(new createjs.Text('YOU LOSE', `${windowFactor * 15}px Arial`, '#ffffff'));
    textLose.textBaseline = 'middle';
    textLose.textAlign = 'center';
    textLose.x = stage.canvas.width / 2;
    textLose.y = stage.canvas.height / 2;
    stage.addEventListener('stagemousedown', start);
  }
};

start = function () {
  createjs.Ticker.setPaused(false);
  if (textLose) {
    delete textLose.text;
  }
  if (stage) {
    stage.removeEventListener('stagemousedown', start);
  }
  sceneScale = 3;
  circles.forEach(circle => circleSet(circle));
};

circleClick = function (event) {
  let circle = event.target;
  if (!createjs.Ticker.getPaused()) {
    circle.power += 100;
    sfx = createjs.Sound.play('sfx01');
    sfx.volume = sfxVolume;
  }
  circleTween(event.target);
};

circleTween = function (circle) {
  createjs.Tween.removeAllTweens(circle);
  createjs.Tween.get(circle, { loop: false })
    .to({
      scaleX: (circle.power / 1000) * sceneScale,
      scaleY: (circle.power / 1000) * sceneScale,
    }, 200);
  circle.uncache();
  circle.cache(
    -windowFactor,
    -windowFactor,
    windowFactor * 2,
    windowFactor * 2,
    (circle.power / 1000) * sceneScale
  );
};

circleSet = function (circle) {
  // Stats
  circle.power = POWER_STARTING_VALUE;
  circle.population = POPULATION_STARTING_VALUE;
  circle.demand = 1;
  circle.populationTimer = 10;
  circle.unit = 1;
  circle.unitText = 'W';

  circle.set({
    x: stage.canvas.width / 2,
    y: stage.canvas.height / 2,
    scaleX: (circle.power / 1000) * sceneScale,
    scaleY: (circle.power / 1000) * sceneScale,
  });
};

createCircle1 = function () {
  let circle = new createjs.Shape();
  circle.graphics.beginFill('#ffffff').drawCircle(0, 0, windowFactor);
  circleSet(circle);
  circle.addEventListener('mousedown', circleClick);
  circle.filters = [new createjs.ColorFilter(0, 1, 0, 1)];
  stage.addChild(circle);
  circle.uncache();
  circle.cache(
    -windowFactor,
    -windowFactor,
    windowFactor * 2,
    windowFactor * 2,
    (circle.power / 1000) * sceneScale
  );

  circle.textPopulation = stage.addChild(new createjs.Text(`Population: ${circle.population}`, `${windowFactor * 6}px Arial`, '#ffffff'));
  circle.textPopulation.textBaseline = 'center';
  circle.textPopulation.textAlign = 'center';
  circle.textPopulation.x = circle.x;
  circle.textPopulation.y = (circle.y) - (circle.textPopulation.getMeasuredLineHeight() + 5);
  circle.textPopulation.shadow = new createjs.Shadow('#000000', 0, 0, windowFactor * 0.5);

  circle.textDemand = stage.addChild(new createjs.Text(`Demand: ${circle.demand}`, `${windowFactor * 6}px Arial`, '#ffffff'));
  circle.textDemand.textBaseline = 'center';
  circle.textDemand.textAlign = 'center';
  circle.textDemand.x = circle.x;
  circle.textDemand.y = circle.y;
  circle.textDemand.shadow = new createjs.Shadow('#000000', 0, 0, windowFactor * 0.5);

  circle.textPower = stage.addChild(new createjs.Text(`Power: ${circle.power}`, `${windowFactor * 6}px Arial`, '#ffffff'));
  circle.textPower.textBaseline = 'alphabetic';
  circle.textPower.textAlign = 'center';
  circle.textPower.x = circle.x;
  circle.textPower.y = circle.y + (circle.textPower.getMeasuredLineHeight() + 5);
  circle.textPower.shadow = new createjs.Shadow('#000000', 0, 0, windowFactor * 0.5);

  return circle;
};

function resizeStage() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (height * (9 / 16) < width) {
    width = height * (9 / 16);
  } else {
    height = width * (16 / 9);
  }
  windowFactor = width / 100;
  stage.canvas.setAttribute('width', width);
  stage.canvas.setAttribute('height', height);
  circles.forEach(circle => {
    if (circle) {
      circle.set({
        x: stage.canvas.width / 2,
        y: stage.canvas.height / 2,
      });
    }
  });
  checkLose();
  if (textFPS) {
    delete textFPS.text;
    addTextFPS();
  }
}

function tick() {
  if (!createjs.Ticker.getPaused()) {
    circles.forEach(circle => {
      circle.populationTimer += 1;
      if (circle.populationTimer > POPULATION_SPEED) {
        circle.population += Math.pow(circle.population, 1.02) / 1000;
        circle.populationTimer = 0;
        circle.demand = (Math.pow(circle.population / 100, 3) * 1000);
        let r = (1 - ((circle.power - circle.demand) / DANGER)) * 2;
        let g = ((circle.power - circle.demand) / DANGER) * 2;
        let b = 0;
        let a = 1;
        circle.filters = [new createjs.ColorFilter(r, g, b, a)];
        circle.uncache();
        circle.cache(
          -windowFactor,
          -windowFactor,
          windowFactor * 2,
          windowFactor * 2,
          (circle.power / 1000) * sceneScale
        );

        checkLose();
      }
      if (circle.unit === 1) {
        circle.unitText = 'W';
      }
      circle.textPopulation.text = `Population: ${parseInt(circle.population, 10)}`;
      circle.textDemand.text = `Demand: ${circle.demand.toFixed(1)} ${circle.unitText}`;
      circle.textPower.text = `Power: ${circle.power} ${circle.unitText}`;
    });
  }
  setTextFPS();
}

function init() {
  stage = new createjs.Stage('game');
  createjs.Touch.enable(stage);
  stage.canvas.style.backgroundColor = '#333';
  resizeStage();

  // Circle
  circles.push(createCircle1());

  // Ticker
  createjs.Ticker.timingMode = createjs.Ticker.RAF_SYNCHED;
  createjs.Ticker.setFPS(60);
  createjs.Ticker.addEventListener('tick', stage);
  createjs.Ticker.addEventListener('tick', tick);

  addTextFPS();

  start();
  // createjs.Ticker.setPaused(true);

  // Sound
  bgmVolume = DEFAULT_BGM_VOL;
  sfxVolume = DEFAULT_SFX_VOL;
  createjs.Sound.registerSounds([{
    id: 'bgm',
    src: '/audio/bgm.mp3',
  }, {
    id: 'sfx01',
    src: '/audio/sfx01.mp3',
  }]);
  createjs.Sound.addEventListener('fileload', () => {
    bgm = createjs.Sound.play('bgm');
    bgm.loop = -1;
    bgm.volume = bgmVolume;
  });

  mute = false;
  let muteButton = stage.addChild(new createjs.Text('\uf026', `${windowFactor * 10}px FontAwesome`, '#ffffff'));
  muteButton.textBaseline = 'top';
  muteButton.textAlign = 'left';
  muteButton.x = stage.canvas.width - (windowFactor * 12);
  muteButton.y = windowFactor * 2;
  muteButton.addEventListener('mousedown', () => {
    if (!mute) {
      bgmVolume = 0;
      sfxVolume = 0;
      muteButton.text = '\uf028';
      muteButton.color = '#666';
      mute = true;
    } else {
      bgmVolume = DEFAULT_BGM_VOL;
      sfxVolume = DEFAULT_SFX_VOL;
      muteButton.text = '\uf026';
      muteButton.color = '#ffffff';
      mute = false;
    }
    if (bgm) {
      bgm.volume = bgmVolume;
    }
    if (sfx) {
      sfx.volume = sfxVolume;
    }
  });

}

init();

window.addEventListener('resize', () => resizeStage());

const button = document.getElementById('play');
button.style.display = 'none';
button.addEventListener('click', () => {
  createjs.Ticker.setPaused(false);
  button.style.display = 'none';
  if (stage.canvas.webkitRequestFullscreen) {
    stage.canvas.webkitRequestFullscreen();
  } else if (stage.canvas.mozRequestFullScreen) {
    stage.canvas.mozRequestFullScreen();
  } else if (stage.canvas.requestFullscreen) {
    stage.canvas.requestFullscreen();
  }
});
