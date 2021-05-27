const _ = require('lodash');
const express = require('express');
//const cors = require('cors');

const dogecoin = require('./dogecoin');
const dbMongo = require('./db');

const server = express();

server.use('/dist', express.static('dist'));
server.use('/assets', express.static('assets'));
server.use('/images', express.static('images'));
//server.use(cors);

server.get('/api/create/wallet', (req, res) => {
    res.json(dogecoin.createWallet());
});

server.get('/api/addr/:publicKey', (req, res) => {
    if (_.isNil(req.params.publicKey)) {
        res.sendStatus(404);
    } else {
        dbMongo.getUserByPublicKey(req.params.publicKey, (err, user) => {
            if (err) {
                res.json({"error": "missing data."});
            } else {
                res.json(user);                
            }
        })        
    }
});

server.get('/api/user', (req, res) => {    
    const userInfo = {
        username: req.query.twitter,
        dogname: req.query.dogname        
    };

    dbMongo.createUser(userInfo, (err, user) => {
        if (err) {        
            res.json({"error": "missing data."});
        } else {
            res.json(user);
        }
    });
});
/*
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/' + 'index.html');
});

server.get('/addr/:publicKey', (req, res) => {
    res.sendFile(__dirname + '/' + 'addr.html');
});
*/
console.log('Server started ...');
server.listen(8083);
