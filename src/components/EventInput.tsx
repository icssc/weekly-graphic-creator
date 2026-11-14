import "./EventInput.scss";
import { useContext, useEffect, useState } from "react";
import { getQuarterColors, type Quarter } from "../util/quarterColors";
import type { ClubEvent } from "./EventsContext";
import EventsContext from "./EventsContext";

const Expressions = {
  AuthorHeader: /^.*(?:\n\n)? — \d+\/\d+\/\d+, \d+:\d+\u202f\w{2}$/gm,
  EventText:
    /^(?<CLUB>.+)\n(?<EVT>.+)\n(?<LOC>.+)\n(?<DAY>Mon|Tue|Wed|Thu|Fri|Sat).*?\s*(?<START>\d+(?::\d+)?(\s?[ap]m)?)([^\d\n]*[-–—][^\d\n]*)(?<END>\d+(?::\d+)?(\s?[ap]m)?)\s*$/gim,
};

function parseEventsFromMessages(text: string) {
  const withoutHeaders = text.replace(Expressions.AuthorHeader, "");
  const matches = [...(withoutHeaders.matchAll(Expressions.EventText) ?? [])];
  return matches.map<ClubEvent>((match) => {
    const groups = match.groups!;
    return {
      clubName: groups.CLUB,
      eventName: groups.EVT,
      location: groups.LOC,
      dayOfWeek: groups.DAY.toUpperCase(),
      startTime: groups.START,
      endTime: groups.END,
    };
  });
}

export default function EventInput() {
  const { events, setEvents, inputText, setInputText, quarter, setQuarter, week } = useContext(EventsContext);

  const addEventsFromText = (text: string) => {
    const added = parseEventsFromMessages(text);
    setEvents([...events, ...added]);

    const unparsed = text
      .replace(Expressions.AuthorHeader, "")
      .replace(Expressions.EventText, "")
      .replace(/\n{2,}/g, "\n\n")
      .trim();

    setInputText(unparsed);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    addEventsFromText(inputText);
  };

  const [colors, setColors] = useState(() => getQuarterColors(quarter, week));

  useEffect(() => {
    setColors(getQuarterColors(quarter, week));
  }, [quarter, week]);

  useEffect(() => {
    document.body.style.setProperty("--col-header", colors.header);
    document.body.style.setProperty("--col-background", colors.background);
  }, [colors]);

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setColors((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <form className="text-input-container" action="" onSubmit={handleSubmit}>
      <p>
        Copy and paste in messages from Discord, customize colors, then click "Add to Graphic". Bulk imports are
        supported. To remove an event from the graphic (i.e. if details need to be changed), alt+click on it.
      </p>
      <textarea
        name="input"
        value={inputText}
        onInput={(e) => setInputText((e.target as HTMLTextAreaElement).value)}
      ></textarea>
      <div className="color-pickers">
        <label>
          Header: <input type="color" name="header" value={colors.header} onChange={handleColorChange} />
        </label>
        <label>
          Background: <input type="color" name="background" value={colors.background} onChange={handleColorChange} />
        </label>
        <label>
          Quarter:{" "}
          <select name="quarter" value={quarter} onChange={(e) => setQuarter(e.target.value as Quarter)}>
            <option value="fall">Fall</option>
            <option value="winter">Winter</option>
            <option value="spring">Spring</option>
          </select>
        </label>
        <button type="submit">Add to Graphic</button>
      </div>
    </form>
  );
}
