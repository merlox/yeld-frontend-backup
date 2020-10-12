import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import {
  Typography,
  Accordion,
  AccordionDetails,
  AccordionSummary
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withNamespaces } from 'react-i18next';
import { colors } from '../../theme'

import Snackbar from '../snackbar'
import Asset from './asset'
import Loader from '../loader'

import {
  ERROR,
  GET_BALANCES_LIGHT,
  BALANCES_LIGHT_RETURNED,
  INVEST_RETURNED,
  REDEEM_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
} from '../../constants'

import Store from "../../stores";
const emitter = Store.emitter
const dispatcher = Store.dispatcher
const store = Store.store

const styles = (theme) => ({
  root: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "1200px",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    [theme.breakpoints.up("xl")]: {
      minWidth: "1870px",
    },
  },
  investedContainerLoggedOut: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minWidth: "100%",
    marginTop: "40px",
    [theme.breakpoints.up("md")]: {
      minWidth: "1000px",
    },
  },
  investedContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    minWidth: "100%",
    [theme.breakpoints.up("md")]: {
      minWidth: "1000px",
    },
  },
  titleInvested: {
    margin: "15px 0 15px",
  },
  investedVaults: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr",
    gridColumnGap: "0",
    [theme.breakpoints.up("lg")]: {
      gridTemplateColumns: "repeat(2, 1fr)",
      gridColumnGap: "24px",
    },
  },
  exclusivesContainer: {
    backgroundColor: colors.investGray,
    margin: "0 20px",
    [theme.breakpoints.up("md")]: {
      margin: "0",
    },
  },
  exclusivesTitle: {
    marginTop: "20px",
    marginBottom: "20px",
    [theme.breakpoints.up("md")]: {
      marginTop: "0",
      marginBottom: "auto",
    },
  },
  balancesContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    padding: "12px 12px",
    position: "relative",
  },
  connectContainer: {
    padding: "12px",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "450px",
    [theme.breakpoints.up("md")]: {
      width: "450",
    },
  },
  intro: {
    width: "100%",
    position: "relative",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
    },
  },
  introCenter: {
    maxWidth: "500px",
    textAlign: "center",
    display: "flex",
    padding: "24px 0px",
  },
  introText: {
    paddingLeft: "20px",
  },
  actionButton: {
    "&:hover": {
      backgroundColor: "#2F80ED",
    },
    padding: "12px",
    backgroundColor: "#2F80ED",
    border: "1px solid #9C9DA0",
    fontWeight: 500,
    [theme.breakpoints.up("md")]: {
      padding: "15px",
    },
  },
  overlay: {
    position: "absolute",
    background: "RGBA(200, 200, 200, 1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid #9C9DA0",
    cursor: "pointer",

    right: "0px",
    top: "10px",
    height: "70px",
    width: "160px",
    [theme.breakpoints.up("md")]: {
      right: "0px",
      top: "10px",
      height: "90px",
      width: "210px",
    },
  },
  heading: {
    display: "none",
    paddingTop: "12px",
    flex: 2,
    flexShrink: 0,
    [theme.breakpoints.up("sm")]: {
      paddingTop: "5px",
      display: "block",
    },
  },
  headingName: {
    paddingTop: "5px",
    flex: 2,
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    minWidth: "100%",
    [theme.breakpoints.up("sm")]: {
      minWidth: "auto",
    },
  },
  buttonText: {
    fontWeight: "700",
    color: "white",
  },
  assetSummary: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexWrap: "wrap",
    [theme.breakpoints.up("sm")]: {
      flexWrap: "nowrap",
    },
  },
  assetIcon: {
    display: "flex",
    alignItems: "center",
    verticalAlign: "middle",
    borderRadius: "20px",
    height: "30px",
    width: "30px",
    textAlign: "center",
    cursor: "pointer",
    marginRight: "20px",
    [theme.breakpoints.up("sm")]: {
      height: "40px",
      width: "40px",
      marginRight: "24px",
    },
  },
  iconInvested: {
    display: "flex",
    justifyContent: "center",
    alignItems: "left",
    [theme.breakpoints.down("sm")]: {
      margin: "20px 0 20px",
      alignItems: "center",
    },
  },
  addressContainer: {
    display: "flex",
    justifyContent: "space-between",
    overflow: "hidden",
    flex: 1,
    whiteSpace: "nowrap",
    fontSize: "0.83rem",
    textOverflow: "ellipsis",
    cursor: "pointer",
    padding: "28px 30px",

    border: "1px solid " + colors.borderBlue,
    alignItems: "center",
    maxWidth: "calc(100vw - 24px)",
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
      maxWidth: "auto",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    [theme.breakpoints.up("lg")]: {
      width: "100%",
      maxWidth: "auto",
    },
  },
  between: {
    width: "40px",
    height: "40px",
  },
  expansionPanel: {
    maxWidth: "calc(100vw - 24px)",
    width: "100%",
  },
  versionToggle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  tableHeadContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  investAllContainer: {
    paddingTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
    width: "100%",
  },
  disclaimer: {
    padding: "12px",
    // border: '1px solid rgb(174, 174, 174)',
    borderRadius: "0.75rem",
    marginBottom: "24px",
    background: colors.whiteLight,
  },
  walletAddress: {
    padding: "0px 12px",
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray,
  },
  grey: {
    color: colors.darkGray,
  },
});

class InvestSimple extends Component {

  constructor(props) {
    super()

    const account = store.getStore('account')
    this.state = {
      assets: store.getStore('assets'),
      account: account,
      snackbarType: null,
      snackbarMessage: null,
      hideV1: true,
      value: 1,
      YELDAPY: 0,
    }

    if(account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES_LIGHT, content: {} })
    }

    this.getYELDPrice()
  }

  async getYELDPrice() {
    const priceUrl = 'https://api.coingecko.com/api/v3/simple/price?ids=yeld-finance&vs_currencies=usd'

    const req = await fetch(priceUrl, {
      headers: {
        'content-type': 'application/json',
      }
    })
    const res = await req.json()
    const price = res['yeld-finance'].usd
    // 365 days * 100 yeld * yeld price * 100(%) / 1 million since that's the equivalence
    const rawAPY = 365 * 100 * price * 100 / 1e6
    this.setState({ YELDAPY: rawAPY })
  }

  componentWillMount() {
    emitter.on(INVEST_RETURNED, this.investReturned);
    emitter.on(REDEEM_RETURNED, this.redeemReturned);
    emitter.on(ERROR, this.errorReturned);
    emitter.on(BALANCES_LIGHT_RETURNED, this.balancesReturned);
    emitter.on(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.on(CONNECTION_DISCONNECTED, this.connectionDisconnected);

  }

  componentWillUnmount() {
    emitter.removeListener(INVEST_RETURNED, this.investReturned);
    emitter.removeListener(REDEEM_RETURNED, this.redeemReturned);
    emitter.removeListener(ERROR, this.errorReturned);
    emitter.removeListener(CONNECTION_CONNECTED, this.connectionConnected);
    emitter.removeListener(CONNECTION_DISCONNECTED, this.connectionDisconnected);
    emitter.removeListener(BALANCES_LIGHT_RETURNED, this.balancesReturned);
  };

  refresh() {
    dispatcher.dispatch({ type: GET_BALANCES_LIGHT, content: {} })
  }

  balancesReturned = (balances) => {
    this.setState({ assets: store.getStore('assets') })
    setTimeout(this.refresh, 300000);
  };

  connectionConnected = () => {
    const { t } = this.props
    this.setState({ account: store.getStore('account') })

    dispatcher.dispatch({ type: GET_BALANCES_LIGHT, content: {} })

    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: t("Unlock.WalletConnected"), snackbarType: 'Info' }
      that.setState(snackbarObj)
    })
  };

  connectionDisconnected = () => {
    this.setState({ account: store.getStore('account') })
  }

  errorReturned = (error) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: error.toString(), snackbarType: 'Error' }
      that.setState(snackbarObj)
    })
  };

  investReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  redeemReturned = (txHash) => {
    const snackbarObj = { snackbarMessage: null, snackbarType: null }
    this.setState(snackbarObj)
    this.setState({ loading: false })
    const that = this
    setTimeout(() => {
      const snackbarObj = { snackbarMessage: txHash, snackbarType: 'Hash' }
      that.setState(snackbarObj)
    })
  };

  render() {
    const { classes } = this.props;
    const {
      loading,
      account,
      snackbarMessage,
      value,
    } = this.state

    if(!account || !account.address) {
      return (
        <div className={ classes.root }>
          <div className={ classes.investedContainerLoggedOut }>
          <Typography variant={'h5'} className={ classes.disaclaimer }>This project is in beta. Use at your own risk.</Typography>
            <div className={ classes.introCenter }>
              <Typography variant='h3'>Connect your wallet to continue</Typography>
            </div>
          </div>
          { snackbarMessage && this.renderSnackbar() }
        </div>
      )
    }

    return (
      <div className={classes.root}>
        <div className={classes.twoColumns}>
          <div className={classes.iconInvested}>
            <img
              alt="Optimized Yield Farming"
              src={require("../../assets/Icon-awesome-dollar-sign.svg")}
              height={"65px"}
            />
          </div>
          <div className={classes.investedContainer}>
            <Typography
              variant={"h3"}
              className={classes.titleInvested}
              style={{ textAlign: "left" }}
            >
              {" "}
              Your Optimised Yield Farm{" "}
            </Typography>
            <div className={classes.investedVaults}>
              {account.address && value === 1 && this.renderAssetBlocksv2()}
            </div>
          </div>
        </div>

        {loading && <Loader />}
        {snackbarMessage && this.renderSnackbar()}
        <Typography
          variant={"h5"}
          className={classes.disaclaimer}
          style={{ marginTop: "24px" }}
        >
          This project is in beta. Use at your own risk.
        </Typography>
      </div>
    );
  };

  handleTabChange = (event, newValue) => {
    this.setState({value:newValue})
  };

  onChange = (event) => {
    let val = []
    val[event.target.id] = event.target.checked
    this.setState(val)
  };

  renderAssetBlocksv2 = () => {
    const { assets, expanded } = this.state
    const { classes, t } = this.props
    const width = window.innerWidth
    return assets.filter((asset) => {
      return (asset.version === 2)
    }).filter((asset) => {
      return !(asset.symbol === "iDAI")
    }).map((asset) => {
      return (
        <Accordion className={ classes.expansionPanel } square key={ asset.id+"_expand" } expanded={ expanded === asset.id} onChange={ () => { this.handleChange(asset.id) } }>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <div className={ classes.assetSummary }>
              <div className={classes.headingName}>
                <div className={ classes.assetIcon }>
                  <img
                    alt=""
                    src={ require('../../assets/'+asset.symbol+'-logo.png') }
                    height={ width > 600 ? '40px' : '30px'}
                    style={asset.disabled?{filter:'grayscale(100%)'}:{}}
                  />
                </div>
                <div>
                  <Typography variant={ 'h3' }>{ asset.name }</Typography>
                  <Typography variant={ 'h5' } className={ classes.grey }>{ asset.description }</Typography>
                </div>
              </div>
              <div className={classes.heading} style={{flex: '4', textAlign: 'center', }}>
                <Typography variant={ 'h3' }>
                  {
                    asset.maxApr
                      ? ((asset.maxApr / 2 * 100) + this.state.YELDAPY).toFixed(2) + ' %'
                      : '0.00 %'
                  }
                </Typography>
                <Typography variant={ 'h4' }>
                  ({ this.state.YELDAPY.toFixed(2) } % in YELD)
                </Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>{ t('InvestSimple.InterestRate') }</Typography>
              </div>
              <div className={classes.heading}>
                <Typography variant={ 'h3' }>
                  {
                    asset.balance
                      ? (asset.balance).toFixed(4) + ' ' + (asset.tokenSymbol ? asset.tokenSymbol : asset.symbol)
                      : '0.00 ' + (asset.tokenSymbol ? asset.tokenSymbol : asset.symbol)
                  }
                </Typography>
                <Typography variant={ 'h5' } className={ classes.grey }>{ t('InvestSimple.AvailableBalance') }</Typography>
              </div>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <Asset asset={ asset } startLoading={ this.startLoading } />
          </AccordionDetails>
        </Accordion>
      )
    })
  }

  handleChange = (id) => {
    this.setState({ expanded: this.state.expanded === id ? null : id })
  }

  startLoading = () => {
    this.setState({ loading: true })
  }

  renderSnackbar = () => {
    var {
      snackbarType,
      snackbarMessage
    } = this.state
    return <Snackbar type={ snackbarType } message={ snackbarMessage } open={true}/>
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(InvestSimple)));
