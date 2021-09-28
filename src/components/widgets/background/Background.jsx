// todo: rewrite this mess
import { PureComponent } from 'react';

import PhotoInformation from './PhotoInformation';

import EventBus from 'modules/helpers/eventbus';
import Interval from 'modules/helpers/interval';
import { videoCheck, offlineBackground, gradientStyleBuilder, randomColourStyleBuilder } from 'modules/helpers/background/widget';

import './scss/index.scss';

export default class Background extends PureComponent {
  constructor() {
    super();
    this.state = {
      style: '',
      url: '',
      currentAPI: '',
      photoInfo: {
        hidden: false,
        offline: false,
        photographerURL: '',
        photoURL: ''
      }
    };
  }

  setBackground() {
    const backgroundImage = document.getElementById('backgroundImage');

    if (this.state.url !== '') {
      const url = (localStorage.getItem('ddgProxy') === 'true' && this.state.photoInfo.offline !== true && !this.state.url.startsWith('data:')) ? variables.constants.DDG_IMAGE_PROXY + this.state.url : this.state.url;
      const photoInformation = document.querySelector('.photoInformation');

      // just set the background
      if (localStorage.getItem('bgtransition') === 'false') {
        if (photoInformation) {
          photoInformation.style.display = 'block';
        }
        backgroundImage.style.background = null;
        return backgroundImage.style.background = `url(${url})`;
      }

      // firstly we set the background as hidden and make sure there is no background set currently
      backgroundImage.classList.add('backgroundPreload');
      backgroundImage.style.background = null;

      // same with photo information if not using custom background
      if (photoInformation) {
        photoInformation.classList.add('backgroundPreload');
      }

      // preloader for background transition, required so it loads in nice
      const preloader = document.createElement('img');
      preloader.src = url;

      // once image has loaded, add the fade-in transition
      preloader.addEventListener('load', () => {
        backgroundImage.classList.remove('backgroundPreload');
        backgroundImage.classList.add('fade-in');

        backgroundImage.style.background = `url(${url})`;
        // remove the preloader element we created earlier
        preloader.remove();

        if (photoInformation) {
          photoInformation.classList.remove('backgroundPreload');
          photoInformation.classList.add('fade-in');
        }
      });
    } else {
      // custom colour
      backgroundImage.setAttribute('style', this.state.style);
    }
  }

  // Main background getting function
  async getBackground() {
    let offline = (localStorage.getItem('offlineMode') === 'true');
    if (localStorage.getItem('showWelcome') === 'true') {
      offline = true;
    }

    const setFavourited = (favourited) => {
      this.setState({
        url: favourited.url,
        photoInfo: {
          credit: favourited.credit,
          location: favourited.location,
          camera: favourited.camera
        }
      });
    }

    const type = localStorage.getItem('backgroundType');
    switch (type) {
      case 'api':
        if (offline) {
          return this.setState(offlineBackground());
        }

        const favourited = JSON.parse(localStorage.getItem('favourite'));
        if (favourited) {
          return setFavourited(favourited);
        }

        // API background
        const backgroundAPI = localStorage.getItem('backgroundAPI');
        const apiCategory = localStorage.getItem('apiCategory');
        const apiQuality = localStorage.getItem('apiQuality');
        const photoMap = localStorage.getItem('photoMap');

        let requestURL, data;
        switch (backgroundAPI) {
          case 'unsplash':
            requestURL = `${variables.constants.PROXY_URL}/images/unsplash?quality=${apiQuality}&map=${(photoMap === 'true')}`;
            break;
          case 'pexels':
            requestURL = `${variables.constants.PROXY_URL}/images/pexels?quality=${apiQuality}`;
            break;
          // Defaults to Mue
          default:
            requestURL = `${variables.constants.API_URL}/images/random?category=${apiCategory}&quality=${apiQuality}`;
            break;
        }

        try {
          data = await (await fetch(requestURL)).json();
        } catch (e) {
          // if requesting to the API fails, we get an offline image
          return this.setState(offlineBackground());
        }

        let credit = data.photographer;
        let photoURL, photographerURL;

        if (backgroundAPI === 'unsplash') {
          photoURL = data.photo_page;
          photographerURL = data.photographer_page;
        } else if (backgroundAPI === 'pexels') {
          photoURL = data.photo_page;
          photographerURL = data.photographer_page;
        }

        const object = {
          url: data.file,
          type: 'api',
          currentAPI: backgroundAPI,
          photoInfo: {
            hidden: false,
            credit: credit,
            location: data.location,
            camera: data.camera,
            url: data.file,
            photographerURL: photographerURL,
            photoURL: photoURL,
            latitude: data.latitude || null,
            longitude: data.longitude || null,
            // location map token from mapbox
            maptoken: data.maptoken || null
          }
        };

        this.setState(object);

        localStorage.setItem('currentBackground', JSON.stringify(object));
      break;

      case 'colour':
        const customBackgroundColour = localStorage.getItem('customBackgroundColour') || {'angle':'180','gradient':[{'colour':'#ffb032','stop':0}],'type':'linear'};

        let gradientSettings = '';
        try {
          gradientSettings = JSON.parse(customBackgroundColour);
        } catch (e) {
          const hexColorRegex = /#[0-9a-fA-F]{6}/s;
          if (hexColorRegex.exec(customBackgroundColour)) {
            // Colour use to be simply a hex colour or a NULL value before it was a JSON object. This automatically upgrades the hex colour value to the new standard. (NULL would not trigger an exception)
            gradientSettings = { 'type': 'linear', 'angle': '180', 'gradient': [{ 'colour': customBackgroundColour, 'stop': 0 }] };
            localStorage.setItem('customBackgroundColour', JSON.stringify(gradientSettings));
          }
        }

        if (typeof gradientSettings === 'object' && gradientSettings !== null) {
          return this.setState(gradientStyleBuilder(gradientSettings));
        }
      break;

      case 'random_colour':
      case 'random_gradient':
        this.setState(randomColourStyleBuilder(type));
      break;

      case 'custom':
        let customBackground;
        try {
          customBackground = JSON.parse(localStorage.getItem('customBackground'));
        } catch (e) {
          // move to new format
          customBackground = [localStorage.getItem('customBackground')];
          localStorage.setItem('customBackground', JSON.stringify(customBackground));
        }

        // pick random
        customBackground = customBackground[Math.floor(Math.random() * customBackground.length)];

        // allow users to use offline images
        if (offline && !customBackground.startsWith('data:')) {
          return this.setState(offlineBackground());
        }

        if (customBackground !== '' && customBackground !== 'undefined' && customBackground !== ['']) {
          const object = {
            url: customBackground,
            type: 'custom',
            video: videoCheck(customBackground),
            photoInfo: {
              hidden: true
            }
          };

          this.setState(object);

          localStorage.setItem('currentBackground', JSON.stringify(object));
        }
      break;

      case 'photo_pack':
        if (offline) {
          return this.setState(offlineBackground());
        }

        const photofavourited = JSON.parse(localStorage.getItem('favourite'));
        if (photofavourited) {
          return setFavourited(photofavourited);
        }

        const photoPack = JSON.parse(localStorage.getItem('photo_packs'));
        if (photoPack) {
          const randomPhoto = photoPack[Math.floor(Math.random() * photoPack.length)];
          return this.setState({
            url: randomPhoto.url.default,
            type: 'photo_pack',
            photoInfo: {
              hidden: false,
              credit: randomPhoto.photographer,
              location: randomPhoto.location || 'N/A'
            }
          });
        }
      break;
      default:
        break;
    }
  }

  componentDidMount() {
    const element = document.getElementById('backgroundImage');

    // this resets it so the fade in and getting background all works properly
    const refresh = () => {
      element.classList.remove('fade-in');
      this.setState({
        url: '',
        style: '',
        type: '',
        video: false,
        photoInfo: {
          hidden: true
        }
      });
      this.getBackground();
    };

    EventBus.on('refresh', (data) => {
      if (data === 'welcomeLanguage') {
        localStorage.setItem('welcomeImage', JSON.stringify(this.state));
      }

      if (data === 'background') {
        if (localStorage.getItem('background') === 'false') {
          // user is using custom colour or image
          if (this.state.photoInfo.hidden === false) {
            document.querySelector('.photoInformation').style.display = 'none';
          }

          // video backgrounds
          if (this.state.video === true) {
            return document.getElementById('backgroundVideo').style.display = 'none';
          } else {
            return element.style.display = 'none';
          }
        }

        // video backgrounds
        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.display = 'block';
        } else {
          if (this.state.photoInfo.hidden === false) {
            try {
              document.querySelector('.photoInformation').style.display = 'block';
            } catch (e) {
              // Disregard exception
            }
          }

          element.style.display = 'block';
        }

        const backgroundType = localStorage.getItem('backgroundType');

        if (this.state.photoInfo.offline !== true) {
          // basically check to make sure something has changed before we try getting another background
          if (backgroundType !== this.state.type || (this.state.type === 'api' && localStorage.getItem('backgroundAPI') !== this.state.currentAPI) || (this.state.type === 'custom' && localStorage.getItem('customBackground') !== this.state.url)) {
            return refresh();
          }
        } else {
          if (backgroundType !== this.state.type) {
            return refresh();
          }
        }

        // background effects so we don't get another image again
        const backgroundFilter = localStorage.getItem('backgroundFilter');

        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.webkitFilter = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%) ${backgroundFilter ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)' : ''}`;
        } else {
          element.style.webkitFilter = `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%) ${backgroundFilter ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)' : ''}`;
        }
      }

      // uninstall photo pack reverts your background to what you had previously
      if (data === 'marketplacebackgrounduninstall' || data === 'backgroundwelcome' || data === 'backgroundrefresh') {
        refresh();
      }
    });

    if (localStorage.getItem('welcomeTab')) {
      return this.setState(JSON.parse(localStorage.getItem('welcomeImage')));
    }

    const interval = localStorage.getItem('backgroundchange');
    if (interval && interval !== 'refresh') {
      const type = localStorage.getItem('backgroundType')
      if (type === 'api' || type === 'custom') {
        Interval(() => {
          try {
            document.getElementById('backgroundImage').classList.remove('fade-in');
            document.getElementsByClassName('photoInformation')[0].classList.remove('fade-in');
          } catch (e) {
            // Disregard exception
          }
          this.getBackground();
        }, Number(interval), 'background');
  
        try {
          // todo: refactor this mess
          const current = JSON.parse(localStorage.getItem('currentBackground'));
          if (current.type !== type) {
            this.getBackground();
          }
          const offline = localStorage.getItem('offlineMode');
          if (current.url.startsWith('http') && offline === 'false') {
            this.setState(current);
          } else if (current.url.startsWith('http')) {
            this.setState(offlineBackground());
          } else {
            if (offline === 'false') {
              localStorage.removeItem('currentBackground');
              return this.getBackground();
            }
            this.setState(current);
          }
        } catch (e) {
          this.setBackground();
        }
      }
    } else {
      this.getBackground();
    }
  }

  // only set once we've got the info
  componentDidUpdate() {
    if (this.state.video === true) {
      return;
    }

    this.setBackground();
  }

  componentWillUnmount() {
    EventBus.off('refresh');
  }

  render() {
    if (this.state.video === true) {
      const enabled = (setting) => {
        return (localStorage.getItem(setting) === 'true');
      };

      return (
        <video autoPlay muted={enabled('backgroundVideoMute')} loop={enabled('backgroundVideoLoop')} style={{ WebkitFilter: `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%)` }} id='backgroundVideo'>
          <source src={this.state.url}/>
        </video>
      );
    }

    const backgroundFilter = localStorage.getItem('backgroundFilter');

    return (
      <>
        <div style={{ WebkitFilter: `blur(${localStorage.getItem('blur')}px) brightness(${localStorage.getItem('brightness')}%) ${backgroundFilter ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)' : ''}` }} id='backgroundImage'/>
        {(this.state.photoInfo.credit !== '') ?
          <PhotoInformation info={this.state.photoInfo} api={this.state.currentAPI} url={this.state.url}/>
        : null}
      </>
    );
  }
}
