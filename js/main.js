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
  return array[getRandomBetween(0, array.length)];
};

// получение массива случайной длинны из другого массива
var getRandomNumberElements = function (array) {
  var copyElements = array.slice(0, array.length);
  var numberElements = getRandomBetween(1, copyElements.length);
  var takeElements = [];
  var finalElements = [];

  for (var i = 0; i < numberElements; i++) {
    var randomElement = getRandomBetween(0, copyElements.length - 1);
    takeElements = copyElements.splice(randomElement, 1);
    finalElements.push(takeElements[0]);
  }
  return finalElements;
};

// получение массива ссылок на аватара пользователя
var createImageNames = function (number) {
  return 'img/avatars/user0' + (number + 1) + '.png';
};

// создание массива с данными пользователя
var createUserData = function (number) {
  var userData = [];

  var author = {
    avatar: createImageNames(number)
  };

  var location = {
    x: getRandomBetween(MAP_PIN_MIN_X, (getElementWidth(MAP))),
    y: getRandomBetween(MAP_PIN_MIN_Y, MAP_PIN_MAX_Y)
  };

  var offer = {
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
