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
    }
  }

  componentWillMount() {
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);
  }

  async componentDidMount() {
    window.retirementYeld.snapshots(window.web3.eth.accounts[0], async (err, snapshot) => {
      snapshot = {
        timestamp: snapshot[0].toString(),
        yeldBalance: snapshot[1].toString(),
      }
      const dateNowWithOneDay = Number(Date.now().toString().substr(0, 10)) + 86400
      if (snapshot.timestamp != 0 && dateNowWithOneDay >= snapshot.timestamp) {
        const balanceBlackHole = String(await window.yeld.balanceOfAsync('0x0000000000000000000000000000000000000000'))
        const totalSupply = await window.yeld.totalSupplyAsync()
        const userPercentage = (await window.yeld.balanceOfAsync(window.web3.eth.accounts[0])).div(totalSupply - balanceBlackHole)

        // Gets how many ETH the user earns based on his balance
        window.web3.eth.getBalance(window.retirementYeld.address, (err, retirementContractBalance) => {
          const earnings = retirementContractBalance.mul(userPercentage).div(100)
          this.setState({retirementYeldAvailable: true, earnings})
        })
      }
    })

    let yeldBalance = String(window.web3.fromWei(await window.yeld.balanceOfAsync(window.web3.eth.accounts[0])))
    if (yeldBalance.split().length > 0) {
      yeldBalance = yeldBalance.split('.')[0] + '.' + yeldBalance.split('.')[1].substr(0, 2)
    }
    this.setState({ yeldBalance })
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
            onClick={async () => {
              await window.retirementYeld.takeSnapshotAsync()
            }}
            >
            <Typography variant={ 'h5'} color='secondary'>Snapshot Yeld Balance ({this.state.yeldBalance} YELD)</Typography>
          </Button>
          <Button
            style={{marginLeft: '10px'}}
            variant="outlined"
            color="primary"
            disabled={ !this.state.retirementYeldAvailable }
            onClick={async () => {
              await window.retirementYeld.redeemETHAsync()
            }}
            >
            <Typography variant={ 'h5'} color='secondary'>Redeem Retirement Yield ({this.state.earnings} ETH)</Typography>
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
