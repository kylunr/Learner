import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar';

function Home() {
    return (
        <div>
            <Navbar />
            <div className="home">

                {/* Calendar object section */}
                <div className="calendar_object_section">
                </div>

                {/* Calendar section */}
                <div className="calendar_section">
                    
                </div>

                {/* Progress section */}
                <div className="progress_section">
                    
                </div>
            </div>
        </div>
    );
}

export default Home;