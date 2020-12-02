import React, { useEffect, useState, useReducer, useRef } from 'react';
import './History.css';
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';
import db from '../firebase';


function withMyHook(Component) {
    return function WrappedComponent(props) {
        const myHookValue = useSelector(selectUser);
        return <Component {...props} myHookValue={myHookValue} />;
    }
}

class History2 extends React.Component {

    componentDidMount() {
        this.calculateLifeTimeStatistics();
    }

    state = {
        user: this.props.myHookValue,
        lifetimeArray: [],
        weeklyArray: []
    };

    calculateLifeTimeStatistics = () => {
        var totalTime = 0;
        
        // Getting the user's database document
        var docRef = db.collection("users").doc(this.state.user.email);

        // Get live updates of user's document using onSnapshot
        docRef.onSnapshot(function(doc) {
        
            // If the document exists
            if (doc.exists) {
                // Read the data into the state array
                let document = doc.data();

                if ((document.calendarEvents.length > 0)) {
                    let eventsArray = document.calendarEvents;
                    // console.log(eventsArray);

                    eventsArray.forEach(element => {

                        var title = element.title;
                        var index = -1;
                        var result = false;

                        if (this.state.lifetimeArray()) {
                            this.state.lifetimeArray.forEach((element, idx) => {
                                if (element.title === title) {
                                    index = idx;
                                    result = true;
                                    return;
                                } else {
                                    result = false;
                                    return;
                                }
                            });

                        }

                        // console.log(result);

                        if (result) {
                            this.setState({
                                lifetimeArray: this.state.lifetimeArray[index].time += (element.end.toDate() - element.start.toDate())
                            });
                        } else {
                            this.setState({
                                lifetimeArray: this.state.lifetimeArray.push({ title: title, time: (element.end.toDate() - element.start.toDate()) })
                            });
                        }

                        console.log(this.state.lifetimeArray);

                        totalTime += (element.end.toDate() - element.start.toDate());
                    });
                } 
            } 
            // If the document does not exist
            else {
            }

            // console.log(msToTime(totalTime));
        });
    }


    render() {
        return (
            <div>
            <Navbar />
            {/* Body Section */}
            <div className="body_section">
                {/* Lifetime History */}
                <div className="lifetime_history">
                    {this.state.lifetimeArray.map((subject, idx) =>
                        <div key={idx} className="lifetime_subject">
                            <h2>{subject.title}</h2>
                            <h4>{subject.time}</h4>
                        </div>
                    )}
                </div>

                {/* Weekly History Summary */}
                <div className="weekly_history">
                    <h1>Weekly History</h1>
                </div>
            </div>
        </div>
        );
    }
}

export default withMyHook(History2);