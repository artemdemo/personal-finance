import React from 'react';
import { connect } from "react-redux";
import history from "../../history";
import Container from "../../components/Container/Container";
import MainMenu from "../../containers/MainMenu/MainMenu";
import * as googleApi from "../../google-api/google-api";
import { signedIn, signedOut } from "../../model/user/userActions";
import BasicProfile = gapi.auth2.BasicProfile;
import GSheet from "../../google-api/GSheet";

type TProps = {
    signedIn: (user: BasicProfile) => void;
    signedOut: () => void;
    setSheets: (sheets: GSheet[]) => void;
};

type TState = {
    initialized: boolean;
    status: string;
};

const LOGIN_PATH = '/login';

class AppView extends React.PureComponent<TProps, TState> {
    state: TState = {
        initialized: false,
        status: '',
    };

    componentDidMount() {
        this.setState({ status: 'Loading client.js' });

        googleApi.load()
            .then(() => {
                this.setState({ status: 'Script loaded, initializing' });

                googleApi.init()
                    .then(this.handleClientInitialized)
                    .catch(this.handleClientInitializingErr);
            });
    }

    handleClientInitialized = () => {
        this.setState({ initialized: true });

        googleApi.listenIsSignedIn(this.updateSigninStatus);

        this.updateSigninStatus(
            googleApi.getIsSignedIn(),
        );
    };

    handleClientInitializingErr = (err) => {
        const { signedOut } = this.props;
        console.error(err);
        signedOut();
    };

    updateSigninStatus = (isSignedIn: boolean) => {
        const { signedIn, signedOut } = this.props;
        if (isSignedIn) {
            if (history.location.pathname === LOGIN_PATH) {
                history.push('/');
            }
            signedIn(googleApi.getBasicProfile())
        } else {
            history.push(LOGIN_PATH);
            signedOut()
        }
    }

    render() {
        return (
            <Container>
                <MainMenu />
                <div className='px-2'>
                    {this.state.initialized ? this.props.children : this.state.status}
                </div>
            </Container>
        );
    }
}

export default connect(
    () => ({}),
    {
        signedIn,
        signedOut,
    },
)(AppView);
