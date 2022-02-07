import PropTypes from 'prop-types';
// material
import { Grid } from '@mui/material';
import ShopProductCard from './ProductCard';
import {
  useModalContext
} from '../../../contexts/ProductModalContext';
import { useState } from 'react';
// ----------------------------------------------------------------------

ProductList.propTypes = {
  products: PropTypes.array.isRequired
};

export default function ProductList({ ...other }) {

  // const { contents } = useModalContext();

  const [contents, setContents] = useState([]);
  const onChange = (e) => {
    let files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }
    setContents(files);
  }

  return (
    <div>
      <div>
        <div className='browse'>
          {/* <input type="button" id="get_file" className="btn-main" value="Browse" /> */}
          <input id='upload_file' type="file" multiple onChange={onChange} />
        </div>
      </div>

      <br />

      <Grid container spacing={1} {...other}>
        {contents.map((product, i) => (
          <Grid key={/*product.id*/ i} item style={{ width: '12%' }}>
            <ShopProductCard product={product} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
