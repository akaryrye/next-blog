import Link from 'next/link';
import { useState, useEffect } from 'react';
import Router from 'next/router';
import dynamic from 'next/dynamic';
import { withRouter } from 'next/router';
import { getCookie, isAuthenticated } from '../../actions/auth';
import { getCategories } from '../../actions/category';
import { getTags } from '../../actions/tag';
import { createBlog } from '../../actions/blog';
const ReactQuill = dynamic(() => import ('react-quill'), {ssr: false});
import styles from './Blog.module.css';
import { QuillModules, QuillFormats } from '../../helpers/quill';
//import '../../node_modules/react-quill/dist/quill.snow.css';

const CreateBlog = ({ router }) => {
  
  const StoredBlog = () => {
    if (typeof window !== 'undefined' && localStorage.getItem('blog')) {
      return JSON.parse(localStorage.getItem('blog'));
    } else {
      return false;
    }
  };

  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const [checkCat, setCheckCat] = useState([]);
  const [checkTag, setCheckTag] = useState([]);

  const [body, setBody] = useState(StoredBlog());
  const [values, setValues] = useState({
    error: '',
    sizeError: '',
    success: '',
    formData: '',
    title: '',
    hideButton: false
  });

  const { error, sizeError, success, formData, title, hideButton } = values;
  const token = getCookie('token');

  useEffect(() => {
    setValues({ ...values, formData: new FormData() });
    initCategories();
    initTags();
  }, [router]);

  const initCategories = () => {
    getCategories().then( data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setCategories(data);
      }
    })
  }

  const initTags = () => {
    getTags().then( data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setTags(data);
      }
    });
  };

  const publishBlog = (e) => {
    e.preventDefault();
    //console.log(formData);
    createBlog(formData, token).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({ ...values, title: '', error: '', success: `New blog: "${data.title}" successfully created.` });
        setBody('');
        setCategories([]);
        setTags([]);
      }
    });
  };

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    formData.set(name, value);
    setValues({ ...values, [name]: value, formData, error: '' });
  };

  const handleBody = e => {
    setBody(e);
    formData.set('body', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('blog', JSON.stringify(e) )
    }
  };

  const catToggle = item => () => {
    setValues({ ...values, error: '' });
    const clickedItem = checkCat.indexOf(item);
    const all = [...checkCat];

    if (clickedItem === -1) {
      all.push(item);
    } else {
      all.splice(clickedItem, 1);
    }
    console.log(all);
    setCheckCat(all);
    formData.set('categories', all);
  }

  const tagToggle = item => () => {
    setValues({ ...values, error: '' });
    const clickedItem = checkTag.indexOf(item);
    const all = [...checkTag];

    if (clickedItem === -1) {
      all.push(item);
    } else {
      all.splice(clickedItem, 1);
    }
    console.log(all);
    setCheckTag(all);
    formData.set('tags', all);
  }

  const showCategories = () => {
    return (
      categories && categories.map((item, i) => (
        <li key={i} className="list-unstyled">
          <input onChange={catToggle(item._id)} type="checkbox" className="mr-2" />
          <label className="form-check-label">{item.name}</label>
        </li>
      ))
    );
  };

  const showTags = () => {
    return (
      tags && tags.map((item, i) => (
        <li key={i} className="list-unstyled">
          <input onChange={tagToggle(item._id)} type="checkbox" className="mr-2" />
          <label className="form-check-label">{item.name}</label>
        </li>
      ))
    );
  };

  const showAlert = (message) => (
    <div className="alert alert-danger px-3" style={{ display: message ? '' : 'none' }}>
      {message}
    </div>
  );

  const CreateBlogForm = () => {
    return (
      <form onSubmit={publishBlog}> 
        <div className="form-group">
          <label className="text-muted">Title</label>
          <input type="text" className="form-control" value={title} onChange={handleChange('title')} />
        </div>
        
        <div className="form-group">
          <ReactQuill
              modules={QuillModules}
              formats={QuillFormats}
              value={body}
              placeholder="Write blog here"
              onChange={handleBody} />
        </div>

        <div>
          <button type="submit" className="btn btn-primary">
            Publish
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="container-fluid">
      <div className="row">
        
        <div className="col-md-8">
          <div className="pb-3">
            {showAlert(error)}
            {showAlert(success)}
          </div>
          {CreateBlogForm()}
        </div>

        <div className="col-md-4">
          
          <div>
            <div className="form-group pb-2">
              <h5>Featured Image</h5><hr />
              <small className="text-muted">Max size: 1mb</small>
              <label className="btn btn-outline-info">
                Upload featured image
                <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
              </label>
            </div>
          </div>

          <div>
            <h5>Categories:</h5><hr />
            <ul className={styles.catsTags}>
              {showCategories()}
            </ul><hr />
          </div>

          <div>
            <h5>Tags:</h5><hr />
            <ul className={styles.catsTags}>
              {showTags()}
            </ul><hr />
          </div>

        </div>
      </div>
    </div>
  );
};

export default withRouter(CreateBlog);
