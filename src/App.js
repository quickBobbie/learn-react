import React, { Component } from 'react';
import { BrowserRouter, Route, Link, Switch } from 'react-router-dom';

import Signin from './Pages/Signin/Signin';
import Signup from './Pages/Signup/Signup';

import Header from './Components/Header/Header';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = { isAthenticated : true }
    }

    render() {
        return (
            <BrowserRouter>
                <div className="container">
                    { this.state.isAthenticated && <Header/> }
                    <div className="flex-container">
                        <Switch>
                            <Route exact path="/" render={ () => { return <Signin title="Signin"/> } }/>
                            <Route path="/signup" render={ () => { return <Signup title="Signup"/> } }/>
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
