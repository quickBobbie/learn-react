import React, { Component } from 'react';

export default class Select extends Component {
    constructor(props) {
        super(props);

        this.params = props.params;
    }

    render() {
        return (
            <div>
                {
                    this.params.title && <label className="input-title">{ this.params.title }</label>
                }
                <select className="form-control" value={ this.params.value?this.params.value:this.params.defaultValue } id={ this.props.id } onChange={ this.props.handleChange }>
                    <option disabled>{ this.params.defaultValue }</option>
                    {
                        this.params.options.map((value, index) => {
                            return <option key={ index } value={ value }>{ value }</option>
                        })
                    }
                </select>
            </div>
        );
    }
}