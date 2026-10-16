// Интеграция игры с ВКонтакте через VK Bridge (vk-bridge.min.js должен быть подключён раньше этого файла).
// Вне VK (локальный запуск) все функции молча ничего не делают, и игра работает как обычно.
//
// Диагностика: откройте игру по адресу https://vk.com/app<ID>#debug - внизу экрана появится панель
// со всеми запросами к VK и их ответами (например, причиной, по которой не показался баннер).
(function () {
  'use strict';

  var bridge = window.vkBridge;
  var inVK = !!(bridge && bridge.isEmbedded());
  var log = createDebugLog(/(^#|[#&])debug\b/.test(location.hash) || /[?&]loona_debug=1\b/.test(location.search));

  // Статичный рекламный баннер сверху. 'resize' - экран игры уменьшается на высоту баннера,
  // и баннер ничего не перекрывает (игра сама перестраивается по событию resize).
  // Важно: banner_location 'top' работает, только если в настройках игры в VK указано
  // «Настройки → Отображение → Мобильный формат → Элементы управления: Над окном».
  var BANNER = { banner_location: 'top', layout_type: 'resize' };
  var BANNER_RETRY_MS = 30000;
  var BANNER_MAX_ATTEMPTS = 5;
  // Если клиент VK не знает метода, запрос может остаться без ответа - тогда считаем попытку неудачной.
  var BANNER_TIMEOUT_MS = 10000;

  // Запрос к VK с записью в диагностическую панель и (необязательным) таймаутом.
  function call(method, params, timeoutMs) {
    log('→ ' + method + ' ' + json(params));
    var request = bridge.send(method, params);
    if (timeoutMs) {
      request = Promise.race([request, new Promise(function (resolve, reject) {
        setTimeout(function () { reject({ error_type: 'timeout', error_data: { ms: timeoutMs } }); }, timeoutMs);
      })]);
    }
    return request.then(function (data) {
      log('← ' + method + ' ' + json(data));
      return data;
    }, function (error) {
      log('✗ ' + method + ' ' + json(error));
      if (window.console) console.warn('[VK] ' + method + ' failed', error);
      throw error;
    });
  }

  function showBanner(attempt) {
    call('VKWebAppShowBannerAd', BANNER, BANNER_TIMEOUT_MS)
      .then(function (data) {
        if (!data || !data.result) retryBanner(attempt);
      })
      .catch(function () {
        // Реклама может быть временно недоступна (нет объявлений) - пробуем ещё раз позже.
        retryBanner(attempt);
      });
  }

  function retryBanner(attempt) {
    if (attempt + 1 < BANNER_MAX_ATTEMPTS) {
      log('повтор баннера через ' + BANNER_RETRY_MS / 1000 + ' c (попытка ' + (attempt + 2) + ' из ' + BANNER_MAX_ATTEMPTS + ')');
      setTimeout(function () { showBanner(attempt + 1); }, BANNER_RETRY_MS);
    } else {
      log('баннер так и не показан, попытки закончились');
    }
  }

  // Прогресс игры (пройденные обучения, открытые карты-джокеры) лежит в localStorage.
  // На хостинге VK адрес игры меняется с каждой выкладкой, и localStorage при этом пустеет,
  // поэтому значения дублируются в хранилище VK (привязано к пользователю) и восстанавливаются при запуске.
  function restoreStorage() {
    return call('VKWebAppStorageGetKeys', { count: 1000, offset: 0 })
      .then(function (data) {
        var keys = (data && data.keys) || [];
        if (!keys.length) return null;
        return call('VKWebAppStorageGet', { keys: keys });
      })
      .then(function (data) {
        var items = (data && data.keys) || [];
        items.forEach(function (item) {
          if (!item.value) return;
          try {
            if (window.localStorage.getItem(item.key) === null) window.localStorage.setItem(item.key, item.value);
          } catch (e) {}
        });
      });
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise.catch(function () {}),
      new Promise(function (resolve) { setTimeout(resolve, ms); })
    ]);
  }

  window.loonaVK = {
    // Сохранить значение в хранилище VK (вызывается игрой при каждой записи в localStorage).
    save: function (key, value) {
      if (!inVK) return;
      call('VKWebAppStorageSet', { key: key, value: value }).catch(function () {});
    },
    // Окно «Поделиться» со ссылкой на игру. Возвращает false вне VK - тогда игра делает своё.
    share: function () {
      if (!inVK) return false;
      call('VKWebAppShare').catch(function () {});
      return true;
    }
  };

  var launch = new URLSearchParams(location.search);
  log('vk_platform=' + launch.get('vk_platform') + ' vk_app_id=' + launch.get('vk_app_id') +
    ' bridge=' + !!bridge + ' embedded=' + inVK +
    (bridge ? ' webview=' + bridge.isWebView() + ' iframe=' + bridge.isIframe() : ''));

  // Игра (moon_january.js) загружается только после этого промиса, чтобы успеть восстановить прогресс.
  if (!inVK) {
    window.loonaBoot = Promise.resolve();
    return;
  }

  // События от VK, которые приходят не в ответ на наши запросы (обновление баннера, конфиг и т. п.).
  bridge.subscribe(function (event) {
    var type = event && event.detail && event.detail.type;
    if (type && !/(Result|Failed)$/.test(type)) log('событие ' + type + ' ' + json(event.detail.data));
  });

  var init = call('VKWebAppInit', undefined, 5000);
  init.then(function () { showBanner(0); }, function () { showBanner(0); });
  window.loonaBoot = withTimeout(init.then(restoreStorage), 2000);

  function json(value) {
    if (value === undefined) return '';
    try {
      var text = JSON.stringify(value);
      return text.length > 300 ? text.slice(0, 300) + '…' : text;
    } catch (e) {
      return String(value);
    }
  }

  // Панель диагностики внизу экрана (только с #debug в адресе). Не мешает нажатиям по игре.
  function createDebugLog(enabled) {
    if (!enabled) return function () {};
    var start = Date.now();
    var lines = [];
    var panel = null;
    function render() {
      if (!panel && document.body) {
        panel = document.createElement('pre');
        panel.style.cssText = 'position:fixed;left:0;right:0;bottom:0;z-index:2147483647;margin:0;max-height:45%;' +
          'overflow:auto;padding:6px 8px;background:rgba(0,0,0,.85);color:#9f9;font:11px/1.35 monospace;' +
          'white-space:pre-wrap;word-break:break-all;text-align:left;pointer-events:none';
        document.body.appendChild(panel);
      }
      if (panel) {
        panel.textContent = lines.join('\n');
        panel.scrollTop = panel.scrollHeight;
      }
    }
    document.addEventListener('DOMContentLoaded', render);
    return function (message) {
      lines.push(((Date.now() - start) / 1000).toFixed(1) + 's ' + message);
      render();
    };
  }
})();
