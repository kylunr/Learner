import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Calendar2 from '../components/Calendar2';

function Home() {
    return (
        <div className="body">
            <Navbar />
            <div className="body_section">
                <Calendar2 />
            </div>
        </div>
    );
}

export default Home;