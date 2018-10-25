import React, { Component } from 'react';

import Form from '../Components/Form';
import Action from "../Actions/Action";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = { disabled : false, homes : Action.getData('homes')?Action.getData('homes'):[] };

        this.form = [
            {
                title : "Home",
                type : "select",
                name : "home",
                defaultValue : "--- select home ---",
                value : '',
                selectionId : "",
                options : this.state.homes
            },
            {
                title : "Edit home",
                placeholder : "Enter new name",
                type : 'text',
                name : "homename",
                value : ""
            },
            {
                title : "Room",
                type : "select",
                name : "room",
                defaultValue : "--- select room ---",
                value : '',
                selectionId : "",
                options : []
            },
            {
                title : "Edit room",
                placeholder : "Enter new name",
                type : 'text',
                name : "roomname",
                value : ""
            }
        ];
    }

    componentDidMount() {
        if (!this.state.homes) {
            fetch(
                'http://localhost:4000/home',
                {
                    headers : Action.setHeaders()
                }
            )
                .then(res => res.json())
                .then(data => {
                    if (data.homes) {
                        Action.setData('homes', data.homes);
                        this.setState({ homes : data.homes });
                    } else if (data.message) {
                        alert(data.message);
                    }
                })
                .catch(err => console.log(err));
        }

    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                <h2>Homes</h2>
                <Form
                    form={ this.form }
                    button="Seve"
                    handleSubmit={ this.handleSubmit }
                    disabled={ this.state.disabled }
                />
            </section>
        );
    }
}