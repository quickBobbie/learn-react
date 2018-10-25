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
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();

        this.props.handleSubmit(this.state.inputs);

    }

    handleChange(event) {
        let state = this.state;

        state.inputs[event.target.id].value = event.target.value;

        this.setState(state);
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
                                    handleChange={ this.handleChange }
                                />
                            }
                            return <Input
                                key={ index }
                                id={ index }
                                params={ value }
                                handleChange={ this.handleChange }
                            />
                        })
                    }
                    <button type="submit" className="btn btn-default col-md-12 col-xs-12">{ this.props.button }</button>
                </fieldset>
            </form>
        );
    }
}