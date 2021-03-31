// todo: add more
export default function ExperimentalInit() {
  if (localStorage.getItem('debug') === 'true') {
    document.onkeydown = (e) => {
      e = e || window.event;
      if (!e.ctrlKey) {
        return;
      }
      let code = e.which || e.keyCode;

      switch (code) {
        case 222:
          debugger;
          break;
      }
    };
  }
}
