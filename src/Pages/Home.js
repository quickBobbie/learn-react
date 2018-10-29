import React, { Component } from 'react';

import Form from '../Components/Form';
import Action from "../Actions/Action";

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            disabled : false,
            homes : this.props.homes ? this.props.homes : Action.getData('user').homes
        };

        this.addHome = this.addHome.bind(this);
        this.deleteHome = this.deleteHome.bind(this);
        this.updateHome = this.updateHome.bind(this);

        this.addRoom = this.addRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.updateRoom = this.updateRoom.bind(this);

        this.form = [
            {
                title : "Home",
                type : "select",
                name : "home",
                defaultValue : "-- select home ---",
                value : "",
                selectionIndex : undefined,
                options : this.state.homes ? Action.createSelectionFields(this.state.homes, 'homeName') : []
            },
            {
                title : "Edit home",
                placeholder : "Enter new name",
                type : 'text',
                name : "homename",
                value : ""
            },
            {
                type : "button",
                value : "Add home",
                handleClick : this.addHome
            },
            {
                type : "button",
                value : "Update home",
                handleClick : this.updateHome
            },
            {
                type : "button",
                value : "Delete home",
                handleClick : this.deleteHome
            },
            {
                title : "Room",
                type : "select",
                name : "room",
                defaultValue : "--- select room ---",
                value : '',
                selectionIndex : undefined,
                options : []
            },
            {
                title : "Edit room",
                placeholder : "Enter new name",
                type : 'text',
                name : "roomname",
                value : ""
            },
            {
                type : "button",
                value : "Add room",
                handleClick : this.addRoom
            },
            {
                type : "button",
                value : "Update room",
                handleClick : this.updateRoom
            },
            {
                type : "button",
                value : "Delete room",
                handleClick : this.deleteRoom
            }
        ];
    }

    handleSelect(inputs, target) {
        let homeSelection = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];
        let roomSelection = Action.getFilteredInputs(inputs, { field : "name", value : "room" })[0];
        let homeInput = Action.getFilteredInputs(inputs, { field : "name", value : "homename" })[0];
        let roomInput = Action.getFilteredInputs(inputs, { field : "name", value : "roomname" })[0];

        let selected = target.selectedIndex - 1;

        if (target.name === "home") {
            let rooms = Action.getData('user').homes[selected].rooms;

            homeSelection.selectionIndex = selected;
            homeSelection.value = homeSelection.options[selected].value;

            roomSelection.options = Action.createSelectionFields(rooms, "roomName");

            homeInput.value = homeSelection.value;
            roomInput.value = "";
        }

        if (target.name === "room") {
            roomSelection.selectionIndex = selected;
            roomSelection.value = roomSelection.options[selected].value;

            roomInput.value = roomSelection.value;
        }

        for (let input of inputs) {
            if (input.name === 'home') input = homeSelection;
            if (input.name === 'room') input = roomSelection;
            if (input.name === 'homename') input = homeInput;
            if (input.name === 'roomname') input = roomInput;
        }

        return inputs
    }

    addHome(inputs) {
        let homeNameInput = Action.getFilteredInputs(inputs, { field : "name", value : "homename" })[0];
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];

        if (!homeNameInput.value) return alert("No home name.");

        let data = {
            homeName : homeNameInput.value
        };

        this.setState({ disabled : true });

        fetch(
            'http://localhost:4000/home',
            {
                headers : Action.setHeaders(),
                method : "POST",
                body : Action.stringifyData(data)
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");

                return res.json();
            })
            .then(({ home }) => {
                let user = Action.getData('user');

                user.homes.push(home);
                Action.setData('user', user);

                homeSelect.options.push({
                    value : home.homeName,
                    _id : home._id
                });

                homeNameInput.value = "";

                let homes = this.state.homes;

                homes.push(home);
                this.setState({ homes : homes });
            })
            .catch(err => console.log(err));
    }

    updateHome(inputs) {
        let homeNameInput = Action.getFilteredInputs(inputs, { field : "name", value : "homename" })[0];
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];

        if (!homeNameInput.value) return alert("No home name.");

        let data = {
            homeName : homeNameInput.value
        };

        this.setState({ disabled : true });

        fetch(
            `http://localhost:4000/home/${ homeSelect.options[homeSelect.selectionIndex]._id }`,
            {
                headers : Action.setHeaders(),
                method : "PUT",
                body : Action.stringifyData(data)
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");

                return res.json();
            })
            .then(data => {
                if (data.homeName) {
                    let user = Action.getData('user');

                    for (let home of user.homes) {
                        if (home._id === homeSelect.selectionId) home.homeName = data.homeName;
                    }

                    Action.setData('user', user);

                    let homes = this.state.homes;

                    this.setState({ homes : homes });

                    homeSelect.options = Action.createSelectionFields(user.homes, "homeName");
                    homeSelect.value = data.homeName;

                    document.querySelector('select[name=home]').children[homeSelect.selectionIndex + 1].innerHTML = data.homeName
                }

            })
            .catch(err => console.log(err));
    }

    deleteHome(inputs) {
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];

        if (homeSelect.selectionIndex === undefined) return alert("Home not found.");

        this.setState({ disabled : true });

        fetch(
            `http://localhost:4000/home/${ homeSelect.options[homeSelect.selectionIndex]._id }`,
            {
                headers : Action.setHeaders(),
                method : "DELETE"
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");
                return res.json();
            })
            .then(({ message }) => {
                alert(message)
                let user = Action.getData('user');

                let homes = Action.getFilteredInputs(user.homes, { field : "_id", value : homeSelect.options[homeSelect.selectionIndex]._id }, true);

                user.homes = homes;

                homeSelect.options = Action.createSelectionFields(user.homes, "homeName");
                Action.getFilteredInputs(inputs, { field : "name", value : "homename" })[0].value = "";

                Action.setData('user', user);

                this.setState({ homes : user.homes });


            })
            .catch(err => console.log(err));
    }

    addRoom(inputs) {
        let roomNameInput = Action.getFilteredInputs(inputs, { field : "name", value : "roomname" })[0];
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];
        let roomSelect = Action.getFilteredInputs(inputs, { field : "name", value : "room" })[0];

        if (homeSelect.selectionIndex === undefined || !roomNameInput.value) return alert("Home not found and/or invalid room name.");

        let homeId = homeSelect.options[homeSelect.selectionIndex]._id;

        let data = {
            roomName : roomNameInput.value
        };

        this.setState({ disabled : true });

        fetch(
            `http://localhost:4000/home/${ homeId }/room`,
            {
                headers : Action.setHeaders(),
                method : "POST",
                body : Action.stringifyData(data)
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");

                return res.json();
            })
            .then(({ room }) => {
                let user = Action.getData('user');
                let homes = user.homes;
                let rooms = [];

                for (let home of homes) {
                    if (home._id === homeId) {
                        home.rooms.push(room);
                        rooms = home.rooms
                    }
                }

                user.homes = homes;
                Action.setData('user', user);

                roomSelect.options = Action.createSelectionFields(rooms, "roomName");

                this.setState({ homes : homes });
            })
            .catch(err => console.log(err));
    }

    updateRoom(inputs) {
        let roomNameInput = Action.getFilteredInputs(inputs, { field : "name", value : "roomname" })[0];
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];
        let roomSelect = Action.getFilteredInputs(inputs, { field : "name", value : "room" })[0];

        if (homeSelect.selectionIndex === undefined || !roomNameInput.value) return alert("Home not found and/or invalid room name.");

        let homeId = homeSelect.options[homeSelect.selectionIndex]._id;
        let roomId = roomSelect.options[roomSelect.selectionIndex]._id;

        let data = {
            roomName : roomNameInput.value
        };

        this.setState({ disabled : true });

        fetch(
            `http://localhost:4000/home/${ homeId }/room/${ roomId }`,
            {
                headers : Action.setHeaders(),
                method : "PUT",
                body : Action.stringifyData(data)
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");

                return res.json();
            })
            .then(data => {
                let user = Action.getData('user');
                let homes = user.homes;
                let rooms = [];

                for (let home of homes) {
                    if (home._id === homeId) {
                        for (let room of home.rooms) {
                            if (room._id === roomId) {
                                room.roomName = data.roomName
                                rooms = home.rooms;
                            }
                        }
                    }
                }

                user.homes = homes;
                Action.setData('user', user);

                roomSelect.options = Action.createSelectionFields(rooms, "roomName");

                this.setState({ homes : homes });
            })
            .catch(err => console.log(err));
    }


    deleteRoom(inputs) {
        let roomNameInput = Action.getFilteredInputs(inputs, { field : "name", value : "roomname" })[0];
        let homeSelect = Action.getFilteredInputs(inputs, { field : "name", value : "home" })[0];
        let roomSelect = Action.getFilteredInputs(inputs, { field : "name", value : "room" })[0];

        if (roomSelect.selectionIndex === undefined) return alert("Room not found.");

        let homeId = homeSelect.options[homeSelect.selectionIndex]._id;
        let roomId = roomSelect.options[roomSelect.selectionIndex]._id;

        this.setState({ disabled : true });

        fetch(
            `http://localhost:4000/home/${ homeId }/room/${ roomId }`,
            {
                headers : Action.setHeaders(),
                method : "DELETE"
            })
            .then(res => {
                this.setState({ disabled : false });
                if (res.status !== 200) return alert("Internal server error.");

                return res.json();
            })
            .then(({ message }) => {
                let user = Action.getData('user');
                let homes = user.homes;
                let rooms = [];

                for (let home of homes) {
                    if (home._id === homeId) {
                        for (let room of home.rooms) {
                            if (room._id !== roomId) {
                                rooms.push(room);
                            }
                        }

                        home.rooms = rooms;
                    }
                }

                user.homes = homes;
                Action.setData('user', user);

                roomSelect.options = Action.createSelectionFields(rooms, "roomName");
                roomNameInput.value = "";

                this.setState({ homes : homes });
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <section className="col-md-5 col-xs-12 col-sm-6">
                <h2>Homes</h2>
                <Form
                    form={ this.form }
                    button="Update"
                    handleSelect={ this.handleSelect }
                    disabled={ this.state.disabled }
                    />
            </section>
        );
    }
}