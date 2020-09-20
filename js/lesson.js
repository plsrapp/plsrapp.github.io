let arr = [];
let bg;
let canvasSize;

let mousePositions = [];
let trailLength = 50;

let isTouchProceeding = false;
let isLessonCompleted = false;

let currentLesson = 1;
let currentPath = [];
let lessonPath = {
  1: { 1: {points: [14,33,53,74], isCompleted: false}, 2: {points: [16,37,57,76], isCompleted: false}},
  2: { 1: {points: [], isCompleted: false}, 2: {points: [], isCompleted: false}},
  3: { 1: {points: [], isCompleted: false}, 2: {points: [], isCompleted: false}}
}


function preload() {
  bg = loadImage("images/logo.png");
}

function setup() {
  canvasSize = createVector(bg.width, bg.height);
  createCanvas(bg.width, bg.height);
  background(bg);
  strokeWeight(10);
  stroke(0);

  for(let i =0; i<100; i++){
    arr.push(i);
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
  textAlign(CENTER, CENTER);


  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let xpos = x *canvasSize.x/10;
      let ypos = y *canvasSize.y/10;

      let index = y * 10 + x; // find the index
      fill(255,0);
      stroke(0);
      rect(xpos, ypos, canvasSize.x/10, canvasSize.y/10);

      // colorMode(HSB);
      //let h = map(index, 0, 69, 0, 0);
      fill(0);
      noStroke();
      text(arr[index], xpos, ypos, canvasSize.x/10, canvasSize.y/10);
    }
  }
  // colorMode(RGB);
  colorMode(RGB);
  stroke(0);

  drawTrail();
}

function checkPath() {
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      let xpos = x * canvasSize.x / 10;
      let ypos = y * canvasSize.y / 10;

      let index = y * 10 + x; // find the index

      if (inside(xpos, ypos, canvasSize.x / 10, canvasSize.y / 10)) {
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
        }
        break;
      } else
        {
        }
    }
  }
  //console.log(currentPath);
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
    //how you're drawing your pose

    heart(mouseX, mouseY, 50);
    //ellipse(mouseX, mouseY, 50, 50);

    //how you're storing the last 50 poses
    mousePositions.push({x: mouseX, y: mouseY});
    trailLength = 50;
  }
  else if(trailLength>0)
    trailLength--;

  //removes poses that are older than 50
  if (mousePositions.length > trailLength) {
    mousePositions.shift();
  }
  for (let i = 0; i < mousePositions.length; i +=1) {
    // how you want to draw the previous poses
    // relate it to i to change pose drawing over time
    heart(mousePositions[i].x, mousePositions[i].y, i);
    //ellipse(mousePositions[i].x, mousePositions[i].y, i, i);
  }
}

function heart(x, y, size) {
  beginShape();
  vertex(x, y);
  bezierVertex(x - size / 2, y - size / 2, x - size, y + size / 3, x, y + size);
  bezierVertex(x + size, y + size / 3, x + size / 2, y - size / 2, x, y);
  endShape(CLOSE);
}