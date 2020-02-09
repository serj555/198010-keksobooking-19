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
  PRICE_PER_NIGHT_INPUT: document.querySelector('#price'),
  TIMEIN_SELECT: document.querySelector('#timein'),
  TIMEOUT_SELECT: document.querySelector('#timeout'),
  FORM_SUBMIT_BUTTON: document.querySelector('.ad-form__submit'),
  TYPE_HOUSE_SELECT: document.querySelector('#type'),
  ROOM_SELECT: document.querySelector('#room_number'),
  CAPACITY_SELECT: document.querySelector('#capacity'),
};
var MapPinOffset = {
  X: 25, // размер смещения маркера по оси X
  Y: 70, // размер смещения маркера по оси Y
  MAIN_X: 32,
  MAIN_Y: 80
};
var MapPinLocation = {
  MIN_Y: 130,
  MAX_Y: 630,
  MIN_X: 0,
};
var Price = {
  MIN: 1000,
  MAX: 5000,
};
var Room = {
  MIN: 1,
  MAX: 5,
};
var Guest = {
  MIN: 1,
  MAX: 10,
};
var PricePerNight = {
  bungalo: '0',
  flat: '1000',
  house: '5000',
  palace: '10000',
};
var KEY_ENTER = 'Enter';
var NUMBER_USERS = 8;
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
  }
  return finalElements;
};

// получение массива ссылок на аватара пользователя
var createImageNames = function (number) {
  return 'img/avatars/user0' + (number + 1) + '.png';
};

// создание массива с данными пользователя
var createUserData = function (number) {
  var locationX = getRandomBetween(MapPinLocation.MIN_X, (getElementWidth(Nodes.MAP)));
  var locationY = getRandomBetween(MapPinLocation.MIN_Y + MapPinOffset.Y, MapPinLocation.MAX_Y + MapPinOffset.Y);

  var userData = {
    author: {
      avatar: createImageNames(number)
    },

    location: {
      x: locationX,
      y: locationY
    },

    offer: {
      title: 'заголовок предложения',
      address: locationX + ', ' + locationY,
      price: getRandomBetween(Price.MIN, Price.MAX),
      type: getRandomElement(TYPES),
      rooms: getRandomBetween(Room.MIN, Room.MAX),
      guests: getRandomBetween(Guest.MIN, Guest.MAX),
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

    pinElement.style.left = (element.location.x - MapPinOffset.X) + 'px';
    pinElement.style.top = (element.location.y - MapPinOffset.Y) + 'px';
    pinImage.src = element.author.avatar;
    pinImage.alt = element.offer.title;

    fragment.appendChild(pinElement);
  });
  return fragment;
};

// добавление('add')/удаление('remove') атрибута Disabled у элементов коллекции
var setDisabled = function (array, act) {
  switch (act) {
    case 'add':
      for (var i = 0; i < array.length; i++) {
        array[i].setAttribute('disabled', 'disabled');
      }
      break;
    case 'remove':
      for (i = 0; i < array.length; i++) {
        array[i].removeAttribute('disabled');
      }
      break;
  }
};

// активация('on')/деактивация('off') формы и фильтра
var activateForm = function (stat) {
  var formElements = Nodes.FORM.children;
  var mapFilterElements = Nodes.MAP_FILTERS.children;

  switch (stat) {
    case 'on':
      setDisabled(formElements, 'remove');
      setDisabled(mapFilterElements, 'remove');
      Nodes.FORM.classList.remove('ad-form--disabled');
      break;
    case 'off':
      setDisabled(formElements, 'add');
      setDisabled(mapFilterElements, 'add');
      Nodes.FORM.classList.add('ad-form--disabled');
      break;
  }
};

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
      pinLocationX = parseInt(pinStyles.left, 10) + MapPinOffset.MAIN_X;
      pinLocationY = parseInt(pinStyles.top, 10) + MapPinOffset.MAIN_Y;
      break;
  }

  Nodes.FIELD_ADDRESS.value = Math.floor(pinLocationX) + ', ' + (Math.floor(pinLocationY));
};

// функция активации карты
var activateMap = function (evt) {
  evt.preventDefault();
  var existClass = Nodes.MAP.classList.contains('map--faded');

  if ((evt.button === 0 && existClass) || (evt.key === KEY_ENTER && existClass)) {
    Nodes.MAP_PINS_BLOCK.appendChild(renderPins());
    Nodes.MAP.classList.remove('map--faded');
    getLocationPin('move');
    activateForm('on');
  }
};

// устанавливает максимальное количество гостей в зависимости от количства комнат
var changeNumberGuests = function (number) {
  var capacityOptions = Nodes.CAPACITY_SELECT.children;

  setDisabled(capacityOptions, 'add');

  if (number > 0 && number < 100) {
    for (var i = number; i > 0; i--) {
      Nodes.CAPACITY_SELECT.querySelector('option[value="' + i + '"]').disabled = false;
    }
  } else if (number === '100') {
    Nodes.CAPACITY_SELECT.querySelector('option[value="0"]').disabled = false;
  } else {
    setDisabled(capacityOptions, 'remove');
  }
};

// устанавливает минимальную цену за ночь в зависимости от типа жилья
var changeCostPerNight = function (value) {
  var minPrice = 0;

  switch (value) {
    case 'bungalo':
      minPrice = PricePerNight.bungalo;
      break;
    case 'flat':
      minPrice = PricePerNight.flat;
      break;
    case 'house':
      minPrice = PricePerNight.house;
      break;
    case 'palace':
      minPrice = PricePerNight.palace;
      break;
    default:
      minPrice = 0;
  }

  Nodes.PRICE_PER_NIGHT_INPUT.setAttribute('min', minPrice);
  Nodes.PRICE_PER_NIGHT_INPUT.setAttribute('placeholder', minPrice);
};

// устанавливает одинаковое время заезда и выезда
var timeCheck = function (element, value) {
  var timeInCurrentSelect = Nodes.TIMEIN_SELECT.querySelector('option[value="' + value + '"]');
  var timeOutCurrentSelect = Nodes.TIMEOUT_SELECT.querySelector('option[value="' + value + '"]');

  if (element === 'timeout') {
    timeInCurrentSelect.selected = true;
  } else if (element === 'timein') {
    timeOutCurrentSelect.selected = true;
  }

  // тернарное выражение работает но ругается ESLint
  // element === 'timeout' ? (timeInCurrentSelect.selected = true) : (timeOutCurrentSelect.selected = true);
};

// валидация поля с количеством гостей
var validateCapacty = function () {
  var rooms = parseInt(Nodes.ROOM_SELECT.value, 10);
  var guests = parseInt(Nodes.CAPACITY_SELECT.value, 10);
  var message = '';

  if ((rooms < 100) && (guests > 1)) {
    message = 'Количество гостей не должно быть больше количества комнат';
  } else if ((rooms === 100) && (guests > 0)) {
    message = 'Такое количество комнат скорее всего не для гостей';
  } else if ((rooms < 100) && (guests === 0)) {
    message = 'Выберите подходящее количество гостей';
  }

  Nodes.CAPACITY_SELECT.setCustomValidity(message);
};

var onTimeCheckChange = function (evt) {
  var target = evt.target;
  var targetName = target.getAttribute('name');
  var matchesIn = target.matches('select[name="timein"]');
  var matchesOut = target.matches('select[name="timeout"]');

  if (target && (matchesIn || matchesOut)) {
    timeCheck(targetName, target.value);
  }
};

var onSubmitFomrClick = function () {
  validateCapacty();
};

var onMainPinClick = function (evt) {
  activateMap(evt);
  changeNumberGuests(Nodes.ROOM_SELECT.querySelector('option[selected]').value);
  changeCostPerNight(Nodes.TYPE_HOUSE_SELECT.querySelector('option[selected]').value);
};

// события
Nodes.TYPE_HOUSE_SELECT.addEventListener('change', function (evt) {
  var target = evt.target;

  changeCostPerNight(target.value);
});

Nodes.ROOM_SELECT.addEventListener('change', function (evt) {
  var target = evt.target;

  changeNumberGuests(target.value);
});

Nodes.FORM.addEventListener('change', onTimeCheckChange);
Nodes.FORM_SUBMIT_BUTTON.addEventListener('click', onSubmitFomrClick);
Nodes.MAP_PIN_MAIN.addEventListener('mousedown', onMainPinClick);
Nodes.MAP_PIN_MAIN.addEventListener('keydown', onMainPinClick);


getLocationPin('preload');
activateForm('off');
