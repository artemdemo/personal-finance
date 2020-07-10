import React from 'react';
import { connect } from "react-redux";
import history from "../../history";
import Container from "../../components/Container/Container";
import MainMenu from "../../containers/MainMenu/MainMenu";
import * as googleApi from "../../google-api/google-api";
import { signedIn, signedOut } from "../../model/user/userActions";
import { sendNotification } from "../../model/notifications/notificationsActions";
import Notifications from "../../containers/Notifications/Notifications";
import BasicProfile = gapi.auth2.BasicProfile;

type TProps = {
    signedIn: (user: BasicProfile) => void;
    signedOut: () => void;
    sendNotification: (props: any) => void;
};

type TState = {};

const LOGIN_PATH = '/login';

class AppView extends React.PureComponent<TProps, TState> {
    componentDidMount() {
        googleApi.loadAndInit()
            .then(this.handleClientInitialized)
            .catch(this.handleClientInitializingErr);
    }

    handleClientInitialized = () => {
        this.setState({ initialized: true });

        googleApi.listenIsSignedIn(this.updateSigninStatus);

        googleApi.getIsSignedIn()
            .then(status => this.updateSigninStatus(status));
    };

    handleClientInitializingErr = (err) => {
        const { signedOut } = this.props;
        console.error(err);
        signedOut();
    };

    updateSigninStatus = (isSignedIn: boolean) => {
        const { signedIn, signedOut, sendNotification } = this.props;
        if (isSignedIn) {
            if (history.location.pathname === LOGIN_PATH) {
                history.push('/');
            }
            sendNotification({ msg: 'Test' });
            sendNotification({ msg: 'Test 1' });
            googleApi.getBasicProfile()
                .then(status => signedIn(status));
        } else {
            history.push(LOGIN_PATH);
            signedOut()
        }
    }

    render() {
        return (
            <Container>
                <MainMenu />
                <Notifications />
                <div className='px-2'>
                    {this.props.children}
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
        sendNotification,
    },
)(AppView);
