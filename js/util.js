'use strict';

(function () {

  // получение ширины DOM-элемента
  var getElementSize = function (element, param) {
    return param === 'width' ? element.offsetWidth : element.offsetHeight;
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
  var getRandomNumberElements = function (items) {
    var copyElements = items.slice(0, items.length);
    var numberElements = getRandomBetween(1, copyElements.length);
    var finalElements = [];

    for (var i = 0; i < numberElements; i++) {
      var randomIndex = getRandomBetween(0, copyElements.length - 1);
      finalElements.push(copyElements.splice(randomIndex, 1)[0]);
    }
    return finalElements;
  };

  // добавление('add')/удаление('remove') атрибута Disabled у элементов коллекции
  var setDisabled = function (HTMLCollection, act) {

    var isDisabled = act === 'add';
    var action = isDisabled ? 'setAttribute' : 'removeAttribute';

    for (var i = 0; i < HTMLCollection.length; i++) {
      HTMLCollection[i][action]('disabled', 'disabled');
    }
  };

  var onErrorLoad = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('errorMessage');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: red;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fonsize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  };

  window.util = {
    getElementSize: getElementSize,
    getRandomBetween: getRandomBetween,
    getRandomElement: getRandomElement,
    getRandomNumberElements: getRandomNumberElements,
    setDisabled: setDisabled,
    onErrorLoad: onErrorLoad
  };
})();
