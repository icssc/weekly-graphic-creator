import "./EventsGraphic.scss";
import html2canvas from "html2canvas";
import { useContext, useRef, useState } from "react";
import { parseWeek } from "../util/quarterColors";
import EventsContext, { type ClubEvent } from "./EventsContext";

const UCI_PATTERN = /\s*(?:@\s*|\bat\b\s*)?\buci\b/gi;

/**
 * Returns possible logo file names for a club, in order of preference.
 * Multi-word names are abbreviated by their initials, e.g. "Black in Tech" -> ["bit", "black in tech"]
 */
function getLogoCandidates(clubName: string): string[] {
  const name = clubName
    .replace(/[([][^)\]]*[)\]]/g, " ") // ignore parenthesized text
    .replace(UCI_PATTERN, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  const words = name.split(/[^a-z0-9]+/).filter(Boolean);
  const candidates: string[] = [];
  if (words.length > 1) candidates.push(words.map((w) => w[0]).join(""));
  candidates.push(name);
  return candidates.filter((c, i) => c && candidates.indexOf(c) === i);
}

function ClubIcon({ clubName }: { clubName: string }) {
  const candidates = getLogoCandidates(clubName);
  const [index, setIndex] = useState(0);
  const candidate = candidates[Math.min(index, candidates.length - 1)];

  return (
    <img
      src={`/weekly-graphic-creator/club-logos/${candidate}.png`}
      alt={"Club icon for " + clubName}
      className="club-icon"
      width="78"
      onError={() => setIndex((i) => (i + 1 < candidates.length ? i + 1 : i))}
    />
  );
}

function Event({ data }: { data: ClubEvent }) {
  const { events, setEvents, inputText, setInputText } = useContext(EventsContext);

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
      <ClubIcon key={data.clubName} clubName={data.clubName} />
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
  const { events, setWeek } = useContext(EventsContext);
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
        <h1
          className="header"
          contentEditable
          suppressContentEditableWarning
          spellCheck="false"
          onInput={(e) => setWeek(parseWeek(e.currentTarget.textContent ?? ""))}
        >
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
