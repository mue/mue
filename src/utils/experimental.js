export default function ExperimentalInit() {
  if (localStorage.getItem('debug') === 'true') {
    document.onkeydown = (e) => {
      e = e || window.event;

      if (!e.ctrlKey) {
        return;
      }

      const code = e.which || e.keyCode;

      switch (code) {
        case 222: {
          const timeout = localStorage.getItem('debugtimeout');

          if (timeout !== '0') {
            setTimeout(() => {
              // eslint-disable-next-line no-debugger
              debugger;
            }, timeout);
          } else {
            // eslint-disable-next-line no-debugger
            debugger;
          }
          break;
        }
        default:
          break;
      }
    };
  }
}
