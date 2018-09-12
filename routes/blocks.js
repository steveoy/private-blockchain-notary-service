const Joi = require('joi');
const simpleChain = require('../domain/simpleChain');

const Block = simpleChain.Block;
const blockchain = new simpleChain.Blockchain();

//Step 2: Configure Star Registration Endpoint
exports.addBlock = function (req, res, next) {

    const schema = {
        body: Joi.string().min(3).required()
    }
    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(400).send(error.details[0].message);


    blockchain.addBlock(new Block(req.body.body)).then(result => {
        if (result == "success")
            blockchain.getBlock(blockchain.blockHeight).then(block => {
                res.send(block);
            });
    }).catch(err => {
        res.status(400).send(err);
    });
}

//Step 3: Configure Star Lookup by height
exports.getBlock = function (req, res, next) {

    const schema = {
        blockHeight: Joi.number().integer().min(0).max(blockchain.blockHeight).required()
    }
    const { error } = Joi.validate(req.params, schema);
    if (error) return res.status(400).send(error.details[0].message);

    blockchain.getBlock(req.params.blockHeight).then(block => {
        res.send(block);
    }).catch(err => {
        res.status(400).send(err);
    });
}
