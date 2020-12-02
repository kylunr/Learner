import React from 'react';
import './About.css';
import Navbar from '../components/Navbar';
import Calendar2 from '../components/Calendar2';

function About() {
    return (
        <div className="body">
            <Navbar />
            <div className="body_section">
                <Calendar2 />
            </div>
        </div>
    );
}

export default About;