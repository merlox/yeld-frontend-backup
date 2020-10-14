export default () => {
  return new Promise(async resolve => {
    const endBetaTimestamp = 1604080800000
    if (Date.now() > endBetaTimestamp) {
      return resolve(true)
    }
    let yeldBalance = await window.yeld.methods.balanceOf(window.web3.eth.defaultAccount).call()
    const fiveYeld = await window.web3.utils.toWei('5')
    resolve(Number(yeldBalance) >= Number(fiveYeld))
  })
}