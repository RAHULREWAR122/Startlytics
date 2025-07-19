// components/ReduxProvider.js
'use client';
import { Provider } from 'react-redux';
import { store } from './store';
import AuthLoader from './AuthLoad';
import { ThemeProvider } from './ThemeProvider';
export default function ReduxProvider({ children }) {
  return <Provider store={store}>
    <ThemeProvider>
     <AuthLoader/>
    {children}
   </ThemeProvider> 
  </Provider>;
}