import {AsyncStorage} from 'react-native'
import {persistStore} from 'redux-persist'
import configureStore from '../store/configureStore'



export const store = configureStore()

