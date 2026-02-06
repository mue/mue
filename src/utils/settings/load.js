import variables from 'config/variables';
import ExperimentalInit from 'utils/experimental';

function loadGoogleFontAsync(fontFamily, id) {
  const fontUrl = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g, '+')}:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap`;

  const existingLink = document.getElementById(id);
  if (existingLink) {
    existingLink.remove();
  }

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = fontUrl;
  link.id = id;
  document.head.appendChild(link);
}

/**
 * It loads the settings from localStorage and applies them to the page.
 * @param hotreload - boolean
 */
export function loadSettings(hotreload) {
  // Migrate old font settings to new widgetFont settings for backwards compatibility
  if (localStorage.getItem('font') && !localStorage.getItem('widgetFont')) {
    localStorage.setItem('widgetFont', localStorage.getItem('font'));
    localStorage.removeItem('font');
  }
  if (localStorage.getItem('fontweight') && !localStorage.getItem('widgetFontWeight')) {
    localStorage.setItem('widgetFontWeight', localStorage.getItem('fontweight'));
    localStorage.removeItem('fontweight');
  }
  if (localStorage.getItem('fontstyle') && !localStorage.getItem('widgetFontStyle')) {
    localStorage.setItem('widgetFontStyle', localStorage.getItem('fontstyle'));
    localStorage.removeItem('fontstyle');
  }

  switch (localStorage.getItem('theme')) {
    case 'dark':
      document.body.classList.add('dark');
      document.body.classList.remove('light');
      break;
    case 'auto':
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.body.classList.add('dark');
      } else {
        document.body.classList.remove('dark');
        document.body.classList.add('light');
      }
      break;
    default:
      document.body.classList.add('light');
      document.body.classList.remove('dark');
  }

  document.title = localStorage.getItem('tabName') || variables.getMessage('tabname');

  if (hotreload === true) {
    // remove old custom stuff and add new
    const custom = [
      'customcss',
      'customwidgetfont',
      'customsettingsfont',
      'customgreetingfont',
      'customclockfont',
      'customquotefont',
    ];
    custom.forEach((element) => {
      try {
        document.head.removeChild(document.getElementById(element));
      } catch (e) {}
    });
  }

  if (localStorage.getItem('animations') === 'false') {
    document.body.classList.add('no-animations');
  } else {
    document.body.classList.remove('no-animations');
  }

  // technically, this is text SHADOW, and not BORDER
  // however it's a mess and we'll just leave it at this for now
  const textBorder = localStorage.getItem('textBorder');
  // enable/disable old text border from before redesign
  if (textBorder === 'true') {
    const elements = ['greeting', 'clock', 'quote', 'quoteauthor', 'date'];
    elements.forEach((element) => {
      try {
        document.querySelector('.' + element).classList.add('textBorder');
      } catch (e) {}
    });
  } else {
    const elements = ['greeting', 'clock', 'quote', 'quoteauthor', 'date'];
    elements.forEach((element) => {
      try {
        document.querySelector('.' + element).classList.remove('textBorder');
      } catch (e) {}
    });
  }

  // remove actual default shadow
  if (textBorder === 'none') {
    document.getElementById('center').classList.add('no-textBorder');
  } else {
    document.getElementById('center').classList.remove('no-textBorder');
  }

  const css = localStorage.getItem('customcss');
  if (css) {
    document.head.insertAdjacentHTML('beforeend', '<style id="customcss">' + css + '</style>');
  }

  const widgetFont = localStorage.getItem('widgetFont');
  if (widgetFont) {
    const widgetFontWeight = localStorage.getItem('widgetFontWeight') || '400';
    const widgetFontStyle = localStorage.getItem('widgetFontStyle') || 'normal';

    loadGoogleFontAsync(widgetFont, 'customwidgetfont-link');

    const existingStyle = document.getElementById('customwidgetfont');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `
        <style id='customwidgetfont'>
          .greeting, .clock, .quote, .quoteauthor, .date, .weather, .navbar, #center {
            font-family: '${widgetFont}', 'Lexend Deca', 'Inter', sans-serif !important;
            font-weight: ${widgetFontWeight};
            font-style: ${widgetFontStyle};
          }
        </style>
      `,
    );
  }

  const settingsFont = localStorage.getItem('settingsFont');
  if (settingsFont) {
    const settingsFontWeight = localStorage.getItem('settingsFontWeight') || '400';
    const settingsFontStyle = localStorage.getItem('settingsFontStyle') || 'normal';

    loadGoogleFontAsync(settingsFont, 'customsettingsfont-link');

    const existingStyle = document.getElementById('customsettingsfont');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `
        <style id='customsettingsfont'>
          .modal-content, .settings, .preferences, .marketplace, .welcome {
            font-family: '${settingsFont}', 'Lexend Deca', 'Inter', sans-serif !important;
            font-weight: ${settingsFontWeight};
            font-style: ${settingsFontStyle};
          }
        </style>
      `,
    );
  }

  // Per-widget fonts (override global widget font)
  const greetingFont = localStorage.getItem('greetingFont');
  const greetingFontWeight = localStorage.getItem('greetingFontWeight');
  const greetingFontStyle = localStorage.getItem('greetingFontStyle');
  const greetingColor = localStorage.getItem('greetingColor');

  if (greetingFont || greetingFontWeight || greetingFontStyle || greetingColor) {
    if (greetingFont) {
      loadGoogleFontAsync(greetingFont, 'customgreetingfont-link');
    }

    let styleContent = '.greeting {';
    if (greetingFont) {
      styleContent += `font-family: '${greetingFont}', 'Lexend Deca', 'Inter', sans-serif !important;`;
    }
    if (greetingFontWeight) {
      styleContent += `font-weight: ${greetingFontWeight} !important;`;
    }
    if (greetingFontStyle) {
      styleContent += `font-style: ${greetingFontStyle} !important;`;
    }
    if (greetingColor) {
      styleContent += `color: ${greetingColor} !important;`;
    }
    styleContent += '}';

    const existingStyle = document.getElementById('customgreetingfont');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style id='customgreetingfont'>${styleContent}</style>`,
    );
  }

  const clockFont = localStorage.getItem('clockFont');
  const clockFontWeight = localStorage.getItem('clockFontWeight');
  const clockFontStyle = localStorage.getItem('clockFontStyle');
  const clockColor = localStorage.getItem('clockColor');

  if (clockFont || clockFontWeight || clockFontStyle || clockColor) {
    if (clockFont) {
      loadGoogleFontAsync(clockFont, 'customclockfont-link');
    }

    let styleContent = '.clock, .date {';
    if (clockFont) {
      styleContent += `font-family: '${clockFont}', 'Lexend Deca', 'Inter', sans-serif !important;`;
    }
    if (clockFontWeight) {
      styleContent += `font-weight: ${clockFontWeight} !important;`;
    }
    if (clockFontStyle) {
      styleContent += `font-style: ${clockFontStyle} !important;`;
    }
    if (clockColor) {
      styleContent += `color: ${clockColor} !important;`;
    }
    styleContent += '}';

    const existingStyle = document.getElementById('customclockfont');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style id='customclockfont'>${styleContent}</style>`,
    );
  }

  const quoteFont = localStorage.getItem('quoteFont');
  const quoteFontWeight = localStorage.getItem('quoteFontWeight');
  const quoteFontStyle = localStorage.getItem('quoteFontStyle');
  const quoteColor = localStorage.getItem('quoteColor');

  if (quoteFont || quoteFontWeight || quoteFontStyle || quoteColor) {
    if (quoteFont) {
      loadGoogleFontAsync(quoteFont, 'customquotefont-link');
    }

    let styleContent = '.quote, .quoteauthor {';
    if (quoteFont) {
      styleContent += `font-family: '${quoteFont}', 'Lexend Deca', 'Inter', sans-serif !important;`;
    }
    if (quoteFontWeight) {
      styleContent += `font-weight: ${quoteFontWeight} !important;`;
    }
    if (quoteFontStyle) {
      styleContent += `font-style: ${quoteFontStyle} !important;`;
    }
    if (quoteColor) {
      styleContent += `color: ${quoteColor} !important;`;
    }
    styleContent += '}';

    const existingStyle = document.getElementById('customquotefont');
    if (existingStyle) {
      existingStyle.remove();
    }

    document.head.insertAdjacentHTML(
      'beforeend',
      `<style id='customquotefont'>${styleContent}</style>`,
    );
  }

  // were not set, set them
  if (localStorage.getItem('applinks') === null) {
    localStorage.setItem('applinks', JSON.stringify([]));
  }
  if (localStorage.getItem('appsEnabled') === null) {
    localStorage.setItem('showWelcome', false);
  }

  // everything below this shouldn't run on a hot reload event
  if (hotreload === true) {
    return;
  }

  if (localStorage.getItem('experimental') === 'true') {
    ExperimentalInit();
  }

  // easter egg
  console.log(`
  █████████████████████████████████████████████████████████████
  ██                                                         ██
  ██               ███    ███ ██    ██ ███████               ██
  ██               ████  ████ ██    ██ ██                    ██
  ██               ██ ████ ██ ██    ██ █████                 ██
  ██               ██  ██  ██ ██    ██ ██                    ██
  ██               ██      ██  ██████  ███████               ██
  ██                                                         ██
  ██                                                         ██
  ██           Copyright 2018-${new Date().getFullYear()} The Mue Authors           ██
  ██           GitHub: https://github.com/mue/mue            ██
  ██                                                         ██
  ██               Thank you for using Mue!                  ██
  ██              Feedback: hello@muetab.com                 ██
  █████████████████████████████████████████████████████████████
  `);
}
