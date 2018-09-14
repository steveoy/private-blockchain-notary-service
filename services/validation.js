const queue = require('../domain/messageQueue');
const bitcoinMessage = require('bitcoinjs-message');
const Message = queue.Message;
const MessageQueue = queue.MessageQueue;
const validationWindow = queue.messageValidationWindow;


exports.requestValidation = function (address) {

    const currentTimeStamp = new Date().getTime().toString().slice(0, -3);
    return new Promise((resolve, reject) => {
        MessageQueue.getMessage(address).then(message => {
            if (message.registerStar)
                reject("Star Registry is already authorized!; Please navigate to registration endpoint.");
            else if (isValidationWindowExpired(message.info.requestTimeStamp, currentTimeStamp)) {
                MessageQueue.removeMessage(address);
                reject("Validation window is expired!; Please request validation again.");
            }
            else {
                message.info.validationWindow = validationWindow - (currentTimeStamp - message.info.requestTimeStamp);
                MessageQueue.addMessage(address, message).then(() => {
                    if (message.registerStar === false)
                        reject("Message signature was invalid!. Please validate a new message signature.");
                    else
                        resolve(message.info);
                });
            }

        }).catch(err => {
            if (err) {
                if (err.notFound) { //First time requesting validation
                    const message = new Message(address);
                    MessageQueue.addMessage(address, message)
                        .then(() => {
                            resolve(message.info);
                        });
                } else
                    reject(err);
            }

        });

    });
}

exports.messageSignatureValidation = function (address, signature) {
    const currentTimeStamp = new Date().getTime().toString().slice(0, -3);
    return new Promise((resolve, reject) => {
        MessageQueue.getMessage(address).then(message => {
            if (message.registerStar)
                reject("Star Registry is already authorized!; Please navigate to registration endpoint.");
            else if (isValidationWindowExpired(message.info.requestTimeStamp, currentTimeStamp)) {
                MessageQueue.removeMessage(address);
                reject("Validation window is expired!; Please request validation again.");
            }
            else {
                try {
                    message.registerStar = bitcoinMessage.verify(message.info.message, address, signature);
                    message.info.validationWindow = validationWindow - (currentTimeStamp - message.info.requestTimeStamp);
                    MessageQueue.addMessage(address, message).then(() => {
                        resolve(validationResponseMessage(message, ""));
                    });
                } catch (err) {
                    message.registerStar = false;
                    message.info.validationWindow = validationWindow - (currentTimeStamp - message.info.requestTimeStamp);
                    MessageQueue.addMessage(address, message).then(() => {
                        resolve(validationResponseMessage(message, err));
                    });
                }
            }
        }).catch(err => {
            reject("Please request validation first!. " + err);
        });
    });
}

function isValidationWindowExpired(requestTimeStamp, currentTimeStamp) {
    const timeRemaining = validationWindow - (currentTimeStamp - requestTimeStamp);
    return timeRemaining <= 0;
}

function validationResponseMessage(message, err) {
    return {
        "registerStar": message.registerStar,
        "status": {
            "address": message.info.address,
            "requestTimeStamp": message.info.requestTimeStamp,
            "message": message.info.message,
            "validationWindow": message.info.validationWindow,
            "messageSignature": message.registerStar === true ? "valid" : "Invalid. " + err.toString()
        }
    }
}