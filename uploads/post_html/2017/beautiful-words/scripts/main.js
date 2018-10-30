'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function (window) {
  window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

  var FRAME_RATE = 60;
  var PARTICLE_NUM = 2000;
  var RADIUS = Math.PI * 2;
  var CANVAS_WIDTH = 320;
  var CANVAS_HEIGHT = 300;
  var CANVAS_ID = 'canvas';
  var SCREEN_HEIGHT = window.screen.height;
  var SCREEN_WIDTH = window.screen.width;

  var texts = ['新年快乐', '大吉大利', '天天开心', 'Always'];

  var canvas = void 0,
      ctx = void 0,
      particles = [],
      quiver = true,
      text = texts[0],
      textIndex = 0,
      textSize = 62;

  function init() {
    if (SCREEN_WIDTH <= 320) {
      CANVAS_WIDTH = 320;
      CANVAS_HEIGHT = 250;
      textSize = 62;
    } else if (SCREEN_WIDTH <= 400) {
      CANVAS_WIDTH = 350;
      CANVAS_HEIGHT = 300;
      textSize = 65;
    } else {
      CANVAS_WIDTH = 400;
      CANVAS_HEIGHT = 300;
      textSize = 72;
    }

    // 从 url 中读取参数
    var tmpTexts = getUrlParam('texts', null);
    try {
      texts = tmpTexts.split(',');
      text = texts[0];
      textIndex = 0;
      console.log(tmpTexts);
    } catch (e) {}
    canvas = document.getElementById(CANVAS_ID);
    if (canvas === null || !canvas.getContext) {
      return;
    }
    ctx = canvas.getContext('2d');
    setDimensions();
    event();

    for (var i = 0; i < PARTICLE_NUM; i++) {
      particles[i] = new Particle(canvas);
    }

    draw();

    setInterval(function () {
      textIndex++;
      textIndex = textIndex % texts.length;
      text = texts[textIndex];
      console.log(textIndex);
    }, 4500);
  }

  function draw() {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = 'rgb(255, 255, 255)';
    ctx.textBaseline = 'middle';
    ctx.fontWeight = 'bold';
    ctx.font = textSize + 'px \'SimHei\', \'Avenir\', \'Helvetica Neue\', \'Arial\', \'sans-serif\'';
    ctx.fillText(text, (CANVAS_WIDTH - ctx.measureText(text).width) * 0.5, CANVAS_HEIGHT * 0.5);

    var imgData = ctx.getImageData(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    for (var i = 0, l = particles.length; i < l; i++) {
      var p = particles[i];
      p.inText = false;
    }
    particleText(imgData);

    window.requestAnimationFrame(draw);
  }

  function particleText(imgData) {
    // 点坐标获取
    var pxls = [];
    for (var w = CANVAS_WIDTH; w > 0; w -= 3) {
      for (var h = 0; h < CANVAS_HEIGHT; h += 3) {
        var index = (w + h * CANVAS_WIDTH) * 4;
        if (imgData.data[index] > 1) {
          pxls.push([w, h]);
        }
      }
    }

    var count = pxls.length;
    var j = parseInt((particles.length - pxls.length) / 2, 10);
    j = j < 0 ? 0 : j;

    for (var i = 0; i < pxls.length && j < particles.length; i++, j++) {
      try {
        var p = particles[j],
            X,
            Y;

        if (quiver) {
          X = pxls[i - 1][0] - (p.px + Math.random() * 10);
          Y = pxls[i - 1][1] - (p.py + Math.random() * 10);
        } else {
          X = pxls[i - 1][0] - p.px;
          Y = pxls[i - 1][1] - p.py;
        }
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);
        p.x = p.px + C * T * p.delta;
        p.y = p.py + S * T * p.delta;
        p.px = p.x;
        p.py = p.y;
        p.inText = true;
        p.fadeIn();
        p.draw(ctx);
      } catch (e) {}
    }
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      if (!p.inText) {
        p.fadeOut();

        var X = p.mx - p.px;
        var Y = p.my - p.py;
        var T = Math.sqrt(X * X + Y * Y);
        var A = Math.atan2(Y, X);
        var C = Math.cos(A);
        var S = Math.sin(A);

        p.x = p.px + C * T * p.delta / 2;
        p.y = p.py + S * T * p.delta / 2;
        p.px = p.x;
        p.py = p.y;

        p.draw(ctx);
      }
    }
  }

  function getUrlParam(name, default_value) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    // decodeURI，处理中文问题
    var url = window.location.search.substr(1);
    console.log(url);
    try {
      url = decodeURI(url);
    } catch (e) {}
    var r = url.match(reg); //匹配目标参数
    if (r != null) return unescape(r[2]);
    return default_value; //返回参数值
  }

  function setDimensions() {
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    canvas.style.position = 'absolute';
    canvas.style.left = '0px';
    canvas.style.top = '0px';
    canvas.style.bottom = '0px';
    canvas.style.right = '0px';
    canvas.style.marginTop = window.innerHeight * .15 + 'px';
  }

  function event() {
    document.addEventListener('click', function (e) {
      textIndex++;
      textIndex = textIndex % texts.length;
      // if (textIndex >= texts.length) {
      //   textIndex--;
      //   return
      // }
      text = texts[textIndex];
      console.log(textIndex);
    }, false);

    // document.addEventListener('touchstart', function (e) {
    //   textIndex++;
    //   textIndex = textIndex % texts.length;
    //   // if (textIndex >= texts.length) {
    //   //   textIndex--;
    //   //   return
    //   // }
    //   text = texts[textIndex];
    //   console.log(textIndex)
    // }, false)
  }

  var Particle = function () {
    function Particle(canvas) {
      _classCallCheck(this, Particle);

      var spread = canvas.height;
      var size = Math.random() * 1.2;
      // 速度
      this.delta = 0.06;
      // 现在的位置
      this.x = 0;
      this.y = 0;
      // 上次的位置
      this.px = Math.random() * canvas.width;
      this.py = canvas.height * 0.5 + (Math.random() - 0.5) * spread;
      // 记录点最初的位置
      this.mx = this.px;
      this.my = this.py;
      // 点的大小
      this.size = size;
      // this.origSize = size
      // 是否用来显示字
      this.inText = false;
      // 透明度相关
      this.opacity = 0;
      this.fadeInRate = 0.005;
      this.fadeOutRate = 0.03;
      this.opacityTresh = 0.98;
      this.fadingOut = true;
      this.fadingIn = true;
    }

    _createClass(Particle, [{
      key: 'fadeIn',
      value: function fadeIn() {
        this.fadingIn = this.opacity <= this.opacityTresh;
        if (this.fadingIn) {
          this.opacity += this.fadeInRate;
        } else {
          this.opacity = 1;
        }
      }
    }, {
      key: 'fadeOut',
      value: function fadeOut() {
        this.fadingOut = this.opacity >= 0;
        if (this.fadingOut) {
          this.opacity -= this.fadeOutRate;
          if (this.opacity < 0) {
            this.opacity = 0;
          }
        } else {
          this.opacity = 0;
        }
      }
    }, {
      key: 'draw',
      value: function draw(ctx) {
        ctx.fillStyle = 'rgba(226,225,142, ' + this.opacity + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, RADIUS, true);
        ctx.closePath();
        ctx.fill();
      }
    }]);

    return Particle;
  }();

  setTimeout(function () {
    init();
  }, 1000);
  // mp3.play()
})(window);
//# sourceMappingURL=main.js.map
