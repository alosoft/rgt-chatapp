import React, { Component } from 'react';
import { connect } from 'react-redux';
import ChatBox from '../ChatBox/ChatBox';
import CircularProgressBar from '../CircularProgressBar/CircularProgressBar';
import Input from '../Input/Input';
import ProgressBar from '../ProgressBar/ProgressBar';
import UserCard from '../UserCard/UserCard';
import './Main.css';

class Main extends Component {

    render() {
        const { selectedUser, socket, saving, loading } = this.props
        console.log('socket=>', socket)
        console.log('selected user', selectedUser)
        return (
            <div className='main'>
                <div className="main__header">
                    {selectedUser ?
                        <UserCard user={selectedUser} />
                        : null}
                </div>
                <div className="main__chat">
                    {
                        loading ? <CircularProgressBar /> :
                            selectedUser ?
                                <ChatBox socket={socket} />
                                : <div className='main__instruction'>
                                    <p>Select a user on the left to start</p>
                                </div>
                    }
                </div>
                {saving ?
                    <ProgressBar />
                    : null}
                <div className="main__input">
                    <Input socket={socket} />
                </div>
            </div>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return {
        ...ownProps,
        saving: state.chat.saving,
        loading: state.chat.loading,
        selectedUser: Object.keys(state.chat.selectedUser).length === 0 ? null : state.chat.selectedUser
    }
}
export default connect(mapStateToProps, {})(Main);