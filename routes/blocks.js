const Joi = require('joi');
const simpleChain = require('../domain/simpleChain');

const Block = simpleChain.Block;
const Blockchain = simpleChain.Blockchain;
const blockchain = new Blockchain();

exports.addBlock = function (req, res, next) {

    const schema = {
        body: Joi.string().min(3).required()
    }
    const { error } = Joi.validate(req.body, schema);
    if (error) return res.status(400).json(error.details[0].message);


    blockchain.addBlock(new Block(req.body.body)).then(result => {
        if (result == "success")
            blockchain.getBlock(blockchain.blockHeight).then(block => {
                res.json(block);
            });
    }).catch(err => {
        res.status(400).json(err);
    });
}

//Step 3: Configure Star Lookup by height
exports.getBlock = function (req, res, next) {
    blockchain.getBlockHeight().then(result => {
        const schema = {
            blockHeight: Joi.number().integer().min(0).max(result).required()
        }
        const { error } = Joi.validate(req.params, schema);
        if (error) return res.status(400).json(error.details[0].message);

        blockchain.getBlock(req.params.blockHeight).then(block => {
            res.json(block);
        }).catch(err => {
            res.status(400).json(err);
        });
    });
}
