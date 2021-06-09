#!/usr/bin/env node
var fs = require('fs');
const chalk = require("chalk");
var figlet = require('figlet');
var inquirer = require('inquirer');
var getJSON = require('get-json')
const cosmosjs = require("@cosmostation/cosmosjs");
var Table = require('cli-table');
var table = new Table( {style: {head: ['green']}});
var table2 = new Table( {style: {head: ['green']}});

let rawdata = fs.readFileSync('config.json');
let config = JSON.parse(rawdata);

const mnemonic = config.mnemonic;
const validatorAddress = config.validatorAddress;
const chainId = config.chainId;
const cosmosTool = cosmosjs.network(config.lcdUrl, chainId);
cosmosTool.setBech32MainPrefix(config.prefix);
cosmosTool.setPath("m/44'/118'/0'/0/0");
const address = cosmosTool.getAddress(mnemonic);
const ecpairPriv = cosmosTool.getECPairPriv(mnemonic);
const MessageMemo = config.memo;

const init = () => {
	console.log(
		chalk.green(
			figlet.textSync("Cosmos-tool", { 
				font: 'Slant',
				horizontalLayout: "default",
				verticalLayout: "default"
			})
		)
	);
	table.push(
		{ 'Adress': address }
		, { 'Validator adress': validatorAddress }
		, { 'Chain Id': chainId }
	);	
	console.log(table.toString());
	//console.log('BCNA adress: ' + address +'\nValidator adress: ' + validatorAddress +'\nChain Id:    ' + chainId +'\n');
}


function getInfo() {
	// Get info from wallet
	getJSON(config.lcdUrl+'/cosmos/bank/v1beta1/balances/'+address, function(error, response){
		cosmosTool.getAccounts(address).then(data => {
			table2.push(
				{ 'Uamount': response.balances[0].amount + ' ' + config.denom}
				, { 'Amount': (response.balances[0].amount/1000000).toFixed(2) + ' ' + config.prefix}
				, { 'Account number': data.result.value.account_number }
				, { 'Sequence': data.result.value.sequence }
			);			
			console.log(table2.toString());
		})
	})
}

function Unjail() {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgUnjail
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgUnjail",
				value: {
					address: validatorAddress
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});
		
		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}
function addDelegate(amountDel, adressAdd) {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgDelegate
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgDelegate",
				value: {
					amount: {
						amount: String(amountDel), // 1000000
						denom: config.denom
					},
					delegator_address: address,
					validator_address: adressAdd
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});	
		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}
function removeDelegate(amountUndel, adressRemove) {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgUndelegate
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgUndelegate",
				value: {
					amount: {
						amount: String(amountUndel),
						denom: config.denom
					},
					delegator_address: address,
					validator_address: adressRemove
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});
		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}
function EditValidator(moniker, identity, website, details) {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgEditValidator
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgEditValidator",
				value: {
					description: {
						moniker: moniker,
						identity: identity,
						website: website,
						details: details
					},
					validator_address: validatorAddress,
					//commission_rate: "0.200000000000000000",	// 22.0%
					//min_self_delegation: null
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});		
		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}
function RewardValidatorCommission(amount, adresseTo) {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgWithdrawValidatorCommission
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgWithdrawValidatorCommission",
				value: {
					validator_address: validatorAddress
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});
		
		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}

function Reward(adresseTo) {
	console.log(address,validatorAddress)
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {		
		// cosmos-sdk/MsgWithdrawDelegationReward
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
			{
				type: "cosmos-sdk/MsgWithdrawDelegationReward",
				value: {
					delegator_address: address,
					validator_address: adresseTo
				}
			}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});

		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}

function sendTx(amount, adresseTo) {
	// Generate MsgSend transaction and broadcast
	cosmosTool.getAccounts(address).then(data => {
		let stdSignMsg = cosmosTool.newStdMsg({
			msgs: [
				{
					type: "cosmos-sdk/MsgSend",
					value: {
						amount: [
							{
								amount: String(amount),  
								denom: config.denom
							}
						],
						from_address: address,
						to_address: adresseTo
					}
				}
			],
			chain_id: chainId,
			fee: { amount: [ { amount: String(config.feeAmount), denom: config.denom } ], gas: String(config.gasLimit) },
			memo: MessageMemo,
			account_number: String(data.result.value.account_number),
			sequence: String(data.result.value.sequence)
		});

		const signedTx = cosmosTool.sign(stdSignMsg, ecpairPriv);
		cosmosTool.broadcast(signedTx).then(response => console.log(response));
	})
}

const askQuestions = () => {
  const questions = [
    {
      type: 'rawlist',
      name: 'main',
      message: 'What do you want to do?',
	  pageSize: '20',
      choices: [
        'Send',
		'Delegate',
		'Undelegate',
		'Edit Validator',
		'Withdraw Delegation Reward',
		'Withdraw Validator Commission',
		'Unjail',
		'Get info'
      ],
    },
  ];
  return inquirer.prompt(questions);
};
const askSend = () => {
	const questions = [
	{
		type: 'input',
		name: 'amout',
		message: "Amount to send?",
		default: function () {
			return '1000000';
		},
		
	},
	{
		type: 'input',
		name: 'adresse',
		message: "Adresse?"
	},		
	];
	return inquirer.prompt(questions);
};
const askEditValidator = () => {
	const questions = [
	{
		type: 'input',
		name: 'moniker',
		message: "Name of moniker?"		
	},
	{
		type: 'input',
		name: 'identity',
		message: "Identity?"
	},		
	{
		type: 'input',
		name: 'website',
		message: "Website?"
	},			
	{
		type: 'input',
		name: 'details',
		message: "Details?"
	},			
	];
	return inquirer.prompt(questions);
};
const askDelegate = () => {
	const questions = [
	{
		type: 'input',
		name: 'amout',
		message: "Amount to delegate?",
		default: function () {
			return '200000000';
		},
		
	},
	{
		type: 'input',
		name: 'adresse',
		message: "Validator adresse to delegate?"
	},		
	];
	return inquirer.prompt(questions);
};
const askUnDelegate = () => {
	const questions = [
	{
		type: 'input',
		name: 'amout',
		message: "Amount to undelegate?",
		default: function () {
			return '1000000';
		},
		
	},
	{
		type: 'input',
		name: 'adresse',
		message: "Adresse to undelegate?"
	},		
	];
	return inquirer.prompt(questions);
};
const askReward = () => {
	const questions = [
	{
		type: 'input',
		name: 'adresse',
		message: "Operator Address?"
	},		
	];
	return inquirer.prompt(questions);
};

init();

const run = async () => {
	// ask questions
	const answers = await askQuestions();
	if (answers.main === 'Send') {
		const answersSend = await askSend();
		if (answersSend.amout) {
			sendTx(answersSend.amout, answersSend.adresse);
		}		
	} else if (answers.main === 'Edit Validator') {
		const answersEV = await askEditValidator();
		if (answersEV.moniker) {
			EditValidator(answersEV.moniker, answersEV.identity, answersEV.website, answersEV.details);
		}	
	} else if (answers.main === 'Delegate') {
		const answersDEL = await askDelegate();		
		if (answersDEL.amout) {
			addDelegate(answersDEL.amout, answersDEL.adresse);
		}	
	} else if (answers.main === 'Undelegate') {
		const answersUNDEL = await askUnDelegate();		
		if (answersUNDEL.amout) {
			removeDelegate(answersUNDEL.amout, answersUNDEL.adresse);
		}			
	} else if (answers.main === 'Withdraw Delegation Reward') {
		const answersREWARD = await askReward();		
		if (answersREWARD.adresse) {
			Reward(answersREWARD.adresse);
		}
	} else if (answers.main === 'Withdraw Validator Commission') {
		RewardValidatorCommission()
	} else if (answers.main === 'Unjail') {
		Unjail()
	} else if (answers.main === 'Get info') {
		getInfo()
	} 
};

run();
