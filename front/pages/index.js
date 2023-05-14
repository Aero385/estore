import Featured from "@/components/Featured";
import Header from "@/components/Header";
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/models/Product";

export default function HomePage({product}) {
  return (
    <div>
      <Header/>
      <Featured product={product}/>
    </div>
  )
}

export async function getServerSideProps() {
  const featuredProductId = '6457e9ff5d37202510b559a7';
  await mongooseConnect();
  const product = await Product.findById(featuredProductId);
  return {
    props: {product: JSON.parse(JSON.stringify(product))},
  }
}