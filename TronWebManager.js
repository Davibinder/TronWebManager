/****************************************************************************

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/
/**
 * @author Davinder Singh
 * A Wrapper to interact with tron-web api's
 * @type {{fullNode: string, adminWalletAddress: null, getTransactionsFromAddress: TronWebManager.getTransactionsFromAddress, getTransactionsRelatedToAddress: TronWebManager.getTransactionsRelatedToAddress, sendTRXTransaction: TronWebManager.sendTRXTransaction, setupTronNode: TronWebManager.setupTronNode, getTransactionsToAddress: TronWebManager.getTransactionsToAddress, getAccountResources: TronWebManager.getAccountResources, getSmartContract: TronWebManager.getSmartContract, myTronlinkAddress: null, solidityNode: string, tronLinkState: {installed: boolean, loggedIn: boolean}, eventServer: string, getTransactionInfo: TronWebManager.getTransactionInfo, tronLinkExtensionStatus: (function(): (TronWebManager.tronLinkState|{installed, loggedIn})), getBalance: TronWebManager.getBalance, getAccountInfo: TronWebManager.getAccountInfo, sendTokenTransaction: TronWebManager.sendTokenTransaction, setAdminWalletAddress: TronWebManager.setAdminWalletAddress, tronWeb: null}}
 *
 */
var tronWebCounter = 0;


var TronWebManager = {
    tronWeb             : null,
    privateKey          : "" , // Private key of Wallet
    normalGoldContract  : null,
    rareGoldContract    : null,
    strategyGoldContract: null,
    majorGoldContract   : null,
    collectableContract : null,
    buyAbleContract     : null,
    marketPlaceContract : null,
    myTronlinkAddress : null,
    adminWalletAddress : null,

    // Create custom instance of TronWeb
    customTronWeb : function() {
        const HttpProvider = TronWeb.providers.HttpProvider;
        var url = MMAppManager.appRunMode == AppMode.Production ? TronHttpUrls.MainNetwork : TronHttpUrls.ShastaNetwork;
        const fullNode = new HttpProvider(url);
        const solidityNode = new HttpProvider(url);
        const eventServer = new HttpProvider(url);
        const privateKey = TronWebManager.privateKey;
        this.tronWeb = new TronWeb(fullNode, solidityNode, eventServer, privateKey);
     },


    setMyTronlinkAddress : function(address){
        TronWebManager.myTronlinkAddress = address.toString();
    },

    setAdminWalletAddress : function(address) {
      this.adminWalletAddress = address;
    },

    /**
     * Function to check balance of tron-link account
     * @param address = tron address to check balance OR skip this parameter to check current account's of tron-link
     * @param callback = callback function
     */
    getBalance : function (address, callback) {
        // The majority of the function calls are asynchronus,
        // meaning that they cannot return the result instantly.
        // These methods therefore return a promise, which you can await.
        // const balance = this.tronWeb.trx.getBalance(address);
        // console.log({balance});

        // You can also bind a `then` and `catch` method.
        this.tronWeb.trx.getBalance(address).then(balance => {
            callback(null,balance);
        }).catch(err => console.error(err));

        // If you'd like to use a similar API to Web3, provide a callback function.
        // this.tronWeb.trx.getBalance(address, (err, balance) => {
        //     callback(err,balance);
        // });
    },

    /**
     * get account detail of given tron address
     * @param address = tron address OR skip this parameter to check current account's of tron-link
     * @param callback = callback function
     */
    getAccountInfo : function(callback) {
       // this.myTronlinkAddress = this.tronWeb.defaultAddress.base58;
     //   if(this.tronLinkState.installed && this.tronLinkState.loggedIn){
            this.tronWeb.trx.getAccount(this.myTronlinkAddress).then(response => {
                callback(null,response);
            }).catch(err => {callback(err,null);});
    },

    /**
     * Get Tron Account resources i.e bandwidth, energy, trx, tokens etc
     * @param address = Resources for particular address OR skip this param to get resources for current Tron-Link Acc.
     * @param callback = Callback function
     */
    getAccountResources : function(address,callback) {
        this.tronWeb.trx.getAccountResources(address, (error,response) => {
            this.tronWeb.trx.getAccount(address, (error,response) => {
                callback(error,response);
            });
        });
    },

    /**
     *
     * @param toAddress = Beneficiary account address
     * @param amount = TRX amount
     * @param callback = = Callback function
     */
    sendTRXTransaction : function(toAddress, amount , callback){

        this.tronWeb.trx.sendTransaction(toAddress, amount, (error, response) => {
            callback(error,response);
        });

        /*
        this.tronWeb.transactionBuilder.sendTrx(toAddress, amount, fromAddress, (error,response) => {
            if (error)
                return console.error(error);
            callback(error,response);

        });*/
    },

    /**
     *
     * @param toAddress = Beneficiary account address
     * @param amount = token amount
     * @param tokenID = token ID i.e 'Chic101' etc
     * @param callback = = Callback function
     */
    sendTokenTransaction : function(toAddress,amount,tokenID,callback) {
        this.tronWeb.trx.sendTransaction(toAddress, 100, tokenID, (error, response) => {
            callback(error,response);
        });

        /*
        this.tronWeb.transactionBuilder.sendToken(toAddress, amount, tokenID, fromAddress, (error,response) => {

        });*/
    },

    /**
     * This function will get whole info about a particular transaction
     * @param tHash =  TRX transaction Hash
     * @param callback = callback function
     */
    getTransactionInfo : function(tHash,callback){
        this.tronWeb.trx.getTransactionInfo(tHash,(error,response) => {
            callback(error,response);
        });
    },

    /**
     * This function will return all transaction related to given address
     * @param address
     * @param limit
     * @param offset
     * @param callback
     */
    getTransactionsToAddress : function(address,limit,offset,callback) {
        this.tronWeb.trx.getTransactionsToAddress(address, limit, offset, (error,response) => {
            callback(error,response);
        });

    },

    /**
     * This function will return all transaction related from given address
     * @param address
     * @param limit
     * @param offset
     * @param callback
     */
    getTransactionsFromAddress : function(address,limit,offset,callback) {
        this.tronWeb.trx.getTransactionsFromAddress(address, limit, offset, (error,response) => {
            callback(error,response);
        });

    },

    /**
     * This function will return all transaction related to given address
     * @param address
     * @param direction
     * @param limit
     * @param offset
     */
    getTransactionsRelatedToAddress : function(address,direction,limit,offset, callback) {
        this.tronWeb.trx.getTransactionsRelated(address, direction, limit, offset, (error,response) => {
            callback(error,response);
        });
    },

    /**
     * This function can fetch TVM smart contract at specified Address
     * @param contractAddress
     * @param callback
     */
    getSmartContract : function(contractAddress, callback) {
        this.tronWeb.contract().at(contractAddress).then(contract => {
            callback(null,contract);
        }).catch(err => {
            callback(err,null);
        });
    },

    instantiateAllContract : function (callback) {
         this.getSmartContract(MMContractConstants.getGoldWithrawContract(), (error, contract) => {
             if(contract) {
                 this.normalGoldContract = contract.abi;
                 if(callback){
                     callback(null,  this.normalGoldContract);
                 }
             }
             else
                 this.instantiateContractWithAddress(this.normalGoldContract, (MMContractConstants.getGoldWithrawContract()));
         });

        this.getSmartContract(MMContractConstants.getStrategySquareContract(), (error, contract) => {
            if(contract) {
                this.strategyGoldContract = contract.abi;
                if(callback){
                    callback(null,  this.strategyGoldContract);
                }
            }
            else
                this.instantiateContractWithAddress(this.strategyGoldContract, (MMContractConstants.getStrategySquareContract()));
        });

        this.getSmartContract(MMContractConstants.getMajorPriceWithrawnContract(), (error, contract) => {
            if(contract) {
                this.majorGoldContract = contract.abi;
                if(callback){
                    callback(null,  this.majorGoldContract);
                }
            }
            else
                this.instantiateContractWithAddress(this.majorGoldContract, (MMContractConstants.getMajorPriceWithrawnContract()));
        });

        this.getSmartContract(MMContractConstants.getCollectibleWithrawContract(), (error, contract) => {
            if(contract) {
                this.collectableContract = contract.abi;
                if(callback){
                    callback(null,  this.collectableContract);
                }
            }
            else
                this.instantiateContractWithAddress(this.collectableContract, (MMContractConstants.getCollectibleWithrawContract()));
        });

        this.getSmartContract(MMContractConstants.getTransModeContract(), (error, contract) => {
            if(contract){
                this.buyAbleContract   = contract.abi;
                if(callback){
                    callback(null,  this.buyAbleContract);
                }
            }
            else
                this.instantiateContractWithAddress(this.buyAbleContract, (MMContractConstants.getTransModeContract()));
        });

        this.getSmartContract(MMContractConstants.getCollectibleWithrawContract(), (error, contract) => {
            if(contract) {
                this.marketPlaceContract = contract.abi;
                if(callback){
                    callback(null,  this.marketPlaceContract);
                }
            }
            else
                this.instantiateContractWithAddress(this.marketPlaceContract, (MMContractConstants.getCollectibleWithrawContract()));
        });
    },

    instantiateContractWithAddress : function (contractVariable, contractAddress) {
        this.getSmartContract(contractAddress, (error, contract)=>{
            if(contract)
                contractVariable = contract;
        });
    },

    isValidContract : function (contract) {
     return  contract.abi.length > 0;
    }
};
