var Particles = (function(document, window) {

  'use strict';

  var c = document.getElementById('particles');
  var ctx = c.getContext('2d'),
      fps = 24,
      pointer = {
        x: (window.innerWidth / 2),
        y: (window.innerHeight / 2)
      },
      particles = [];

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function Draw() {
    var particle = {
      color: '#3B8686',
      size: 40
    };
    particle.xSpeed = getRandomInt(-10, 10);
    particle.ySpeed = getRandomInt(-10, 10);
    particle.x = pointer.x - (particle.size / 2);
    particle.y = pointer.y - (particle.size / 2);
    particles.push(particle);
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    if (particles.length === 12) {
      particles.splice(60);
    }
    for (var i =0; i < particles.length; i++) {
      particle = particles[i];
      if ((particle.x < -particle.size) || (particle.x > window.innerWidth + particle.size) || (particle.y < -particle.size) || (particle.y > window.innerHeight + particle.size)) {
        particles.splice(particles.indexOf(particles[i]), 1);
      } else {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.shadowBlur = 80;
        ctx.shadowColor = particle.color;
        particle.x = particle.x + particle.xSpeed;
        particle.y = particle.y + particle.ySpeed;
        particle.size = particle.size * 0.9;
      }
    }
    setTimeout(requestFrame, 1000 / fps);
  }

  function requestFrame() {
    requestAnimationFrame(Draw);
  }

  function setCanvasSize() {
    c.height = window.innerHeight;
    c.width = window.innerWidth;
  }

  function setPointerPosition() {
    pointer.x = event.changedTouches ? event.changedTouches[0].pageX : event.clientX;
    pointer.y = event.changedTouches ? event.changedTouches[0].pageY : event.clientY;
  }

  function init() {
    c.addEventListener('touchstart', setPointerPosition);
    c.addEventListener('touchmove', setPointerPosition);
    c.addEventListener('mousemove', setPointerPosition);
    window.addEventListener('resize', setCanvasSize);
    setCanvasSize();
    requestFrame();
  }

  return {
    init: init
  };

} )(document, window);

var getParams = function (url) {
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
};


var canvas;
var touchmovectx;
var touchmovezone=null;
var lastPt=null;

function init() {
  touchmovezone = document.getElementById("mycanvas");
  touchmovezone.addEventListener("touchmove", drawtouchmove, false);
  touchmovezone.addEventListener("touchend", endtouchmove, false);

  touchmovezone.addEventListener("mousedown", function() {
        touchmovezone.addEventListener("mousemove", drawmousemove, false);
      }
      , false);
  touchmovezone.addEventListener("mouseup", endmousemove, false);
  touchmovectx = touchmovezone.getContext("2d");
}


function drawtouchmove(e) {
  e.preventDefault();
  var offset  = getOffset(touchmovezone);
  if(lastPt!=null) {
    touchmovectx.beginPath();
    touchmovectx.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
    touchmovectx.lineTo(e.touches[0].pageX-offset.left, e.touches[0].pageY-offset.top);
    touchmovectx.strokeStyle = 'purple';
    touchmovectx.lineWidth = 3;
    touchmovectx.stroke();
  }
  lastPt = {x:e.touches[0].pageX, y:e.touches[0].pageY};
}


function drawmousemove(e) {

  e.preventDefault();
  var offset  = getOffset(touchmovezone);
  if(lastPt!=null) {
    touchmovectx.beginPath();
    touchmovectx.moveTo(lastPt.x-offset.left, lastPt.y-offset.top);
    touchmovectx.lineTo(e.pageX-offset.left, e.pageY-offset.top);
    touchmovectx.strokeStyle = 'purple';
    touchmovectx.lineWidth = 3;
    touchmovectx.stroke();
  }
  lastPt = {x:e.pageX, y:e.pageY};
}

function endtouchmove(e) {
  e.preventDefault();
  lastPt = null;
}

function endmousemove(e) {
  e.preventDefault();
  touchmovezone.removeEventListener("mousemove", drawmousemove, false);
  lastPt = null;
}

function getOffset(obj) {
  var offsetLeft = 0;
  var offsetTop = 0;
  do {
    if (!isNaN(obj.offsetLeft)) {
      offsetLeft += obj.offsetLeft;
    }
    if (!isNaN(obj.offsetTop)) {
      offsetTop += obj.offsetTop;
    }
  } while(obj = obj.offsetParent );
  return {left: offsetLeft, top: offsetTop};
}

var c = getParams(window.location.href);
if(c['type']!=null & c['type']== 'particles')
  Particles.init();
else
  init();
console.log(c);


const url = "https://script.google.com/macros/s/AKfycbz21sm0LgTXTpQerLTbapxQXgP0zCDklewGQ5B2v--hLhn8LK-G/exec";

var vm = new Vue({
  methods: {
    async submit() {

      // Sample request to the SpreadAPI
      const response = await fetch(url, {
        method: 'UPDATELESSON',
        body: JSON.stringify({
          sheet: "Users",
          user: "komarov@gamefjord.com"
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" } })
      }
    }
});
vm.submit();
//Particles.init();