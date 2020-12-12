import Head from 'next/head';
import Link from 'next/link';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import { useState } from 'react';
import { listBlogs  } from '../../actions/blog';
import Card from '../../components/blog/Card';
import { API, DOMAIN, APP_NAME } from '../../config';

const Blogs = ({ blogs, categories, tags, size, router }) => {
  
  const head = () => (
    <Head>
      <title>Programming Blogs | {APP_NAME}</title>
      <meta 
        name="description"
        content="Programming blogs and tutorials on react, node, next, and web development" />
      <Link rel="canonical" href={`${DOMAIN}${router.pathname}`} />
      <meta property="og:title" content={`Latest web development tutorials | ${APP_NAME}`} />
      <meta 
        name="og:description" 
        content="Programming blogs and tutorials on react, node, next, and web development" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${DOMAIN}${router.pathname}`} />
      <meta property="og:site_name" content={`${APP_NAME}`} />
      
      <meta property="og:image" content={`${DOMAIN}/static/img/profile.jpg`} />
      <meta property="og:image:secure_url" content={`${DOMAIN}/static/img/profile.jpg`} />
      <meta property="og:image:type" content="image/jpg" />
      <meta property="fb:app_id" content="12345" />
    </Head>
  )

  const showBlogs = () => {
    return blogs.map((blog, i) => {
      return (
        <article key={i}>
          <Card blog={blog} />
          <hr />
        </article>
      );
    });
  };

  const showCategoriesTags = (a, b) => {
    return a.map((item, i) => (
      <Link href={`/${b}/${item.slug}`} key={i}>
        <a className="btn btn-primary mx-1 mt-3">{item.name}</a>
      </Link>
    ));
  };
  
  return (
    <React.Fragment>
      
      <Layout>
        {head()}
        <main>
          <div className="container-fluid">
            <header>
              <div className="col-md-12 pt-3">
                <h1 className="display-4 font-weight-bold text-center">
                  Programming Blogs and Tutorials
                </h1>
              </div>
              <section>
                <div className="pb-3 text-center">
                  <hr />
                  Categories: {showCategoriesTags(categories, 'categories')}
                  <hr />
                  Tags: {showCategoriesTags(tags, 'tags')}
                  <hr />
                </div>
              </section>
            </header>
          </div>
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">{showBlogs()}</div>
            </div>
          </div>
        </main>
      </Layout>
    </React.Fragment>
    
  );
};

Blogs.getInitialProps = () => {
  return listBlogs().then(data => {
    if (data.error) {
      console.log(data.error)
    } else {
      return {
        blogs: data.blogs,
        categories: data.categories,
        tags: data.tags,
        size: data.size
      }
    }
  });
};

export default withRouter(Blogs);