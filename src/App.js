import React, { Component } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import {
  Switch,
  Route
} from "react-router-dom";
import IpfsRouter from 'ipfs-react-router'
import { promisifyAll } from 'bluebird'
import MyWeb3 from 'web3'

import './i18n';
import interestTheme from './theme';

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
} from './constants'

import Store from "./stores";
const emitter = Store.emitter
const store = Store.store

class App extends Component {
  state = {
    setupComplete: false,
    betaValid: true,
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

  betaTesting = () => {
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

  setup = async () => {
    if (typeof (window.ethereum) !== 'undefined') {
      // Create the contract instance
      window.web3 = new MyWeb3(window.ethereum);

      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error('You must approve this dApp to interact with it')
      }
      window.yeld = new window.web3.eth.Contract(yeldConfig.yeldAbi, yeldConfig.yeldAddress)
      const account = await this.getAccount();
      window.web3.eth.defaultAccount = account

      // Create the retirementyeld and yelddai contract instances
      window.retirementYeld = new window.web3.eth.Contract(yeldConfig.retirementYeldAbi, yeldConfig.retirementYeldAddress)
      console.log('YDAI', yeldConfig.yDAIAddress)
      console.log('YDAI', yeldConfig.yDAIAddress)
      console.log('YDAI', yeldConfig.yDAIAddress)
      console.log('YDAI', yeldConfig.yDAIAddress)
      console.log('YDAI', yeldConfig.yDAIAddress)
      window.yDAI = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yeldConfig.yDAIAddress)
      window.yTUSD = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yeldConfig.yTUSDAddress)
      window.yUSDT = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yeldConfig.yUSDTAddress)
      window.yUSDC = new window.web3.eth.Contract(yeldConfig.yDAIAbi, yeldConfig.yUSDCAddress)

      if (await this.betaTesting()) {
        this.setState({
          betaValid: true,
          setupComplete: true,
        })
      } else {
        this.setState({ setupComplete: true })
      }
    }
  }

  getAccount() {
    return new Promise(async resolve => {
      const accs = await window.web3.eth.getAccounts()
      resolve(accs[0])
    })
  }

  render() {
    return (
      <MuiThemeProvider theme={createMuiTheme(interestTheme)}>
        <CssBaseline />
        <IpfsRouter>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            alignItems: 'center',
            background: "#e1e1e1"
          }}>
            <Switch>
              <Route path="/">
                <Header setupComplete={this.state.setupComplete} />
                {/* <Vaults /> */}
                <StakeSimple setupComplete={this.state.setupComplete} />
                {typeof (window.ethereum) !== 'undefined' ?
                  (!this.state.betaValid ? (
                    <h2 style={{ margin: 'auto' }}>You need to hold 5 YELD to use the dApp</h2>
                  ) : (
                      <InvestSimple setupComplete={this.state.setupComplete} />
                    ))
                  :
                  <h2 style={{ margin: 'auto' }}>
                    <p style={{ marginLeft: "10px" }}>You don't have Metamask Installed or </p>
                    <p>Your browser doesn't support Metamask</p>
                  </h2>
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

export default App;
