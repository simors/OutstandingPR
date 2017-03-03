/**
 * Created by wanpeng on 2017/3/2.
 */
import React, {Component} from 'react'
import {
  View,
  StyleSheet,
  InteractionManager,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'


class SystemMessageCell extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <View>

      </View>
    )
  }
}


const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let members = ownProps.members
  let otherMem = members.filter((member) => {
    if (member === currentUser) {
      return false
    }
    return true
  })
  let doctors = userInfoByIds(state, otherMem)
  return {
    currentUser: currentUser,
    users: doctors,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SystemMessageCell)