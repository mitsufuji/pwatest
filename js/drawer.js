'use strict';
function instanceCheck(target, clazz) {
  if (!(target instanceof clazz)) {
    throw new Error('illegal state');
  }
  return target;
}
function nullcheck(target) {
  if (target === null || target === undefined) {
    throw new Error('illegal state');
  }
  return target;
}
window.addEventListener('load', () => {
  let last;
  const canvas = instanceCheck(
    document.getElementById('stage'),
    HTMLCanvasElement
  );
  const ctx = nullcheck(canvas.getContext('2d'));
  function resize() {
    canvas.setAttribute('width', `${window.innerWidth * 2}`);
    canvas.setAttribute('height', `${window.innerHeight * 2}`);
    ctx.font = '30px serif';
    ctx.fillText('PWAサンプルアプリ', 20, 40);
    ctx.font = '25px serif';
    ctx.fillText('マウスや指タッチで線が描けるよ！', 15, 80);
    ctx.lineWidth = 5;
    ctx.scale(2, 2);
  }
  resize();
  window.addEventListener('resize', resize);
  window.addEventListener('orientationchange', resize);
  canvas.addEventListener(
    'pointerdown',
    event => {
      event.preventDefault();
      last = [event.pageX, event.pageY];
    },
    false
  );
  canvas.addEventListener(
    'pointermove',
    event => {
      if (last === undefined) return;
      ctx.strokeStyle =
        'rgb(' +
        Math.floor(Math.random() * 255) +
        ',' +
        Math.floor(Math.random() * 255) +
        ',' +
        Math.floor(Math.random() * 255) +
        ')';
      ctx.beginPath();
      ctx.moveTo(last[0], last[1]);
      ctx.lineTo(event.pageX, event.pageY);
      ctx.stroke();
      ctx.closePath();
      last = [event.pageX, event.pageY];
    },
    false
  );
  canvas.addEventListener(
    'pointerup',
    _ => {
      last = undefined;
    },
    false
  );
});
// ServiceWorker登録：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja
if ('serviceWorker' in navigator) {
  (async () => {
    try {
      const registration = await navigator.serviceWorker.register('sw.js');
      console.log(
        'ServiceWorker registration successful with scope: ',
        registration.scope
      );
    } catch (err) {
      console.log('ServiceWorker registration failed: ', err);
    }
  })();
}
//# sourceMappingURL=drawer.js.map
