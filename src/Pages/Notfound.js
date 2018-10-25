import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Notfound extends Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                <h2>Page not found!</h2>
                <Link to={ this.props.path }>Go to the main page!</Link>
            </section>
        )
    }
}