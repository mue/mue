import { PureComponent } from 'react';

import EventBus from '../../../../modules/helpers/eventbus';

export default class Dropdown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: localStorage.getItem(this.props.name) || '',
      title: ''
    };
  }

  getLabel() {
    return this.props.label ? <label>{this.props.label}</label> : null;
  }

  onChange = (e) => {
    const { value } = e.target;

    if (value === window.language.modals.main.loading) {
      return;
    }

    window.stats.postEvent('setting', `${this.props.name} from ${this.state.value} to ${value}`);

    this.setState({
      value,
      title: e.target[e.target.selectedIndex].text
    });
  
    localStorage.setItem(this.props.name, value);
  
    if (this.props.onChange) {
      this.props.onChange(value);
    }

    if (this.props.element) {
      if (!document.querySelector(this.props.element)) {
        document.querySelector('.reminder-info').style.display = 'block';
        return localStorage.setItem('showReminder', true);
      }
    }

    EventBus.dispatch('refresh', this.props.category);
  }

  // todo: find a better way to do this
  componentDidMount() {
    const element = document.getElementById(this.props.name);
    this.setState({
      title: element[element.selectedIndex].text
    });
  }

  render() {
    return (
      <>
        {this.getLabel()}
        <select id={this.props.name} value={this.state.value} onChange={this.onChange} style={{ width: `${(8*this.state.title.length) + 50}px` }}>
          {this.props.children}
        </select>
      </>
    );
  }
}
