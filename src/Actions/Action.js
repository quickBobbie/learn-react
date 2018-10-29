import Crypto from 'crypto';

class Action {
    getFilteredInputs(inputs, filterObj, flag) {
        let filteredInputs = inputs.filter(item => {
            if (flag) return item[filterObj.field] !== filterObj.value;

            return item[filterObj.field] === filterObj.value;
        })

        return filteredInputs;
    }

    createHash(str) {
        return Crypto.createHmac('sha256', str)
            .update('this is secret')
            .digest('hex');
    }

    compaerePasswords(inputs) {
        const validValue = inputs[0].value;

        let result = inputs.every(item => {
            if (!item.value) return false;

            return item.value === validValue;
        })

        return result;
    }

    setData(model, data) {
        try {
            localStorage.setItem(model, JSON.stringify(data));
            return true;
        }catch (e) {
            return false;
        }

    }

    getData(model) {
        return JSON.parse(localStorage.getItem(model));
    }

    createSelectionFields(arr, field) {
        let selectionFields = [];

        for (let item of arr) {
            if (item._id || item.id)
                selectionFields.push({ value : item[field], _id : item._id?item._id:item.id })
            else
                selectionFields.push({ value : item[field] })
        }

        return selectionFields;
    }

    fieldsValid(arr, field) {
        for (let item of arr) {
            item[field] = item[field].replace(" ",'').trim();
            if (!item[field] || item.field === "") return false;
        }

        return true;
    }

    stringifyData(data) {
        let str = '';

        for (let key in data)
            str += `${ key }=${ data[key] }&`;

        return str.substring(0, str.length - 1);
    }

    setHeaders() {
        let token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization' : token?`Bearer ${token.slice(1, token.length - 1)}`:""
        };
    }

    createDate(userDate) {
        const date = new Date(userDate);

        let month = date.getMonth() + 1;
        let day = date.getDate();

        if (month.toString().length === 1) month = `0${ month }`;
        if (day.toString().length === 1) day = `0${ day }`;

        return `${ date.getFullYear() }-${ month }-${ day }`
    }

}

export default new Action();