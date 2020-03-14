'use strict';

(function () {

  var Nodes = {
    MAP_FILTERS: document.querySelector('.map__filters'),
    FORM: document.querySelector('.ad-form'),
    PRICE_PER_NIGHT_INPUT: document.querySelector('#price'),
    TIMEIN_SELECT: document.querySelector('#timein'),
    TIMEOUT_SELECT: document.querySelector('#timeout'),
    FORM_SUBMIT_BUTTON: document.querySelector('.ad-form__submit'),
    TYPE_HOUSE_SELECT: document.querySelector('#type'),
    ROOM_SELECT: document.querySelector('#room_number'),
    CAPACITY_SELECT: document.querySelector('#capacity'),
    CAPACITY_OPTION_NOT_GUEST: document.querySelector('#capacity option[value="0"]'),
  };
  var PricePerNight = {
    BUNGALO: '0',
    FLAT: '1000',
    HOUSE: '5000',
    PALACE: '10000',
  };
  var prices = {
    'bungalo': PricePerNight.BUNGALO,
    'flat': PricePerNight.FLAT,
    'house': PricePerNight.HOUSE,
    'palace': PricePerNight.PALACE,
  };
  var ROOMS_MAX = Math.max.apply(null, window.mock.ROOMS);

  // активация('on')/деактивация('off') формы и фильтра
  var activateForm = function (stat) {
    var formElements = Nodes.FORM.children;
    var mapFilterElements = Nodes.MAP_FILTERS.children;
    var action = stat === 'on' ? 'remove' : 'add';

    window.util.setDisabled(formElements, action);
    window.util.setDisabled(mapFilterElements, action);
    Nodes.FORM.classList[action]('ad-form--disabled');
  };

  // активация пунктов количества гостей
  var activateGuestOption = function (guests, numberRooms) {
    guests.forEach(function (elem) {
      if (elem.value <= numberRooms && elem.value > 0) {
        elem.disabled = false;
      }
    });
  };

  // устанавливает максимальное количество гостей в зависимости от количства комнат
  var changeNumberGuests = function (number) {
    var capacityOptions = document.querySelectorAll('#capacity option');

    window.util.setDisabled(capacityOptions, 'add');

    if (+number < ROOMS_MAX) {
      activateGuestOption(capacityOptions, number);
    } else if (+number === ROOMS_MAX) {
      Nodes.CAPACITY_OPTION_NOT_GUEST.disabled = false;
    } else {
      window.util.setDisabled(capacityOptions, 'remove');
    }
  };

  // устанавливает минимальную цену за ночь в зависимости от типа жилья
  var changeCostPerNight = function (value) {
    Nodes.PRICE_PER_NIGHT_INPUT.setAttribute('min', prices[value]);
    Nodes.PRICE_PER_NIGHT_INPUT.setAttribute('placeholder', prices[value]);
  };

  // устанавливает одинаковое время заезда и выезда
  var timeCheck = function (element, value) {

    if (element === 'timeout') {
      Nodes.TIMEIN_SELECT.querySelector('option[value="' + value + '"]').selected = true;
    } else if (element === 'timein') {
      Nodes.TIMEOUT_SELECT.querySelector('option[value="' + value + '"]').selected = true;
    }
  };

  // определение подходящего сообщения при валидации
  var messageCapacity = function () {
    var rooms = parseInt(Nodes.ROOM_SELECT.value, 10);
    var guests = parseInt(Nodes.CAPACITY_SELECT.value, 10);

    if ((rooms < guests) && (guests > 1)) {
      return 'Количество гостей не должно быть больше количества комнат';
    } else if ((rooms === ROOMS_MAX) && (guests > 0)) {
      return 'Такое количество комнат скорее всего не для гостей';
    } else if ((rooms < ROOMS_MAX) && (guests === 0)) {
      return 'Выберите подходящее количество гостей';
    }

    return '';
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

  // валидация поля при клике на кнопку отправки формы
  var onSubmitFormClick = function () {
    Nodes.CAPACITY_SELECT.setCustomValidity(messageCapacity());
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
  Nodes.FORM_SUBMIT_BUTTON.addEventListener('click', onSubmitFormClick);

  window.pin.setLocationInForm('preload');
  activateForm('off');

  window.form = {
    activate: activateForm
  };
})();
