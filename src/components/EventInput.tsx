import { useContext, useState } from "react"
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
  const { events, setEvents } = useContext(EventsContext)
  const [inputText, setInputText] = useState('')

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

  return <form className="text-input-container" action="" onSubmit={handleSubmit}>
    <textarea name="input" value={inputText} onInput={e => setInputText((e.target as HTMLTextAreaElement).value)}></textarea>
    <input type="color" name="border" />
    <input type="color" name="header" />
    <input type="color" name="background" />
    <input type="submit" value="Add to Graphic" />
  </form>
}