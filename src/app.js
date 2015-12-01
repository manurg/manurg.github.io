// rAF polyfill
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame   ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      function( callback ){
        window.setTimeout(callback, 1000 / 60);
      };
})();


// app
$(function () {

  'use strict';

  var NUM_PARTICLES = 300,
      MAX__DISTANCE = 100,

      $window = $(window),
      $main = $('main'),
      $introduction = $main.find('.introduction'),
      $header = $introduction.find('header'),
      $more = $introduction.find('.more'),
      $canvas = $main.find('#stage'),

      md = new MobileDetect(window.navigator.userAgent),
      isMobile = md.mobile(),
      canvas = document.getElementById('stage'),
      ctx,
      stageWidth,
      stageHeight,
      particles;

  init();

  //////

  function init () {

    if (isMobile) {
      $.getScript('dist/lib/fastclick.js', function () {
        FastClick.attach(document.body);
      });
    }

    updateDimensions();
    updateIntroduction();

    if(canvas && canvas.getContext) {
      ctx = canvas.getContext('2d');

      initParticles();
      updateCanvas();

      if (!md.mobile()) {
        animloop();
      } else {
        render();
      }
    }

    $header.on('click', onHeaderClick);

    $window
      .on('resize', _.throttle(resize, 500))
      .on('scroll', _.throttle(scroll, 250));
  }

  function onHeaderClick() {
    $('html, body').animate({scrollTop: $introduction.height()}, 500);
  }

  function animloop(){
    requestAnimFrame(animloop);
    render();
  }

  function initParticles () {
    var i = 0,
        numParticles = isMobile ? 50 : NUM_PARTICLES;

    particles = [];

    for (i; i < numParticles; i++) {
      particles.push({
        x: Math.random() * stageWidth,
        y: Math.random() * stageHeight,
        vX: Math.random() * 4 - 2 || Math.random(),
        vY: Math.random() * 4 - 2 || -Math.random()
      });
    }
  }

  function resize () {
    updateDimensions();
    updateCanvas();
    updateIntroduction();

    if (md.mobile()) {
      render();
    }
  }

  function updateDimensions () {
    stageWidth = $window.width();
    stageHeight = $window.height();
  }

  function updateCanvas () {
    $canvas.attr('width', stageWidth).attr('height', stageHeight);
  }

  function updateIntroduction () {
    $introduction.width(stageWidth);
    $introduction.height(stageHeight);
  }

  function scroll () {
    if ($window.scrollTop() > 50) {
      $more.addClass('hidden');
    } else {
      $more.removeClass('hidden');
    }
  }

  function render () {
    var currentParticle,
        nextParticle,
        currentDistance,
        nextX,
        nextY;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.4;

    for (var i = 0; i < particles.length; i++) {
      currentParticle = particles[i];
      nextX = currentParticle.x + currentParticle.vX;
      nextY = currentParticle.y + currentParticle.vY;

      ctx.fillRect(currentParticle.x, currentParticle.y, 1, 1);

      // calc distance
      for (var j = 0; j < particles.length; j++) {
        nextParticle = particles[j];
        currentDistance = getDistance(currentParticle.x, currentParticle.y, nextParticle.x, nextParticle.y);

        if (currentDistance < MAX__DISTANCE) {
          ctx.beginPath();
          ctx.moveTo(currentParticle.x, currentParticle.y);
          ctx.lineTo(nextParticle.x, nextParticle.y);
          ctx.stroke();
        }
      }

      // movement for next render iteration
      currentParticle.x = nextX > stageWidth ? 0 : nextX < 0 ? stageWidth : nextX;
      currentParticle.y = nextY > stageHeight ? 0 : nextY < 0 ? stageHeight : nextY;
    }

  }

  // helper
  function getDistance (x1, y1, x2, y2) {
    return Math.sqrt((x2 -= x1) * x2 + (y2 -= y1) * y2);
  }

});
