import { useState } from "react";
import "./App.scss";
import EventInput from "./components/EventInput";
import EventsContext, { type ClubEvent } from "./components/EventsContext";
import EventsGraphic from "./components/EventsGraphic";
import type { Quarter } from "./util/quarterColors";

function App() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [inputText, setInputText] = useState("");
  const [week, setWeek] = useState<number | null>(null);
  const [quarter, setQuarter] = useState<Quarter>("fall");

  return (
    <EventsContext.Provider value={{ events, setEvents, inputText, setInputText, quarter, setQuarter, week, setWeek }}>
      <main>
        <EventInput />
        <div className="preview">
          <EventsGraphic />
        </div>
      </main>
    </EventsContext.Provider>
  );
}

export default App;
