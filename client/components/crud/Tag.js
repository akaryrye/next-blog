import { useState, useEffect } from 'react';
import { Link } from 'next/link';
import Router from 'next/router';
import { getCookie } from '../../actions/auth';
import { createTag, getTags, removeTag } from '../../actions/tag';

const Tag = () => {
  
  const [values, setValues] = useState({
    name: '',
    error: false,
    success: false,
    tags: [],
    removed: false,
    reload: false
  });

  const { name, error, success, tags, removed, reload } = values;
  const token = getCookie('token');

  useEffect( () => {
    loadTags();
  }, [reload]);

  const loadTags = () => {
    getTags().then(data => {
      if(data.error) {
        console.log(data.error)
      } else {
        setValues({ ...values, tags: data });
      }
    });
  };

  const showTags = () => {
    return tags.map((t, i) => {
      return (
        <button onDoubleClick={() => deleteConfirm(t.slug)} title="double-click to delete" key={i} className="btn btn-outline-primary mr-1 ml-1 mt-3">
          {t.name}
        </button>
      )
    });
  };

  const deleteConfirm = (tag) => {
    let confirm = window.confirm('Are you sure you want to delete this tag?')
    if(confirm) {
      deleteTag(tag);
    }
  };

  const deleteTag = (tag) => {
    //console.log('delete', tag);
    removeTag(tag, token)
      .then((data) => {
        if(data.error) console.log(error)
        else  {
          setValues({ ...values, error: false, success: false, name: '', removed: !removed, reload: !reload });
        }
      });
  };

  const clickSubmit = (e) => {
    e.preventDefault();
    //console.log('create tag', name);
    createTag({name}, token).then(data => {
      if(data.error) {
        setValues({ ...values, error: data.error, success: false });
      } else {
        setValues({ ...values, error: false, success: true, name: '', reload: !reload });
      }
    });
  };

  const handleChange = (e) => {
    setValues({ ...values, name: e.target.value, error: false, success: false, removed: '' });
  };

  const showSuccess = () => {
    if(success) {
      return <p className="text-success">
        Tag has been created
      </p>
    };
  };
  
  const showError = () => {
    if(error) {
      return <p className="text-danger">
        Tag already exists
      </p>
    };
  };

  const showRemoved = () => {
    if(removed) {
      return <p className="text-warning">
        Tag has been removed
      </p>
    };
  };

  const clearMessage = (e) => {
    setValues({ ...values, error: false, success: false, removed: '' });
  }

  const newTagForm = () => (
    <form onSubmit={clickSubmit}>
      <div className="form-group">
        <label className="text-muted">Create Tag:</label>
        <input type="text" className="form-control" onChange={handleChange} value={name} required />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Create Tag
        </button>
      </div>
    </form>
  );

  return (
    <React.Fragment>
      {showSuccess()}
      {showError()}
      {showRemoved()}
      
      <div onMouseOver={clearMessage}>
        {newTagForm()}
        {showTags()}
      </div>
    </React.Fragment>
  );
};


export default Tag;
