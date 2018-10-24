import Crypto from 'crypto';

class Hash {
    constructor(str) {
        this.str = str;
    }

    encode() {
        return Crypto.createHmac('sha256', this.str).update('update string').digest('hex');
    }
}

export default Hash;