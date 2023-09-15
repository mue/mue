/* eslint-disable no-unused-expressions */
// todo: rewrite this mess
import variables from 'modules/variables';
import { PureComponent } from 'react';

import PhotoInformation from './PhotoInformation';

import EventBus from 'modules/helpers/eventbus';
import {
  videoCheck,
  offlineBackground,
  getGradient,
  randomColourStyleBuilder,
} from 'modules/helpers/background/widget';

import './scss/index.scss';
import { decodeBlurHash } from 'fast-blurhash';
import { supportsAVIF } from 'modules/helpers/background/avif';

export default class Background extends PureComponent {
  constructor() {
    super();
    this.state = {
      blob: null,
      style: '',
      url: '',
      currentAPI: '',
      firstTime: false,
      photoInfo: {
        hidden: false,
        offline: false,
        photographerURL: '',
        photoURL: '',
      },
    };
  }

  async setBackground() {
    // clean up the previous image to prevent a memory leak
    if (this.blob) {
      URL.revokeObjectURL(this.blob);
    }

    const backgroundImage = document.getElementById('backgroundImage');

    if (this.state.url !== '') {
      let url = this.state.url;
      if (
        localStorage.getItem('ddgProxy') === 'true' &&
        this.state.photoInfo.offline !== true &&
        !this.state.url.startsWith('data:')
      ) {
        url = variables.constants.DDG_IMAGE_PROXY + this.state.url;
      }

      const photoInformation = document.querySelector('.photoInformation');

      // just set the background
      if (localStorage.getItem('bgtransition') === 'false') {
        photoInformation?.[(photoInformation.style.display = 'flex')];
        return (backgroundImage.style.background = `url(${url})`);
      }

      backgroundImage.style.background = null;

      if (this.state.photoInfo.blur_hash) {
        backgroundImage.style.backgroundColor = this.state.photoInfo.colour;
        backgroundImage.classList.add('fade-in');
        const canvas = document.createElement('canvas');
        canvas.width = 32;
        canvas.height = 32;
        const ctx = canvas.getContext('2d');
        const imageData = ctx.createImageData(32, 32);
        imageData.data.set(decodeBlurHash(this.state.photoInfo.blur_hash, 32, 32));
        ctx.putImageData(imageData, 0, 0);
        backgroundImage.style.backgroundImage = `url(${canvas.toDataURL()})`;
      }

      this.blob = URL.createObjectURL(await (await fetch(url)).blob());
      backgroundImage.classList.add('backgroundTransform');
      backgroundImage.style.backgroundImage = `url(${this.blob})`;
    } else {
      // custom colour
      backgroundImage.setAttribute('style', this.state.style);
    }
  }

  async getAPIImageData(currentPun) {
    let apiCategories;

    try {
      apiCategories = JSON.parse(localStorage.getItem('apiCategories'));
    } catch (error) {
      apiCategories = localStorage.getItem('apiCategories');
    }

    const backgroundAPI = localStorage.getItem('backgroundAPI');
    const apiQuality = localStorage.getItem('apiQuality');
    let backgroundExclude = JSON.parse(localStorage.getItem('backgroundExclude'));
    if (!Array.isArray(backgroundExclude)) {
      backgroundExclude = [];
    }
    if (currentPun) {
      backgroundExclude.push(currentPun);
    }

    let requestURL, data;
    switch (backgroundAPI) {
      case 'unsplash':
      case 'pexels':
        requestURL = `${variables.constants.API_URL}/images/unsplash?categories=${apiCategories}&quality=${apiQuality}`;
        break;
      // Defaults to Mue
      default:
        requestURL = `${variables.constants.API_URL}/images/random?categories=${apiCategories}&quality=${apiQuality}&excludes=${backgroundExclude}`;
        break;
    }

    const accept = 'application/json, ' + ((await supportsAVIF()) ? 'image/avif' : 'image/webp');
    try {
      data = await (await fetch(requestURL, { headers: { accept } })).json();
    } catch (e) {
      // if requesting to the API fails, we get an offline image
      this.setState(offlineBackground('api'));
      return null;
    }

    let photoURL, photographerURL;

    if (backgroundAPI === 'unsplash') {
      photoURL = data.photo_page;
      photographerURL = data.photographer_page;
    }

    return {
      url: data.file,
      type: 'api',
      currentAPI: backgroundAPI,
      photoInfo: {
        hidden: false,
        category: data.category,
        credit: data.photographer,
        location: data.location.name,
        camera: data.camera,
        url: data.file,
        photographerURL,
        photoURL,
        latitude: data.location.latitude || null,
        longitude: data.location.longitude || null,
        views: data.views || null,
        downloads: data.downloads || null,
        likes: data.likes || null,
        description: data.description || null,
        colour: data.colour,
        blur_hash: data.blur_hash,
        pun: data.pun || null,
      },
    };
  }

  // Main background getting function
  async getBackground() {
    let offline = localStorage.getItem('offlineMode') === 'true';
    if (localStorage.getItem('showWelcome') === 'true') {
      offline = true;
    }

    const setFavourited = ({ type, url, credit, location, camera, pun, offline }) => {
      if (type === 'random_colour' || type === 'random_gradient') {
        return this.setState({
          type: 'colour',
          style: `background:${url}`,
        });
      }
      this.setState({
        url,
        photoInfo: {
          credit,
          location,
          camera,
          pun,
          offline,
          url,
        },
      });
    };

    const favourited = JSON.parse(localStorage.getItem('favourite'));
    if (favourited) {
      return setFavourited(favourited);
    }

    const type = localStorage.getItem('backgroundType');
    switch (type) {
      case 'api':
        if (offline) {
          return this.setState(offlineBackground('api'));
        }

        // API background
        let data = JSON.parse(localStorage.getItem('nextImage')) || (await this.getAPIImageData());
        localStorage.setItem('nextImage', null);
        if (data) {
          this.setState(data);
          localStorage.setItem('currentBackground', JSON.stringify(data));
          localStorage.setItem(
            'nextImage',
            JSON.stringify(await this.getAPIImageData(data.photoInfo.pun)),
          ); // pre-fetch data about the next image
        }
        break;

      case 'colour':
        const gradient = getGradient();
        if (gradient) {
          this.setState(gradient);
        }
        break;

      case 'random_colour':
      case 'random_gradient':
        this.setState(randomColourStyleBuilder(type));
        break;
      case 'custom':
        let customBackground = [];
        const customSaved = localStorage.getItem('customBackground');
        try {
          customBackground = JSON.parse(customSaved);
        } catch (e) {
          if (customSaved !== '') {
            // move to new format
            customBackground = [customSaved];
          }
          localStorage.setItem('customBackground', JSON.stringify(customBackground));
        }

        // pick random
        customBackground = customBackground[Math.floor(Math.random() * customBackground.length)];

        // allow users to use offline images
        if (offline && !customBackground.startsWith('data:')) {
          return this.setState(offlineBackground('custom'));
        }

        if (
          customBackground !== '' &&
          customBackground !== 'undefined' &&
          customBackground !== undefined
        ) {
          const object = {
            url: customBackground,
            type: 'custom',
            video: videoCheck(customBackground),
            photoInfo: {
              hidden: true,
            },
          };

          this.setState(object);

          localStorage.setItem('currentBackground', JSON.stringify(object));
        }
        break;

      case 'photo_pack':
        if (offline) {
          return this.setState(offlineBackground('photo_pack'));
        }

        const photofavourited = JSON.parse(localStorage.getItem('favourite'));
        if (photofavourited) {
          return setFavourited(photofavourited);
        }

        const photoPack = [];
        const installed = JSON.parse(localStorage.getItem('installed'));
        installed.forEach((item) => {
          if (item.type === 'photos') {
            photoPack.push(...item.photos);
          }
        });
        if (photoPack) {
          const randomNumber = Math.floor(Math.random() * photoPack.length);
          const randomPhoto = photoPack[randomNumber];
          if (
            (localStorage.getItem('backgroundchange') === 'refresh' &&
              this.state.firstTime === true) ||
            (localStorage.getItem('backgroundchange') === null && this.state.firstTime === true)
          ) {
            if (this.state.firstTime !== true) {
              localStorage.setItem('marketplaceNumber', randomNumber);
              this.setState({
                firstTime: false,
                url: randomPhoto.url.default,
                type: 'photo_pack',
                photoInfo: {
                  hidden: false,
                  credit: randomPhoto.photographer,
                  location: randomPhoto.location,
                },
              });
            }
          } else {
            if (
              Number(
                Number(localStorage.getItem('backgroundStartTime')) +
                  Number(localStorage.getItem('backgroundchange')) >=
                  Number(Date.now()),
              )
            ) {
              const randomPhoto = photoPack[localStorage.getItem('marketplaceNumber')];
              if (this.state.firstTime !== true) {
                this.setState({
                  url: randomPhoto.url.default,
                  type: 'photo_pack',
                  photoInfo: {
                    hidden: false,
                    credit: randomPhoto.photographer,
                    location: randomPhoto.location,
                  },
                });
              } else {
                this.setState({ firstTime: true });
              }
              this.setState({ firstTime: true });
            } else {
              localStorage.setItem('marketplaceNumber', randomNumber);
              return this.setState({
                url: randomPhoto.url.default,
                type: 'photo_pack',
                photoInfo: {
                  hidden: false,
                  credit: randomPhoto.photographer,
                  location: randomPhoto.location,
                },
              });
            }
          }
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
          hidden: true,
        },
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
            return (document.getElementById('backgroundVideo').style.display = 'none');
          } else {
            return (element.style.display = 'none');
          }
        }

        // video backgrounds
        if (this.state.video === true) {
          document.getElementById('backgroundVideo').style.display = 'block';
        } else {
          if (this.state.photoInfo.hidden === false) {
            try {
              document.querySelector('.photoInformation').style.display = 'flex';
            } catch (e) {
              // Disregard exception
            }
          }

          element.style.display = 'block';
        }

        const backgroundType = localStorage.getItem('backgroundType');

        if (this.state.photoInfo.offline !== true) {
          // basically check to make sure something has changed before we try getting another background
          if (
            backgroundType !== this.state.type ||
            (this.state.type === 'api' &&
              localStorage.getItem('backgroundAPI') !== this.state.currentAPI) ||
            (this.state.type === 'custom' &&
              localStorage.getItem('customBackground') !== this.state.url) ||
            JSON.parse(localStorage.getItem('backgroundExclude')).includes(this.state.photoInfo.pun)
          ) {
            return refresh();
          }
        } else if (backgroundType !== this.state.type) {
          return refresh();
        }

        // background effects so we don't get another image again
        const backgroundFilterSetting = localStorage.getItem('backgroundFilter');
        const backgroundFilter = backgroundFilterSetting && backgroundFilterSetting !== 'none';

        if (this.state.video === true) {
          document.getElementById(
            'backgroundVideo',
          ).style.webkitFilter = `blur(${localStorage.getItem(
            'blur',
          )}px) brightness(${localStorage.getItem('brightness')}%) ${
            backgroundFilter
              ? backgroundFilterSetting +
                '(' +
                localStorage.getItem('backgroundFilterAmount') +
                '%)'
              : ''
          }`;
        } else {
          element.style.webkitFilter = `blur(${localStorage.getItem(
            'blur',
          )}px) brightness(${localStorage.getItem('brightness')}%) ${
            backgroundFilter
              ? backgroundFilterSetting +
                '(' +
                localStorage.getItem('backgroundFilterAmount') +
                '%)'
              : ''
          }`;
        }
      }

      // uninstall photo pack reverts your background to what you had previously
      if (
        data === 'marketplacebackgrounduninstall' ||
        data === 'backgroundwelcome' ||
        data === 'backgroundrefresh'
      ) {
        refresh();
      }
    });

    if (localStorage.getItem('welcomeTab')) {
      return this.setState(JSON.parse(localStorage.getItem('welcomeImage')));
    }

    if (
      localStorage.getItem('backgroundchange') === 'refresh' ||
      localStorage.getItem('backgroundchange') === null
    ) {
      try {
        document.getElementById('backgroundImage').classList.remove('fade-in');
        document.getElementsByClassName('photoInformation')[0].classList.remove('fade-in');
      } catch (e) {
        // Disregard exception
      }
      this.getBackground();
      localStorage.setItem('backgroundStartTime', Date.now());
    }

    const test = localStorage.getItem('backgroundchange');

    this.interval = setInterval(() => {
      const targetTime = Number(Number(localStorage.getItem('backgroundStartTime')) + Number(test));
      const currentTime = Number(Date.now());
      const type = localStorage.getItem('backgroundType');

      if (test !== null && test !== 'refresh') {
        if (currentTime >= targetTime) {
          element.classList.remove('fade-in');
          this.getBackground();
          localStorage.setItem('backgroundStartTime', Date.now());
        } else {
          try {
            const current = JSON.parse(localStorage.getItem('currentBackground'));
            if (current.type !== type) {
              this.getBackground();
            }
            const offline = localStorage.getItem('offlineMode');
            if (current.url.startsWith('http') && offline === 'false') {
              if (this.state.firstTime !== true) {
                this.setState(current);
              }
            } else if (current.url.startsWith('http')) {
              this.setState(offlineBackground());
            }
            if (this.state.firstTime !== true) {
              this.setState(current);
            }
            this.setState({ firstTime: true });
          } catch (e) {
            this.setBackground();
          }
        }
      }
    });
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
    clearInterval(this.interval);
  }

  render() {
    if (this.state.video === true) {
      const enabled = (setting) => {
        return localStorage.getItem(setting) === 'true';
      };

      return (
        <video
          autoPlay
          muted={enabled('backgroundVideoMute')}
          loop={enabled('backgroundVideoLoop')}
          style={{
            WebkitFilter: `blur(${localStorage.getItem(
              'blur',
            )}px) brightness(${localStorage.getItem('brightness')}%)`,
          }}
          id="backgroundVideo"
        >
          <source src={this.state.url} />
        </video>
      );
    }

    const backgroundFilter = localStorage.getItem('backgroundFilter');

    return (
      <>
        <div
          style={{
            WebkitFilter: `blur(${localStorage.getItem(
              'blur',
            )}px) brightness(${localStorage.getItem('brightness')}%) ${
              backgroundFilter && backgroundFilter !== 'none'
                ? backgroundFilter + '(' + localStorage.getItem('backgroundFilterAmount') + '%)'
                : ''
            }`,
          }}
          id="backgroundImage"
        />
        {this.state.photoInfo.credit !== '' ? (
          <PhotoInformation
            info={this.state.photoInfo}
            api={this.state.currentAPI}
            url={this.state.url}
          />
        ) : null}
      </>
    );
  }
}
