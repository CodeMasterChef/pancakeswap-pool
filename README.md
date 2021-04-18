# PancakeSwap Pool
This project is used for deploying a liquidity pool on PancakeSwap.
# Overview:
```
[human] --createPair--> [Factory] ----> [Pair]
[hunan] --addLiquidity--> [Router] --mint--> [Pair]
```
# Contracts:
## contracts/Factory.sol
We do not deploy this contract because it is existed on the PancakeSwap. We create this file to create ABI when compiling it.

The Factory in reality has more functions than on this file but we will only need the createPair function.
## contracts/Router.sol
The Router in reality has more functions but we only need the addLiquidity function. We just copy paste the function signature with no implementation.

We will look at the parameters.
```
 function addLiquidity(
   address tokenA,
   address tokenB,
   uint amountADesired,
   uint amountBDesired,
   uint amountAMin,
   uint amountBMin,
   address to,
   uint deadline
  ) external returns(uint amountA, uint amountB, uint liquidity) {}
```
- `tokenA`, `tokenB`: the smart contract address of tokens.
- `amountADesired` , `amountBDesired`:
- `amountAMin`, `amountBMin`:
- `to`: where the LP token will be sent to.
- `deadline`: a timestamp in seconds so this is to protect you if your transaction gets stuck in the memory pool.

## contracts/Pair.sol:
We only need the balanceOf to check the balance of LP token after we added liquidity.

## contracts/Token1.sol and contracts/Token2.sol:
They are just the ERC-20 tokens. We deploy them with defination on the constructor and use _mint to create new token balance to `msg.sender`.

# Deploy scripts:
All we need in the file `scripts/deploy-pool.js`.

```
const factory = await Factory.at('0x6725F303b657a9451d8BA641348b6761A6CC7a17');
const router = await Router.at('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');
```
The Factory and Router will point to the existed contracts on the **Testnet** of Binance Smart Chain. You can update the Mainnet if you want.

```
await token1.approve(router.address, 10000);
await token2.approve(router.address, 10000); 
```
Above functions to request permission for spending token by the Router. Your ERC-20 tokens can not be spent with any contact if not having permission. 
We hard code the approved token number is 10000 here.

```
 await router.addLiquidity(
      token1.address,
      token2.address,
      10000,
      10000,
      10000,
      10000,
      admin,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
```
The deadline is 10 minutes. The timestamp is in second so that we need to divided by 1000. We set that after 10 minutes the transaction must be completed so that we need to plus with: 10 min * 60 seconds = 600 seconds.
# Deploy to BSC Testnet:
Install packages:
```
$ npm install
```

Create a `.env` file from copying `.env.example` file. Change the PRIVATE_KEY by your private key.

Faucet for free BNB on BSC Testnet: https://testnet.binance.org/faucet-smart

Run to deploy to BSC Testnet:

```
$ truffle exec scripts/deploy-pool.js --network bsctestnet
```