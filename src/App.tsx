// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState } from 'react'
import './App.scss'
import EventInput from './components/EventInput'
import EventsContext, { type ClubEvent } from './components/EventsContext'
import EventsGraphic from './components/EventsGraphic'

function App() {
  const [events, setEvents] = useState<ClubEvent[]>([])

  return (
    <EventsContext.Provider value={{ events, setEvents }}>
      <div className="flex">
        <EventInput />
        <div className="preview">
          <EventsGraphic />
          <button>Save</button>
        </div>
      </div>
    </EventsContext.Provider>
  )
}

export default App
