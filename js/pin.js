'use strict';

(function () {

  var TEMPLATE = document.querySelector('#pin')
    .content
    .querySelector('.map__pin');
  var NUMBER_USERS = 8;

  var createElement = function (item) {
    var pinElement = TEMPLATE.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = (item.location.x - window.data.Offset.X) + 'px';
    pinElement.style.top = (item.location.y - window.data.Offset.Y) + 'px';
    pinImage.src = item.author.avatar;
    pinImage.alt = item.offer.title;

    return pinElement;
  };

  // создание фрагмента с метками пользователей на основе шаблона и вставка в DOM
  var renderNewOnes = function () {
    var fragment = document.createDocumentFragment();
    var users = window.userData.createUsers(NUMBER_USERS);

    users.forEach(function (item) {
      fragment.appendChild(createElement(item));
    });
    return fragment;
  };

  // добавление координаты метки в поле с адресом
  // preload - расчет координат относительно цента метки(в момент загрузки страницы)
  // move - расчет координат относительно указателя метки(после активации карты)
  var getLocationPin = function (stat) {
    var mainPinWidth = window.util.getElementSize(window.data.Nodes.MAP_PIN_MAIN, 'width');
    var mainPinHeight = window.util.getElementSize(window.data.Nodes.MAP_PIN_MAIN, 'height');
    var pinStyles = getComputedStyle(window.data.Nodes.MAP_PIN_MAIN);
    var isPreload = stat === 'preload';
    var pinLocationX = parseInt(pinStyles.left, 10) + (isPreload ? mainPinWidth / 2 : window.data.Offset.MAIN_X);
    var pinLocationY = parseInt(pinStyles.top, 10) + (isPreload ? mainPinHeight / 2 : window.data.Offset.MAIN_Y);

    window.data.Nodes.FIELD_ADDRESS.value = Math.floor(pinLocationX) + ', ' + (Math.floor(pinLocationY));
  };

  window.pin = {
    renderNewOnes: renderNewOnes,
    getLocationPin: getLocationPin
  };
})();
