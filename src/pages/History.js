import React, { useEffect, useState } from 'react';
import './History.css';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';

function History() {

    const user = useSelector(selectUser);

    useEffect(() => {
        calculateLifeTimeStatistics();
    }, []);

    let [lifetimeArray, setLifetimeArray] = useState([]);
    let [weeklyArray, setWeeklyArray] = useState([]);

    const calculateLifeTimeStatistics = () => {
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
                    console.log(eventsArray);

                    eventsArray.forEach(element => {
                        totalTime += (element.end.toDate() - element.start.toDate());
                    });

                    console.log(msToTime(totalTime));
                    return <p>{totalTime}</p>;
                } 
            } 
            // If the document does not exist
            else {
                return <p></p>;
            }
        });
    }

    const calculateWeeklyTimeStatstics = () => {
    }

    const msToTime = (duration) => {
        var milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
    }

    return (
        <div>
            <Navbar />
            {/* Body Section */}
            <div className="body_section">
                {/* Lifetime History */}
                <div className="lifetime_history">
                    <h1>Lifetime History</h1>
                    <p id="test"></p>
                </div>

                {/* Weekly History Summary */}
                <div className="weekly_history">
                    <h1>Weekly History</h1>
                </div>
            </div>
        </div>
    );
}

export default History;