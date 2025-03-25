// src/App.tsx
import React from 'react';
import Calendar from './components/Calendar';
import "./App.css";

const App: React.FC = () => {
    return (
        <div> 
            <div className='header'>
                <img src="..\public\icon.png" alt="Logo" className='logo'/>
                <div className='title'>DEADLINED</div>
            </div>
            <div className="app">
                <Calendar/>
            </div>
        </div>
    );
};

export default App;
