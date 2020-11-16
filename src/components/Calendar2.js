import React, { Component } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

import './Calendar2.css';
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);

class Calendar2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [
                {
                    start: new Date('November 18, 2020 06:00:00'),
                    end: new Date('November 18, 2020 08:00:00'),
                    title: "Some title",
                },
                {
                    // start: moment().add(6, "hours").toDate(),
                    // end: moment().add(2, "hours").toDate(),
                    // title: "Some title 2",
                    start: new Date('November 16, 2020 06:00:00'),
                    end: new Date('November 16, 2020 08:00:00'),
                    title: "Some title 2",
                },
            ]
        };
        this.onEventDrop = this.onEventDrop.bind(this);
        this.onEventResize = this.onEventResize.bind(this);
    }

    //Clicking an existing event allows you to remove it
    onSelectEvent(pEvent) {
        const r = window.confirm("Would you like to remove this event?")
        if(r === true){
        
        this.setState((prevState, props) => {
            const events = [...prevState.events]
            const idx = events.indexOf(pEvent)
            events.splice(idx, 1);
            return { events };
        });
        }
    }


onEventResize({event, start, end}){
    const { events } = this.state

    const nextEvents = events.map(existingEvent => {
      return existingEvent.id === event.id
        ? { ...existingEvent, start, end }
        : existingEvent
    })

    this.setState({
      events: nextEvents,
    })
}

//   onEventDrop = (data) => {
//     const { start, end } = data;

//     this.setState((state) => {
//       state.events[0].start = start;
//       state.events[0].end = end;
//       return { events: [...state.events] };
//     });
//   };
onEventDrop({ event, start, end }) {
    const { events } = this.state;
    const idx = events.indexOf(event);
    const updatedEvent = { ...event, start, end };
    const nextEvents = [...events];
    nextEvents.splice(idx, 1, updatedEvent);
    this.setState({
      events: nextEvents,
    })
}


  render() {
    return (
      <div className="App">
        <DnDCalendar
          defaultDate={moment().toDate()}
          views={['week', 'day']}
          defaultView="week"
          events={this.state.events}
          localizer={localizer}
          onEventDrop={this.onEventDrop}
          onEventResize={this.onEventResize}
          onSelectEvent= {event => this.onSelectEvent(event)}
          resizable
          style={{ height: "100vh" }}
          allDay="false"
        />
      </div>
    );
  }
}

export default Calendar2;