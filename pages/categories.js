import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';

function Categories({swal}){
  
  const [editedCategory, setEditedCategory] = useState(null)
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('')
  const [categories, setCategories] = useState([]);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, [])

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {
      name, 
      parentCategory, 
      properties:properties.map(p => ({
        name: p.name, 
        values: p.values.split(','),
      })),
    };
    if(editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/categories', data);
      setEditedCategory(null);
    } else {
      await axios.post('/api/categories/', data);
    }
      setName('');
      setParentCategory('');
      setProperties([]);
      fetchCategories();
  }

  function editCategory(category){
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);
    setProperties(category.properties.map(({name, values}) => ({
      name,
      values: values.join(',')
     }))
    );
  }

  function deleteCategory(category){
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}`,
      showCancelButton: true,
      cancelButtonTitle: 'Cancel',
      confirmButtonText: 'Yes, Delete!',
      confirmButtonColor: '#d55',
  }).then(async result => {
    if(result.isConfirmed) {
      const {_id} = category;
      await axios.delete('/api/categories?_id='+ _id);
      fetchCategories();
    }
  });
  }

  function addProperty(){
    setProperties(prev => {
      return [...prev, {name:'', values:''}]
    })
  }

  function handleNameChange(index, property, newName){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }

  function handlePropertyValuesChange(index, property, newValues){
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    })
  }

  function removeProperty(indexToRemove){
    setProperties(prev => {
      return  [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }

  return (
    <Layout>
      <h1>Categories</h1>
      <label>
        {editedCategory 
          ? `Edit category ${editedCategory.name}` 
          : 'Create new Category name'
        }
      </label>
        <form onSubmit={saveCategory}>
          <div className="flex gap-1">
          <input св
            type="text" 
            placeholder={'Category name'}
            value={name}
            onChange={ev => setName(ev.target.value)}
          />
          <select 
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}
          >
            <option>No parent category</option>
            {categories.length > 0 && categories.map(category => (
              <option value={category._id} key={category._id}>
                <td>{category.name}</td>
              </option>
            ))}
          </select>
        </div>
        <div className="mb-2">
          <label className="block">Properties</label>
          <button 
            onClick={addProperty}
            type='button'
            className="btn-default btn text-sm mb-2"
          >
            Add new property
          </button>
          {properties.length > 0 && properties.map((property, index) => (
            <div className="flex gap-1 mb-2">
              <input 
                type="text" 
                onChange={ev => handleNameChange(index, property, ev.target.value)}
                value={property.name} 
                placeholder="property name (example: color)"
                className="mb-0"
              />
              <input 
                type="text" 
                onChange={ev => handlePropertyValuesChange(index, property, ev.target.value)}
                value={property.values} 
                placeholder="values, comma separated"
                className="mb-0"

              />
              <button 
                onClick={() => removeProperty(index)}
                className="btn btn-default"
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-1">
          <button 
            type='submit' 
            className="btn-primary"
          >
            Save
          </button>
          {editedCategory && (
            <button 
              type="button"
              className="btn-default btn"
              onClick={() => {
                setEditedCategory(null);
                setParentCategory('');
                setName('');
                setProperties([]);
              }}
            >Cancel</button>
          )}
        </div>
      </form>
      {!editedCategory && (
        <table className="basic mt-4">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 && categories.map(category => (
            <tr key={category._id}>
              <td>{category.name}</td>
              <td>{category?.parent?.name}</td>
              <td>
                <button 
                  onClick={() => editCategory(category)}
                  className="btn-primary mr-1"
                >
                  Edit
                </button>
                <button 
                  className="btn-primary mr-1"
                  onClick={() => deleteCategory(category)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </Layout>
  )
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal}/>
))