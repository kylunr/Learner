import React from 'react';
import './About.css';
import Navbar from '../components/Navbar'

function About() {
    return (
        <div>
            <Navbar />
            <div className="about">
                <h1>About</h1>
            </div>
        </div>
    );
}

export default About;