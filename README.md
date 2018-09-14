# Private Blockchain Notary Service

Notarizing ownership of digital assets by building a Star Registry

## Project Overview
The goal is to allow users to notarize star ownership using their blockchain identity:

| Feature | Description |
| ------- | ----------- |
| Notarize | Users will be able to notarize star ownership using their blockchain identity. |
| Verify Wallet Address | This will provide a message to users allowing them to verify their wallet address with a message signature. |
| Register a Star |	Once a user verifies their wallet address, they have the right to register the star. |
| Share a Story | Once registered, each star has the ability to share a story. |
| Star Lookup | Users will be able to look up their star by hash, block height, or wallet address. |

### Installing
```bash
$ npm install
```
### Testing
After installing please run app in terminal:
```bash
$ node app.js
```
### Clean Architecture
Trying to follow good architecture concepts as the one proposed by Uncle Bob some years ago, called Clean Architecture. It supports the idea of making the model independent from the framework, libraries, dbs…

### Functionality

#### Blockchain ID Validation Routine

**Validating User Request**
| Request | Response |
| ---------------------------------------------------------- | ----------- |
| curl -X "POST" "http://localhost:8000/requestValidation" \ | {
| -H 'Content-Type: application/json; charset=utf-8' \       |   "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
|         -d $'{                                             |    "requestTimeStamp": "1532296090",
|  "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ"           |    "message": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ:1532296090:starRegistry",
|     }'                                                     |    "validationWindow": 300
|                                                            |  }

**Verifying User Message Signature**

#### Star Registration Endpoint



#### Star Lookup

**Lookup by Blockchain ID (Wallet Address)**

**Lookup by Block Hash**

**Lookup by Block Height**


End with an example of getting some data out of the system or using it for a little demo

## Built With

* [Express](https://expressjs.com/) - The web framework used
* [Level](https://github.com/Level/level) - A Node.js-style LevelDB wrapper to persist blockchain
* [CryptoJS](https://www.npmjs.com/package/crypto-js) - Used to generate SHA256 block hash address
* [Joi](https://github.com/hapijs/joi) - Object schema validation
* [BitcoinJS](https://www.npmjs.com/package/bitcoinjs-lib) - Used for validating message signatures
* [JSONPath](https://www.npmjs.com/package/jsonpath) - Query JavaScript objects with JSONPath expressions