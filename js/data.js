'use strict';

(function () {

  var Nodes = {
    MAP: document.querySelector('.map'),
    PIN_TEMPLATE: document.querySelector('#pin')
      .content
      .querySelector('.map__pin'),
    MAP_PIN_MAIN: document.querySelector('.map__pin--main'),
    FIELD_ADDRESS: document.querySelector('#address'),
  };
  var Offset = {
    X: 25, // размер смещения маркера по оси X
    Y: 70, // размер смещения маркера по оси Y
    MAIN_X: 32, // размер смещения главного маркера по оси X
    MAIN_Y: 80, // размер смещения главного маркера по оси Y
  };

  window.data = {
    Nodes: Nodes,
    Offset: Offset,
  };
})();
