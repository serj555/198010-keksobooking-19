'use strict';

(function () {

  var Location = {
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
  var TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECK_TIMES = ['12:00', '13:00', '14:00'];
  var FEATURES = [
    'wifi',
    'dishwasher',
    'parking',
    'washer',
    'elevator',
    'conditioner',
  ];
  var PHOTOS = [
    'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
    'http://o0.github.io/assets/images/tokyo/hotel3.jpg',
  ];

  // получение массива ссылок на аватара пользователя
  var createImageNames = function (number) {
    return 'img/avatars/user0' + (number + 1) + '.png';
  };

  // создание массива с данными пользователя
  var createUserData = function (number) {
    var locationX = window.util.getRandomBetween(Location.MIN_X, window.util.getElementSize(window.data.Nodes.MAP, 'width'));
    var locationY = window.util.getRandomBetween(Location.MIN_Y + window.data.Offset.Y, Location.MAX_Y);

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
        price: window.util.getRandomBetween(Price.MIN, Price.MAX),
        type: window.util.getRandomElement(TYPES),
        rooms: window.util.getRandomBetween(Room.MIN, Room.MAX),
        guests: window.util.getRandomBetween(Guest.MIN, Guest.MAX),
        checkin: window.util.getRandomElement(CHECK_TIMES),
        checkout: window.util.getRandomElement(CHECK_TIMES),
        features: window.util.getRandomNumberElements(FEATURES),
        description: 'описание',
        photos: window.util.getRandomNumberElements(PHOTOS)
      }
    };

    return userData;
  };

  // создание массива с данными пользователей
  var createUsers = function (number) {
    var users = [];

    for (var i = 0; i < number; i++) {
      users.push(createUserData(i));
    }

    return users;
  };

  window.userData = {
    createUsers: createUsers,
  };
})();
