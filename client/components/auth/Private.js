import { useEffect } from 'react';
import Router from 'next/router';
import { isAuthenticated } from '../../actions/auth';

const Private = ({ children }) => {
  useEffect( () => {
    if(!isAuthenticated()) {
      Router.push('/signin');
    }
  }, []);
  return <React.Fragment>{children}</React.Fragment>;
};

export default Private;