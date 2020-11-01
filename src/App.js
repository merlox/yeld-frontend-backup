import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { colors } from './theme'
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'
import { promisifyAll } from 'bluebird'
import MyWeb3 from 'web3'
import { Typography, Modal, Box } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import './i18n';
import interestTheme from './theme';

import betaTesting from './betaTesting'

import APR from './components/apr';
import InvestSimple from './components/investSimple';
import StakeSimple from './components/stakeSimple';
import Manage from './components/manage';
import Performance from './components/performance';
import Zap from './components/zap';
import IDai from './components/idai';
import Footer from './components/footer';
import Home from './components/home';
import Header from './components/header';
import Vaults from './components/vault';

import { injected } from "./stores/connectors";
import yeldConfig from './yeldConfig'

import {
  CONNECTION_CONNECTED,
  SET_YELD_ADDRESSES,
} from './constants'

import Store from "./stores";
import './App.css';

const emitter = Store.emitter
const store = Store.store
const dispatcher = Store.dispatcher

const styles = (theme) => ({
  warningStart: {
    position: 'absolute',
    width: "38%",
    backgroundColor: "white",
    boxShadow: "gray",
    padding: "1.5%",
    [theme.breakpoints.down("sm")]: {
      width: "98%",
    },
  },
})

class App extends Component {
  state = {
    setupComplete: false,
    betaValid: false,
    displayWarning: true,
    modalOpen: true,
    v2Selected: true,
    retirementYeld: null,
    yDAI: null,
    yTUSD: null,
    yUSDT: null,
    yUSDC: null,
    yeld: null,
  };

  async componentWillMount() {
    await this.setup()

    injected.isAuthorized().then(isAuthorized => {
      if (isAuthorized) {
        injected.activate()
          .then((a) => {
            store.setStore({ account: { address: a.account }, web3context: { library: { provider: a.provider } } })
            emitter.emit(CONNECTION_CONNECTED)
          })
          .catch((e) => {
            console.log(e)
          })
      } else {

      }
    });
  }

  async componentDidMount () {

  }

  updateContracts = async bool => {
    dispatcher.dispatch({ type: SET_YELD_ADDRESSES, content: bool })

    if (bool) {
      this.setupContracts(
        yeldConfig.twoyDAIAddress,
        yeldConfig.twoyTUSDAddress,
        yeldConfig.twoyUSDTAddress,
        yeldConfig.twoyUSDCAddress,
        yeldConfig.tworetirementYeldAddress,
      )
    } else {
      this.setupContracts(
        yeldConfig.oneyDAIAddress,
        yeldConfig.oneyTUSDAddress,
        yeldConfig.oneyUSDTAddress,
        yeldConfig.oneyUSDCAddress,
        yeldConfig.oneretirementYeldAddress,
      )
    }
  }

  setup = async () => {
    console.log('typeof', typeof (window.ethereum))
    console.log('typeof', typeof (window.ethereum))
    console.log('typeof', typeof (window.ethereum))

      // Create the contract instance
    if (typeof (window.ethereum) !== 'undefined') {
      window.web3 = new MyWeb3(window.ethereum);
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error('You must approve this dApp to interact with it')
      }
      window.yeld = new window.web3.eth.Contract(yeldConfig.yeldAbi, yeldConfig.yeldAddress)
      const account = await this.getAccount();
      window.web3.eth.defaultAccount = account

      await this.setupContracts(
        yeldConfig.twoyDAIAddress,
        yeldConfig.twoyTUSDAddress,
        yeldConfig.twoyUSDTAddress,
        yeldConfig.twoyUSDCAddress,
        yeldConfig.tworetirementYeldAddress,
      )

      if (await betaTesting()) {
        this.setState({
          betaValid: true,
          setupComplete: true,
        })
      } else {
        this.setState({ setupComplete: true })
      }
    } else {
      alert('You must have metamask installed to use this dApp')
    }
  }

  setupContracts = async (yDAIAddress, yTUSDAddress, yUSDTAddress, yUSDCAddress, retirementYeldAddress) => {
    const retirementYeld = new window.web3.eth.Contract(yeldConfig.retirementYeldAbi, retirementYeldAddress)
    const yDAI = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yDAIAddress)
    const yTUSD = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yTUSDAddress)
    const yUSDT = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yUSDTAddress)
    const yUSDC = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yUSDCAddress)
    const yeld = new window.web3.eth.Contract(yeldConfig.yeldAbi, yeldConfig.yeldAddress)

    this.setState({
      retirementYeld, yDAI, yTUSD, yUSDT, yUSDC, yeld,
    })
  }

  getAccount() {
    return new Promise(async resolve => {
      const accs = await window.web3.eth.getAccounts()
      resolve(accs[0])
    })
  }

  render() {
    const {
      classes
    } = this.props;

    return (
      <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: colors.white,
          }}>
              <Switch>
              <Route path="/">
                <Header
                  setupComplete={this.state.setupComplete}
                  setV2Selected={bool => {
                    this.setState({v2Selected: bool})
                    this.updateContracts(bool)
                  }}
                  v2Selected={this.state.v2Selected}
                  yDAI={this.state.yDAI}
                  yTUSD={this.state.yTUSD}
                  yUSDT={this.state.yUSDT}
                  yUSDC={this.state.yUSDC}
                  yeld={this.state.yeld}
                />
                {/* <Vaults /> */}
                <StakeSimple 
                  retirementYeld={this.state.retirementYeld}
                  yDAI={this.state.yDAI}
                  yTUSD={this.state.yTUSD}
                  yUSDT={this.state.yUSDT}
                  yUSDC={this.state.yUSDC}
                  setupComplete={this.state.setupComplete}
                />
                <Box style={{
                  width: "100%",
                  border: "1px solid #e1e3e6",
                  borderTop: "none", marginBottom: "30px"}}></Box>
                {!this.state.displayWarning ?
                  (typeof (window.ethereum) !== 'undefined' ?
                    (!this.state.betaValid ? (
                      <h2 style={{ margin: 'auto' }}>You need to hold 5 YELD to use the dApp</h2>
                    ) : (
                        <InvestSimple 
                          retirementYeld={this.state.retirementYeld}
                          yDAI={this.state.yDAI}
                          yTUSD={this.state.yTUSD}
                          yUSDT={this.state.yUSDT}
                          yUSDC={this.state.yUSDC}
                          setupComplete={this.state.setupComplete}
                        />
                      ))
                    :
                    <h2 style={{ margin: 'auto' }}>
                      <p style={{ marginLeft: "10px" }}>You don't have Metamask Installed or </p>
                      <p>Your browser doesn't support Metamask</p>
                    </h2>
                  )
                  :
                  <Modal
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    open={this.state.modalOpen}
                    onClose={() => this.setState({ modalOpen: false, displayWarning: false })}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                  >
                    <Typography variant='h4' className={classes.warningStart}>
                      <p style={{ color: "red" }}>
                        This is a BETA product and there's a HIGH chance you may lose REAL money.
                      </p>

                      We aren't responsible for whatever loss you incur in using the product including those
                      related to bugs or exploits in the smart contracts, bugs or exploits in the user
                      interface and everything else. If you use this product you accept the risks
                      associated with using a Beta product and you may lose real money.
                      </Typography>
                  </Modal>
                }
                {/* <Footer /> */}
              </Route>
            </Switch>
          </div>
        </IpfsRouter>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
