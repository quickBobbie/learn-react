import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Action from '../Actions/Action';
import Hash from '../Actions/Hash';

import Form from '../Components/Form';
import Modal from '../Components/Modal';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.user = this.props.user?this.props.user:Action.getData('user');

        this.state = { loading : false, redirected : false };

        this.form = [
            {
                title : "Name",
                type : 'text',
                name : "username",
                value : this.user.username
            },
            {
                title : "Birthday",
                placeholder : "Enter birthday",
                type : 'date',
                name : "birthday",
                value : this.user.birthday?Action.createDate(this.user.birthday):""
            },
            {
                title : "Sex",
                type : "select",
                name : "sex",
                defaultValue : "--- select sex ---",
                value : this.user.sex?this.user.sex:"",
                options : [
                    {
                        value : "male",
                        selected : this.user.sex === "male"
                    },
                    {
                        value : "female",
                        selected : this.user.sex === 'female'
                    }
                ]
            },
            {
                title : "Password",
                placeholder : "Enter old password",
                type : 'password',
                description : "old password",
                name : "password_old",
                value : ""
            },
            {
                placeholder : "Enter new password",
                type : 'password',
                description : "new password",
                name : "password_1",
                value : ""
            },
            {
                placeholder : "Repeat new password",
                type : 'password',
                description : "new password",
                name : "password_2",
                value : ""
            }
        ]
    }

    handleSubmit = inputs => {
        const passwordInputs = Action.getFilteredInputs(inputs, { field : "type", value : "password" });

        let data = {};

        let oldPassword = Action.getFilteredInputs(passwordInputs, { field : 'description', value : 'old password' })[0];
        let newPasswords = Action.getFilteredInputs(passwordInputs, { field : 'description', value : 'new password'});

        if (oldPassword.value && Action.compaerePasswords(newPasswords)) {
            data.newPassword = new Hash(newPasswords[0].value).encode();
            data.oldPassword = new Hash(oldPassword.value).encode();
        } else if (oldPassword.value && !Action.compaerePasswords(newPasswords)){
            alert("Passwords not match");
        }

        const withoutPassword = Action.getFilteredInputs(inputs, { field : "type", value : "password" }, true);

        for (let item of withoutPassword)
            data[item.name] = item.value;

        if(!this.state.loading) {
            fetch('http://localhost:4000/user', {
                    headers : Action.setHeaders(),
                    method : "PUT",
                    body : Action.stringifyData(data)
                })
                .then(res => res.json())
                .then(({ user, message }) => {
                    if (user) {
                        Action.setData('user', user);
                    }

                    if(message){
                        alert(message);
                    }

                    this.setState({ loading : false });
                    document.querySelector('fieldset').disabled = false;
                })
                .catch(err => console.log(err));
        } else {
            let modalText = document.querySelector('text');

            modalText.innerHTML = "You stupid?"
        }

        this.setState({ loading : true });

        for (let input of passwordInputs) {
            for (let inputItem of inputs) {
                if (inputItem.name === input.name) inputItem = input;
            }
        }

        document.querySelector('fieldset').disabled = true;

        this.form = inputs;

        return inputs;

    }

    inputValid = (inputs) => {
        let password_1 = Action.getFilteredInputs(inputs, { field : "name", value : "password_1" })[0];
        let password_2 = Action.getFilteredInputs(inputs, { field : "name", value : "password_2" })[0];

        if (password_1.value !== password_2.value)
            return "form-group has-error"
        else
            return "form-group";
    }

    deleteAccount() {
        if (!this.state.loading) {
            let del = window.confirm("Delete account?");

            if (del) {
                fetch('http://localhost:4000/user', {
                        headers : Action.setHeaders(),
                        method : "DELETE"
                    })
                    .then(res => res.json())
                    .then(({ message }) => {
                        if (message === "success") {
                            this.setState({ loading : false, redirected : true  })
                            alert("Account deleted");
                            this.props.logout();
                        }
                    })
                    .catch(err => console.log(err))
            }
        } else {
            let modalText = document.querySelector('text');

            modalText.innerHTML = "You stupid?"
        }

        this.setState({ loading : true });
        document.querySelector('fieldset').disabled = true;
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <Form
                        form={ this.form }
                        handleSubmit={ this.handleSubmit }
                        inputValid={ this.inputValid }
                        titleSubmit="Save"
                    />
                    <button disabled={ this.state.loading?"disabled":"" } onClick={ this.deleteAccount.bind(this) } className="btn btn-default col-md-12 col-xs-12">Delete account</button>
                    { this.state.loading && <Modal/> }
                    { this.state.redirected && <Redirect to="/"/> }
                </div>
            </div>
        )
    }
}

export default Settings;