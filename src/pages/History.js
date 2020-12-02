import React, { useEffect, useState, useReducer, useRef } from 'react';
import './History.css';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';

function History() {

    const user = useSelector(selectUser);

    let [lifetimeArray, setLifetimeArray] = useState([]);
    let [weeklyArray, setWeeklyArray] = useState([]);

    useEffect(() => {
    
        // Send updated list to database
        db.collection("users").doc(user.email).get()
        .then(doc => {
            let document = doc.data();

            document.calendarEvents.forEach(element => {
                // setCalendarEvents(
                //     calendarEvents => calendarEvents.concat(element)
                // );

                var title = element.title;
                var index = -1;
                var result = false;

                lifetimeArray.forEach((element, idx) => {
                    if (element.title === title) {
                        index = idx;
                        result = true;
                        return;
                    } else {
                        result = false;
                        return;
                    }
                });

                if (result) {
                    lifetimeArray[index].time += (element.end.toDate() - element.start.toDate());
                    // setLifetimeArray(
                    //     lifetimeArray[index].time += (element.end.toDate() - element.start.toDate())
                    // );
                } else {
                    lifetimeArray.push(
                                { title: title, time: (element.end.toDate() - element.start.toDate()) }
                            );
                    // setLifetimeArray(
                    //     lifetimeArray.push(
                    //         { title: title, time: (element.end.toDate() - element.start.toDate()) }
                    //     )
                    // );
                }

                // console.log(lifetimeArray);

                var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

                let today = new Date();
                today.setDate(today.getDate() + 1);
                let todaysDate = today.toLocaleTimeString('en-us', options);
                let dayArray = todaysDate.split(",");
        
                while (dayArray[0] !== "Sunday") {
                    today.setDate(today.getDate() + 1);
                    todaysDate = today.toLocaleTimeString('en-us', options);
                    dayArray = todaysDate.split(",");
                }
        
                today.setHours(0);
                today.setMinutes(0);
                today.setSeconds(0);

                let todayValue = today.valueOf()
                let nextSunday = new Date(todayValue);
                let nextSundayValue = nextSunday.valueOf();
                let prevSunday = new Date(nextSundayValue);
                let prevSundayDate = prevSunday.getDate();
                prevSunday.setDate(prevSundayDate - 7);

                if ((element.end.toDate() < nextSunday) && (element.start.toDate() > prevSunday)) {
                    var title = element.title;
                    var index = -1;
                    var result = false;

                    weeklyArray.forEach((element, idx) => {

                        element.startDate.setMilliseconds(0);
                        prevSunday.setMilliseconds(0);

                        if (element.startDate.valueOf() === prevSunday.valueOf()) {
                            index = idx;
                            result = true;
                            return;
                        } 
                    });

                    // console.log(result);

                    // If the week is already in the db
                    if (result) {
                        let subjectIndex = -1;
                        let subjectResult = false;
                        let subjectsArray = weeklyArray[index].subjects;
                        let subjectTitle = "";
                        let subjectCurrentTime = 0;

                        // Check if the subject already has an element
                        subjectsArray.forEach((element1, idx) => {
                            if (element1.title === title) {
                                subjectIndex = idx;
                                subjectResult = true;
                                subjectTitle = element1.title;
                                subjectCurrentTime = element1.time;
                                return;
                            } else {
                                subjectResult = false;
                                return;
                            }
                        });

                        if (subjectResult) {
                            
                            weeklyArray[index].subjects[subjectIndex] = {title: subjectTitle, time: subjectCurrentTime + (element.end.toDate() - element.start.toDate())} ;
                            
                        } else {
                            weeklyArray[index].subjects.push(
                                { title: title, time: (element.end.toDate() - element.start.toDate()) }
                            );
                        }

                    } else {
                        weeklyArray.push({ 
                            startDate: prevSunday,
                            endDate: nextSunday,
                            subjects: [ { title: title, time: (element.end.toDate() - element.start.toDate()) } ]
                        });
                    }
                }

                console.log(weeklyArray);
            });            
        })
        .catch(function(error) {
            console.error("Error updating document: ", error);
        });

    }, []);

    // const calculateLifeTimeStatistics = () => {
    //     var totalTime = 0;
    
    //     calendarEvents.forEach(element => {

    //         var title = element.title;
    //         var index = -1;
    //         var result = false;

    //         lifetimeArray.forEach((element, idx) => {
    //             if (element.title === title) {
    //                 index = idx;
    //                 result = true;
    //                 return;
    //             } else {
    //                 result = false;
    //                 return;
    //             }
    //         });

    //         if (result) {
    //             lifetimeArray[index].time += (element.end.toDate() - element.start.toDate());
    //             // setLifetimeArray(
    //             //     lifetimeArray[index].time += (element.end.toDate() - element.start.toDate())
    //             // );
    //         } else {
    //             lifetimeArray.push(
    //                         { title: title, time: (element.end.toDate() - element.start.toDate()) }
    //                     );
    //             // setLifetimeArray(
    //             //     lifetimeArray.push(
    //             //         { title: title, time: (element.end.toDate() - element.start.toDate()) }
    //             //     )
    //             // );
    //         }

    //         console.log(lifetimeArray);

    //         totalTime += (element.end.toDate() - element.start.toDate());
    //     });
    // }

    const calculateWeeklyTimeStatstics = () => {
        var totalTime = 0;
        // Getting the user's database document
        var docRef = db.collection("users").doc(user.email);

        // Get live updates of user's document using onSnapshot
        docRef.onSnapshot(function(doc) {
        
            // If the document exists
            if (doc.exists) {
                // Read the data into the state array
                let document = doc.data();
            
                if ((document.calendarEvents.length > 0)) {
                    let eventsArray = document.calendarEvents;
                    
                    let nextSunday = findNextSunday();
                    let prevSunday = new Date(nextSunday.getTime());
                    prevSunday.setDate(prevSunday.getDate() - 7);

                    eventsArray.forEach(element => {

                        if ((element.end.toDate() < nextSunday) && (element.start.toDate() > prevSunday)) {
                            var title = element.title;
                            var index = -1;
                            var result = false;

                            weeklyArray.forEach((element, idx) => {
                                if (element.startDate === prevSunday) {
                                    index = idx;
                                    result = true;
                                    return;
                                } else {
                                    result = false;
                                    return;
                                }
                            });

                            // console.log(result);

                            // If the week is already in the db
                            if (result) {
                                let subjectIndex = -1;
                                let subjectResult = false;
                                let subjectsArray = weeklyArray[index].subjects;
                                let subjectTitle = "";
                                let subjectCurrentTime = 0;

                                // Check if the subject already has an element
                                subjectsArray.forEach((element1, idx) => {
                                    if (element1.title === title) {
                                        subjectIndex = idx;
                                        subjectResult = true;
                                        subjectTitle = element1.title;
                                        subjectCurrentTime = element1.time;
                                        return;
                                    } else {
                                        subjectResult = false;
                                        return;
                                    }
                                });

                                if (subjectResult) {
                                    setWeeklyArray(
                                        weeklyArray[index].subjects[subjectIndex] = {title: subjectTitle, time: subjectCurrentTime + (element.end.toDate() - element.start.toDate())} 
                                    );
                                } else {
                                    setWeeklyArray(
                                        weeklyArray[index].subjects.push(
                                            { title: title, time: (element.end.toDate() - element.start.toDate()) }
                                        )
                                    );
                                }

                            } else {
                                setWeeklyArray(
                                    weeklyArray.push({ 
                                        startDate: prevSunday,
                                        endDate: nextSunday,
                                        subjects: [ { title: title, time: (element.end.toDate() - element.start.toDate()) } ]
                                    })
                                );
                            }

                            // console.log(weeklyArray);

                            totalTime += (element.end.toDate() - element.start.toDate());
                        }
                    });
                    // console.log(msToTime(totalTime));
                } 
            } 
            // If the document does not exist
            else {
            }
        });
    }

    const findNextSunday = () => {
        var options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };

        let today = new Date();
        today.setDate(today.getDate() + 1);
        let todaysDate = today.toLocaleTimeString('en-us', options);
        let dayArray = todaysDate.split(",");

        while (dayArray[0] !== "Sunday") {
            today.setDate(today.getDate() + 1);
            todaysDate = today.toLocaleTimeString('en-us', options);
            dayArray = todaysDate.split(",");
        }

        today.setHours(0);
        today.setMinutes(0);
        today.setSeconds(0);
        
        // console.log(today);
        return today;
    }

    const msToTime = (duration) => {
        // var milliseconds = parseInt((duration % 1000) / 100),
        // seconds = Math.floor((duration / 1000) % 60),
        // minutes = Math.floor((duration / (1000 * 60)) % 60),
        // hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        // hours = (hours < 10) ? "0" + hours : hours;
        // minutes = (minutes < 10) ? "0" + minutes : minutes;
        // seconds = (seconds < 10) ? "0" + seconds : seconds;

        // return hours + " hours, " + minutes + " minutes";

        return (duration / (1000 * 60 * 60)) + " hours";
    }

    Date.prototype.toString = function dateToString() {
        return `${this.getMonth() + 1}/${this.getDate()}/${this.getFullYear()}`
    };
    
    return (
        <div>
            <Navbar />
            {/* Body Section */}
            <div className="body_section">
                {/* Lifetime History */}
                <div className="lifetime_history">
                    <h1>Lifetime History</h1>
                    <div className="lifetime_flex">
                        {lifetimeArray.map((subject, idx) =>
                            <div key={idx} className="lifetime_subject">
                                <h2>{subject.title}</h2>
                                <h4>{msToTime(subject.time)}</h4>
                            </div>
                        )}
                    </div>
                </div>

                {/* Weekly History Summary */}
                <div className="weekly_history">
                    <h1 className="weekly_header">Weekly History</h1>
                    <div className="weekly_flex">
                        {weeklyArray.map((week, idx) =>
                            <div key={idx} className="weekly_section">
                                <h4 className="week_title">
                                    {"Week of " +
                                     new Date(week.startDate).toString() + " - " +
                                     new Date(week.endDate).toString() 
                                    }
                                </h4>
                                <div className="subjects_flex">
                                    {week.subjects.map((subject, idx2) => 
                                        <div key={idx2} className="weekly_subjects">
                                            <h2>{subject.title}</h2>
                                            <h4>{msToTime(subject.time)}</h4>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default History;