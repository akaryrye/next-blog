import Router from 'next/router';
import { useState, useEffect } from 'react'
import { signup, isAuthenticated } from '../../actions/auth';

const SignupComponent = () => {
  
  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    showForm: true
  });

  const {name, email, password, error, loading, message, showForm} = values;

  useEffect( () => {
    isAuthenticated() && Router.push('/');
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({...values, loading: true, error: false});
    const user = { name, email, password };
    
    signup(user).then(data => {
      if(data.error) {
        setValues({...values, error: data.error, loading: false });
        console.log(data.error);
      } else {
        setValues({
            ...values, 
            name: '', 
            email: '', 
            password: '', 
            error: '', 
            loading: false, 
            message: data.message, 
            showForm: false
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
  
  const signupForm = () => {
    return (
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input 
            value={name}
            onChange={handleChange('name')}
            type="text" 
            className="form-control" 
            placeholder="Enter name" />
        </div>
        
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
      {showForm && signupForm()}
    </React.Fragment>
  );
};

export default SignupComponent;