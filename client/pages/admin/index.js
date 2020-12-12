import Layout from '../../components/Layout';
import Admin from '../../components/auth/Admin';
import Link from 'next/link';

const AdminIndex = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-12 pt-5 pb-5 text-center">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-4 text-center">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag">
                    <a>Create Categories</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-8 text-center">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/crud/category-tag">
                    <a>Create Tags</a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-8 text-center">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/crud/blog">
                    <a>Create Blog</a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Admin>
    </Layout> 
  );
};

export default AdminIndex;

