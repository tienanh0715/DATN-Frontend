import { Provider } from 'react-redux'
import { getPersistor } from '@rematch/persist'
import { PersistGate } from 'redux-persist/es/integration/react'
import store from './index'

const StoreProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <PersistGate persistor={getPersistor()}>
                {children}
            </PersistGate>
        </Provider>
    )
}
export {StoreProvider}