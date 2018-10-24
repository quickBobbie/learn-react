import React, { Component } from 'react';

import Form from '../Components/Form';

import Action from '../Actions/Action';

class Homes extends Component {
    constructor(props) {
        super(props);

        this.form = [
            {
                title : "Home",
                type : "select",
                name : "home",
                defaultValue : "--- select home ---",
                value : '',
                selectionId : "",
                options : Action.createSelectionFields(Action.getData('homes')?Action.getData('homes'):this.getHomes(), 'homeName')
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

    getHomes() {
        fetch('http://localhost:4000/home', {
            headers : Action.setHeaders()
        })
            .then(res => res.json())
            .then(data => {
                if (data.homes) return data.homes
                    else return [];
            })
            .catch(err => console.log(err));
    }

    handleSubmit(inputs) {
        let homeList = Action.getData('homes');

        let inputHome = Action.getFilteredInputs(inputs, { field : 'name', value : 'homename' })[0];
        let inputRoom = Action.getFilteredInputs(inputs, { field : 'name', value : 'roomname' })[0];

        let selectionHome = Action.getFilteredInputs(inputs, { field : 'name', value : 'home' })[0];
        let selectionRoom = Action.getFilteredInputs(inputs, { field : 'name', value : 'room' })[0];

        for (let homeItem of homeList) {
            if (homeItem._id === selectionHome.selectionId) {
                if (homeItem.homeName !== inputHome.value) {
                    homeItem.homeName = inputHome.value;
                    selectionHome.value = inputHome.value;

                    for (let optionItem of selectionHome.options)
                        if (optionItem._id === selectionHome.selectionId) optionItem.value = inputHome.value;
                }

                for (let roomItem of homeItem.rooms) {
                    if (roomItem.id === selectionRoom.selectionId)
                        if (roomItem.roomName !== inputRoom.value) {
                            roomItem.roomName = inputRoom.value;
                            selectionRoom.value = inputRoom.value;

                            for (let optionItem of selectionRoom.options)
                                if (optionItem._id === selectionRoom.selectionId) optionItem.value = inputRoom.value;
                        }
                }
            }
        }

        Action.setData('homes', homeList);

        return [
            selectionHome,
            inputHome,
            selectionRoom,
            inputRoom
        ];
    }

    handleSelect(inputs, id, selected) {
        let homeList = Action.getData('homes');

        let selectionRoom = Action.getFilteredInputs(inputs, { field : 'name', value : 'room' })[0];

        let inputHome = Action.getFilteredInputs(inputs, { field : 'name', value : 'homename' })[0];
        let inputRoom = Action.getFilteredInputs(inputs, { field : 'name', value : 'roomname' })[0];

        if (inputs[id].name === 'home') {
            let homeID = inputs[id].options[selected - 1]._id;
            let home = Action.getFilteredInputs(homeList, { field : '_id', value : homeID })[0];

            selectionRoom.options = Action.createSelectionFields(home.rooms, 'roomName');

            inputHome.value = inputs[id].value;
            inputs[id].selectionId = homeID;
        }

        if (inputs[id].name === 'room') {
            selectionRoom.selectionId = selectionRoom.options[selected - 1]._id;

            inputRoom.value = selectionRoom.value;
        }

        for (let index in inputs){
            if (inputs[index].extend === parseInt(id)) inputs[index] = selectionRoom;
            if (inputs[index].name === inputHome.name) inputs[index] = inputHome;
        }

        return inputs;
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-6 col-md-offset-3">
                    <Form
                        form={ this.form }
                        handleSubmit={ this.handleSubmit }
                        titleSubmit="Save"
                        handleSelect={ this.handleSelect }
                    />
                </div>
            </div>
        );
    }
}

export default Homes;