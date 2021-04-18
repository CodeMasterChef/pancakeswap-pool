const Factory = artifacts.require('Factory.sol');
const Router = artifacts.require('Router.sol');
const Pair = artifacts.require('Pair.sol');
const Token1 = artifacts.require('Token1.sol');
const Token2 = artifacts.require('Token2.sol');

module.exports = async done => {
  try {
    const [admin, _] = await web3.eth.getAccounts();
    const factory = await Factory.at('0x6725F303b657a9451d8BA641348b6761A6CC7a17');
    const router = await Router.at('0xD99D1c33F9fC3444f8101754aBC46c52416550D1');
    const token1 = await Token1.at('0xf21e94818c9816372e9abd532ac3f8783c64380a');
    const token2 = await Token2.at('0x286BAFFa323BC584277A5B31E7DACDe0CD0cF53c');
    
    console.log("%c 📵: token1.address ", token1.address)
    console.log("%c ⛹️‍♂️: token2.address ", token2.address)
    
    const pairAddress = await factory.getPair.call(token1.address, token2.address);
    console.log("%c 🌤️: pairAddress ",  pairAddress);
    
    const token1Amount = await web3.utils.toWei('10', 'ether');
    const token2Amount = await web3.utils.toWei('20', 'ether');
    await token1.approve(router.address, token1Amount);
    await token2.approve(router.address, token2Amount); 
    await router.addLiquidity(
      token1.address,
      token2.address,
      token1Amount,
      token2Amount,
      token1Amount,
      token2Amount,
      admin,
      Math.floor(Date.now() / 1000) + 60 * 10
    );
    const pair = await Pair.at(pairAddress);
    const balance = await pair.balanceOf(admin); 
    console.log(`balance LP: ${web3.utils.fromWei(balance, 'ether')}`);
    } catch(e) {
      console.log(e);
    }
  done();
};
