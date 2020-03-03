'use strict';

(function () {
  var Nodes = {
    MAP_PIN_MAIN: document.querySelector('.map__pin--main'),
    FIELD_ADDRESS: document.querySelector('#address'),
    TEMPLATE: document.querySelector('#pin')
      .content
      .querySelector('.map__pin'),
  };
  var Offset = {
    X: 25, // размер смещения маркера по оси X
    Y: 70, // размер смещения маркера по оси Y
    MAIN_X: 32, // размер смещения главного маркера по оси X
    MAIN_Y: 80, // размер смещения главного маркера по оси Y
  };

  var renderPin = function (item) {
    var pinElement = Nodes.TEMPLATE.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = (item.location.x - Offset.X) + 'px';
    pinElement.style.top = (item.location.y - Offset.Y) + 'px';
    pinImage.src = item.author.avatar;
    pinImage.alt = item.offer.title;

    return pinElement;
  };

  // создание фрагмента с метками пользователей на основе шаблона и вставка в DOM
  var renderPins = function (users) {
    var fragment = document.createDocumentFragment();

    users.forEach(function (item) {
      fragment.appendChild(renderPin(item));
    });
    return fragment;
  };

  // добавление координаты метки в поле с адресом
  // preload - расчет координат относительно цента метки(в момент загрузки страницы)
  // move - расчет координат относительно указателя метки(после активации карты)
  var getLocationPin = function (stat) {
    var mainPinWidth = window.util.getElementSize(Nodes.MAP_PIN_MAIN, 'width');
    var mainPinHeight = window.util.getElementSize(Nodes.MAP_PIN_MAIN, 'height');
    var pinStyles = getComputedStyle(Nodes.MAP_PIN_MAIN);
    var isPreload = stat === 'preload';
    var pinLocationX = parseInt(pinStyles.left, 10) + (isPreload ? mainPinWidth / 2 : Offset.MAIN_X);
    var pinLocationY = parseInt(pinStyles.top, 10) + (isPreload ? mainPinHeight / 2 : Offset.MAIN_Y);

    Nodes.FIELD_ADDRESS.value = Math.floor(pinLocationX) + ', ' + (Math.floor(pinLocationY));
  };

  window.pin = {
    renderAll: renderPins,
    getLocationPin: getLocationPin
  };
})();
