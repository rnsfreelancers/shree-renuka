import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Radio, Button, Modal } from "antd";
import { Prices } from "../components/Prices";
import { Sort } from "../components/Filter/Sort";
import { useFilter } from "../context/filter-context";
import { useCart } from "../context/cart";
import { Brand } from "../components/Filter/Brand";
import toast from "react-hot-toast";
import "./../assests/styles/Filter.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [showFilters, setShowFilter] = useState(false); // Toggle Filter
  const [isMobileScreen, setIsMobileScreen] = useState(false); // Check for mobile screen

  const { state } = useFilter();

  useEffect(() => {
    if (params?.slug) getPrductsByCat();
  }, [params?.slug]);

  useEffect(() => {
    getAllCategory();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileScreen(window.innerWidth <= 768);
    };

    handleResize(); // Check initial screen size
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

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

  // Filter Modal
  const openFiltersModal = () => {
    setShowFilter(true);
  };

  const closeFiltersModal = () => {
    setShowFilter(false);
  };

  return (
    <Layout title={"All Categories"}>
      <div className="row">
        {!isMobileScreen && (
          <div className="col-sm-3 category-filter-box">
            <label className="text-center category-filter-heading">
              Filter By
            </label>
            <label
              style={{ marginLeft: "78px", color: "blue" }}
              onClick={() => window.location.reload()}
            >
              Clear
            </label>
            <hr></hr>
            <label className="text-center category-filter-heading">
              Category
            </label>
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
            <hr></hr>
            <label className="text-center category-filter-heading">Brand</label>

            <Brand />
          </div>
        )}

        {/* Toggle button for mobile screens */}
        {isMobileScreen && (
          <div className="d-sm-none text-center mb-3">
            <Button onClick={openFiltersModal}>Show Filters</Button>
          </div>
        )}

        <div className="col-sm-9">
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
                  <button
                    className="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, p]);
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, p])
                      );
                      toast.success("Item Added to cart");
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filter Modal */}
      {isMobileScreen && (
        <Modal
          title="Filters"
          visible={showFilters}
          onOk={closeFiltersModal}
          onCancel={closeFiltersModal}
          footer={[
            <Button key="clear" onClick={() => window.location.reload()}>
          Clear
        </Button>,
            <Button key="submit" type="primary" onClick={closeFiltersModal}>
              Apply Filters
            </Button>,
          ]}
        >
          <hr></hr>
          <div className="d-flex flex-column">
            <label className="text-left category-filter-heading">
              Category
            </label>
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
            <hr />
            <label className="text-left category-filter-heading">Brand</label>

            <Brand />
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default CategoryProduct;
