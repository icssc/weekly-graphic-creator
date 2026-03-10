import "./EventsGraphic.scss";
import { useContext, useRef } from "react";
import EventsContext, { type ClubEvent } from "./EventsContext";
import html2canvas from "html2canvas";

function Event({ data }: { data: ClubEvent }) {
  const { events, setEvents, inputText, setInputText } = useContext(EventsContext);
  const shortName = data.clubName.replace(/\s*(@|at)\s*uci\s*$/gi, "").toLowerCase();
  const source = `/icssc-weekly/club-logos/${shortName}.png`;

  const handleClick = (event: React.MouseEvent) => {
    if (!event.altKey) return;
    // Remove if both club and event name are the same
    setEvents(events.filter((ev) => ev.clubName !== data.clubName || ev.eventName !== data.eventName));
    const restoredText =
      `${data.clubName}\n${data.eventName}\n${data.location}\n` +
      `${fullNames[labels.indexOf(data.dayOfWeek)]} ${data.startTime}-${data.endTime}`;
    setInputText(`${inputText}\n\n${restoredText}`.trim());
  };

  return (
    // biome-ignore lint/a11y: this is a secondary function
    <div className="event" onClick={handleClick}>
      <img src={source} alt={"Club icon for " + data.clubName} className="club-icon" width="78" />
      <b>{data.clubName.trim()}</b>
      <p>{data.eventName.trim()}</p>
      <p>{data.location.trim()}</p>
      <p>
        {data.startTime.trim()}-{data.endTime.trim()}
      </p>
    </div>
  );
}

interface EventsOnDayProps {
  label: string;
  events: ClubEvent[];
}
function EventsOnDay({ label, events }: EventsOnDayProps) {
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + ((((7 - nextMonday.getDay()) % 7) + 1) % 7));
  const weekdayDate = new Date(nextMonday);
  weekdayDate.setDate(nextMonday.getDate() + fullNames.indexOf(label) - 1);

  const eventsCopy = events
    .slice()
    .sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime));

  return (
    <div className="row">
      <div className="header">
        <h2>{label}</h2>
        <h3>
          {weekdayDate.toLocaleDateString("en-US", {
            month: "2-digit",
            day: "2-digit",
          })}
        </h3>
      </div>
      {eventsCopy.map((ev) => (
        <Event key={ev.eventName} data={ev} />
      ))}
    </div>
  );
}

const labels = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const fullNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function EventsGraphic() {
  const { events } = useContext(EventsContext);
  const graphicRef = useRef<HTMLDivElement>(null);

  const buckets: { name: string; events: ClubEvent[] }[] = labels.map((l, i) => {
    return {
      events: events.filter((ev) => ev.dayOfWeek === l),
      name: fullNames[i],
    };
  });

  // Remove weekends if no events are on those days
  if (!buckets[0].events.length && !buckets.at(-1)!.events.length) {
    buckets.splice(0, 1);
    buckets.pop();
  }

  const save = async () => {
    if (!graphicRef.current) return;
    graphicRef.current.style.zoom = "1";
    const canvas = await html2canvas(graphicRef.current, {
      backgroundColor: "black",
    });
    const blob = (await new Promise((resolve) => canvas.toBlob(resolve, "image/png"))) as Blob | null;
    const url = URL.createObjectURL(blob!);
    graphicRef.current.style.zoom = "";
    window.open(url);
  };

  return (
    <>
      <div className="events-graphic-container" ref={graphicRef}>
        <h1 className="header" contentEditable spellCheck="false">
          ICS Club Events: Week ##
        </h1>
        <div className="weekdays">
          {buckets.map((b) => (
            <EventsOnDay label={b.name} key={b.name} events={b.events} />
          ))}
        </div>
      </div>
      <button type="button" onClick={save}>
        Save Graphic (opens in new tab)
      </button>
    </>
  );
}
