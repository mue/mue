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
    this.setState({ 
      currentTab: tab 
    });
  };

  render() {
    let className = 'sidebar';
    let tabClass = 'tab-content';
    let optionsText = (<h1>Options</h1>);

    if (this.props.navbar) {
      className = 'modalNavbar';
      tabClass = '';
      optionsText = '';
    }

    return (
      <span className='tabs'>
        <ul className={className}>
         {optionsText}
          {this.props.children.map((tab) => {
            return (
              <Tab
                currentTab={this.state.currentTab}
                key={tab.props.label}
                label={tab.props.label}
                onClick={this.onClick}
                navbar={this.props.navbar || false}
              />
            );
          })}
        </ul>
        <div className={tabClass}>
          <ErrorBoundary>
          {this.props.children.map((child) => {
            if (child.props.label !== this.state.currentTab) return undefined;
            return child.props.children;
          })}
          </ErrorBoundary>
        </div>
      </span>
    );
  }
}
