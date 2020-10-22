import React from 'react';
import './Home.css';
import Navbar from '../components/Navbar'

function Home() {
    return (
        <div>
            <Navbar />
            <div className="home">
                <h1>Home</h1>
            </div>
        </div>
    );
}

export default Home;