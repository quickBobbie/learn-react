import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import Form from '../Components/Form';

import Action from '../Actions/Action';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.user = this.props.user !== {} ? this.props.user : Action.getData('user');

        console.log(this.props.user)

        this.dataForm = [
            {
                title : "Username",
                placeholder : "Enter username",
                type : 'text',
                name : "username",
                value : this.user.username ? this.user.username : ""
            },
            {
                title : "Birthday",
                placeholder : "Enter birthday",
                type : 'date',
                name : "birthday",
                value : this.user.birthday ? Action.createDate(this.user.birthday) : ""
            },
            {
                title : "Sex",
                type : "select",
                name : "sex",
                defaultValue : "--- select sex ---",
                value : this.user.sex ? this.user.sex : "",
                options : [
                    {
                        value : "male"
                    },
                    {
                        value : "female"
                    }
                ]
            }
        ];

        this.pwdForm = [
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

        this.state = { disabled : false, deleted : false };

        this.handleSubmitData = this.handleSubmitData.bind(this);
        this.handleSubmitPassword = this.handleSubmitPassword.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    handleSubmitData(inputs) {
        let data = {};

        for (let input of inputs) {
            if (input.value) data[input.name] = input.value;
        }

        if (data.birthday && new Date(data.birthday) > new Date()) {
            alert("Date of birth can not exceed today's date.");
            delete data.birthday;
        }

        if (Object.keys(data).length !== 0) {
            this.setState({ disabled : true });
            fetch(
                'http://localhost:4000/user/data',
                {
                    method : "PUT",
                    headers : Action.setHeaders(),
                    body : Action.stringifyData(data)
                }
                )
                .then(res => {
                    this.setState({ disabled : false });

                    if (res.status !== 200) return alert("Internal server error.");
                    return res.json();
                })
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                    }

                    if (data.updated) {
                        let user = Action.getData('user');

                        for (let key in data.updated) {
                            user[key] = data.updated[key];
                        }

                        this.user = user;

                        Action.setData('user', user);
                    }
                })
                .catch(err => console.log(err));
        } else alert("Empty data.")
    }

    handleSubmitPassword(inputs) {
        let oldPasswordInput = Action.getFilteredInputs(inputs, { field : "name", value : "password_old" })[0];

        if (!oldPasswordInput.value) return alert("You did not enter the old password.");

        let newPasswordInputs = Action.getFilteredInputs(inputs, { field : "description", value : "new password" });

        if (!Action.compaerePasswords(newPasswordInputs)) return alert("New passwords do not match.");

        this.setState({ disabled : true });

        let data = {
            oldPassword : Action.createHash(oldPasswordInput.value),
            newPassword : Action.createHash(newPasswordInputs[0].value)
        };

        fetch(
            'http://localhost:4000/user/password',
            {
                method : "PUT",
                headers : Action.setHeaders(),
                body : Action.stringifyData(data)
            })
            .then(res => {
                if (res.status === 500) return alert("Internal server error.");

                return res.json();
            })
            .then(({ message }) => {
                alert(message);
                for (let input of inputs) {
                    input.value = ""
                }

                this.setState({ disabled : false })
            })
            .catch(err => console.log(err));
    }

    deleteAccount() {
        let del = window.confirm("Delete account?");

        if (del) {
            this.setState({ disabled : true });

            fetch(
                'http://localhost:4000/user',
                {
                    headers : Action.setHeaders(),
                    method : "DELETE"
                }
            )
                .then(res => {
                    this.setState({ disabled : false });
                    return res.json();
                })
                .then(({ message }) => {
                    alert(message);
                    this.setState({ deleted : true })
                    this.props.logout();
                })
        }

    }

    handleSelect(inputs, target) {
        let sexSelect = Action.getFilteredInputs(inputs, { field : "name", value : "sex" })[0];

        sexSelect.value = sexSelect.options[target.selectedIndex - 1].value;
    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                { this.state.deleted && <Redirect to="/" /> }
                <h2>Settings</h2>
                <div>
                    <h3>User data</h3>
                    <Form
                        form={ this.dataForm }
                        button="Update"
                        handleSubmit={ this.handleSubmitData }
                        handleSelect={ this.handleSelect }
                        disabled={ this.state.disabled }
                    />
                </div>
                <div>
                    <h3>Password</h3>
                    <Form
                        form={ this.pwdForm }
                        button="Update"
                        handleSubmit={ this.handleSubmitPassword }
                        disabled={ this.state.disabled }
                    />
                </div>

                <button onClick={ this.deleteAccount } disabled={ this.state.disabled } className="link-btn btn btn-default col-md-12 col-xs-12">Delete account</button>
            </section>
        );
    }
}