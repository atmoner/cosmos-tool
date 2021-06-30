<p align="center"> 
  <img src="https://i.imgur.com/oyHTRP4.png" alt="Cosmos-tool"> 
</p>
<h1 align="center">
    Cosmos-tool
</h1>
 

<p align="center">
⭐ Cosmos-tool is a tool to facilitate the use of your cosmos wallet/node (regardless of the blockchain) from anywhere <br />
  Whether you are a validator or a simple delegator, this tool will prevent you from using the command line for each action <br /><br />
</p>

|Main menu ![image](https://user-images.githubusercontent.com/1071490/121424663-1bc77800-c961-11eb-93d8-38b04b1c2a6b.png)|Send Tx ![image](https://user-images.githubusercontent.com/1071490/121424917-621cd700-c961-11eb-8d05-52b2d93efc23.png)  |
|--|--|
 


## Prerequisites

```node version >=14.0.0```

## Installation

```sh
git clone https://github.com/atmoner/cosmos-tool.git
cd cosmos-tool
npm i
```
## Config
```sh
nano config.json
```
Edit this part with your value:  
```
{
    "mnemonic":"",
    "validatorAddress":"",
    "chainId":"", 
    "lcdUrl":"",
    "denom":"",
    "prefix":"",
    "feeAmount":5000,
    "gasLimit":100000,
    "memo":"Send from Cosmos-Tool"
}
```  
Example of config.json: <a href="https://github.com/atmoner/cosmos-tool/tree/main/config-example">/config-example</a>  

## Run it 
```
node app.js
```

## Known problem 

### Problem 

When launching cosmos-tool, you should see a warnig appear, nothing serious!
```
WARN deprecated @cosmostation/cosmosjs@0.9.x: You needs to upgrade to @cosmostation/cosmosjs above 0.10.0+ : 1) Proper nodejs v14+ support 2) 0.10.0+ supports protobuf signing for cosmos-sdk 0.40.0+
```

### Solution

To remove this warning, edit the file ```node_modules/@cosmostation/cosmosjs/src/index.js```  
Remove or comment line 29, like this:  

![image](https://user-images.githubusercontent.com/1071490/124016013-b18c7b00-d9d4-11eb-8742-e143a6c181f4.png)


## Development setup
  
For the improvement of the software, do not hesitate to make your proposal in the support section 

## To Do 
 - [ ] Main menu
   - [ ] Redelegate
   - [ ] List all validator
   - [ ] Add generate adresse
   - [ ] Multi Tx
   - [ ] IBC
 
