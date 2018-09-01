import { combineReducers } from 'redux'
import store from '../store'
import vipcourseReducer from './vipcourse'


const syncReducers = {
  vipcourse: vipcourseReducer,
}

const asyncReducers = {}


export default function createRootReducer() {
  return combineReducers({
    ...syncReducers,
    ...asyncReducers
  })
}
