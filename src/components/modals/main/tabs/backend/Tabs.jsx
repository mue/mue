import React from 'react';

import Tab from './Tab';
import ErrorBoundary from '../../../ErrorBoundary';

export default class Tabs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.children[0].props.label
    };
  }

  onClick = (tab) => {
    if (tab !== this.state.currentTab) {
      window.stats.postEvent('tab', `Changed ${this.state.currentTab} to ${tab}`);
    }

    this.setState({ 
      currentTab: tab 
    });
  };

  render() {
    let className = 'sidebar';
    let tabClass = 'tab-content';
    let optionsText = (<h1>{window.language.modals.main.title}</h1>);

    if (this.props.navbar) {
      className = 'modalNavbar';
      tabClass = '';
      optionsText = '';
    }

    return (
      <>
        <ul className={className}>
          {optionsText}
          {this.props.children.map((tab, index) => (
            <Tab
              currentTab={this.state.currentTab}
              key={tab.props.label || index}
              label={tab.props.label}
              onClick={this.onClick}
              navbar={this.props.navbar || false}
            />
          ))}
        </ul>
        <div className={tabClass}>
          <ErrorBoundary>
            {this.props.children.map((tab) => {
              if (tab.props.label !== this.state.currentTab) {
                return undefined;
              }

              return tab.props.children;
            })}
          </ErrorBoundary>
        </div>
      </>
    );
  }
}
