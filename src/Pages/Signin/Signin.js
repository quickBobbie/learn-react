import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Form from '../../Components/Form';

import Inputs from './Inputs';

import Action from '../../Actions/Action';

export default class Signin extends Component {
    constructor(props) {
        super(props);

        this.form = Inputs;

        this.state = { disabled : false };

        this.handleSubmit = this.handleSubmit.bind(this)
    }

    handleSubmit(inputs) {
        if (!Action.fieldsValid(inputs, "value")) return;

        this.setState({ disabled : true });

        let passwordInput = Action.getFilteredInputs(inputs, { field : "name", value : "password" })[0];
        let loginInput = Action.getFilteredInputs(inputs, { field : "name", value : "login" })[0];

        let data = {
            login : loginInput.value,
            password : Action.createHash(passwordInput.value)
        };

        fetch(
                'http://localhost:4000/user/signin',
                {
                    method : "POST",
                    headers : Action.setHeaders(),
                    body : Action.stringifyData(data)
                }
            )
            .then(res => {
                this.setState({ disabled : false });
                return res.json();
            })
            .then(data => {
                this.props.autherize(data);
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                <h2>{ this.props.title }</h2>
                <Form
                    form={ this.form }
                    button="Signin"
                    handleSubmit={ this.handleSubmit }
                    disabled={ this.state.disabled }
                />
                <Link to="/signup" className="link-btn btn btn-default col-md-12 col-xs-12">Signup</Link>
            </section>
        );
    }
}