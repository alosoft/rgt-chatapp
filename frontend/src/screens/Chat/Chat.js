import React, { Component } from 'react'
import { connect } from 'react-redux';
import Layout from '../../components/Layout/Layout';
import LeftPane from '../../components/LeftPane/LeftPane';
import Main from '../../components/Main/Main';
import io from 'socket.io-client';
import { setSelectedUser } from '../../store/chatSlice';
import CurrentUser from '../../components/CurrentUser/CurrentUser';
import { Auth0Provider, useAuth0, User } from "@auth0/auth0-react";
import config from '../../utils/config';
import authSlice, { fetchBlocked, fetchBlockers } from '../../store/authSlice';


class Chat extends Component {

    constructor(props) {
        super(props);
        const { currentUser } = this.props;
        console.log('poppppp=> ', currentUser)

        this.socket = io(`http://${window.location.hostname}:5000`, {
            query: {
                ...currentUser
            }
        });
        this.socket.on('message-send', data => {
            console.log('data from socket', data)
        })
        this.socket.on('disconnect', data => {
            // alert('user disconnected on frontend')
        })
        this.socket.on('user-settings', data => {
            this.props.fetchBlockers(currentUser)
        })
    }

    render() {
        const onRedirectCallback = (appState) => {
            console.log(window.location.pathname);
            console.log('app state', appState);
            // navigate('/chat');
        };

        const { currentUser, selectedUser, setSelectedUser, fetchBlocked, notify, disableNotify, fetchBlockers } = this.props;
        fetchBlocked(currentUser);
        fetchBlockers();
        console.log('currentUser', currentUser);
        if (selectedUser) {
            setSelectedUser(selectedUser)
        }

        if (notify) {
            this.socket.emit('user-blocked');
            disableNotify()
        }

        return (
            <Auth0Provider
                domain={config}
                clientId={config.clientId}
                redirectUri={window.location.origin}
                onRedirectCallback={onRedirectCallback}
            >
                <Layout>
                    <LeftPane socket={this.socket} />
                    <div>
                        <CurrentUser />
                        <Main socket={this.socket} />
                    </div>
                </Layout>
            </Auth0Provider>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSelectedUser: (user) => dispatch(setSelectedUser(user)),
        fetchBlocked: (user) => dispatch(fetchBlocked(user)),
        fetchBlockers: () => dispatch(fetchBlockers('')),
        disableNotify: ()=> dispatch(authSlice.actions.removeNotify())
    }
}

const mapStateToProps = (state, props) => {
    console.log('state in chat', state)
    return {
        currentUser: state.auth.currentUser,
        selectedUser: state.chat.selectedUser,
        notify: state.auth.notify,
        ...props
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);