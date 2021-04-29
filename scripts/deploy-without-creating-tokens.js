const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const MyToken = artifacts.require('MyToken.sol');

module.exports = async done => {
  try {
    const [admin, normal_user,_] = await web3.eth.getAccounts();
// #PancakeSwap on BSC testnet:
// Factory: 0x6725F303b657a9451d8BA641348b6761A6CC7a17
// Router: 0xD99D1c33F9fC3444f8101754aBC46c52416550D1

// const factory = await Factory.at('0x6725F303b657a9451d8BA641348b6761A6CC7a17');
// const router = await Router.at('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');

    const factory = await Factory.at('0x3A0688AE7dB82FdDE7646603ef0E04Daebf762BB');
    const router = await Router.at('0x22774B1F8245d59774722aFA7cf67699593e9A09');
    const token1 = await MyToken.at('0x756e1f709d7dcd8c5d6096c119b119cead00fafd');
    const token2 = await MyToken.at('0x340d042C50A101C4dB4C1F5aD43AdC5F59B1e345');
    
    console.log("🇸🇰: factory ", factory.address);
    console.log("🐃: router ", router.address);
    console.log("📵: token1.address ", token1.address);
    console.log("⛹️‍♂️: token2.address ", token2.address);
        
    const token1Amount = await web3.utils.toWei('1', 'ether');
    const token2Amount = await web3.utils.toWei('2', 'ether');
    const tx1 = await token1.approve(router.address, token1Amount);
    console.log("🧙‍♀️: tx1 ", tx1)
    const tx2 = await token2.approve(router.address, token2Amount); 
    console.log("🚽: tx2 ", tx2)
    await router.addLiquidity(
      token1.address,
      token2.address,
      token1Amount,
      token2Amount,
      await web3.utils.toWei('0.95', 'ether'),
      web3.utils.toWei('1.9', 'ether'),
      normal_user,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pairAddress = await factory.getPair.call(token1.address, token2.address);
    console.log("🌤️: pairAddress ",  pairAddress);
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(normal_user); 
    console.log(`balance LP: ${web3.utils.fromWei(balance, 'ether')}`);
    } catch(e) {
      console.log(e);
    }
  done();
};
