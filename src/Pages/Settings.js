import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Form from '../Components/Form';

import Action from '../Actions/Action';

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.user = Action.getData('user');

        this.form = [
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
                    "male",
                    "female"
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
        ];

        this.state = { disabled : false };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    handleSubmit(inputs) {
        let data = {};

        for (let input of inputs) {
            if (input.value) data[input.name] = input.value;
        }

        if (data.birthday && new Date(data.birthday) > new Date()) {
            alert("Date of birth can not exceed today's date.");
            delete data.birthday;
        }

        if (data.password_old && data.password_1 && data.password_2){
            if (data.password_1 === data.password_2) {
                data.password = data.password_1;
            } else {
                alert("passwords do not match.")
            }
        }

        delete data.password_old;
        delete data.password_1;
        delete data.password_2;

        if (Object.keys(data).length !== 0) {
            this.setState({ disabled : true });

            fetch(
                'http://localhost:4000/user',
                {
                    method : "PUT",
                    headers : Action.setHeaders(),
                    body : Action.stringifyData(data)
                }
                )
                .then(res => {
                    this.setState({ disabled : false });
                    return res.json();
                })
                .then(data => {
                    if (data.message) {
                        alert(data.message);
                    } else if (data.user) {
                        Action.setData('user', data.user);
                    }
                })
                .catch(err => console.log(err));
        } else alert("Empty data.")
    }

    deleteAccount() {
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
                this.props.logout();
            })
    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                <h2>Settings</h2>
                <Form
                    form={ this.form }
                    button="Seve"
                    handleSubmit={ this.handleSubmit }
                    disabled={ this.state.disabled }
                />
                <Link onClick={ this.deleteAccount } disabled={ this.state.disabled } to="/" className="link-btn btn btn-default col-md-12 col-xs-12">Delete account</Link>
            </section>
        );
    }
}