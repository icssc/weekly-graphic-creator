import { useState } from "react";
import "./App.scss";
import EventInput from "./components/EventInput";
import EventsContext, { type ClubEvent } from "./components/EventsContext";
import EventsGraphic from "./components/EventsGraphic";

function App() {
  const [events, setEvents] = useState<ClubEvent[]>([]);
  const [inputText, setInputText] = useState("");

  return (
    <EventsContext.Provider value={{ events, setEvents, inputText, setInputText }}>
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
