import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Typography,
} from '@material-ui/core';
import { withRouter } from "react-router-dom";
import { colors } from '../../theme'

import {
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
} from '../../constants'

import UnlockModal from '../unlock/unlockModal.jsx'

import Store from "../../stores";
const emitter = Store.emitter
const store = Store.store

const styles = theme => ({
  root: {
    verticalAlign: 'top',
    width: '100%',
    display: 'flex',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '40px'
    }
  },
  headerV2: {
    background: colors.white,
    border: '1px solid '+colors.borderBlue,
    borderTop: 'none',
    width: '100%',
    borderRadius: '0px 0px 50px 50px',
    display: 'flex',
    padding: '24px 32px',
    alignItems: 'center',
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-between',
      padding: '16px 24px'
    }
  },
  icon: {
    display: 'flex',
    alignItems: 'center',
    flex: 1,
    cursor: 'pointer'
  },
  links: {
    display: 'flex'
  },
  link: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    '&:hover': {
      paddingBottom: '9px',
      borderBottom: "3px solid "+colors.borderBlue,
    },
  },
  title: {
    textTransform: 'capitalize'
  },
  linkActive: {
    padding: '12px 0px',
    margin: '0px 12px',
    cursor: 'pointer',
    paddingBottom: '9px',
    borderBottom: "3px solid "+colors.borderBlue,
  },
  account: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    [theme.breakpoints.down('sm')]: {
      flex: '0'
    }
  },
  walletAddress: {
    padding: '12px',
    border: '2px solid rgb(174, 174, 174)',
    borderRadius: '50px',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '&:hover': {
      border: "2px solid "+colors.borderBlue,
      background: 'rgba(47, 128, 237, 0.1)'
    },
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      position: 'absolute',
      top: '90px',
      border: "1px solid "+colors.borderBlue,
      background: colors.white
    }
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray
  },
  connectedDot: {
    background: colors.compoundGreen,
    opacity: '1',
    borderRadius: '10px',
    width: '10px',
    height: '10px',
    marginRight: '3px',
    marginLeft:'6px'
  },
  name: {
    paddingLeft: '24px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    }
  }
});

class Header extends Component {

  constructor(props) {
    super()

    this.state = {
      account: store.getStore('account'),
      modalOpen: false,
      retirementYeldAvailable: false, // When you have something to redeem
      earnings: 0,
      yeldBalance: 0,
      hoursPassedAfterStaking: 0,
      retirementYeldCurrentStaked: 0,
    }

    this.waitUntilSetupComplete()
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  waitUntilSetupComplete() {
    window.myInterval = setInterval(async () => {
      if (this.props.setupComplete) {
        window.clearInterval(window.myInterval)
        await this.setupContractData()
      }
    }, 1e2)
  }

  secondsToHms(seconds) {
    if (!seconds) return '';
   
    let duration = seconds;
    let hours = duration / 3600;
    duration = duration % (3600);
   
    let min = parseInt(duration / 60);
    duration = duration % (60);
   
    let sec = parseInt(duration);
   
    if (sec < 10) {
      sec = `0${sec}`;
    }
    if (min < 10) {
      min = `0${min}`;
    }
   
    if (parseInt(hours, 10) > 0) {
      return `${parseInt(hours, 10)}h ${min}m ${sec}s`
    }
    else if (min == 0) {
      return `${sec}s`
    }
    else {
      return `${min}m ${sec}s`
    }
  }

  async setupContractData() {
    const snapshot = await window.retirementYeld.methods.stakes(window.web3.eth.defaultAccount).call()

    const dateNowWithOneDay = Number(Date.now().toString().substr(0, 10)) + 86400
    const dateNow = Number(Date.now().toString().substr(0, 10))
    const substraction = Number(dateNow) - Number(snapshot.timestamp)
    const hoursPassedAfterStaking = this.secondsToHms(substraction)

    this.setState({
      retirementYeldCurrentStaked: snapshot.yeldBalance,
      hoursPassedAfterStaking: snapshot.timestamp == 0 ? 0 : hoursPassedAfterStaking,
    })

    // If one day has passed, change 
    if (snapshot.timestamp != 0 && dateNowWithOneDay >= snapshot.timestamp) {
      const balanceBlackHole = String(await window.yeld.methods.balanceOf('0x0000000000000000000000000000000000000000').call())
      const totalSupply = await window.yeld.methods.totalSupply().call()
      const userPercentage = (snapshot.yeldBalance) / (totalSupply - balanceBlackHole)

      // Gets how many ETH the user earns based on his balance
      const balanceRetirementContract = await window.web3.eth.getBalance(window.retirementYeld._address)
      const earnings = String(balanceRetirementContract * userPercentage / 100)
      if (earnings > 0) this.setState({retirementYeldAvailable: true, earnings})
    }

    let yeldBalance = String(window.web3.utils.fromWei(await window.yeld.methods.balanceOf(window.web3.eth.defaultAccount).call()))
    if (yeldBalance.split('.').length > 1) {
      yeldBalance = yeldBalance.split('.')[0] + '.' + yeldBalance.split('.')[1].substr(0, 2)
    }
    this.setState({ yeldBalance })
  }

  betaTesting() {
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

  componentWillUnmount() {
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  connectionConnected = () => {
    this.setState({ account: store.getStore('account') })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  render() {
    const {
      classes
    } = this.props;

    const {
      account,
      modalOpen
    } = this.state

    var address = null;
    if (account.address) {
      address = account.address.substring(0,6)+'...'+account.address.substring(account.address.length-4,account.address.length)
    }

    return (
      <div className={ classes.root }>
        <div className={ classes.headerV2 }>
          <div className={ classes.icon }>
            <img
              alt=""
              src={ require('../../assets/favicon3.png') }
              height={ '40px' }
              onClick={ () => { this.nav('') } }
            />
            <Typography variant={ 'h3'} className={ classes.name } onClick={ () => { this.nav('') } }>Yeld.finance</Typography>
          </div>
          <Button
            style={{marginLeft: '10px'}}
            variant="outlined"
            color="primary"
            disabled={ this.state.yeldBalance <= 0 }
            onClick={async () => {
              if(await this.betaTesting()) {
                let amountToStake = prompt("Enter how much YELD you want to stake:", this.state.yeldBalance)
                
                await window.yeld.methods.approve(
                  window.retirementYeld._address, 
                  window.web3.utils.toWei(amountToStake), 
                ).send({
                  from: window.web3.eth.defaultAccount,
                })

                await window.retirementYeld.methods.stakeYeld(
                  window.web3.utils.toWei(amountToStake)
                ).send({
                    from: window.web3.eth.defaultAccount,
                })
              } else {
                alert("You can't use the dapp during the beta testing period if you hold less than 5 YELD")
              }
            }}
          >
            <Typography variant={ 'h5'} color='secondary'>
              Stake Yeld Tokens ({this.state.yeldBalance} YELD)
              <br/>
              <i>{this.state.retirementYeldCurrentStaked <= 0 ? 
              '' : 
              `Currently Staked ${window.web3.utils.fromWei(this.state.retirementYeldCurrentStaked)} YELD`}
              </i>
            </Typography>
          </Button>
          <Button
            style={{marginLeft: '10px'}}
            variant="outlined"
            color="primary"
            disabled={this.state.retirementYeldCurrentStaked <= 0}
            onClick={async () => {
              if(await this.betaTesting()) {
                await window.retirementYeld.methods.unstake(
                  window.web3.utils.toWei(this.state.retirementYeldCurrentStaked)
                ).send({
                  from: window.web3.eth.defaultAccount,
                })
              } else {
                alert("You can't use the dapp during the beta testing period if you hold less than 5 YELD")
              }
            }}
          >
            <Typography variant={ 'h5'} color='secondary'>
              Unstake Yeld
            </Typography>
          </Button>
          <Button
            style={{marginLeft: '10px'}}
            variant="outlined"
            color="primary"
            disabled={ !this.state.retirementYeldAvailable }
            onClick={async () => {
              if(await this.betaTesting()) {
                await window.retirementYeld.methods.redeemETH().send({
                  from: window.web3.eth.defaultAccount,
                })
              } else {
                alert("You can't use the dapp during the beta testing period if you hold less than 5 YELD")
              }
            }}
          >
            <Typography variant={ 'h5'} color='secondary'>
              {!this.state.retirementYeldAvailable ? (
                <span>
                  Retirement Yield Available in 24h
                  <br/>
                  <i>
                  {
                    this.state.hoursPassedAfterStaking <= 0 ?
                    '' :
                    `Time passed ${this.state.hoursPassedAfterStaking}`
                  }
                  </i>
                </span>
              )
              : (
                <span>
                  Redeem Retirement Yield ({this.state.earnings} ETH)
                </span>
              )}
            </Typography>
          </Button>
          <div className={ classes.account }>
            { address &&
              <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap onClick={this.addressClicked} >
                { address }
                <div className={ classes.connectedDot }></div>
              </Typography>
            }
            { !address &&
              <Typography variant={ 'h4'} className={ classes.walletAddress } noWrap onClick={this.addressClicked} >
                Connect your wallet
              </Typography>
            }
          </div>
        </div>
        { modalOpen && this.renderModal() }
      </div>
    )
  }

  renderLink = (screen) => {
    const {
      classes
    } = this.props;

    return (
      <div className={ (window.location.pathname==='/'+screen)?classes.linkActive:classes.link } onClick={ () => { this.nav(screen) } }>
        <Typography variant={'h4'} className={ `title` }>{ screen }</Typography>
      </div>
    )
  }

  nav = (screen) => {
    if(screen === 'cover') {
      window.open("https://yinsure.finance", "_blank")
      return
    }
    this.props.history.push('/'+screen)
  }

  addressClicked = () => {
    this.setState({ modalOpen: true })
  }

  closeModal = () => {
    this.setState({ modalOpen: false })
  }

  renderModal = () => {
    return (
      <UnlockModal closeModal={ this.closeModal } modalOpen={ this.state.modalOpen } />
    )
  }
}

export default withRouter(withStyles(styles)(Header));
