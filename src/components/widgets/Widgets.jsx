import { PureComponent, Fragment, Suspense, lazy } from "react";

import Clock from "./time/Clock";
import Greeting from "./greeting/Greeting";
import Quote from "./quote/Quote";
import Search from "./search/Search";
import QuickLinks from "./quicklinks/QuickLinks";
import Date from "./time/Date";
import Message from "./message/Message";
import Reminder from "./reminder/Reminder";

import EventBus from "modules/helpers/eventbus";

const Weather = lazy(() => import("./weather/Weather"));
const renderLoader = () => <></>;

export default class Widgets extends PureComponent {
  online = localStorage.getItem("offlineMode") === "false";
  constructor() {
    super();
    this.state = {
      order: JSON.parse(localStorage.getItem("order")),
      welcome: localStorage.getItem("showWelcome"),
    };
    // widgets we can re-order
    this.widgets = {
      time: this.enabled("time") ? <Clock /> : null,
      greeting: this.enabled("greeting") ? <Greeting /> : null,
      quote: this.enabled("quote") ? <Quote /> : null,
      date: this.enabled("date") ? <Date /> : null,
      quicklinks:
        this.enabled("quicklinksenabled") && this.online ? (
          <QuickLinks />
        ) : null,
      message: this.enabled("message") ? <Message /> : null,
      reminder: this.enabled("reminder") ? <Reminder /> : null,
    };
  }

  enabled(key) {
    return localStorage.getItem(key) === "true";
  }

  componentDidMount() {
    EventBus.on("refresh", (data) => {
      if (data === "widgets") {
        this.setState({
          order: JSON.parse(localStorage.getItem("order")),
        });
      }

      if (data === "widgetsWelcome") {
        this.setState({
          welcome: localStorage.getItem("showWelcome"),
        });
        localStorage.setItem("showWelcome", true);
        window.onbeforeunload = () => {
          localStorage.clear();
        };
      }

      if (data === "widgetsWelcomeDone") {
        this.setState({
          welcome: localStorage.getItem("showWelcome"),
        });
        window.onbeforeunload = null;
      }
    });
  }

  render() {
    // don't show when welcome is there
    if (this.state.welcome !== "false") {
      return <div id="widgets"></div>;
    }

    // allow for re-ordering widgets
    let elements = [];

    if (this.state.order) {
      this.state.order.forEach((element) => {
        elements.push(
          <Fragment key={element}>{this.widgets[element]}</Fragment>
        );
      });
    } else {
      // prevent error
      elements = [
        <Greeting />,
        <Clock />,
        <QuickLinks />,
        <Quote />,
        <Date />,
        <Message />,
        <Reminder />,
      ];
    }

    return (
      <div id="widgets">
        <Suspense fallback={renderLoader()}>
          {this.enabled("searchBar") ? <Search /> : null}
          {elements}
          {this.enabled("weatherEnabled") && this.online ? <Weather /> : null}
        </Suspense>
      </div>
    );
  }
}
