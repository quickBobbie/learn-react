import React, { Component } from 'react';

class Input extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value : this.props.value
        }
    }

    className = "form-group";

    handleChange = event => {
        let input = event.target;
        let className = this.props.handleChange({id: input.id, value: input.value});

        if (input.name === 'password_2')
            input.parentElement.className = className;

        this.setState({ value : input.value });
    }

    render() {
        return (
            <div className={ this.className }>
                {
                    this.props.title && <label className="input-title" htmlFor="exampleInputEmail1">{ this.props.title }</label>
                }
                <input
                    type={ this.props.type }
                    name={ this.props.name }
                    placeholder={ this.props.placeholder }
                    value={ this.state.value }
                    required={ this.props.required }
                    id={ this.props.id }
                    className="form-control"
                    onChange={ this.handleChange }
                />
            </div>
        )
    }

}

export default Input;