// Интеграция игры с ВКонтакте через VK Bridge (vk-bridge.min.js должен быть подключён раньше этого файла).
// Вне VK (локальный запуск) все функции молча ничего не делают, и игра работает как обычно.
(function () {
  'use strict';

  var bridge = window.vkBridge;
  var inVK = !!(bridge && bridge.isEmbedded());

  // Статичный рекламный баннер сверху. 'resize' - экран игры уменьшается на высоту баннера,
  // и баннер ничего не перекрывает (игра сама перестраивается по событию resize).
  // Важно: banner_location 'top' работает, только если в настройках игры в VK указано
  // «Отображение → Мобильный формат → Элементы управления: Над окном».
  var BANNER = { banner_location: 'top', layout_type: 'resize' };
  var BANNER_RETRY_MS = 30000;
  var BANNER_MAX_ATTEMPTS = 5;

  function showBanner(attempt) {
    bridge.send('VKWebAppShowBannerAd', BANNER)
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
      setTimeout(function () { showBanner(attempt + 1); }, BANNER_RETRY_MS);
    }
  }

  // Прогресс игры (пройденные обучения, открытые карты-джокеры) лежит в localStorage.
  // На хостинге VK адрес игры меняется с каждой выкладкой, и localStorage при этом пустеет,
  // поэтому значения дублируются в хранилище VK (привязано к пользователю) и восстанавливаются при запуске.
  function restoreStorage() {
    return bridge.send('VKWebAppStorageGetKeys', { count: 1000, offset: 0 })
      .then(function (data) {
        var keys = (data && data.keys) || [];
        if (!keys.length) return null;
        return bridge.send('VKWebAppStorageGet', { keys: keys });
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
      bridge.send('VKWebAppStorageSet', { key: key, value: value }).catch(function () {});
    },
    // Окно «Поделиться» со ссылкой на игру. Возвращает false вне VK - тогда игра делает своё.
    share: function () {
      if (!inVK) return false;
      bridge.send('VKWebAppShare').catch(function () {});
      return true;
    }
  };

  // Игра (moon_january.js) загружается только после этого промиса, чтобы успеть восстановить прогресс.
  if (!inVK) {
    window.loonaBoot = Promise.resolve();
    return;
  }

  var init = bridge.send('VKWebAppInit');
  init.then(function () { showBanner(0); }, function () { showBanner(0); });
  window.loonaBoot = withTimeout(init.then(restoreStorage), 2000);
})();
