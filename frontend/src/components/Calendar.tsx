import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import styles from './Calendar.module.css'

export default function Calendar() {
  return (
    <div className={styles.calendarContainer}>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridWeek"
        weekends={false}
        events={[
          { title: 'event 1', date: '2025-04-01' },
          { title: 'event 2', date: '2025-04-02' }
          // ideally put in events from db here
        ]}
        editable={true}
        headerToolbar={{
          left: 'prev,next',
          center: 'title',
          right: 'dayGridDay,dayGridWeek,dayGridMonth' // user can switch between the two
        }}
      />
    </div>
  )
}