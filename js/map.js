'use strict';

(function () {
  var Nodes = {
    BODY: document.querySelector('body'),
    MAP: document.querySelector('.map'),
    MAP_PINS_BLOCK: document.querySelector('.map__pins'),
    MAP_PIN_MAIN: document.querySelector('.map__pin--main'),
  };
  var KEY_ENTER = 'Enter';

  // функция активации карты
  var activateMap = function () {
    Nodes.MAP.classList.remove('map--faded');
  };

  var onMainPinClick = function (evt) {
    var existClass = Nodes.MAP.classList.contains('map--faded');
    var errorMessage = document.querySelector('.errorMessage');

    if ((evt.button === 0 && existClass) || (evt.key === KEY_ENTER && existClass)) {
      activateMap();
      window.pin.renderAll();
      window.pin.setLocationInForm('move');
      window.form.activate('on');
    }

    if (errorMessage) {
      Nodes.BODY.removeChild(errorMessage);
      window.pin.renderAll();
    }
  };

  Nodes.MAP_PIN_MAIN.addEventListener('mousedown', onMainPinClick);
  Nodes.MAP_PIN_MAIN.addEventListener('keydown', onMainPinClick);
})();
