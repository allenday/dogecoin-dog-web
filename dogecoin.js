const _ = require('lodash');

const CoinKey = require('coinkey');
const coinInfo = require('coininfo');

const cryptocoin = require('bitcoinjs-lib');
const cryptocoinMessage = require('bitcoinjs-message');

const createWallet = () => {
    const dogeInfo = coinInfo('DOGE').versions;

    const ck = new CoinKey.createRandom(dogeInfo);

    return {
        wif: ck.privateWif,
        sk: ck.privateKey.toString('hex'),
        pk: ck.publicAddress
    }
};

const signMessage = (username, wif) => {
    const dogecoinNetwork =   {
        messagePrefix: '\x19Dogecoin Signed Message:\n',
        bip32: {
          public: 0x02facafd,
          private: 0x02fac398
        },
        pubKeyHash: 0x1e,
        scriptHash: 0x16,
        wif: 0x9e
      }
    
    const keyPair = cryptocoin.ECPair.fromWIF(wif, dogecoinNetwork);
    const privateKey = keyPair.__D;
    const message = _.toLower(username);
    
    const signature = cryptocoinMessage.sign(message, privateKey, keyPair.compressed);

    return signature.toString('base64');
};

module.exports = {
    createWallet: createWallet,
    signMessage: signMessage
};
