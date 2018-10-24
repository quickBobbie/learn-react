import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import Auth from "./Pages/Auth";
import Register from './Pages/Register';
import Homes from './Pages/Homes';
import Settings from './Pages/Settings';
import Notfound from './Pages/Notfound';

import Action from "./Actions/Action";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAuthenticated : Action.getData('user')?true:false
        }

        this.auth = this.auth.bind(this);
    }

    auth(data) {
        this.setState({
            isAuthenticated : !this.state.isAuthenticated,
            user : data.user,
        });

        Action.setData('user', data.user);
        Action.setData('token', data.token);
    }

    logout() {
        localStorage.clear();
        this.setState({ isAuthenticated : false });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    {
                        this.state.isAuthenticated &&
                        <div className="row">
                            <header>
                                <h1>Title</h1>
                                <nav>
                                    <ul className="nav nav-pills">
                                        <li><Link to="/">Homes</Link></li>
                                        <li><Link to="/settings">Settings</Link></li>
                                        <li><Link to="/" onClick={ this.logout.bind(this) }>logout</Link></li>
                                    </ul>
                                </nav>
                            </header>
                            <Switch>
                                <Route exact path="/settings" render={() => ( <Settings user={ this.state.user } logout={ this.logout.bind(this) } /> )} />
                                <Route path="/" render={ () => ( <Homes homes={ this.state.homes }/> ) } />
                            </Switch>
                        </div>
                    }
                    {
                        !this.state.isAuthenticated &&
                        <div className="row">
                            <section className="col-md-6 col-md-offset-3 col-sm-12 col-xs-12">
                                <div className="row">
                                    <div className="col-md-12">
                                        <h3>Title</h3>
                                    </div>
                                </div>
                                <Switch>
                                    <Route exact path="/" render={ () => ( <Auth auth={ this.auth } /> ) } />
                                    <Route path="/signup" render={ () => ( <Register auth={ this.auth }/> ) } />
                                    <Route path="*" component={ Notfound }/>
                                </Switch>
                            </section>
                        </div>
                    }
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
