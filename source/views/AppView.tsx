import React from 'react';
import {connect} from 'react-redux';
import history from '../history';
import {Container} from '../components/Container/Container';
import MainMenu from '../containers/MainMenu/MainMenu';
import * as googleApi from '../google-api/google-api';
import {
  TSignedIn,
  signedIn,
  signedOut,
} from '../model/user/userActions';
import Notifications from '../containers/Notifications/Notifications';
import logger from '../services/logger';
import {loadSheets} from '../model/sheets/sheetsActions';
import {
  TLoadAccounts,
  loadAccounts,
} from '../model/accounts/accountsActions';
import {
  loadTransactions, TLoadTransactions,
} from '../model/transactions/transactionsActions';
import {
  TLoadCategories,
  loadCategories,
} from '../model/categories/categoriesActions';
import * as routes from '../routing/routes';
import ErrorHandler from '../components/ErrorHandler/ErrorHandler';

type TProps = {
  signedIn: TSignedIn;
  signedOut: () => void;
  loadSheets: () => void;
  loadAccounts: TLoadAccounts;
  loadCategories: TLoadCategories;
  loadTransactions: TLoadTransactions;
  children: any;
};

class AppView extends React.PureComponent<TProps> {
  componentDidMount() {
    googleApi.loadAndInit()
      .then(this.handleClientInitialized)
      .catch(this.handleClientInitializingErr);
  }

  handleClientInitialized = () => {
    googleApi.listenIsSignedIn(this.updateSigninStatus);

    googleApi.getIsSignedIn()
      .then(status => this.updateSigninStatus(status));
  };

  handleClientInitializingErr = (err) => {
    const {signedOut} = this.props;
    logger.error(err);
    signedOut();
  };

  updateSigninStatus = (isSignedIn: boolean) => {
    const {signedIn, signedOut, loadSheets, loadAccounts, loadTransactions, loadCategories} = this.props;
    if (isSignedIn) {
      if (history.location.pathname === routes.login()) {
        history.push(routes.main());
      }
      loadTransactions();
      loadSheets();
      loadAccounts();
      loadCategories();
      googleApi.getBasicProfile()
        .then(status => signedIn(status));
    } else {
      history.push(routes.login());
      signedOut()
    }
  }

  render() {
    return (
      <Container>
        <MainMenu/>
        <Notifications/>
        <ErrorHandler>
          {this.props.children}
        </ErrorHandler>
      </Container>
    );
  }
}

export default connect(
  () => ({}),
  {
    loadCategories,
    loadTransactions,
    loadSheets,
    loadAccounts,
    signedIn,
    signedOut,
  },
)(AppView);
