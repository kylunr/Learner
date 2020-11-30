import React from 'react';
import './About.css';
import Navbar from '../components/Navbar';
import Calendar2 from '../components/Calendar2';
import Progress from '../components/Progress';

function About() {
    return (
        <div>
            <Navbar />
            <div className="body_section">
                <Calendar2 />
                <Progress />
            </div>
        </div>
    );
}

export default About;