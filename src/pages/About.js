import React from 'react';
import './About.css';
import Navbar from '../components/Navbar';

function About() {
    return (
        <div className="body">
            <Navbar />
            <div className="about-section">
                <h1 className="about-header">About</h1>
                
                <h2 className="guide-header">Guide</h2>
                <ul className="head-list">
                    <li className="list-section-header">Subjects</li>
                    <ul>
                        <li><span className="list-header">To add a subject:</span> enter a name and press the submit button</li>
                        <li><span className="list-header">To delete a subject:</span> press the x button to the right of the subject</li>
                    </ul>

                    <li className="list-section-header">Events</li>
                    <ul>
                        <li><span className="list-header">To add an event:</span> drag the desired subject to the desired date and time in the calendar</li>
                        <li><span className="list-header">To move an event:</span> drag an event to the new desired date and time</li>
                        <li><span className="list-header">To resize an event:</span> hover over and click the bottom of the event and drag to the new desired length</li>
                        <li><span className="list-header">To delete an event:</span> click the event, a prompt will appear asking for confirmation of the delete</li>
                    </ul>

                    <li className="list-section-header">Goals</li>
                    <ul>
                        <li><span className="list-header">To change the duration of a goal:</span> click on the goal, a prompt will appear asking to enter a new goal length in hours</li>
                    </ul>
                </ul>
            </div>
        </div>
    );
}

export default About;