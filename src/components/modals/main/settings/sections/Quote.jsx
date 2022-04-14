import variables from 'modules/variables';
import React, { PureComponent } from 'react';
import { MdCancel, MdAdd } from 'react-icons/md';
import { TextField } from '@mui/material';
import TextareaAutosize from '@mui/material/TextareaAutosize';

import Header from '../Header';
import Checkbox from '../Checkbox';
import Dropdown from '../Dropdown';
import SettingsItem from '../SettingsItem';

import { toast } from 'react-toastify';
import EventBus from 'modules/helpers/eventbus';

export default class QuoteSettings extends PureComponent {
  getMessage = (text) => variables.language.getMessage(variables.languagecode, text);

  constructor() {
    super();
    this.state = {
      quoteType: localStorage.getItem('quoteType') || 'api',
      customQuote: this.getCustom(),
    };
  }

  marketplaceType = () => {
    if (localStorage.getItem('quote_packs')) {
      return (
        <option value="quote_pack">{this.getMessage('modals.main.navbar.marketplace')}</option>
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
    toast(this.getMessage('toasts.reset'));
    EventBus.dispatch('refresh', 'background');
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
      data = [
        {
          quote: localStorage.getItem('customQuote') || '',
          author: localStorage.getItem('customQuoteAuthor') || '',
        },
      ];
    }
    return data;
  }

  render() {
    let customSettings;
    if (this.state.quoteType === 'custom') {
      customSettings = (
        <>
          <SettingsItem
            title={this.getMessage('modals.main.settings.sections.quote.custom')}
            subtitle="subtitle"
          >
            <button onClick={() => this.modifyCustomQuote('add')}>
              {this.getMessage('modals.main.settings.sections.quote.add')} <MdAdd />
            </button>
          </SettingsItem>
          <table style={{ width: '100%' }}>
            <tr>
              <th>Quote</th>
              <th>Author</th>
              <th>Buttons</th>
            </tr>
            {this.state.customQuote.map((_url, index) => (
              <tr>
                <th>
                  <TextareaAutosize
                    value={this.state.customQuote[index].quote}
                    placeholder="Quote"
                    onChange={(e) => this.customQuote(e, true, index, 'quote')}
                    varient="outlined"
                    style={{ marginRight: '10px' }}
                  />
                </th>
                <th>
                  <TextareaAutosize
                    value={this.state.customQuote[index].author}
                    placeholder="Author"
                    onChange={(e) => this.customQuote(e, true, index, 'author')}
                    varient="outlined"
                  />
                </th>
                <th>
                  {this.state.customQuote.length > 1 ? (
                    <button
                      className="deleteButton"
                      onClick={() => this.modifyCustomQuote('remove', index)}
                      style={{}}
                    >
                      <MdCancel />
                    </button>
                  ) : null}
                </th>
              </tr>
            ))}
          </table>
        </>
      );
    } else {
      // api
      customSettings = (
        <SettingsItem title="Additional Options">
          <Dropdown
            label={this.getMessage('modals.main.settings.sections.background.interval.title')}
            name="quotechange"
          >
            <option value="refresh">{this.getMessage('tabname')}</option>
            <option value="60000">
              {this.getMessage('modals.main.settings.sections.background.interval.minute')}
            </option>
            <option value="1800000">
              {this.getMessage('modals.main.settings.sections.background.interval.half_hour')}
            </option>
            <option value="3600000">
              {this.getMessage('modals.main.settings.sections.background.interval.hour')}
            </option>
            <option value="86400000">
              {this.getMessage('modals.main.settings.sections.background.interval.day')}
            </option>
            <option value="604800000">{this.getMessage('widgets.date.week')}</option>
            <option value="2628000000">
              {this.getMessage('modals.main.settings.sections.background.interval.month')}
            </option>
          </Dropdown>
        </SettingsItem>
      );
    }

    return (
      <>
        <Header
          title={this.getMessage('modals.main.settings.sections.quote.title')}
          setting="quote"
          category="quote"
          element=".quotediv"
          zoomSetting="zoomQuote"
          switch={true}
        />
        <SettingsItem
          title={this.getMessage('modals.main.settings.sections.quote.buttons.title')}
          subtitle="subtitle"
        >
          <Checkbox
            name="copyButton"
            text={this.getMessage('modals.main.settings.sections.quote.buttons.copy')}
            category="quote"
          />
          <Checkbox
            name="quoteShareButton"
            text={this.getMessage('modals.main.settings.sections.quote.buttons.tweet')}
            category="quote"
          />
          <Checkbox
            name="favouriteQuoteEnabled"
            text={this.getMessage('modals.main.settings.sections.quote.buttons.favourite')}
            category="quote"
          />
          <Checkbox
            name="authorLink"
            text={this.getMessage('modals.main.settings.sections.quote.author_link')}
            element=".other"
          />
        </SettingsItem>
        <SettingsItem
          title={this.getMessage('modals.main.settings.sections.background.type.title')}
          subtitle="subtitle"
        >
          <Checkbox name="quoteModern" text="Use modern style" />
        </SettingsItem>
        <SettingsItem
          title="Source"
          subtitle="Choose the source of the quotes, pick between the following options"
        >
          <Dropdown
            name="quoteType"
            onChange={(value) => this.setState({ quoteType: value })}
            category="quote"
          >
            {this.marketplaceType()}
            <option value="api">
              {this.getMessage('modals.main.settings.sections.background.type.api')}
            </option>
            <option value="custom">
              {this.getMessage('modals.main.settings.sections.quote.custom')}
            </option>
          </Dropdown>
        </SettingsItem>
        {customSettings}
      </>
    );
  }
}
