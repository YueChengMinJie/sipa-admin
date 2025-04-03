let baseSize = 100;
let glob_tid = null;

function setHtmlFontSize() {
  let scale = 1;

  document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + baseSize * Math.min(scale, 2) + 'px';
}

setHtmlFontSize();

if (window.addEventListener) {
  window.addEventListener(
    'resize',
    function() {
      if (glob_tid) {
        clearTimeout(glob_tid);
      }
      glob_tid = setTimeout(() => {
        setHtmlFontSize();
      }, 300);
    },
    false
  );
}
