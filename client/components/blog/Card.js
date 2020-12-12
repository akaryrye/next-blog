import Link from 'next/link';
import renderHTML from 'react-render-html';
import moment from 'moment';
import { API } from '../../config';

const Card = ({ blog }) => {

  const showCategoriesTags = (type, label) => {
    let classname = '';
    if (label === 'categories') classname = 'btn btn-primary my-1 mt-3'
    else classname = 'btn btn-outline-primary my-1 mt-3'
    return type.map((t, i) => (
      <Link href={`/${label}/${t.slug}`}>
        <a className={classname}>{t.name}</a>
      </Link>
    ));
  };

  return (
    <div className="lead pb-4">
      <header>
        <Link href={`/blogs/${blog.slug}`}>
          <a><h2 className="pt-3 font-weight-bold">
            {blog.title}
          </h2></a>
        </Link>
      </header>
      <section>
        <p className="mark mt-1 py-2">
          Written by {blog.author[0].name} | Published {moment(blog.updatedAt).fromNow()}
        </p>
      </section>
      <section>
        {showCategoriesTags(blog.categories, 'categories')}
        {showCategoriesTags(blog.tags, 'tags')}
        <br />
        <br />
      </section>

      <div className="row">
        <div className="col-md-4">
          <section>
            <img 
                className="img img-fluid" 
                style={{ maxHeight: '150px', width: 'auto' }} 
                src={ `${API}/blog/photo/${blog.slug}` } 
                alt={blog.title} />

          </section>
        </div>
        <div className="col-md-8">
          <div className="pb-3">
            {renderHTML(blog.excerpt)}
          </div>
          <Link href={`/blogs/${blog.slug}`}>
            <a className="btn btn-primary pt-2">Read more</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;