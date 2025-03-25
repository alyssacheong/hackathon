import styles from './Calendar.module.css'
import { useState } from 'react'
import { formatDate, DateSelectArg, EventClickArg, EventApi, EventContentArg } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { INITIAL_EVENTS, createEventId } from './eventUtils.ts'
import { isAfter, isBefore, addDays } from "date-fns";


export default function Calendar() {
  const [weekendsVisible, setWeekendsVisible] = useState(true)
  const [currentEvents, setCurrentEvents] = useState<EventApi[]>([])

  function handleWeekendsToggle() {
    setWeekendsVisible(!weekendsVisible)
  }

  function handleDateSelect(selectInfo: DateSelectArg) {
    let title = prompt('Please enter a new title for your event')
    let calendarApi = selectInfo.view.calendar

    calendarApi.unselect() // clear date selection

    if (title) {
      calendarApi.addEvent({
        id: createEventId(),
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay
      })
    }
  }


  function handleEventClick(clickInfo: EventClickArg) {
    if (confirm(`Are you sure you want to delete the event? '${clickInfo.event.title}'`)) {
      clickInfo.event.remove()
    }
  }

  function handleEvents(events: EventApi[]) {
    setCurrentEvents(events)
  }

  return (
    <div className={styles.app}>
    <Sidebar
      weekendsVisible={weekendsVisible}
      handleWeekendsToggle={handleWeekendsToggle}
      currentEvents={currentEvents}
    />
    <div className={styles.appMain}>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView='dayGridMonth'
        editable={true}
        selectable={true}
        selectMirror={true}
        dayMaxEvents={true}
        weekends={weekendsVisible}
        initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
        select={handleDateSelect} // uncomment this for manual date selection
        eventContent={renderEventContent} // custom render function
        eventClick={handleEventClick}
        eventsSet={handleEvents} // called after events are initialized/added/changed/removed
        /* you can update a remote database when these fire:
        eventAdd={function(){}}
        eventChange={function(){}}
        eventRemove={function(){}}
        */
      />
    </div>
  </div>
  )
}


function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

interface SidebarProps {
  weekendsVisible: boolean;
  handleWeekendsToggle: () => void;
  currentEvents: EventApi[];
}

function Sidebar({ weekendsVisible, handleWeekendsToggle, currentEvents }: SidebarProps) {
  return (
    <div className={styles.appSidebar}>
      <div className={styles.appSidebarSection}>
        <h2>Your Courses:</h2>
        <ul>
          <li>COMP1521</li>
        </ul>
      </div>
      <div className={styles.appSidebarSection}>
        <label>
          <input
            type='checkbox'
            checked={weekendsVisible}
            onChange={handleWeekendsToggle}
          ></input>
          Toggle Weekends
        </label>
      </div>
      <div className={styles.appSidebarSection}>
        <h2>Events in the Next Week ({getUpcomingEvents(currentEvents).length})</h2>
        <ul>
          {currentEvents.map((event) => (
            <SidebarEvent key={event.id} event={event} />
          ))}
        </ul>
      </div>
    </div>
  )
}

interface SidebarEventProps {
  event: EventApi;
}

// //old event code
// function SidebarEvent({ event }: SidebarEventProps) {
//   return (
//     <li key={event.id}>
//       <b>{event.start && formatDate(event.start, {year: 'numeric', month: 'short', day: 'numeric'})}</b>
//       <i>{event.title}</i>
//     </li>
//   )
// }

function getUpcomingEvents(currentEvents: any[]): any[] {
  const now = new Date();
  const dayBefore = addDays(now, -1);
  const nextWeek = addDays(now, 7);

  return currentEvents.filter(event => {
    if (!event.start) return false; // Skip events with no start date

    const eventDate = new Date(event.start); // Ensure it's a Date object
    return isAfter(eventDate, dayBefore) && isBefore(eventDate, nextWeek);
  });
}

function SidebarEvent({ event }: SidebarEventProps) {
  const now = new Date();
  const dayBefore = addDays(now, -1);
  const nextWeek = addDays(now, 7);

  // Ensure event has a valid start date and is within the next 7 days
  if (!event.start || !isAfter(event.start, dayBefore) || !isBefore(event.start, nextWeek)) {
    return null; // Skip events that are not in the next 7 days
  }

  return (
    <li key={event.id}>
      <b>{event.start && formatDate(event.start, { year: "numeric", month: "short", day: "numeric" })}</b>
      <i>{event.title}</i>
    </li>
  );
}
