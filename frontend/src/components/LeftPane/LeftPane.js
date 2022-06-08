import React, { Component } from 'react';
import './LeftPane.css';
import { connect } from 'react-redux';
import { getUsers } from '../../store/actions';
import { fetchUser } from '../../store/usersSlice';
import chatSlice from '../../store/chatSlice';
import UserCard from '../UserCard/UserCard';
import _ from 'lodash';

class LeftPane extends Component {

  constructor(props) {
    super(props);
    this.handleUserOnline = this.handleUserOnline.bind(this);
    this.props.socket.on('user-online', this.handleUserOnline)
  }

  handleUserOnline(user) {
    const { socket, currentUser, onlineUsers, setOnlineUser } = this.props;
    console.log('props in handle online', this.props)


    if (!user.email)
      return;

    const currentUserId = currentUser.user_id || currentUser.sub;
    const userId = user.user_id || user.sub;
    if (currentUserId === userId)
      return;

    const user_id = user.sub || user.user_id;
    const exist = onlineUsers.filter(onlineUser => onlineUser.user_id === user_id || onlineUser.sub === user_id);
    if (exist.length > 0) {

      // socket.emit('user-wave', currentUser)
      return;
    }

    if (currentUser.email) {
      console.log('sending wave....', currentUser)
      socket.emit('user-wave', currentUser)
    }
    setOnlineUser(user)
  }

  // componentWillMount() {
  //   const { getUsers } = this.props;
  //   getUsers()
  // }

  render() {
    const { users, isLoading, currentUser, onlineUsers } = this.props;
    console.log('online users', onlineUsers)
    return (
      <div className='pane'>
        {
          onlineUsers.length > 0 ? _.uniqBy(onlineUsers, 'name').filter(user => user.email !== currentUser.email).map(user => <UserCard user={user} key={user.user_id || user.sub} />)
            : <p>No users online</p>
        }
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...ownProps,
    currentUser: state.auth.currentUser,
    users: state.users.users,
    isLoading: state.users.loading,
    onlineUsers: state.chat.onlineUsers
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    // getUsers: () => dispatch(fetchUser())
    setOnlineUser: (user) => dispatch(chatSlice.actions.setOnlineUser(user))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeftPane);
