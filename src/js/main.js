'use strict';

// Load requirements.
var $ = require('jquery');
var moment = require('moment');

// Simple left-to-right, fixed-width sprite sheet animation
var Animation = function (options) {

  options = options || {};

  // Preload image.
  this.img = new Image();
  this.img.onload = options.callback || null;
  this.img.src = options.imgsrc;

  this.width = options.width;
  this.height = options.height;

  this.canvas = options.canvas;
  this.canvas.width = options.width;
  this.canvas.height = options.height;

  this.context = this.canvas.getContext('2d');

};

Animation.prototype = {

  clear: function () {
    var img = this.context.createImageData(this.width, this.height);
    for (var i = img.data.length; i >= 0; i = i - 1) {
      img.data[i] = 0;
    }
    this.context.putImageData(img, 0, 0);
  },

  drawFrame: function (frame) {
    var w = this.width;
    var h = this.height;
    this.clear();
    this.context.drawImage(this.img, frame * w, 0, w, h, 0, 0, w, h);
  }

};

var yeti = null;

var jsonURL = '/~delfuego/tilde.24h.json';
var onlineURL = '/~gabriel/who.json';

var eatList = [];
var eatListBackup = [{
  'username': 'nobody',
  'homepage': 'http://www.suck.com',
  'modtime': '2014-10-06T03:57:43.6865810600Z'
}];
var eatListIndex = 0;

var onlineList = [];

var spriteURL = 'yeti.png';
var spriteW = 400;
var spriteH = 533;
var spriteIndex = 0;

var tree = '<div class="tree"></div>';

var onlineImg = '<img class="term" src="terminal.gif" height="16" width="16">';

var $app = $('#hungry');
var $website = $('.website');
var $label = $('#label');
var $ondeck = null;

var frameActions = {

  0: function () {

    var entry = eatList[eatListIndex];
    var page = entry.homepage || eatListBackup[0].homepage;
    var time = entry.modtime || eatListBackup[0].modtime;
    var user = entry.username || 'nobody';
    var userLink = '<a href="/~' + user + '/">~' + user + '</a>';
    var iframe = '<iframe src="' + page + '" scrolling="no"></iframe>';

    if (onlineList.indexOf(user) !== -1) {
      userLink = onlineImg + ' ' + userLink;
    }

    $ondeck = $(iframe).addClass('website ondeck');
    $app.append($ondeck);
    $label.html(userLink + ', ' + moment(time).fromNow());

    eatListIndex = eatListIndex + 1;

    if (eatListIndex >= eatList.length) {
      eatListIndex = 0;
    }

    yeti.drawFrame(0);

  },

  5: function () {
    $website.addClass('grasped');
  },

  10: function () {
    $label.show();
    yeti.drawFrame(1);
  },

  14: function () {
    $website.addClass('lifted');
    yeti.drawFrame(2);
  },

  18: function () {
    yeti.drawFrame(3);
  },

  20: function () {
    $website.addClass('downthehatch');
  },

  22: function () {
    $website.addClass('gone');
    yeti.drawFrame(4);
  },

  26: function () {
    $website.remove();
    $website = $ondeck.removeClass('ondeck');
    yeti.drawFrame(5);
  },

  46: function () {
    yeti.drawFrame(6);
  },

  50: function () {
    yeti.drawFrame(7);
  },

  54: function () {
    yeti.drawFrame(8);
  },

  58: function () {
    yeti.drawFrame(9);
  },

  62: function () {
    yeti.drawFrame(10);
  },

  66: function () {
    yeti.drawFrame(11);
  },

  70: function () {
    yeti.drawFrame(12);
  },

  74: function () {
    yeti.drawFrame(13);
  },

  94: function () {
    spriteIndex = -1;
  }

};

var updateYeti = function () {
  if (frameActions[spriteIndex]) {
    frameActions[spriteIndex]();
  }
  spriteIndex = spriteIndex + 1;
};

var addTrees = function () {
  for (var i = 0; i < 4; i = i + 1) {
    var randTop = Math.floor(Math.random() * 80);
    var randLeft = Math.floor(Math.random() * 80);
    var randTree = $(tree).css({
      top: randTop + '%',
      left: randLeft + '%'
    });
    $('body').append(randTree);
  }
};

var updateOnlineList = function (data) {

  if (data && data.online && data.online instanceof Array) {
    onlineList = data.online;
  }

  if (onlineList.indexOf('zarate') !== -1 && eatListIndex === 0) {
    $label.prepend(onlineImg + ' ');
  }

};

var startEating = function (data) {

  if (typeof data === 'object' && data.pagelist) {
    eatList = $.map(data.pagelist, function (el) {
      return (el.username && el.username === 'zarate') ? null : el;
    });
  }

  if (eatList.length === 0) {
    eatList = eatListBackup;
  }

  yeti = new Animation({
    imgsrc: spriteURL,
    width: spriteW,
    height: spriteH,
    canvas: document.getElementById('yeti'),
    callback: function () {
      yeti.drawFrame(0);
      setTimeout(function () {
        setInterval(updateYeti, 50);
      }, 2000);
    }
  });

};

addTrees();

// Fetch online users.
$.getJSON(onlineURL, updateOnlineList);

// Fetch recently-updated pages.
$.getJSON(jsonURL, startEating).fail(startEating);
