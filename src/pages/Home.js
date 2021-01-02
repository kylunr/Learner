import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';

function Home() {
    return (
        <div className="body">
            <Navbar />
            <div className="body_section">
                <Calendar />
            </div>
        </div>
    );
}

export default Home;