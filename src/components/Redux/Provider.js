// components/ReduxProvider.js
'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthLoader from './AuthLoad';
export default function ReduxProvider({ children }) {
  return <Provider store={store}>
    <AuthLoader/>
    {children}
  </Provider>;
}