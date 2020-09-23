const url = "https://script.google.com/macros/s/AKfycbz21sm0LgTXTpQerLTbapxQXgP0zCDklewGQ5B2v--hLhn8LK-G/exec";
let arr = [];
let bg;
let canvasSize;
let params;

let showGrid = true;
let gridSize = [7,7, 49];

let exponent = 4; // Determines the curve
let step = 0.03; // Size of each step along the path

let mousePositions = [];
const trailMaxLength = 50;

let isTouchProceeding = false;
let isLessonCompleted = false;

let currentLesson = 1;
let currentPath = [];
let lessonPath = {
  1: { 1: {points: [10,16,24, 32, 38, 30, 24, 18, 10], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
       //2: {points: [7,13,18], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  2: { 1: {points: [10,16,17,18,10], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [3,9,15,23,24,25,19,11,3], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  3: { 1: {points: [10,16,23,31], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [10,18,25,31], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  4: { 1: {points: [10,16,23,30,31,25,18,10], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
       //2: {points: [], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  5: { 1: {points: [16,17], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [18,17], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  6: { 1: {points: [], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  7: { 1: {points: [9,15,22,29], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [11,19,26,33], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  8: { 1: {points: [22,16,17], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [26,18,17], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}},
  9: { 1: {points: [23,16,17,18], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0},
       2: {points: [25,18,17,16], isCompleted: false, hintStep: 0, pct: 1.0, distX: 0, distY: 0}}
};


function preload() {
  params = getParams(window.location.href);
  currentLesson = params['lesson'] != null ? params['lesson'] : 1;
  bg = loadImage("images/lesson"+currentLesson+".jpg");
}

function setup() {
  canvasSize = createVector(bg.width, bg.height);
  createCanvas(bg.width, bg.height);
  background(bg);
  strokeWeight(10);
  stroke(0);

  for(let i =0; i<gridSize[2]; i++){
    arr.push(i);
  }
  for (let y = 0; y < gridSize[1]; y++) {
    for (let x = 0; x < gridSize[0]; x++) {
      let xpos = x *canvasSize.x/gridSize[0] + canvasSize.x/gridSize[0]/2;
      let ypos = y *canvasSize.y/gridSize[1] + canvasSize.y/gridSize[1]/2;

      let index = y * gridSize[0] + x; // find the index
      arr[index] = [xpos, ypos];
    }
  }
}

function touchMoved() {
  //line(mouseX, mouseY, pmouseX, pmouseY);
  if(!isLessonCompleted)
    checkPath();

  return false;
}
function touchStarted() {
  isTouchProceeding = true;
}
function mousePressed() {
  touchStarted();
}

function touchEnded() {
  isTouchProceeding = false;
  currentPath = [];
}

function mouseReleased() {
  touchEnded();
}

function draw() {
  background(bg);

  if(showGrid)
    drawGrid();

  drawHints();

  drawTrail();
}

function checkPath() {
  if(isLessonCompleted)
    return;

  for (let y = 0; y < gridSize[1]; y++) {
    for (let x = 0; x < gridSize[0]; x++) {
      let xpos = x * canvasSize.x / gridSize[0];
      let ypos = y * canvasSize.y / gridSize[1];

      let index = y * gridSize[0] + x; // find the index

      if (inside(xpos, ypos, canvasSize.x / gridSize[0], canvasSize.y / gridSize[1])) {
        if(!currentPath.includes(index))
          currentPath.push(index);

        let completedPathesNum = 0;
        Object.values(lessonPath[currentLesson]).forEach(function(path) {
          if(path.isCompleted)
          {
            completedPathesNum++;
          }
          else
          {
            let isAllPointsVisited = true;
            path.points.forEach(function(point, pointIndex) {
              if(currentPath.includes(point)) {
                if(pointIndex === path.points.length-1 && isAllPointsVisited) {
                  path.isCompleted = true;
                  completedPathesNum++;

                  //console.log("Path completed");
                }
              }
              else
                isAllPointsVisited = false;
            });
          }
        });

        if(completedPathesNum === Object.values(lessonPath[currentLesson]).length)
        {
          isLessonCompleted = true;
          completeLesson();
        }
        break;
      } else
        {
        }
    }
  }
  //console.log(currentPath);
}

function completeLesson() {
  vm.submit().then(function(response) {
    //console.log(response);
    return response.json();
  })
      .then(function(json) {
        //console.log(json);
      })
      .catch(function (error) {
        console.log('Request failed', error);
      });
}



function inside(x, y, w, h){
  if(mouseX > x && mouseX < x + w && mouseY > y && mouseY < y + h) {
    return true;
  } else {
    return false;
  }
}

function drawTrail(){
  noStroke();
  fill('#fae');
  if(isTouchProceeding) {
    heart(mouseX, mouseY, 50);
    //ellipse(mouseX, mouseY, 50, 50);

    mousePositions.push({x: mouseX, y: mouseY});
  }

  //removes poses that are older than trailMaxLength
  if (mousePositions.length > trailMaxLength || !isTouchProceeding) {
    mousePositions.shift();
  }
  for (let i = 0; i < mousePositions.length; i +=1) {
    heart(mousePositions[i].x, mousePositions[i].y, i*trailMaxLength/mousePositions.length);
    //ellipse(mousePositions[i].x, mousePositions[i].y, i, i);
  }
}
function drawGrid(){
  textAlign(CENTER, CENTER);

  for (let y = 0; y < gridSize[1]; y++) {
    for (let x = 0; x < gridSize[0]; x++) {
      let xpos = x *canvasSize.x/gridSize[0];
      let ypos = y *canvasSize.y/gridSize[1];

      let index = y * gridSize[0] + x; // find the index
      fill(255,0);
      stroke(0);
      rect(xpos, ypos, canvasSize.x/gridSize[0], canvasSize.y/gridSize[1]);

      // colorMode(HSB);
      //let h = map(index, 0, 69, 0, 0);
      fill(0);
      noStroke();
      text(index, xpos, ypos, canvasSize.x/gridSize[0], canvasSize.y/gridSize[1]);
    }
  }
  // colorMode(RGB);
  colorMode(RGB);
  stroke(0);
}

function drawHints(){
  noStroke();
  fill('#afb');
  Object.values(lessonPath[currentLesson]).forEach(function(path) {
    if(!path.isCompleted & path.points.length > 0)
    {
      var x = 0.0;
      var y = 0.0;
      path.pct += step;
      if (path.pct < 1.0) {
        var beginPoint = arr[path.points[path.hintStep-1]];
        var endPoint = arr[path.points[path.hintStep]];
        path.distX = endPoint[0] - beginPoint[0];
        path.distY = endPoint[1] - beginPoint[1];
        x = beginPoint[0] + path.pct * path.distX;
        //y = beginPoint[1] + pow(path.pct, exponent) * path.distY;
        y = beginPoint[1] + path.pct * path.distY;
      }
      else
      {
        path.pct = 0.0;
        path.hintStep = path.hintStep == path.points.length-1 ? 1 : path.hintStep+1;
        var beginPoint = arr[path.points[path.hintStep-1]];
        var endPoint = arr[path.points[path.hintStep]];
        path.distX = endPoint[0] - beginPoint[0];
        path.distY = endPoint[1] - beginPoint[1];
        x = beginPoint[0];
        y = beginPoint[1];
      }
      ellipse(x, y, 50, 50);
    }
  });
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}

function getParams(url) {
  var params = {};
  var parser = document.createElement('a');
  parser.href = url;
  var query = parser.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    params[pair[0]] = decodeURIComponent(pair[1]);
  }
  return params;
}

var vm = new Vue({
  methods: {
    async submit() {

      // Sample request to the SpreadAPI
      const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify({
          method: 'UPDATELESSON',
          sheet: "users",
          userEmail: params['email'] != null ? params['email'] : "no_email"
        }),
      })
      return response;
    }
  }
});