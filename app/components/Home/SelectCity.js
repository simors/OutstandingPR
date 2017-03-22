/**
 * Created by wanpeng on 2017/3/8.
 */
import React, {Component} from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  InteractionManager,
  TouchableOpacity,
  Platform
} from 'react-native'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Actions} from 'react-native-router-flux'
import Symbol from 'es6-symbol'
import Header from '../common/Header'
import {normalizeH, normalizeW} from '../../util/Responsive'
import {submitInputData, submitFormData, INPUT_FORM_SUBMIT_TYPE} from '../../action/authActions'
import {activeUserId} from '../../selector/authSelector'
import Icon from 'react-native-vector-icons/Ionicons'
import * as Toast from '../common/Toast'
import {getCurrentLocation} from '../../action/locAction'
import {getCity} from '../../selector/locSelector'
import AlphabetListView from 'react-native-alphabetlistview'
import {fetchCitiesInfo} from '../../action/configAction'
import {getBaiduCityMap} from '../../selector/configSelector'

const PAGE_WIDTH=Dimensions.get('window').width

class SectionHeader extends Component {
  render() {
    // inline styles used for brevity, use a stylesheet when possible
    var textStyle = {
      color:'rgba(120, 120, 120, 1)',
      fontWeight:'700',
      fontSize:15
    };

    var viewStyle = {
      justifyContent: 'flex-start',
    };
    return (
      <View style={viewStyle}>
        <Text style={textStyle}>{this.props.title}</Text>
      </View>
    );
  }
}

class SectionItem extends Component {
  render() {
    return (
      <Text style={{color:'#f00'}}>{this.props.title}</Text>
    );
  }
}

class Cell extends Component {
  render() {
    return (
      <TouchableOpacity style={{justifyContent: 'center', height:40, borderBottomWidth: 1, borderBottomColor: 'rgba(120, 120, 120, 1)'}}>
        <Text style={{fontSize: 15, color: 'rgba(120, 120, 120, 1)'}}>{this.props.item.area_name}</Text>
      </TouchableOpacity>
    );
  }
}


class SelectCity extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    InteractionManager.runAfterInteractions(() => {
      this.props.getCurrentLocation()
      this.props.fetchCitiesInfo({areaCode: 1})
    })
  }

  onSwitchCity = (city) => {
    console.log("onSwitchCity")
  }



  renderCityList() {
    if(this.props.cityMap) {
      return(
        <AlphabetListView
          data={this.props.cityMap}
          cell={Cell}
          cellHeight={40}
          sectionListItem={SectionItem}
          sectionHeader={SectionHeader}
          sectionHeaderHeight={40}
          onCellSelect={this.onSwitchCity}
        />
      )
    } else {
      return(
        <View />
      )
    }
  }

  render() {
    return (
      <View style={styles.container} >
        <Header
          leftType="icon"
          leftIconName="ios-close"
          leftPress={() => Actions.pop()}
          title="国内"
        />
        <View style={styles.body}>
          <View style={{marginTop: normalizeH(15)}}>
            <Text style={{fontSize: 15}}>定位城市</Text>
            <TouchableOpacity style={styles.locatedCity} onPress={this.onSwitchCity}>
              <Icon
                name={'ios-locate'}
                style={{fontSize: 24, color: '#FF9D4E'}}/>
              <Text style={{fontSize: 15, marginLeft: normalizeW(15)}}>{this.props.locatedCity}</Text>
            </TouchableOpacity>
          </View>
          {this.renderCityList()}
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  let currentUser = activeUserId(state)
  let locatedCity = getCity(state)
  let cityMap = getBaiduCityMap(state)
  console.log("cityList:", cityMap)
  return {
    currentUser: currentUser,
    locatedCity: locatedCity,
    cityMap: cityMap,
  }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
  getCurrentLocation,
  fetchCitiesInfo
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(SelectCity)

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    flex: 1,
    ...Platform.select({
      ios: {
        marginTop: normalizeH(64),
      },
      android: {
        marginTop: normalizeH(44)
      }
    }),
    backgroundColor: '#F5F5F5',
    paddingLeft: normalizeW(15)
  },
  locatedCity: {
    borderRadius: 3,
    marginTop: normalizeH(5),
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    width: normalizeW(120),
    height: normalizeH(40),
    paddingLeft: normalizeW(5)
  }

})