import Head from 'next/head';
import Image from 'next/image';
import { Footer, Cart, FooterBanner, HeroBanner, Layout, NavBar, Product } from '../components';
import { client } from '../lib/client';

export default function Home({ products, bannerData }) {

  console.log(products)
  return (
    <div>
      <HeroBanner heroBanner={bannerData.length && bannerData[0]}/>

      <div>
        <h2>Best Selling Products</h2>
        <p>Speakers of many variations</p>
      </div>

      <div className='products-container'>
        {products?.map((product) => <Product key={product._id} product={product}/>)}
      </div>

      <FooterBanner footerBanner={bannerData && bannerData[0]}/>
    </div>
  )
}



export const getServerSideProps = async () => {
  const query = '*[_type == "product"]';
  const products = await client.fetch(query);

  const bannerquery = '*[_type == "banner"]';
  const bannerData = await client.fetch(bannerquery);

  return {
    props: {
      products,
      bannerData
    }
  }
} 