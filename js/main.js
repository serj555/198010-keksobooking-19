'use strict';

var Nodes = {
  MAP: document.querySelector('.map'),
  MAP_PIN_MAIN: document.querySelector('.map__pin--main'),
  MAP_PIN_TEMPLATE: document.querySelector('#pin')
    .content
    .querySelector('.map__pin'),
  MAP_PINS_BLOCK: document.querySelector('.map__pins'),
  MAP_FILTERS: document.querySelector('.map__filters'),
  FIELD_ADDRESS: document.querySelector('#address'),
  FORM: document.querySelector('.ad-form'),
};
var Offset = {
  OFFSET_MAP_PIN_X: 25, // размер смещения маркера по оси X
  OFFSET_MAP_PIN_Y: 70, // размер смещения маркера по оси Y
  OFFSET_MAP_PIN_MAIN_X: 32,
  OFFSET_MAP_PIN_MAIN_Y: 80
};
var KEY_ENTER = 'Enter';
var NUMBER_USERS = 8;
var MAP_PIN_MIN_Y = 130;
var MAP_PIN_MAX_Y = 630;
var MAP_PIN_MIN_X = 0;
var PRICE_MIN = 1000;
var PRICE_MAX = 5000;
var ROOM_MIN = 1;
var ROOM_MAX = 5;
var GUEST_MIN = 1;
var GUEST_MAX = 10;
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'];
var PHOTOS = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// получение ширины DOM-элемента
var getElementWidth = function (element) {
  return element.offsetWidth;
};

// определение рандомного числа из диапазона чисел
var getRandomBetween = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// получение значения из рандомного елемента массива
var getRandomElement = function (array) {
  return array[getRandomBetween(0, array.length - 1)];
};

// получение массива случайной длинны из другого массива
var getRandomNumberElements = function (array) {
  var copyElements = array.slice(0, array.length);
  var numberElements = getRandomBetween(1, copyElements.length);
  var finalElements = [];

  for (var i = 0; i < numberElements; i++) {
    var randomIndex = getRandomBetween(0, copyElements.length - 1);
    finalElements.push(copyElements[randomIndex]);
    copyElements.splice(randomIndex, 1);
  }
  return finalElements;
};

// получение массива ссылок на аватара пользователя
var createImageNames = function (number) {
  return 'img/avatars/user0' + (number + 1) + '.png';
};

// создание массива с данными пользователя
var createUserData = function (number) {
  var userData = {
    author: {
      avatar: createImageNames(number)
    },

    location: {
      x: getRandomBetween(MAP_PIN_MIN_X, (getElementWidth(Nodes.MAP))),
      y: getRandomBetween(MAP_PIN_MIN_Y + Offset.OFFSET_MAP_PIN_Y, MAP_PIN_MAX_Y + Offset.OFFSET_MAP_PIN_Y)
    },

    offer: {
      title: 'заголовок предложения',
      address: location.x + ', ' + location.y,
      price: getRandomBetween(PRICE_MIN, PRICE_MAX),
      type: getRandomElement(TYPES),
      rooms: getRandomBetween(ROOM_MIN, ROOM_MAX),
      guests: getRandomBetween(GUEST_MIN, GUEST_MAX),
      checkin: getRandomElement(CHECK_TIMES),
      checkout: getRandomElement(CHECK_TIMES),
      features: getRandomNumberElements(FEATURES),
      description: 'описание',
      photos: getRandomNumberElements(PHOTOS)
    }
  };

  return userData;
};

// создание массива с данными пользователей
var createUsers = function () {
  var users = [];

  for (var i = 0; i < NUMBER_USERS; i++) {
    users.push(createUserData(i));
  }

  return users;
};

// создание фрагмента с метками пользователей на основе шаблона и вставка в DOM
var renderPins = function () {
  var fragment = document.createDocumentFragment();
  var users = createUsers();

  users.forEach(function (element) {
    var pinElement = Nodes.MAP_PIN_TEMPLATE.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = (element.location.x - Offset.OFFSET_MAP_PIN_X) + 'px';
    pinElement.style.top = (element.location.y - Offset.OFFSET_MAP_PIN_Y) + 'px';
    pinImage.src = element.author.avatar;
    pinImage.alt = element.offer.title;

    fragment.appendChild(pinElement);
  });

  Nodes.MAP_PINS_BLOCK.appendChild(fragment);
};

// функция активации карты
var activateMap = function () {
  renderPins();
  Nodes.MAP.classList.remove('map--faded');
};

// добавление атрибута Disabled к элементам коллекции
var addDisabled = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].setAttribute('disabled', 'disabled');
  }
};

// удаление атрибута Disabled у элементов коллекции
var removeDisabled = function (array) {
  for (var i = 0; i < array.length; i++) {
    array[i].removeAttribute('disabled');
  }
};

// добавление/удаление disabled для всех дочерних элементов форм (дочерних элементов формы)
var disableForm = function (stat) {
  var formElements = Nodes.FORM.children;
  var mapFilterElements = Nodes.MAP_FILTERS.children;

  switch (stat) {
    case 'on':
      addDisabled(formElements);
      addDisabled(mapFilterElements);
      Nodes.FORM.classList.add('ad-form--disabled');
      break;
    case 'off':
      removeDisabled(formElements);
      removeDisabled(mapFilterElements);
      Nodes.FORM.classList.remove('ad-form--disabled');
      break;
  }
};
disableForm('on');

// добавление координат метки в поле с адресом
// preload - расчет координат относительно цента метки(в момент загрузки страницы)
// move - расчет координат относительно указателя метки(после активации карты)
var getLocationPin = function (stat) {
  var mainPinWidth = Nodes.MAP_PIN_MAIN.offsetWidth;
  var mainPinHeight = Nodes.MAP_PIN_MAIN.offsetHeight;
  var pinStyles = getComputedStyle(Nodes.MAP_PIN_MAIN);

  switch (stat) {
    case 'preload':
      var pinLocationX = parseInt(pinStyles.left, 10) + mainPinWidth / 2;
      var pinLocationY = parseInt(pinStyles.top, 10) + mainPinHeight / 2;
      break;
    case 'move':
      pinLocationX = parseInt(pinStyles.left, 10) + Offset.OFFSET_MAP_PIN_MAIN_X;
      pinLocationY = parseInt(pinStyles.top, 10) + Offset.OFFSET_MAP_PIN_MAIN_Y;
      break;
  }

  Nodes.FIELD_ADDRESS.value = Math.floor(pinLocationX) + ', ' + (Math.floor(pinLocationY));
};
getLocationPin('preload');

Nodes.MAP_PIN_MAIN.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  if (evt.button === 0) {
    activateMap();
    disableForm('off');
    getLocationPin('move');
  }
});

Nodes.MAP_PIN_MAIN.addEventListener('keydown', function (evt) {
  evt.preventDefault();
  if (evt.key === KEY_ENTER) {
    activateMap();
    disableForm('off');
  }
});

