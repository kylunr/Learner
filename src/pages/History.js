import React from 'react';
import './History.css';
import Navbar from '../components/Navbar';
import Calendar from '../components/Calendar';
import Calendar2 from '../components/Calendar2';
import Subjects from '../components/Subjects';

function History() {
    return (
        <div>
            <Navbar />
            <div className="body_section">
                <Calendar2 />
            </div>
        </div>
    );
}

export default History;