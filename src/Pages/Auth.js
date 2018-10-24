import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Form from '../Components/Form';
import Modal from '../Components/Modal';

import Action from '../Actions/Action';
import Hash from '../Actions/Hash';

class Auth extends Component {
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
                name : "password",
                value : "",
                required : true
            }
        ];
    }

    handleSubmit = inputs => {
        if (!Action.fieldsValid(inputs, "value")) {
            return alert("It is not possible to log in with empty data.");
        }

        let loginInput = Action.getFilteredInputs(inputs, { field : 'name', value : "login" })[0];
        let passwordInput = Action.getFilteredInputs(inputs, { field : "name", value : "password" })[0];

        let data = {
            login : loginInput.value,
            password : new Hash(passwordInput.value).encode()
        };

        if (!this.state.loading) {
            fetch('http://localhost:4000/user/signin', {
                headers: Action.setHeaders(),
                method : "POST",
                body : Action.stringifyData(data)
            })
                .then(res => {
                    if (res.status !== 200) {
                        alert("Invalid login and/or password!");
                        this.setState({ loading : false, redirected : false });
                        document.querySelector('fieldset').disabled = false ;
                    }
                    return res.json();
                })
                .then(data => {
                    this.setState({ loading : false, redirected : false });
                    document.querySelector('fieldset').disabled = false ;
                    this.props.auth(data);
                })
                .catch(err => console.log(err));
        } else {
            let modalText = document.querySelector('text');

            modalText.innerHTML = "You stupid?"
        }

        this.setState({ loading : true, redirected : false });
        document.querySelector('fieldset').disabled = true;
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
                    titleSubmit="Sign In"
                />
                <button disabled={ this.state.loading?"desabled":"" } onClick={ this.redirect.bind(this) } className="btn btn-default col-md-12 col-xs-12">Sign Up</button>
                { this.state.loading && <Modal/> }
                { this.state.redirected && <Redirect to="/signup" /> }
            </div>
        )
    }
}

export default Auth;