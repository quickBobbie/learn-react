import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import './Header.css';

export default class Header extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <header>
                <h1>Title</h1>
                <nav>
                    <ul className="nav nav-pills">
                        <li><Link to="/">Homes</Link></li>
                        <li><Link to="/settings">Settings</Link></li>
                        <li><Link to="/" onClick={ this.props.logout }>logout</Link></li>
                    </ul>
                </nav>
            </header>
        );
    }
}