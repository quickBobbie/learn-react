import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Action from '../Actions/Action';
import Hash from '../Actions/Hash';

import Form from '../Components/Form';
import Modal from "../Components/Modal";

class Register extends Component {
    constructor(props) {
        super(props);

        this.state = { loading : false, redirected : false };

        this.form = [
            {
                title : "Login",
                placeholder : "Enter login",
                type : 'text',
                name : "login",
                value : "",
                required : true
            },
            {
                title : "Password",
                placeholder : "Enter password",
                type : 'password',
                name : "password_1",
                value : "",
                required : true
            },
            {
                placeholder : "Repeat password",
                type : 'password',
                name : "password_2",
                value : "",
                required : true
            },
            {
                title : 'Email',
                placeholder : "Enter email",
                type : 'email',
                name : 'email',
                value : '',
                required : true
            },
            {
                title : "Name",
                placeholder : "Enter name",
                type : 'text',
                name : "username",
                value : "",
                required : false
            },
            {
                title : "Birthday",
                placeholder : "Enter birthday",
                type : 'date',
                name : "birthday",
                value : "",
                required : false
            }
        ]
    }

    handleSubmit = inputs => {
        let requiredInputs = Action.getFilteredInputs(inputs, { field : 'required', value : true });
        let passwordInputs = Action.getFilteredInputs(inputs, { field : "type", value : "password" });

        if (!Action.fieldsValid(requiredInputs, "value")) {
            return alert("It is not possible to log in with empty data.");
        }

        if (Action.compaerePasswords(passwordInputs)) {
            let password = new Hash(passwordInputs[0].value).encode();

            let data = {};

            data.password = password;

            const withoutPassword = Action.getFilteredInputs(inputs, { field : 'type', value : 'password' }, true);

            for (let item of withoutPassword)
                data[item.name] = item.value;

            if (!this.state.loading) {
                fetch('http://localhost:4000/signup', {
                        headers: Action.setHeaders(),
                        method : "POST",
                        body : Action.stringifyData(data)
                    })
                    .then(res => res.json())
                    .then(data => {
                        if (data.message) {
                            alert(data.message);
                        } else {
                            if (data.status !== "") alert(data.status);
                            this.props.auth(data);
                        }

                        document.querySelector('fieldset').disabled = false;

                        this.setState({ loading : false, redirected : false });
                    })
                    .catch(err => {
                        console.log(err)
                    });
            } else {
                let modalText = document.querySelector('text');

                modalText.innerHTML = "You stupid?"
            }

            this.setState({ loading : true, redirected : false });
            document.querySelector('fieldset').disabled = true;

        } else alert("Passwords not match");

    }

    inputValid = inputs => {
        let password_1 = Action.getFilteredInputs(inputs, { field : "name", value : "password_1" })[0];
        let password_2 = Action.getFilteredInputs(inputs, { field : "name", value : "password_2" })[0];

        if (password_1.value !== password_2.value)
            return "form-group has-error"
        else
            return "form-group";
    }

    redirect() {
        let redirected = false;
        if (!this.state.loading) redirected = true;

        this.setState({ loading : this.state.loading, redirected : redirected });
    }

    render() {
        return (
            <div>
                <Form
                    form={ this.form }
                    handleSubmit={ this.handleSubmit.bind(this) }
                    inputValid = { this.inputValid.bind(this) }
                    titleSubmit="Sign Up"
                />
                {this.state.loading && <Modal/>}
                <button disabled={ this.state.loading?"disabled":"" } onClick={ this.redirect.bind(this) } className="btn btn-default col-md-12 col-xs-12">Sign In</button>
                { this.state.redirected && <Redirect to="/" /> }
            </div>

        );
    }
}

export default Register;
