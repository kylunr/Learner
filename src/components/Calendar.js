import React from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick
import "./Calendar.css";

// must manually import the stylesheets for each plugin                                                     
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";


export default class Calendar extends React.Component {

    calendarComponentRef = React.createRef();

    // componentDidMount() {
    //     this.setState({
    //         // update a property
    //         userSubjects: this.getUserSubjects
    //     });
    // }

    state = {
        userSubjects: [""],
        calendarWeekends: true,
        calendarEvents: [
            // initial event data
            { title: "Event Now", start: new Date('November 15, 2020 08:00:00') }
        ]
    };

    render() {
        return (
            <div className="calendar">
                <div>
                    {this.state.userSubjects.map(txt => <p>{txt}</p>)}
                </div>
                <div className="calendar_header">
                    <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;

                    &nbsp; (also, click a date/time to add an event)
                </div>
                <div className="calendar_object">
                    <FullCalendar
                        defaultView="timeGridWeek"
                        header={{
                            left: "prev,next today",
                            center: "title",
                            right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                        }}
                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                        ref={this.calendarComponentRef}
                        weekends={this.state.calendarWeekends}
                        events={this.state.calendarEvents}
                        dateClick={this.handleDateClick}
                        allDaySlot={false}
                        scrollTime={'6:00:00'}
                        editable={true}
                    />
                </div>
            </div>
        );
    }

    toggleWeekends = () => {
        this.setState({
            // update a property
            calendarWeekends: !this.state.calendarWeekends
        });
    };

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    };

    handleDateClick = arg => {
        if (window.confirm("Would you like to add an event to " + arg.dateStr + " ?")) {
            this.setState({
            // add new event data
            calendarEvents: this.state.calendarEvents.concat({
                // creates a new array
                title: "New Event",
                start: arg.date,
                allDay: arg.allDay
            })
          });
        }
    };

    getUserSubjects = () => {
        var user = useSelector(selectUser);
        
        // Getting the user's database document
        var docRef = db.collection("users").doc(user.email);

        // Get live updates of user's document using onSnapshot
        docRef.onSnapshot(function(doc) {
            // If the document exists
            if (doc.exists) {
                // Read the data into the state array
                let document = doc.data();
                if (!(document.subjects === "")) {
                    return document.subjects.split('$$');
                } 
            } 
            // If the document does not exist
            else {
                // Create a document for the user
                // setSubjects("");
                return [""];

                db.collection("users").doc(user.email).set({
                    // subjects: ""
                })
                .then(function() {
                    console.log("Document successfully written");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        });
    }
}   
