import './EventInput.scss';
import { useContext } from "react"
import type { ClubEvent } from "./EventsContext"
import EventsContext from "./EventsContext"

const Expressions = {
  AuthorHeader: /^.*(?:\n\n)? — \d+\/\d+\/\d+, \d+:\d+\u202f\w{2}$/gm,
  EventText: /^(?<CLUB>.+)\n(?<EVT>.+)\n(?<LOC>.+)\n(?<DAY>Mon|Tue|Wed|Thu|Fri|Sat).*?\s*(?<START>\d+(?::\d+)?(\s?[ap]m)?)([^\d\n]*[-–—][^\d\n]*)(?<END>\d+(?::\d+)?(\s?[ap]m)?)\s*$/gmi
}

function parseEventsFromMessages(text: string) {
  const withoutHeaders = text.replace(Expressions.AuthorHeader, '')
  const matches = [...(withoutHeaders.matchAll(Expressions.EventText) ?? [])]
  return matches.map<ClubEvent>(match => {
    const groups = match.groups!
    return {
      clubName: groups.CLUB,
      eventName: groups.EVT,
      location: groups.LOC,
      dayOfWeek: groups.DAY.toUpperCase(),
      startTime: groups.START,
      endTime: groups.END
    }
  })
}


export default function EventInput () {
  const { events, setEvents, inputText, setInputText } = useContext(EventsContext)

  const addEventsFromText = (text: string) => {
    const added = parseEventsFromMessages(text)
    setEvents([...events, ...added])

    const unparsed = text
      .replace(Expressions.AuthorHeader, '')
      .replace(Expressions.EventText, '')
      .replace(/\n{2,}/g, '\n\n')
      .trim()

    setInputText(unparsed)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    addEventsFromText(inputText)
  }

  const handleColorChange = (event: React.FormEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement
    const property = '--col-' + target.name
    document.body.style.setProperty(property, target.value)
  }

  return <form className="text-input-container" action="" onSubmit={handleSubmit}>
    <p>
      Copy and paste in messages from Discord, customize colors, then click "Add to Graphic". Bulk imports are supported.
      To remove an event from the graphic (i.e. if details need to be changed), alt+click on it.
    </p>
    <textarea name="input" value={inputText} onInput={e => setInputText((e.target as HTMLTextAreaElement).value)}></textarea>
    <div className="color-pickers">
      <label>
        Header: <input type="color" name="header" defaultValue="#B053EA" onInput={handleColorChange} />
      </label>
      <label>
        Background: <input type="color" name="background" defaultValue="#E9D7EC" onInput={handleColorChange} />
      </label>
    </div>
    <button>Add to Graphic</button>
  </form>
}