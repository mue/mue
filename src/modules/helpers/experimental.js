export default function ExperimentalInit() {
  if (localStorage.getItem('debug') === 'true') {
    document.onkeydown = (e) => {
      e = e || window.event;

      if (!e.ctrlKey) {
        return;
      }

      const code = e.which || e.keyCode;

      switch (code) {
        case 222:
          const timeout = localStorage.getItem('debugtimeout');

          if (timeout !== '0') {
            setTimeout(() => {
              debugger;
            }, timeout);
          } else {
            debugger;
          }
          break;
        default:
          break;
      }
    };
  }
}
