import Layout from '../../../components/Layout';
import Admin from '../../../components/auth/Admin';
import Category from '../../../components/crud/Category';
import Tag from '../../../components/crud/Tag';
import Link from 'next/link';

const CategoryTag = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            
            <div className="col-12 pt-5 pb-5 text-center">
              <h2>Manage Categories and Tags</h2>
            </div>
            
            <div className="col-6 text-center">
              <Category />
            </div>
            
            <div className="col-6 text-center">
              <Tag />
            </div>
            
          </div>
        </div>
      </Admin>
    </Layout> 
  );
};

export default CategoryTag;

