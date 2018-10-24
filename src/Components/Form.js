import React, { Component } from 'react';

import Input from './Input';
import Select from './Select';

class Form extends Component {
    constructor(props) {

        super(props);
        this.state = { form : props.form }
        this.inputList = props.form
    }

    inputList = this.state ? this.state.form : [];

    handleSubmit = event => {
        event.preventDefault();

        this.setState({ form : this.props.handleSubmit(this.inputList) })

        this.forceUpdate();
    }

    handleInputChange = data => {
        this.inputList[data.id].value = data.value;


        if (this.props.inputValid) return this.props.inputValid(this.inputList);
    }

    handleSelect = (value, id, selected) => {
        this.inputList[id].value = value;

        if (this.props.handleSelect) {
            this.inputList = this.props.handleSelect(this.inputList, id, selected);

            this.setState({ from : this.inputList })
        }
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <form role="form" onSubmit={ this.handleSubmit }>
                        <fieldset disabled={ false }>
                            {
                                this.inputList.map((item, index) => {
                                    if (item.type === "select")
                                        return <Select
                                            title={ item.title }
                                            name={ item.name }
                                            value={ item.value }
                                            defaultValue={ item.defaultValue }
                                            options={ item.options }
                                            id={ index }
                                            key={ index }
                                            handleSelect={ this.handleSelect.bind(this) }
                                        />;
                                    return <Input
                                        title={ item.title }
                                        name={ item.name }
                                        placeholder={ item.placeholder }
                                        type={ item.type }
                                        value={ item.value }
                                        key={ index }
                                        id={ index }
                                        required={ item.required }
                                        handleChange={ this.handleInputChange.bind(this) }
                                    />
                                })
                            }
                            <button type="submit" className="btn btn-default col-md-12 col-xs-12">{ this.props.titleSubmit }</button>
                        </fieldset>
                    </form>
               </div>
           </div>
        )
    }

}

export default Form;