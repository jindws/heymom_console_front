import { applyMiddleware, compose, createStore } from 'redux'
import createRootReducer from '../reducers'
import middlewares from './middlewares'
let enhancers = []

if(__LOCAL__&&window.__REDUX_DEVTOOLS_EXTENSION__) {
    enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
}


const store = createStore(
    createRootReducer(),
    window.__INITIAL_STATE__ || {
        vipcourse:{},
    },
    compose(
        applyMiddleware(...middlewares),
        ...enhancers
    )
)

if (module.hot) {
    module.hot.accept('../reducers', () => {
        const nextRootReducer = require('../reducers/index');
        store.replaceReducer(nextRootReducer);
    });
}

export default store
