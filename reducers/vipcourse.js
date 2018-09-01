import createReducer from '../util/createReducer'
import { ACTION_HANDLERS } from '../actions/vipcourse'

let initState = {}
export default createReducer(initState, ACTION_HANDLERS)
