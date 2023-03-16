import variables from 'modules/variables';
import React, { PureComponent } from 'react';
import {
  MdCancel,
  MdAdd,
  MdSource,
  MdOutlineKeyboardArrowRight,
  MdOutlineFormatQuote,
} from 'react-icons/md';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import SettingsItem from '../SettingsItem';

import { toast } from 'react-toastify';
import EventBus from 'modules/helpers/eventbus';

export default class QuoteSettings extends PureComponent {
  constructor() {
    super();
    this.state = {
      quoteType: localStorage.getItem('quoteType') || 'api',
      customQuote: this.getCustom(),
      sourceSection: false,
    };
  }

  marketplaceType = () => {
    if (localStorage.getItem('quote_packs')) {
      return (
        <option value="quote_pack">{variables.getMessage('modals.main.navbar.marketplace')}</option>
      );
    }
  };

  resetCustom = () => {
    localStorage.setItem('customQuote', '[{"quote": "", "author": ""}]');
    this.setState({
      customQuote: [
        {
          quote: '',
          author: '',
        },
      ],
    });
    toast(variables.getMessage('toasts.reset'));
    EventBus.emit('refresh', 'background');
  };

  customQuote(e, text, index, type) {
    const result = text === true ? e.target.value : e.target.result;

    const customQuote = this.state.customQuote;
    customQuote[index][type] = result;
    this.setState({
      customQuote,
    });
    this.forceUpdate();

    localStorage.setItem('customQuote', JSON.stringify(customQuote));
    document.querySelector('.reminder-info').style.display = 'flex';
    localStorage.setItem('showReminder', true);
  }

  modifyCustomQuote(type, index) {
    const customQuote = this.state.customQuote;
    if (type === 'add') {
      customQuote.push({
        quote: '',
        author: '',
      });
    } else {
      customQuote.splice(index, 1);
    }

    this.setState({
      customQuote,
    });
    this.forceUpdate();

    localStorage.setItem('customQuote', JSON.stringify(customQuote));
  }

  getCustom() {
    let data = JSON.parse(localStorage.getItem('customQuote'));
    if (data === null) {
      data = [];
    }
    return data;
  }

  render() {
    let customSettings;
    if (this.state.quoteType === 'custom' && this.state.sourceSection === true) {
      customSettings = (
        <>
          <SettingsItem
            title={variables.getMessage('modals.main.settings.sections.quote.custom')}
            subtitle={variables.getMessage('modals.main.settings.sections.quote.custom_subtitle')}
            final={true}
          >
            <button onClick={() => this.modifyCustomQuote('add')}>
              {variables.getMessage('modals.main.settings.sections.quote.add')} <MdAdd />
            </button>
          </SettingsItem>

          {this.state.customQuote.length !== 0 ? (
            <div className="messagesContainer">
              {this.state.customQuote.map((_url, index) => (
                <div className="messageMap">
                  <div className="icon">
                    <MdOutlineFormatQuote />
                  </div>
                  <div className="messageText">
                    <TextareaAutosize
                      value={this.state.customQuote[index].quote}
                      placeholder={variables.getMessage(
                        'modals.main.settings.sections.quote.title',
                      )}
                      onChange={(e) => this.customQuote(e, true, index, 'quote')}
                      varient="outlined"
                      style={{ fontSize: '22px', fontWeight: 'bold' }}
                    />
                    <TextareaAutosize
                      value={this.state.customQuote[index].author}
                      placeholder={variables.getMessage(
                        'modals.main.settings.sections.quote.author',
                      )}
                      className="subtitle"
                      onChange={(e) => this.customQuote(e, true, index, 'author')}
                      varient="outlined"
                    />
                  </div>
                  <div>
                    <div className="messageAction">
                      <button
                        className="deleteButton"
                        onClick={() => this.modifyCustomQuote('remove', index)}
                        style={{}}
                      >
                        {variables.getMessage('modals.main.marketplace.product.buttons.remove')}
                        <MdCancel />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="photosEmpty">
              <div className="emptyNewMessage">
                <MdOutlineFormatQuote />
                <span className="title">
                  {variables.getMessage('modals.main.settings.sections.quote.no_quotes')}
                </span>
                <span className="subtitle">
                  {variables.getMessage('modals.main.settings.sections.message.add_some')}
                </span>
                <button onClick={() => this.modifyCustomQuote('add')}>
                  {variables.getMessage('modals.main.settings.sections.quote.add')} <MdAdd />
                </button>
              </div>
            </div>
          )}
        </>
      );
    } else {
      // api
      customSettings = <></>;
    }

    return (
      <>
        {this.state.sourceSection ? (
          <span className="mainTitle" onClick={() => this.setState({ sourceSection: false })}>
            <span className="backTitle">
              {variables.getMessage('modals.main.settings.sections.quote.title')}
            </span>
            <MdOutlineKeyboardArrowRight />{' '}
            {variables.getMessage('modals.main.settings.sections.background.source.title')}
          </span>
        ) : (
          <Header
            title={variables.getMessage('modals.main.settings.sections.quote.title')}
            setting="quote"
            category="quote"
            element=".quotediv"
            zoomSetting="zoomQuote"
            switch={true}
          />
        )}
        <div className="moreSettings" onClick={() => this.setState({ sourceSection: true })}>
          <div className="left">
            <MdSource />
            <div className="content">
              <span className="title">
                {variables.getMessage('modals.main.settings.sections.background.source.title')}
              </span>
              <span className="subtitle">
                {variables.getMessage('modals.main.settings.sections.quote.source_subtitle')}
              </span>
            </div>
          </div>
          <div className="action">
            <Dropdown
              name="quoteType"
              label={variables.getMessage('modals.main.settings.sections.background.type.title')}
              onChange={(value) => this.setState({ quoteType: value })}
              category="quote"
            >
              {this.marketplaceType()}
              <option value="api">
                {variables.getMessage('modals.main.settings.sections.background.type.api')}
              </option>
              <option value="custom">
                {variables.getMessage('modals.main.settings.sections.quote.custom')}
              </option>
            </Dropdown>
          </div>
        </div>
        {!this.state.sourceSection ? (
          <>
            <SettingsItem
              title={variables.getMessage('modals.main.settings.sections.quote.buttons.title')}
              subtitle={variables.getMessage(
                'modals.main.settings.sections.quote.buttons.subtitle',
              )}
            >
              <Checkbox
                name="copyButton"
                text={variables.getMessage('modals.main.settings.sections.quote.buttons.copy')}
                category="quote"
              />
              <Checkbox
                name="quoteShareButton"
                text={variables.getMessage('widgets.quote.share')}
                category="quote"
              />
              <Checkbox
                name="favouriteQuoteEnabled"
                text={variables.getMessage('modals.main.settings.sections.quote.buttons.favourite')}
                category="quote"
              />
            </SettingsItem>

            <SettingsItem
              title={variables.getMessage('modals.main.settings.additional_settings')}
              subtitle={variables.getMessage('modals.main.settings.sections.quote.additional')}
              final={true}
            >
              {/*<Dropdown
                label={variables.getMessage(
                  'modals.main.settings.sections.background.interval.title',
                )}
                name="quotechange"
                name2="quoteStartTime"
                value2={Date.now()}
              >
                <option value="refresh">{variables.getMessage('tabname')}</option>
                <option value={10000}>10 seconds</option>
                <option value={60000}>
                  {variables.getMessage('modals.main.settings.sections.background.interval.minute')}
                </option>
                <option value={1800000}>
                  {variables.getMessage(
                    'modals.main.settings.sections.background.interval.half_hour',
                  )}
                </option>
                <option value={3600000}>
                  {variables.getMessage('modals.main.settings.sections.background.interval.hour')}
                </option>
                <option value={86400000}>
                  {variables.getMessage('modals.main.settings.sections.background.interval.day')}
                </option>
                <option value={604800000}>{variables.getMessage('widgets.date.week')}</option>
                <option value={2628000000}>
                  {variables.getMessage('modals.main.settings.sections.background.interval.month')}
                </option>
                  </Dropdown>*/}
              <Checkbox
                name="authorLink"
                text={variables.getMessage('modals.main.settings.sections.quote.author_link')}
                element=".other"
              />
              <Checkbox
                name="authorImg"
                text={variables.getMessage('modals.main.settings.sections.quote.author_img')}
                element=".other"
              />
            </SettingsItem>
          </>
        ) : null}
        {customSettings}
      </>
    );
  }
}
