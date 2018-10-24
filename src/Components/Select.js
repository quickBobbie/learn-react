import React, { Component } from 'react';

class Select extends Component {
    constructor(props) {
        super(props);
    }

    handleChange = event => {
        this.props.handleSelect(event.target.value, event.target.id, event.target.selectedIndex);
    }

    render() {
        return (
            <div>
                {
                    this.props.title && <label className="input-title" htmlFor="exampleInputEmail1">{ this.props.title }</label>
                }
                <select className="form-control" onChange={ this.handleChange.bind(this) } id={ this.props.id }>
                    <option selected disabled>{ this.props.defaultValue }</option>
                    {
                        this.props.options.map((item, index) => {
                            return <option value={ item.value } key={ index } selected={ item.selected }>{ item.value }</option>
                        })
                    }
                </select>
            </div>
        );
    }
}

export default Select;