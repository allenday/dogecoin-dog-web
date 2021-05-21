const _ = require('lodash');
const mongoose = require('mongoose');
const dogecoin = require('./dogecoin');

const connectionString = 'mongodb+srv://dogeTag:SvhZeqx4sprynmAv@shop.auuyn.gcp.mongodb.net/dogeTagDB?retryWrites=true&w=majority';
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true});

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username: String,
    normalizedUsername: String,
    dogname: String,
    wifKey: String,
    secretKey: String,
    publicKey: String,
    tweetUrl: String,
    active: Boolean
}, { versionKey: false });

const userModel = mongoose.model("Users", UserSchema);

const createUser = (userInfo, cb) => {
    // check userInfo
    if (_.isNil(userInfo.username) || _.size(userInfo.username) == 0) {
        cb("invalid username");
    }

    if (_.isNil(userInfo.dogname) || _.size(userInfo.dogname) == 0) {
        cb("invalid dog name");
    }

    userWallet = dogecoin.createWallet();

    const newUser = {
        username: userInfo.username.replace('@', ''),
        normalizedUsername: _.toLower(userInfo.username.replace('@', '')),
        dogname: userInfo.dogname,
        wifKey: userWallet.wif,
        secretKey: userWallet.sk,
        publicKey: userWallet.pk,
        tweetUrl: '',
        active: false
    };
    
    userModel.create(newUser, (err, user) => {
        if (err) {
            cb(err);
        } else {            
            let userPick = _.pick(user, ['username', 'dogname', 'secretKey', 'publicKey']);
            userPick.message = dogecoin.signMessage(user.username, user.wifKey);
            cb(null, userPick);
        }
    });
};

const getUserByPublicKey = (pk, cb) => {
    const query = {
        publicKey: pk
    };

    userModel.findOne(query, (err, user) => {
        if (err || user == null) {
            if (user == null) err = "missing user";
            cb(err);
        } else {
            let userPick = _.pick(user, ['username', 'dogname', 'tweetUrl', 'publicKey']);
            cb(null, userPick);
        }
    });
};

module.exports = {
    createUser: createUser,
    getUserByPublicKey: getUserByPublicKey
};