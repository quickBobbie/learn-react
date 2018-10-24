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
        let requiredInputs = Action.getFilteredInputs(inputs, { field : "required", value : true });

        if (!Action.fieldsValid(requiredInputs, "value")){
            return alert("Empty fields.")
        }

        this.setState({ disabled : true });

        let data = {};

        for (let input of inputs) {
            if (input.type !== "password") data[input.name] = input.value;
        }

        let passwordInputs = Action.getFilteredInputs(inputs, { field : "type", value : "password" });

        if (Action.compaerePasswords(passwordInputs)) {
            data.password = passwordInputs[0].value;
            data.password = Action.createHash(data.password);

            fetch(
                'http://localhost:4000/user/signup',
                {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/x-www-form-urlencoded"
                    },
                    body : Action.stringifyData(data)
                }
                )
                .then(res => {
                    this.setState({ disabled : false });
                    return res.json();
                })
                .then(data => {
                    console.log(data);
                })
                .catch(err => console.log(err));
        } else {
            alert("Passwords do not match.")
            this.setState({ disabled : false });
        }


    }

    render() {
        return (
            <section className="col-md-4 col-xs-12 col-sm-6">
                <h1>{ this.props.title }</h1>
                <Form
                    form={ this.form }
                    button="Signup"
                    handleSubmit={ this.handleSubmit }
                    disabled={ this.state.disabled }
                />
                <Link to="/" className="link-btn btn btn-default col-md-12 col-xs-12">Signin</Link>
            </section>
        );
    }
}