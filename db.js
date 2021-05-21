//mongodb+srv://dogeTag:SvhZeqx4sprynmAv@shop.auuyn.gcp.mongodb.net/dogeTagDB?retryWrites=true&w=majority
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
    active: Boolean
}, { versionKey: false });

const userModel = mongoose.model("Users", UserSchema);

const createUser = (userInfo, cb) => {
    // check userInfo
    userWallet = dogecoin.createWallet();

    const newUser = {
        username: userInfo.username.replace('@', ''),
        normalizedUsername: _.toLower(userInfo.username.replace('@', '')),
        dogname: userInfo.dogname,
        wifKey: userWallet.wif,
        secretKey: userWallet.sk,
        publicKey: userWallet.pk,
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

module.exports = {
    createUser: createUser
};
