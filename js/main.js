'use strict';

var NUMBER_USERS = 8;
var MAP_PIN_MIN_Y = 130;
var MAP_PIN_MAX_Y = 630;
var MAP_PIN_MIN_X = 0;
var OFFSET_MAP_PIN_X = 25; // размер смещения маркера по оси X
var MAP = document.querySelector('.map');
var MAP_PIN_TEMPLATE = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');
var MAP_PINS_BLOCK = document.querySelector('.map__pins');
var TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_TIMES = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];

// получение ширины DOM-элемента
var getWidthElement = function (element) {
  return element.offsetWidth;
};

// определение рандомного числа из диапазона чисел
var getRandomInteger = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

// получение значения из рандомного елемента массива
var getRandomElement = function (array) {
  return array[Math.floor(Math.random() * (array.length - 1))];
};

// получение массива случайной длинны из другого массива
var getRandomNumberElements = function (array) {
  var numberElements = Math.ceil(Math.random() * array.length);
  var elements = [];

  for (var i = 0; i < numberElements; i++) {
    var randomElement = Math.floor(Math.random() * (numberElements - i)) + i;
    elements[i] = array[randomElement];
    array[randomElement] = array[i];
    array[i] = elements[i];
  }
  return elements;
};

// получение массива ссылок на аватара пользователя
var createImageNames = function () {
  var imageNames = [];

  for (var i = 0; i < NUMBER_USERS; i++) {
    imageNames[i] = 'img/avatars/user0' + (i + 1) + '.png';
  }

  return imageNames;
};

// создание массива с данными пользователя
var createUserData = function (number) {
  var userData = [];

  var author = {
    avatar: createImageNames()[number]
  };

  var location = {
    x: getRandomInteger(MAP_PIN_MIN_X, (getWidthElement(MAP))),
    y: getRandomInteger(MAP_PIN_MIN_Y, MAP_PIN_MAX_Y)
  };

  var offer = {
    title: 'заголовок предложения',
    address: location.x + ', ' + location.y,
    price: 500,
    type: getRandomElement(TYPES),
    rooms: 4,
    guests: 5,
    checkin: getRandomElement(CHECK_TIMES),
    checkout: getRandomElement(CHECK_TIMES),
    features: getRandomNumberElements(FEATURES),
    description: 'описание',
    photos: getRandomNumberElements(PHOTOS)
  };

  userData.author = author;
  userData.offer = offer;
  userData.location = location;

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
    var pinElement = MAP_PIN_TEMPLATE.cloneNode(true);
    var pinImage = pinElement.querySelector('img');

    pinElement.style.left = (element.location.x - OFFSET_MAP_PIN_X) + 'px';
    pinElement.style.top = (element.location.y) + 'px';
    pinImage.src = element.author.avatar;
    pinImage.alt = element.offer.title;

    fragment.appendChild(pinElement);
  });

  MAP_PINS_BLOCK.appendChild(fragment);
};

// функция активации карты
var activateMap = function () {
  renderPins();
  MAP.classList.remove('map--faded');
};

activateMap();
