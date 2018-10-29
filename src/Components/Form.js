import React, { Component } from 'react';

import Input from './Input';
import Select from './Select';

export default class From extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs : props.form
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.handleSubmit(this.state.inputs);

    }

    handleSelect(event) {
        let inputs = this.props.handleSelect(this.state.inputs, event.target);

        if (typeof inputs === "object") this.setState({ inputs });
    }

    handleChange(event) {
        let state = this.state;

        state.inputs[event.target.id].value = event.target.value;

        this.setState(state);
    }

    handleClick(handler) {
        handler(this.state.inputs)
    }

    render() {
        return (
            <form role="form" onSubmit={ this.handleSubmit }>
                <fieldset disabled={ this.props.disabled }>
                    {
                        this.state.inputs.map((value, index) => {
                            if (value.type === 'select') {
                                return <Select
                                    key={ index }
                                    id={ index }
                                    params={ value }
                                    handleChange={ this.handleSelect }
                                />
                            }
                            return <Input
                                key={ index }
                                id={ index }
                                params={ value }
                                handleChange={ this.handleChange }
                                handleClick={ () => {return this.handleClick(value.handleClick)} }
                            />
                        })
                    }
                    {
                        this.props.handleSubmit &&
                        <button type="submit" className="btn btn-default col-md-12 col-xs-12">{ this.props.button }</button>
                    }
                </fieldset>
            </form>
        );
    }
}