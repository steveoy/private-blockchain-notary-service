const service = require('../services/validation');
const Joi = require('joi');

exports.requestValidation = function (req, res, next) {
    const schema = {
        address: Joi.string().required()
    }

    const { error } = Joi.validate(req.body, schema);
    if (error)
        return res.status(400).json(error.details[0].message);

    service.requestValidation(req.body.address)
        .then(responseMessage => {
            res.json(responseMessage);
        })
        .catch(err => {
            res.status(400).json(err.toString());
        });
}


exports.messageSignatureValidation = function (req, res, next) {
    const requestPayload = req.body;

    const schema = {
        address: Joi.string().required(),
        signature: Joi.string().required()
    }

    const { error } = Joi.validate(requestPayload, schema);
    if (error)
        return res.status(400).json(error.details[0].message);


    service.messageSignatureValidation(requestPayload.address, requestPayload.signature)
        .then(responseMessage => {
            res.json(responseMessage);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

