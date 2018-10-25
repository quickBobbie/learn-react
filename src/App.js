import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';
import Settings from './Pages/Settings';
import Home from './Pages/Home';
import Notfound from './Pages/Notfound';

import Header from './Components/Header/Header';

import Action from './Actions/Action';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { isAuthenticated : Action.getData('token')?true:false };

        this.autherize = this.autherize.bind(this);
        this.logout = this.logout.bind(this);
    }

    autherize(data) {
        Action.setData('token', data.token);
        Action.setData('user', data.user);

        this.setState({ isAuthenticated : true });
    }

    logout() {
        localStorage.clear();

        this.setState({ isAuthenticated : false });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    {
                        this.state.isAuthenticated &&
                            <div className="container">
                                <Header logout={ this.logout } />
                            </div>
                    }

                    <div className="flex-container">
                        <Switch>
                            { !this.state.isAuthenticated && <Route exact path="/" render={ () => { return <Signin title="Signin" autherize={ this.autherize } /> } }/> }
                            { !this.state.isAuthenticated && <Route path="/signup" render={ () => { return <Signup title="Signup" autherize={ this.autherize } /> } }/> }
                            { this.state.isAuthenticated && <Route exact path="/" render={ () => { return <Home/> } }/> }
                            { this.state.isAuthenticated && <Route path="/settings" render={ () => { return <Settings logout={ this.logout }/>} }/> }

                            <Route path="*" render={ () => { return <Notfound path={ this.state.isAuthenticated?"/settings":"/" }/> } }/>

                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
