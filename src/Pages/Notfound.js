import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class Notfound extends Component {
    render() {
        return (
            <div className="notfound">
                <h1>404</h1>
                <Link to="/">Go to main page</Link>
            </div>
        )
    }
}

export default Notfound;