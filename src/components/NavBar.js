import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = (props) => {
    return (
        <nav className="navbar navbar-expand-md navbar-dark bg-dark">
            <div className="container-fluid">
                <div className="navbar-header">
                    <span className="navbar-brand">MQTT.js Client for React Web</span>
                </div>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link to="/request_response_pattern" className="nav-link">Request/Response Pattern</Link>
                        </li>
                        <li className="nav-item">
                            <Link to="/broadcast" className="nav-link">Boardcast</Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default NavBar;