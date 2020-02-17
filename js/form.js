'use strict';

(function () {

  var Nodes = {
    MAP_PINS_BLOCK: document.querySelector('.map__pins'),
    MAP_FILTERS: document.querySelector('.map__filters'),
    FORM: document.querySelector('.ad-form'),
    PRICE_PER_NIGHT_INPUT: document.querySelector('#price'),
    TIMEIN_SELECT: document.querySelector('#timein'),
    TIMEOUT_SELECT: document.querySelector('#timeout'),
    FORM_SUBMIT_BUTTON: document.querySelector('.ad-form__submit'),
    TYPE_HOUSE_SELECT: document.querySelector('#type'),
    ROOM_SELECT: document.querySelector('#room_number'),
    CAPACITY_SELECT: document.querySelector('#capacity'),
  };
  var PricePerNight = {
    bungalo: '0',
    flat: '1000',
    house: '5000',
    palace: '10000',
  };
  var prices = {
    'bungalo': PricePerNight.bungalo,
    'flat': PricePerNight.flat,
    'house': PricePerNight.house,
    'palace': PricePerNight.palace,
  };
  var KEY_ENTER = 'Enter';

  // активация('on')/деактивация('off') формы и фильтра
  var activateForm = function (stat) {
    var formElements = Nodes.FORM.children;
    var mapFilterElements = Nodes.MAP_FILTERS.children;
    var isActivate = stat === 'on';
    var action = isActivate ? 'remove' : 'add';

    window.util.setDisabled(formElements, action);
    window.util.setDisabled(mapFilterElements, action);
    Nodes.FORM.classList[action]('ad-form--disabled');
  };

  // активация пунктов количества гостей
  var activateGuestOption = function (number) {
    for (var i = 0; i < number; i++) {
      Nodes.CAPACITY_SELECT.querySelector('option[value="' + (i + 1) + '"]').disabled = false;
    }
  };

  // устанавливает максимальное количество гостей в зависимости от количства комнат
  var changeNumberGuests = function (number) {
    var capacityOptions = Nodes.CAPACITY_SELECT.children;

    window.util.setDisabled(capacityOptions, 'add');

    if (number < 100) {
      activateGuestOption(number);
    } else if (number === '100') {
      Nodes.CAPACITY_SELECT.querySelector('option[value="0"]').disabled = false;
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
  var setMessageCapacity = function () {
    var rooms = parseInt(Nodes.ROOM_SELECT.value, 10);
    var guests = parseInt(Nodes.CAPACITY_SELECT.value, 10);
    var message = '';

    if ((rooms < guests) && (guests > 1)) {
      message = 'Количество гостей не должно быть больше количества комнат';
    } else if ((rooms === 100) && (guests > 0)) {
      message = 'Такое количество комнат скорее всего не для гостей';
    } else if ((rooms < 100) && (guests === 0)) {
      message = 'Выберите подходящее количество гостей';
    }

    return message;
  };

  // валидация поля с количеством гостей
  var validateCapacty = function () {
    Nodes.CAPACITY_SELECT.setCustomValidity(setMessageCapacity());
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

  var onSubmitFormClick = function () {
    validateCapacty();
  };

  var onMainPinClick = function (evt) {
    var existClass = window.data.Nodes.MAP.classList.contains('map--faded');

    if ((evt.button === 0 && existClass) || (evt.key === KEY_ENTER && existClass)) {

      Nodes.MAP_PINS_BLOCK.appendChild(window.pin.renderNewOnes());
      window.map.activateMap();
      window.pin.getLocationPin('move');
      activateForm('on');
    }

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
  Nodes.FORM_SUBMIT_BUTTON.addEventListener('click', onSubmitFormClick);
  window.data.Nodes.MAP_PIN_MAIN.addEventListener('mousedown', onMainPinClick);
  window.data.Nodes.MAP_PIN_MAIN.addEventListener('keydown', onMainPinClick);


  window.pin.getLocationPin('preload');
  activateForm('off');
})();
