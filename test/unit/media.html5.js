module('HTML5');

test('should detect whether the volume can be changed', function(){
  var testVid, ConstVolumeVideo;
  if (!{}['__defineSetter__']) {
    ok(true, 'your browser does not support this test, skipping it');
    return;
  }
  testVid = vjs.TEST_VID;
  ConstVolumeVideo = function(){
    this.volume = 1;
    this.__defineSetter__('volume', function(){});
  };
  vjs.TEST_VID = new ConstVolumeVideo();

  ok(!vjs.Html5.canControlVolume());
  vjs.TEST_VID = testVid;
});

test('should re-link the player if the tech is moved', function(){
  var player, tech, el;
  el = document.createElement('div');
  el.innerHTML = '<div />';
  player = {
    id: function(){ return 'id'; },
    el: function(){ return el; },
    options_: {},
    ready: function(){}
  };
  tech = new vjs.Html5(player, {});
  tech.features = {
    movingMediaElementInDOM: false
  };
  tech.createEl();

  strictEqual(player, tech.el()['player']);
});

test('should retry fullscreen if the first attempt fails', function(){
  var count, el, load, tech;
  el = document.createElement('div');
  tech = new vjs.Html5({
    id: function(){ return 'id'; },
    el: function(){ return el; },
    options_: {},
    ready: function(){}
  }, {});
  count = 0;
  tech.el().webkitEnterFullScreen = function(){
    count++;
    throw count;
  };
  load = 0;
  tech.el().load = function(){
    load++;
  };

  tech.enterFullScreen();
  equal(count, 2, 'full screen should be retried if the first attempt fails');
  equal(load, 1, 'the tech should be loaded between retries');
});