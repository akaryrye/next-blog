import Router from 'next/router';
import { useState, useEffect } from 'react'
import { signin, authenticate, isAuthenticated } from '../../actions/auth';

const SigninComponent = () => {
  
  const [values, setValues] = useState({
    email: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    showForm: true
  });

  const {email, password, error, loading, message, showForm} = values;

  useEffect( () => {
    isAuthenticated() && Router.push('/');
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault(); 
    setValues({...values, loading: true, error: false});
    const user = { email, password };
    
    signin(user).then(data => {
      if(data.error) {
        setValues({...values, error: data.error, loading: false });
        console.log(data.error);
      } else {
        // TODO load cookies to localstorage, authenticate user
        authenticate(data, () => {
          if(isAuthenticated() && isAuthenticated().role === 1) {
            Router.push('/admin');
          } else if(isAuthenticated() && isAuthenticated().role === 0) {
            Router.push('/user');
          } else {
            Router.push('/');
          };
        });
        console.log(data.message);
      }
    });
  };

  const handleChange = name => (e) => {
    setValues({...values, error: false, [name]: e.target.value});
  };

  const showLoading = () => (loading ? <div className="alert alert-info">Loading...</div> : '');
  const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
  const showMessage = () => (message ? <div className="alert alert-info">{message}.</div> : '');
  
  const signinForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        
        <div className="form-group">
          <input
            value={email}
            onChange={handleChange('email')}
            type="email" 
            className="form-control" 
            placeholder="Enter email address" />
        </div>

        <div className="form-group">
          <input
            value={password}
            onChange={handleChange('password')} 
            type="password" 
            className="form-control" 
            placeholder="Enter password" />
        </div>

        <div>
          <button className="btn btn-primary">Submit</button>
        </div>

      </form>
    )
  }
  
  return (
    <React.Fragment>
      {showError()}
      {showLoading()}
      {showMessage()}
      {showForm && signinForm()}
    </React.Fragment>
  );
};

export default SigninComponent;