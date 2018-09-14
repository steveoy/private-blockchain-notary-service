const service = require('../services/stars');
const Joi = require('joi');

//Step 2: Configure Star Registration Endpoint
exports.registerStar = function (req, res, next) {

    const starSchema = Joi.object({
        dec: Joi.string().required(),//"-26° 29'\'' 24.9",
        ra: Joi.string().required(),//"16h 29m 1.0s",
        story: Joi.string().min(4).max(500).required(),
        mag: Joi.string(),
        constellation: Joi.string().length(3)
    });

    const schema = {
        address: Joi.string().required(),
        star: starSchema
    };

    const { error } = Joi.validate(req.body, schema);
    if (error)
        return res.status(400).json(error.details[0].message);

    service.registerStar(req.body.address, req.body.star)
        .then(responseMessage => {
            res.json(responseMessage);
        })
        .catch(err => {
            res.status(400).json(err.toString());
        });
}

//Step 3: Configure Star Lookup
// GET /stars/address:[ADDRESS]
exports.getStarByOwnerAddress = function (req, res, next) {
    const schema = {
        ADDRESS: Joi.string().required()
    }

    const { error } = Joi.validate(req.params, schema);
    if (error)
        return res.status(400).json(error.details[0].message);

    service.getStarByOwnerAddress(req.params.ADDRESS)
        .then(responseMessage => {
            res.json(responseMessage);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}

// GET /stars/hash:[HASH]
exports.getStarByBlockHash = function (req, res, next) {

    const schema = {
        HASH: Joi.string().required()
    }

    const { error } = Joi.validate(req.params, schema);
    if (error)
        return res.status(400).json(error.details[0].message);


    service.getStarByBlockHash(req.params.HASH)
        .then(responseMessage => {
            res.json(responseMessage);
        })
        .catch(err => {
            res.status(400).json(err);
        });
}


