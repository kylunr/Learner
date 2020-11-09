import React, { useState, Component } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import './Calendar.css';

class Calendar extends Component {

    render () {
        return (
            <FullCalendar 
                plugins={[ dayGridPlugin ]}
                defaultView="dayGridMonth"
            />
        )
    }
}

export default Calendar;