import { createContext } from "react";

export interface ClubEvent {
  clubName: string;
  eventName: string;
  location: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

const EventsContext = createContext({
  events: [] as ClubEvent[],
  setEvents: (() => undefined) as React.Dispatch<ClubEvent[]>,
  inputText: "",
  setInputText: (() => undefined) as React.Dispatch<string>,
  week: null as number | null,
  setWeek: (() => undefined) as React.Dispatch<number | null>,
});

export default EventsContext;
