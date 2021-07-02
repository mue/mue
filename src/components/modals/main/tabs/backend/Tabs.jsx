import React from 'react';

import Tab from './Tab';
import ErrorBoundary from '../../../ErrorBoundary';

export default class Tabs extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      currentTab: this.props.children[0].props.label,
      currentName: this.props.children[0].props.name 
    };
  }

  onClick = (tab, name) => {
    if (name !== this.state.currentName) {
      window.stats.postEvent('tab', `Changed ${this.state.currentName} to ${name}`);
    }

    this.setState({ 
      currentTab: tab,
      currentName: name
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
              onClick={(nextTab) => this.onClick(nextTab, tab.props.name)}
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
