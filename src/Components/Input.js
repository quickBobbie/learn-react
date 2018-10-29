import React, { Component } from 'react';

export default class Input extends Component {
    constructor(props) {
        super(props);

        this.params = props.params;
    }

    render() {
        return (
            <div className="form-group">
                {
                    this.params.title && <label className="input-title">{ this.params.title }</label>
                }
                <input
                    className="form-control"
                    type={ this.params.type }
                    name={ this.params.name }
                    placeholder={ this.params.placeholder }
                    value={ this.params.value }
                    required={ this.params.required }
                    id={ this.props.id }
                    onChange={ this.props.handleChange }
                    onClick={ this.props.handleClick }
                />
            </div>
        );
    }
}