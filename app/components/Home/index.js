/**
 * Created by wanpeng on 2017/2/13.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Image,
  Text,
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'

class Home extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View>
        <Image
          source={require('../../assets/images/banner.png')}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({

})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})