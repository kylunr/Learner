import React from "react";
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction"; // needed for dayClick
import "./Calendar.css";
import uuid from 'react-uuid';
import Progress from './Progress';

// must manually import the stylesheets for each plugin                                                     
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";

/**
 * Function component wrapper that allows for use
 * of storing user data
 * 
 * @param {} Component 
 */
function withMyHook(Component) {
    return function WrappedComponent(props) {
        const myHookValue = useSelector(selectUser);
        return <Component {...props} myHookValue={myHookValue} />;
    }
}

class Calendar extends React.Component {

    calendarComponentRef = React.createRef();

    componentDidMount() {   
        this.getUserSubjects();

        let color = this.state.colorArray[1];
        let containerEl = document.getElementById("subjects_container");
        new Draggable(containerEl, {
            itemSelector: '.subject_buttons',
            eventData: function(eventEl) {
                let title = eventEl.getAttribute("title");
                let id = eventEl.getAttribute("data");
                return {
                    title: title,
                    id: id,
                    duration: '01:00',
                    color: color
                }
            }
        });
    }
    
    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.calendarEvents !== prevState.calendarEvents) {
    //         console.log(this.state.calendarEvents);
    //         this.updateEvents();
    //     }
    // }

    /**
     * Declares the state for the component
     */
    state = {
        user: this.props.myHookValue,
        userSubjects: [],
        calendarWeekends: true,
        calendarEvents: [
            // { title: "Event Now", start: new Date('November 22, 2020 08:00:00') , end: new Date('November 22, 2020 11:00:00') , color: 'red'}
        ],
        eventsIndex: 0,
        colorCounter: 0,
        // blue, red, green, yellow, orange, purple, teal, lime
        colorArray: ['#317fdd', '#ff4136', '#2ecc40', '#ffdc00', '#ff851b', '#b10dc9', '#39cccc', '#01ff70']
    };

    renderSubjects = () => {

    }

    render() {
        return (
            <div className="all_sections">

                {/* Subjects Section */}
                <div className="subjects_section">
                    <h1 className="subjects_title">Subjects</h1>

                    <div className="form">
                        <form onSubmit={e => e.preventDefault()}>
                            <input id="create_form" className="create_form" type="text" placeholder="Subject Title..."/>
                            <button type="submit" className="submit_button" onClick={this.createSubject}>Create Subject</button>
                        </form>
                    </div>

                    <div className="subjects_container" id="subjects_container">
                        {/* {this.state.userSubjects.map(
                            (txt, idx) => 
                            <div className="subject_buttons" title={txt} data={idx} key={idx}>{txt}</div>
                        )} */}
                        {this.state.userSubjects.map((subject, idx) => 
                            <div title={subject.subject} data={idx} key={idx} className="subject_buttons" style={{backgroundColor: subject.color}}>
                                <h1></h1>
                                <h3 className="subject_name">{subject.subject}</h3>
                                <div className="delete_button" id={subject.subject} onClick={this.deleteSubject}>X</div>
                            </div>
                        )}
                    </div>
                                    
                </div>

                {/* Calendar Section */}
                <div className="calendar">
                    {/* <div className="calendar_header">
                        <button onClick={this.toggleWeekends}>toggle weekends</button>&nbsp;

                        &nbsp; (also, click a date/time to add an event)
                    </div> */}
                    <h1 className="calendar_title">Calendar</h1>
                    <div className="calendar_object">
                        <FullCalendar
                            defaultView="timeGridWeek"
                            // header={{
                            //     left: "prev,next today",
                            //     center: "title",
                            //     right: "timeGridWeek,timeGridDay,listWeek"
                            // }}
                            header={{
                                left: "",
                                center: "",
                                right: ""
                            }}
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            ref={this.calendarComponentRef}
                            weekends={this.state.calendarWeekends}
                            events={this.state.calendarEvents}
                            // dateClick={this.handleDateClick}
                            allDaySlot={false}
                            scrollTime={'6:00:00'}
                            editable={true}
                            nowIndicator={true}
                            droppable={true}
                            eventReceive={this.handleDrop}
                            eventDrop={this.handleChange}
                            eventResize={this.handleChange}
                            eventClick={this.deleteEvent}
                        />
                    </div>
                </div>
                <Progress className="progress" />
            </div>
        );
    }

    /**
     * Toggles the weekends in the week view
     */
    toggleWeekends = () => {
        this.setState({
            // update a property
            calendarWeekends: !this.state.calendarWeekends
        });
    };

    /**
     * Goes to a set date in the past
     */
    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi();
        calendarApi.gotoDate("2000-01-01"); // call a method on the Calendar object
    };

    /**
     * Invoked when the calendar is clicked, asks to add an event
     * to the calendar
     * @param {*} arg 
     */
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

    /**
     * Returns a color for the event, keeps track of other
     * subject's color 
     */
    getColor = () => {
        // Increment to next color
        this.setState({ colorCounter:  this.state.colorCounter + 1 });

        // If the color tracker is outside of the color array index
        if (this.state.colorCounter === this.state.colorArray.length) {
            // Reset the color counter to 0 (start reusing colors)
            this.setState({ colorCounter: 0 });
        }

        // Return the color of the current index
        return this.state.colorArray[this.state.colorCounter];
    }

    /**
     * Method to retrieve the user subjects
     */
    getUserSubjects = () => {
        // var user = useSelector(selectUser);
        
        // Getting the user's database document
        var docRef = db.collection("users").doc(this.state.user.email);

        // Get live updates of user's document using onSnapshot
        docRef.onSnapshot(function(doc) {
            // If the document exists
            if (doc.exists) {
                // Read the data into the state array
                let document = doc.data();
                let subjectsArray = document.subjects;
                let newUserSubjects = [];
                if (!(document.subjects === "")) {

                    subjectsArray.forEach(element => {
                        newUserSubjects.push(
                            {subject: element.subject, color: element.color}
                        );
                    });
                } 

                this.setState({
                    userSubjects: newUserSubjects
                });

                if (!(document.calendarEvents === "")) {
                    //  console.log(document.calendarEvents);
                    var eventsArray = document.calendarEvents;
                    var newCalendarEvents = [];

                    eventsArray.forEach(element => {
                        // console.log(element);

                        if (element.backgroundColor) {
                            newCalendarEvents.push(
                                // {title: element.title, start: new Date(element.start), end: new Date(element.end)}
                                {title: element.title, start: element.start.toDate(), end: element.end.toDate(), id: element.id, backgroundColor: element.backgroundColor}
                            );
                        } else {
                            newCalendarEvents.push(
                                // {title: element.title, start: new Date(element.start), end: new Date(element.end)}
                                {title: element.title, start: element.start.toDate(), end: element.end.toDate(), id: element.id, backgroundColor: 'red'}
                            );
                        }

                        if (element.id > this.state.eventsIndex) {
                            this.setState({ eventsIndex: (parseInt(element.id) + 1) });
                        }
                    });

                    // console.log(newCalendarEvents)

                    this.setState({
                        calendarEvents: newCalendarEvents
                    });
                } 
            } 
            // If the document does not exist
            else {
                // Create a document for the user
                this.setState({
                    userSubjects: [] 
                });

                db.collection("users").doc(this.state.user.email).set({
                    subjects: [],
                    calendarEvents: []
                })
                .then(function() {
                    console.log("Document successfully written");
                })
                .catch(function(error) {
                    console.error("Error writing document: ", error);
                });
            }
        }.bind(this));
    }

    /**
     * Allows user to create a new subject, subject
     * is stored in database
     * 
     * TODO:
     *  - Set maximum and minimum length 
     *  - Browser pop-up when input error (empty or too long)
     */
    createSubject = () => {

        // If the user is submitting empty subject return
        if (document.getElementById("create_form").value === "") {
            return;
        } 
        // If the user is submitting a form that is too long
        else if (document.getElementById("create_form").value.length > 50) {
            return;
        }

        // Create a string for new subjects and add old subjects to string
        let newUserSubjects = [];

        if (!(document.subjects === "")) {
            this.state.userSubjects.forEach(element => {
                newUserSubjects.push(
                    {subject: element.subject, color: element.color}
                );
            });
        } 

        let subjectColor = "";

        if (newUserSubjects.length >= this.state.colorArray.length) {
            subjectColor = this.state.colorArray[newUserSubjects.length - this.state.colorArray.length];
        } else {
            subjectColor = this.state.colorArray[newUserSubjects.length];
        }

        newUserSubjects.push(
            {subject: document.getElementById("create_form").value, color: subjectColor}
        );

        // Add the new subject to string
        // newSubjects += document.getElementById("create_form").value;

        this.setState({
            userSubjects: newUserSubjects
        });

        // Clear the form
        document.getElementById("create_form").value = "";

        // Update the database with new subjects
        db.collection("users").doc(this.state.user.email).update({
            subjects: newUserSubjects
        })
        .then(function() {
            console.log("Document successfully written");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    /**
     * Deletes the subjects from the screen and removes
     * the subject from the database
     * 
     * @param {*} event 
     */
    deleteSubject = (event) => {

        // Records number of subjects
        let numberOfSubjects = this.state.userSubjects.length;

        // If there is only one element left
        if (numberOfSubjects === 1) {
            // Set state array to be empty
            this.setState({
                // update a property
                userSubjects: []
            });
            numberOfSubjects = 0;
        } else {
            // Get index of subject
            var index = this.state.userSubjects.findIndex(e => e.subject === event.target.id);
            // Remove it from the state array
            if (index !== -1) {
                this.setState({
                    userSubjects: this.state.userSubjects.splice(index, 1)
                });
                numberOfSubjects -= 1;
            } 
        }

        let newSubjects = [];

        // If there is still subjects
        if (numberOfSubjects > 0) {
            // Add them to string to send to database
            this.state.userSubjects.forEach(element => {
                newSubjects.push({subject: element.subject, color: element.color})
            });
        }

        // Send updated list to database
        db.collection("users").doc(this.state.user.email).update({
            subjects: newSubjects
        })
        .then(function() {
            console.log("Document successfully written");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    handleDrop = (event) => {

        // console.log(event);

        const calendar = this.calendarComponentRef.current.getApi();
        calendar.getEventById(event.event.id).remove();
        const id = uuid();

        let tempArray = this.state.calendarEvents.slice();

        let subjectColor = "";
        this.state.userSubjects.forEach(element => {
            if (element.subject === event.event.title) {
                subjectColor = element.color;
            }
        });

        tempArray.push(
            {title: event.event.title, start: event.event.start, end: event.event.end, id: id, backgroundColor: subjectColor}
        );

        this.setState({
            calendarEvents: tempArray,
            eventsIndex: parseInt(this.state.eventsIndex) + 1 
        });

        this.updateEvents();
        // console.log(this.state.calendarEvents);
    }

    handleChange = (event) => {
        // console.log(event);

        const findEvent = (element) => {
            return (element.id === event.event.id); 
        };
        
        let index = this.state.calendarEvents.findIndex(findEvent);

        let subjectColor = "";
        this.state.userSubjects.forEach(element => {
            if (element.subject === event.event.title) {
                subjectColor = element.color;
            }
        });

        // this.state.calendarEvents[index] = {title: event.event.title, start: event.event.start, end: event.event.end, id: event.event.id};

        let tempArray = this.state.calendarEvents.slice();
        tempArray[index] = {title: event.event.title, start: event.event.start, end: event.event.end, id: event.event.id, backgroundColor: subjectColor};
        
        this.setState({
            calendarEvents: tempArray
        });

        this.updateEvents();
    }


    updateEvents = () => {
        // Send updated list to database
        db.collection("users").doc(this.state.user.email).update({    
            calendarEvents: this.state.calendarEvents
        })
        .then(function() {
            console.log("Document successfully written");
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });
    }

    deleteEvent = (event) => {
        if (window.confirm("Would you like to delete this event?")) {

            const calendar = this.calendarComponentRef.current.getApi();
            calendar.getEventById(event.event.id).remove();
            
            const findEvent = (element) => {
                return (element.id === event.event.id); 
            };

            let index = this.state.calendarEvents.findIndex(findEvent);
            let tempArray = this.state.calendarEvents.slice();
            tempArray.splice(index, 1);

            this.setState({
                calendarEvents: tempArray
            });

            this.updateEvents();
        }
    }
}   


export default withMyHook(Calendar);