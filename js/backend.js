'use strict';

(function () {
  var Url = {
    LOAD: 'https://js.dump.academy/keksobooking/data'
  };
  var Method = {
    GET: 'GET',
    POST: 'POST'
  };
  var StatusCode = {
    OK: 200,
  };
  var TIMEOUT_IN_MS = 10000; // 10c

  var sendRequest = function (method, url, onLoad, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    var onLoadData = function () {
      if (xhr.status === StatusCode.OK) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    };

    var onErrorLoad = function () {
      onError('Произошла ошибка соединения');
    };

    var onTimeOutLoad = function () {
      onError('Запрос не успел выполнится за ' + xhr.timeout + 'мс. Попробуйте повторить');
    };

    xhr.addEventListener('load', onLoadData);
    xhr.addEventListener('error', onErrorLoad);
    xhr.addEventListener('timeout', onTimeOutLoad);

    xhr.timeout = TIMEOUT_IN_MS;

    xhr.open(method, url);
    xhr.send(data);
  };

  window.backend = {
    load: sendRequest.bind(undefined, Method.GET, Url.LOAD),
    save: sendRequest.bind(undefined, Method.POST, Url.SAVE),
  };
})();
