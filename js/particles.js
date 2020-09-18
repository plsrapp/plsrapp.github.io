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
Particles.init();