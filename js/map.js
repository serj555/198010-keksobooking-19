'use strict';

(function () {

  // функция активации карты
  var activateMap = function () {
    window.data.Nodes.MAP.classList.remove('map--faded');
  };

  window.map = {
    activateMap: activateMap,
  };
})();
