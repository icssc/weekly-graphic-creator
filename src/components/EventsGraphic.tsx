import './EventsGraphic.scss';
import { useContext } from "react"
import EventsContext, { type ClubEvent } from "./EventsContext"

function Event ({ data }: { data: ClubEvent }) {
  const shortName = data.clubName.replace(/\s*(@|at)\s*uci\s*$/gi, '').toLowerCase()
  const source = `/club-logos/${shortName}.png`

  return <div className="event">
    <img src={source} alt={"Club icon for " + data.clubName} className="club-icon" width="78" />
    <b>{data.clubName}</b>
    <p>{data.eventName}</p>
    <p>{data.location}</p>
    <p>{data.startTime}-{data.endTime}</p>
  </div>
}


interface EventsOnDayProps {
  label: string;
  events: ClubEvent[];
}
function EventsOnDay ({ label, events }: EventsOnDayProps) {
  const nextMonday = new Date();
  nextMonday.setDate(nextMonday.getDate() + ((7 - nextMonday.getDay()) % 7 + 1) % 7);
  const weekdayDate = new Date(nextMonday);
  weekdayDate.setDate(nextMonday.getDate() + fullNames.indexOf(label) - 1);

  const eventsCopy = events.slice().sort((a, b) => a.startTime.localeCompare(b.startTime) || a.endTime.localeCompare(b.endTime));
  
  return <div className="row">
    <div className="header">
      <h2>{label}</h2>
      <h3>{weekdayDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</h3>
    </div>
    {eventsCopy.map(ev => <Event key={ev.eventName} data={ev}/>)}
  </div>
}

const labels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const fullNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function EventsGraphic () {
  const { events } = useContext(EventsContext)

  const buckets: { name: string; events: ClubEvent[] }[] = labels.map((l, i) => {
    return { events: events.filter(ev => ev.dayOfWeek === l), name: fullNames[i] }
  })

  // Remove weekends if no events are on those days
  if (!buckets[0].events.length && !buckets.at(-1)!.events.length) {
    buckets.splice(0, 1);
    buckets.pop();
  }

  return <div className="events-graphic-container">
    <h1 className="header" contentEditable>
      ICS Club Events: Week 1
    </h1>
    <div className="weekdays">
      {buckets.map(b => <EventsOnDay label={b.name} key={b.name} events={b.events}/>)}
    </div>
  </div>
}
