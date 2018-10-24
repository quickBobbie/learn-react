import React from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

export default function Header() {
    return (
        <header>
            <h1>Title</h1>
            <nav>
                <ul className="nav nav-pills">
                    <li><Link to="/">Homes</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                    <li><Link to="/">logout</Link></li>
                </ul>
            </nav>
        </header>
    );
}