import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  TextField,
  Button,
  Typography,
  Modal,
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { withNamespaces } from "react-i18next";
import { colors } from "../../theme";

import Snackbar from "../snackbar";
import Loader from "../loader";

import {
  ERROR,
  GET_BALANCES_LIGHT,
  BALANCES_LIGHT_RETURNED,
  INVEST_RETURNED,
  REDEEM_RETURNED,
  CONNECTION_CONNECTED,
  CONNECTION_DISCONNECTED,
} from "../../constants";

import UnlockModal from "../unlock/unlockModal.jsx";

import Store from "../../stores";
const emitter = Store.emitter;
const dispatcher = Store.dispatcher;
const store = Store.store;

const styles = (theme) => ({
  root: {
    verticalAlign: "top",
    width: "100%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "40px",
    },
  },
  headerV2: {
    background: colors.gray,
    border: "1px solid " + colors.borderBlue,
    borderTop: "none",
    width: "100%",
    display: "flex",
    padding: "24px 32px",
    alignItems: "center",
    justifyContent: "center",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "space-between",
      padding: "16px 24px",
    },
  },
  stakeContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "column",
  },
  stakeOptions: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    flex: 1,
    cursor: "pointer",
  },
  links: {
    display: "flex",
  },
  link: {
    padding: "12px 0px",
    margin: "0px 12px",
    cursor: "pointer",
    "&:hover": {
      paddingBottom: "9px",
      borderBottom: "3px solid " + colors.borderBlue,
    },
  },
  title: {
    textTransform: "capitalize",
  },
  actionInput: {
    padding: "0px 0px 12px 0px",
    fontSize: "0.5rem",
  },
  linkActive: {
    padding: "12px 0px",
    margin: "0px 12px",
    cursor: "pointer",
    paddingBottom: "9px",
    borderBottom: "3px solid " + colors.borderBlue,
  },
  account: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
    [theme.breakpoints.down("sm")]: {
      flex: "0",
    },
  },
  walletAddress: {
    padding: "12px",
    border: "2px solid rgb(174, 174, 174)",
    borderRadius: "50px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    "&:hover": {
      border: "2px solid " + colors.borderBlue,
      background: "rgba(47, 128, 237, 0.1)",
    },
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      position: "absolute",
      top: "90px",
      border: "1px solid " + colors.borderBlue,
      background: colors.gray,
    },
  },
  walletTitle: {
    flex: 1,
    color: colors.darkGray,
  },
  connectedDot: {
    background: colors.compoundGreen,
    opacity: "1",
    borderRadius: "10px",
    width: "10px",
    height: "10px",
    marginRight: "3px",
    marginLeft: "6px",
  },
  name: {
    paddingLeft: "24px",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    position: "absolute",
    width: 450,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
});

class StakeSimple extends Component {
  constructor(props) {
    super();

    const account = store.getStore("account");
    this.state = {
      account: account,
      modalOpen: false,
      retirementYeldAvailable: false, // When you have something to redeem
      earnings: 0,
      yeldBalance: 0,
      hoursPassedAfterStaking: 0,
      retirementYeldCurrentStaked: 0,
      stakeModalOpen: false,
      unstakeModalOpen: false,
      stakeAmount: 0,
      unStakeAmount: 0,
    };

    this.waitUntilSetupComplete();

    if (account && account.address) {
      dispatcher.dispatch({ type: GET_BALANCES_LIGHT, content: {} });
    }
  }

  async setupContractData() {
    const snapshot = await window.retirementYeld.methods
      .stakes(window.web3.eth.defaultAccount)
      .call();

    const dateNowWithOneDay =
      Number(Date.now().toString().substr(0, 10)) + 86400;
    const dateNow = Number(Date.now().toString().substr(0, 10));
    const substraction = Number(dateNow) - Number(snapshot.timestamp);
    const hoursPassedAfterStaking = this.secondsToHms(substraction);

    this.setState({
      retirementYeldCurrentStaked: snapshot.yeldBalance,
      hoursPassedAfterStaking:
        snapshot.timestamp == 0 ? 0 : hoursPassedAfterStaking,
    });

    // If one day has passed, change
    if (snapshot.timestamp != 0 && dateNowWithOneDay >= snapshot.timestamp) {
      const balanceBlackHole = String(
        await window.yeld.methods
          .balanceOf("0x0000000000000000000000000000000000000000")
          .call()
      );
      const totalSupply = await window.yeld.methods.totalSupply().call();
      const userPercentage =
        snapshot.yeldBalance / (totalSupply - balanceBlackHole);

      // Gets how many ETH the user earns based on his balance
      const balanceRetirementContract = await window.web3.eth.getBalance(
        window.retirementYeld._address
      );
      const earnings = String(
        (balanceRetirementContract * userPercentage) / 100
      );
      if (earnings > 0)
        this.setState({ retirementYeldAvailable: true, earnings });
    }

    let yeldBalance = String(
      window.web3.utils.fromWei(
        await window.yeld.methods
          .balanceOf(window.web3.eth.defaultAccount)
          .call()
      )
    );
    if (yeldBalance.split(".").length > 1) {
      yeldBalance =
        yeldBalance.split(".")[0] +
        "." +
        yeldBalance.split(".")[1].substr(0, 2);
    }
    this.setState({ yeldBalance });
  }

  waitUntilSetupComplete() {
    window.myInterval = setInterval(async () => {
      if (this.props.setupComplete) {
        window.clearInterval(window.myInterval);
        await this.setupContractData();
      }
    }, 1e2);
  }

  render() {
    const { classes } = this.props;

    const { account, modalOpen } = this.state;

    return (
      <div className={classes.root}>
        <div className={classes.stakeContainer}>
          <Typography
            variant={"h3"}
            className={classes.titleStake}
            style={{ textAlign: "left" }}
          >
            You Retirement Stake
          </Typography>
          <div className={classes.stakeOptions}>
            <Button
              style={{ marginLeft: "10px", borderRadius: "0" }}
              variant="outlined"
              color="primary"
              disabled={this.state.yeldBalance <= 0}
              onClick={() => this.setState({ stakeModalOpen: true })}
            >
              <Typography variant={"h5"} color="secondary">
                Stake Yeld Tokens ({this.state.yeldBalance} YELD)
                <br />
                <i>
                  {this.state.retirementYeldCurrentStaked <= 0
                    ? ""
                    : `Currently Staked ${window.web3.utils.fromWei(
                        this.state.retirementYeldCurrentStaked
                      )} YELD`}
                </i>
              </Typography>
            </Button>

            <Modal
              className={classes.modal}
              open={this.state.stakeModalOpen}
              onClose={() => this.setState({ stakeModalOpen: false })}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={this.modalStyle} className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                  Enter how much YELD you want to stake. Warning: leave at least
                  5 YELD in your wallet to keep using the beta!"
                </Typography>
                <br />
                <TextField
                  fullWidth
                  className={classes.actionInput}
                  value={this.state.stakeAmount}
                  onChange={(e) =>
                    this.setState({ stakeAmount: e.target.value })
                  }
                  placeholder="0"
                  variant="outlined"
                />
                <br /> <br />
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={this.state.stakeAmount <= 0}
                    onClick={async () => {
                      if (await this.betaTesting()) {
                        await window.yeld.methods
                          .approve(
                            window.retirementYeld._address,
                            window.web3.utils.toWei(
                              String(this.state.stakeAmount)
                            )
                          )
                          .send({
                            from: window.web3.eth.defaultAccount,
                          });

                        await window.retirementYeld.methods
                          .stakeYeld(
                            window.web3.utils.toWei(
                              String(this.state.stakeAmount)
                            )
                          )
                          .send({
                            from: window.web3.eth.defaultAccount,
                          });
                      } else {
                        alert(
                          "You can't use the dapp during the beta testing period if you hold less than 5 YELD"
                        );
                      }
                    }}
                  >
                    <Typography variant={"h5"} color="secondary">
                      Stake
                    </Typography>
                  </Button>

                  <Button
                    style={{ marginLeft: "50%" }}
                    variant="outlined"
                    color="primary"
                    onClick={() => this.setState({ stakeModalOpen: false })}
                  >
                    <Typography variant={"h5"} color="secondary">
                      Cancel
                    </Typography>
                  </Button>
                </div>
              </div>
            </Modal>

            <Button
              style={{ marginLeft: "10px" }}
              variant="outlined"
              color="primary"
              disabled={this.state.retirementYeldCurrentStaked <= 0}
              onClick={() => this.setState({ unstakeModalOpen: true })}
            >
              <Typography variant={"h5"} color="secondary">
                Unstake Yeld
              </Typography>
            </Button>

            <Modal
              className={classes.modal}
              open={this.state.unstakeModalOpen}
              onClose={() => this.setState({ unstakeModalOpen: false })}
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
            >
              <div style={this.modalStyle} className={classes.paper}>
                <Typography variant="h4" className={classes.title}>
                  Enter how much YELD you want to unstake:
                </Typography>
                <br />
                <TextField
                  fullWidth
                  className={classes.actionInput}
                  value={this.state.unStakeAmount}
                  onChange={(e) =>
                    this.setState({ unStakeAmount: e.target.value })
                  }
                  placeholder="0"
                  variant="outlined"
                />
                <br /> <br />
                <div>
                  <Button
                    variant="outlined"
                    color="primary"
                    disabled={this.state.unStakeAmount <= 0}
                    onClick={async () => {
                      await window.retirementYeld.methods
                        .unstake(
                          window.web3.utils.toWei(
                            String(this.state.unStakeAmount)
                          )
                        )
                        .send({
                          from: window.web3.eth.defaultAccount,
                        });
                    }}
                  >
                    <Typography variant={"h5"} color="secondary">
                      Unstake
                    </Typography>
                  </Button>

                  <Button
                    style={{ marginLeft: "46%" }}
                    variant="outlined"
                    color="primary"
                    onClick={() => this.setState({ unstakeModalOpen: false })}
                  >
                    <Typography variant={"h5"} color="secondary">
                      Cancel
                    </Typography>
                  </Button>
                </div>
              </div>
            </Modal>

            <Button
              style={{ marginLeft: "10px" }}
              variant="outlined"
              color="primary"
              disabled={!this.state.retirementYeldAvailable}
              onClick={async () => {
                if (await this.betaTesting()) {
                  await window.retirementYeld.methods.redeemETH().send({
                    from: window.web3.eth.defaultAccount,
                  });
                } else {
                  alert(
                    "You can't use the dapp during the beta testing period if you hold less than 5 YELD"
                  );
                }
              }}
            >
              <Typography variant={"h5"} color="secondary">
                {!this.state.retirementYeldAvailable ? (
                  <span>
                    Retirement Yield Available in 24h
                    <br />
                    <i>
                      {this.state.hoursPassedAfterStaking <= 0
                        ? ""
                        : `Time passed ${this.state.hoursPassedAfterStaking}`}
                    </i>
                  </span>
                ) : (
                  <span>
                    Redeem Retirement Yield ({this.state.earnings} ETH)
                  </span>
                )}
              </Typography>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  getModalStyle = () => {
    const top = 50 + Math.round(Math.random() * 20) - 10;
    const left = 50 + Math.round(Math.random() * 20) - 10;
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  };

  addressClicked = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  renderModal = () => {
    return (
      <UnlockModal
        closeModal={this.closeModal}
        modalOpen={this.state.modalOpen}
      />
    );
  };
}

export default withNamespaces()(withRouter(withStyles(styles)(StakeSimple)));
