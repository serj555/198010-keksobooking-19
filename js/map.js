'use strict';

(function () {
  var MAP = document.querySelector('.map');

  // функция активации карты
  var activateMap = function () {
    MAP.classList.remove('map--faded');
  };

  window.map = {
    activateMap: activateMap,
  };
})();
