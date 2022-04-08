import variables from "modules/variables";
import { useState } from "react";
import Checkbox from "../Checkbox";
import Slider from "../Slider";
import { TextField } from "@mui/material";

import EventBus from "modules/helpers/eventbus";
import { values } from "modules/helpers/settings/modals";

export default function ExperimentalSettings() {
  const getMessage = (text) =>
    variables.language.getMessage(variables.languagecode, text);
  const [eventType, setEventType] = useState();
  const [eventName, setEventName] = useState();

  return (
    <>
      <h2>{getMessage("modals.main.settings.sections.experimental.title")}</h2>
      <p>{getMessage("modals.main.settings.sections.experimental.warning")}</p>
      <h3>
        {getMessage("modals.main.settings.sections.experimental.developer")}
      </h3>
      <Checkbox name="debug" text="Debug hotkey (Ctrl + #)" element=".other" />
      <Slider
        title="Debug timeout"
        name="debugtimeout"
        min="0"
        max="5000"
        default="0"
        step="100"
        marks={values("experimental")}
        element=".other"
      />
      <p>Send Event</p>
      <TextField
        label={"Type"}
        value={eventType}
        onChange={(e) => setEventType(e.target.value)}
        spellCheck={false}
        varient="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label={"Name"}
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
        spellCheck={false}
        varient="outlined"
        InputLabelProps={{ shrink: true }}
      />
      <br />
      <button
        className="uploadbg"
        onClick={() => EventBus.dispatch(eventType, eventName)}
      >
        Send
      </button>
      <br />
      <br />
      <button
        className="reset"
        style={{ marginLeft: "0px" }}
        onClick={() => localStorage.clear()}
      >
        Clear LocalStorage
      </button>
    </>
  );
}
