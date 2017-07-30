const POPULATION_SPEED = 10;
const POWER_STARTING_VALUE = 1200;
let stage;
let circle;
let scale;
let population;
let populationTimer;
let demand;
let power = POWER_STARTING_VALUE;
let textPopulation;
let textDemand;
let textPower;
let textFPS;
let textLose;
let circleScale = 3;
let unit;
let unitText;
let filter;
let checkLose;
let start;
let addTextFPS;
let setTextFPS;
let circleTween;
let circleSet;
let bgm;
let sfx;
let mute;
let bgmVolume;
let sfxVolume;

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
  if (demand > power) {
    createjs.Ticker.setPaused(true);
    textLose = stage.addChild(new createjs.Text('YOU LOSE', `${scale * 15}px Arial`, '#ffffff'));
    textLose.textBaseline = 'middle';
    textLose.textAlign = 'center';
    textLose.x = stage.canvas.width / 2;
    textLose.y = stage.canvas.height / 2;
    stage.on('stagemousedown', start);
    stage.on('stagemousedown', start);
  }
};

start = function () {
  createjs.Ticker.setPaused(false);
  if (textLose) {
    delete textLose.text;
  }
  if (stage) {
    stage.off('stagemousedown', start);
  }
  population = 100;
  populationTimer = 0;
  demand = 1;
  power = POWER_STARTING_VALUE;
  circleScale = 3;
  unit = 1;
  unitText = 'W';
  circleSet();
};

circleTween = function () {
  createjs.Tween.removeAllTweens(circle);
  createjs.Tween.get(circle, { loop: false })
    .to({
      scaleX: (power / 1000) * circleScale,
      scaleY: (power / 1000) * circleScale,
    }, 200);
  circle.uncache();
  circle.cache(-scale, -scale, scale * 2, scale * 2, (power / 1000) * circleScale);
};

circleSet = function () {
  circle.set({
    x: stage.canvas.width / 2,
    y: stage.canvas.height / 2,
    scaleX: (power / 1000) * circleScale,
    scaleY: (power / 1000) * circleScale,
  });
};

function resizeStage() {
  let width = window.innerWidth;
  let height = window.innerHeight;
  if (height * (9 / 16) < width) {
    width = height * (9 / 16);
  } else {
    height = width * (16 / 9);
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
  checkLose();
  if (textFPS) {
    delete textFPS.text;
    addTextFPS();
  }
}

function tick() {
  if (!createjs.Ticker.getPaused()) {
    populationTimer += 1;
    if (populationTimer > POPULATION_SPEED) {
      population += Math.pow(population, 1.02) / 1000;
      populationTimer = 0;
      demand = (Math.pow(population / 100, 3) * 1000);

      if ((demand) / power < 0.5) {
        filter = new createjs.ColorFilter(
          ((demand) / power) * 2,
          1,
          0,
          1
        );
      } else {
        filter = new createjs.ColorFilter(
          1,
          2 - (((demand) / power) * 2),
          0,
          1
        );
      }
      circle.filters = [filter];
      circle.uncache();
      circle.cache(-scale, -scale, scale * 2, scale * 2, (power / 1000) * circleScale);

      checkLose();
    }
  }
  if (unit === 1) {
    unitText = 'W';
  }
  textPopulation.text = `Population: ${parseInt(population, 10)}`;
  textDemand.text = `Demand: ${demand.toFixed(1)} ${unitText}`;
  textPower.text = `Power: ${power} ${unitText}`;
  setTextFPS();
}

function init() {
  stage = new createjs.Stage('game');
  createjs.Touch.enable(stage);
  stage.canvas.style.backgroundColor = '#333';
  resizeStage();

  circle = new createjs.Shape();
  circle.graphics.beginFill('#ffffff').drawCircle(0, 0, scale);
  circleSet();
  circle.addEventListener('mousedown', () => {
    if (!createjs.Ticker.getPaused()) {
      power += 100;
      sfx = createjs.Sound.play('sfx01');
      sfx.volume = sfxVolume;
    }
    circleTween();
  });
  filter = new createjs.ColorFilter(0, 1, 0, 1);
  circle.filters = [filter];
  stage.addChild(circle);
  circle.uncache();
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

  addTextFPS();

  start();
  // createjs.Ticker.setPaused(true);

  // Sound
  bgmVolume = 0.25;
  sfxVolume = 0.05;
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
  let muteButton = stage.addChild(new createjs.Text('\uf026', `${scale * 10}px FontAwesome`, '#ffffff'));
  muteButton.textBaseline = 'top';
  muteButton.textAlign = 'left';
  muteButton.x = stage.canvas.width - (scale * 12);
  muteButton.y = scale * 2;
  muteButton.addEventListener('mousedown', () => {
    if (!mute) {
      bgmVolume = 0;
      sfxVolume = 0;
      muteButton.text = '\uf028';
      muteButton.color = '#666';
      mute = true;
    } else {
      bgmVolume = 0.25;
      sfxVolume = 0.05;
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
