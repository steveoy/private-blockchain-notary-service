var messageQueue = require('../domain/messageQueue');

exports.requestValidation = function (req, res, next) {
    var userData = req.body;

    messageQueue.requestValidation(userData)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(400).send(err);
        })
}


exports.messageSignatureValidation = function (req, res, next) {
    var userData = req.body;

    messageQueue.messageSignatureValidation(userData)
        .then(user => {
            res.send(user)
        })
        .catch(err => {
            res.status(400).send(err);
        })
}

