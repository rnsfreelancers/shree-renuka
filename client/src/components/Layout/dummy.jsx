import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio, Button, Modal } from "antd";
import { Prices } from "../components/Prices";
import { Sort } from "../components/Filter/Sort";
import { useFilter } from "../context/filter-context";
import { Brand } from "../components/Filter/Brand";
import "./../assests/styles/Filter.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [showFilters, setShowFilters] = useState(false); // Toggle state for mobile view

  const { state } = useFilter();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  const getPrductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/product-category/${params.slug}`
      );
      setProducts(data?.products);
      setCategory(data?.category);
    } catch (error) {
      console.log(error);
    }
  };

  //get all cat
  const getAllCategory = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  //get products
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(`/api/v1/product/get-product`);
      setProducts(data.products);
    } catch (error) {
      console.log(error);
    }
  };

  // filter by cat
  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    if (!checked.length || !radio.length) getAllProducts();
  }, [checked.length, radio.length]);

  useEffect(() => {
    if (checked.length || radio.length) filterProduct();
  }, [checked, radio]);

  //get filtered product
  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        radio,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

  // Filter by Shubham

  const getSortedProducts = (products, sort) => {
    const sortedProducts = [...products].sort((product1, product2) =>
      sort === "lth"
        ? product1.price - product2.price
        : sort === "htl"
        ? product2.price - product1.price
        : products
    );
    return sortedProducts;
  };

  const getProductByBrand = (products, brand) => {
    const brandProducts = products.filter((product) =>
      brand.length > 0 ? brand.includes(product.brand) : products
    );
    return brandProducts;
  };

  const sortedProducts = getSortedProducts(products, state.sort);
  const brandProducts = getProductByBrand(products, state.brand);
  console.log("Sorted", sortedProducts);
  console.log(state.brand);

  const openFiltersModal = () => {
    setShowFilters(true);
  };

  const closeFiltersModal = () => {
    setShowFilters(false);
  };

  return (
    <Layout>
      <div className="row">
        {/* Filter sidebar for PC screens */}
        <div className="col-sm-3 d-none d-sm-block category-filter-box">
          <h4 className="text-center category-filter-heading">
            Filter By Category
          </h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <Brand />
          {/* <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div> */}
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Toggle button for mobile screens */}
        <div className="d-sm-none text-center mb-3">
          <Button onClick={openFiltersModal}>Show Filters</Button>
        </div>

        <div className="col-sm-9">
          <div className="row">
            <h6 className="text-center">{products?.length} result found </h6>
            <div className="d-flex flex-wrap">
              {brandProducts?.map((p) => (
                <div
                  className="card m-2"
                  style={{ width: "18rem" }}
                  key={p._id}
                >
                  <img
                    src={`/api/v1/product/product-photo/${p._id}`}
                    className="card-img-top"
                    alt={p.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{p.name}</h5>
                    <p className="card-text">
                      {p.description.substring(0, 30)}...
                    </p>
                    <p className="card-text"> $ {p.price}</p>
                    <button
                      className="btn btn-primary ms-1"
                      onClick={() => navigate(`/product/${p.slug}`)}
                    >
                      More Details
                    </button>
                    <button className="btn btn-secondary ms-1">
                      ADD TO CART
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for mobile screens */}
      <Modal
        title="Filters"
        visible={showFilters}
        onCancel={closeFiltersModal}
        footer={[
          <Button key="close" onClick={closeFiltersModal}>
            Close
          </Button>,
        ]}
      >
        <div className="d-flex flex-column">
          <h4 className="text-center category-filter-heading">
            Filter By Category
          </h4>
          <div className="d-flex flex-column">
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>
          <Brand />
          {/* <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div> */}
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTERS
            </button>
          </div>
        </div>
      </Modal>
    </Layout>
  );
};

export default CategoryProduct;
