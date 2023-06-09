import Center from "@/components/Center";
import Header from "@/components/Header";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { useState } from "react";
import styled from "styled-components";

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  h1{
    font-size: 1.5em;
  }
`;

const FiltersWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  justify-content: flex-end;
`;

const Filter = styled.div`
  background-color: #ddd;
  padding: 5px 10px;
  border-radius: 10px;
  display: flex;
  gap: 5px;
  select{
    background-color: transparent;
    border: 0;
    font-size: inherit;
  }
`;


export default function CategoryPage({category, products: originalProducts}){

  const [products, useProducts] = useState(originalProducts);
  const [filtersValues, setFilterValues] = useState(
    category.properties.map(p => ({name:p.name,value:'all'}))
  );
  function handleFilterChange(filterName, filterValue){
    setFilterValues(prev => {
      return prev.map(p => ({
        name: p.name,
        value: p.name === filterName ? filterValue : p.value,
      }))
    })
  }
  return (
    <>
      <Header/>
      <Center>
        <CategoryHeader>
          <h1>{category.name}</h1>
          <FiltersWrapper>
            {category.properties.map(prop => (
              <Filter key={prop.name}>
                <span style={{width:'max-content'}}>{prop.name}:</span>
                <select 
                  value={filtersValues.find(f => f.name === prop.name).value}
                  onChange={(ev) => handleFilterChange(prop.name, ev.target.value) }
                >
                  <option value="all">All </option>
                  {prop.values.map(val => (
                    <option key={val} value={val}>{val}</option>
                  ))}
                </select>
              </Filter>
            ))}
          </FiltersWrapper>
        </CategoryHeader>
        <ProductsGrid products={products}/>
      </Center>
    </>
  )
}

export async function getServerSideProps(context){
  const category = await Category.findById(context.query.id);
  const subCategories = await Category.find({parent: category._id});
  const catIds = [category._id, ...subCategories.map(c => c._id)];
  const products = await Product.find({category:catIds}); 

  return {
    props: {
      category: JSON.parse(JSON.stringify(category)),
      products: JSON.parse(JSON.stringify(products)),
    }
  }
}