const levelDB = require('../db/levelDB_module')('validationdata', 'json');
const validationWindow = 300;

class Message {
    constructor(address) {
        const currentTimeStamp = new Date().getTime().toString().slice(0, -3);
        this.info = {
            address: address,
            requestTimeStamp: currentTimeStamp,
            message: address + ":" + currentTimeStamp + ":starRegistry",
            validationWindow: validationWindow
        }
        this.registerStar = null;
    }
}

class MessageQueue {
    constructor() {

    }

    static addMessage(address, message) {
        return levelDB._addLevelDBData(address, message);
    }

    static getMessage(address) {
        return levelDB._getLevelDBData(address);

    }

    static removeMessage(address) {
        levelDB._deleteLevelDBData(address);
    }

}

exports.Message = Message;
exports.MessageQueue = MessageQueue;
exports.messageValidationWindow = validationWindow;