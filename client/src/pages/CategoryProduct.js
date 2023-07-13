import React, { useState, useEffect } from "react";
import Layout from "../components/Layout/Layout";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Button, Modal } from "antd";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import { Brand } from "../components/Filter/Brand";
import "./../assests/styles/Filter.css";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [cart, setCart] = useCart();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [checkedBrands, setCheckedBrands] = useState([]);
  const [showFilters, setShowFilter] = useState(false); // Toggle Filter
  const [isMobileScreen, setIsMobileScreen] = useState(false); // Check for mobile screen

  useEffect(() => {
    if (params?.slug) getProductsByCat();
  }, [params?.slug]);

  useEffect(() => {
    getAllCategories();
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

  const getProductsByCat = async () => {
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

  const getAllCategories = async () => {
    try {
      const { data } = await axios.get("/api/v1/category/get-category");
      if (data?.success) {
        setCategories(data?.category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all = all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  const filterProduct = async () => {
    try {
      const { data } = await axios.post("/api/v1/product/product-filters", {
        checked,
        checkedBrands,
      });
      setProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };

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
            <div className="d-flex flex-wrap category-container">
              {categories.map((cat) => (
                <div key={cat._id} className="filter-category">
                  <Checkbox
                    onChange={(e) => handleFilter(e.target.checked, cat._id)}
                    checked={checked.includes(cat._id)}
                  >
                    {cat.name}
                  </Checkbox>
                </div>
              ))}
            </div>
            <hr></hr>
            <label className="text-center category-filter-heading">
              Brands
            </label>
            <div className="filter-brand">
              <Brand
                setCheckedBrands={setCheckedBrands}
                checkedBrands={checkedBrands}
              />
            </div>
            <Button
              className="filter-button"
              onClick={filterProduct}
              type="primary"
              block
            >
              Apply Filter
            </Button>
          </div>
        )}
        <div className={isMobileScreen ? "col-sm-12" : "col-sm-9"}>
          <div className="container mt-3">
            <h4 className="text-center">Category - {category?.name}</h4>
            <h6 className="text-center">{products?.length} result found</h6>
            <div className="row">
              <div className="col-md-9 offset-1">
                <div className="d-flex flex-wrap new-products-container">
                  {products?.map((p) => (
                    <div
                      className="card m-2 new-product-card clickable-pointer"
                      key={p._id}
                      onClick={() => navigate(`/product/${p.slug}`)}
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
                        <div className="card-buttons">
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
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Filters"
        visible={showFilters}
        onCancel={closeFiltersModal}
        footer={null}
        width={isMobileScreen ? "100%" : 800}
        destroyOnClose={true}
      >
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6">
              <label className="filter-label">Categories</label>
              <div className="d-flex flex-wrap filter-container">
                {categories.map((cat) => (
                  <div key={cat._id} className="filter-category">
                    <Checkbox
                      onChange={(e) => handleFilter(e.target.checked, cat._id)}
                      checked={checked.includes(cat._id)}
                    >
                      {cat.name}
                    </Checkbox>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-md-6">
              <label className="filter-label">Brands</label>
              <div className="filter-brand">
                <Brand
                  setCheckedBrands={setCheckedBrands}
                  checkedBrands={checkedBrands}
                />
              </div>
            </div>
          </div>
          <Button
            className="filter-button"
            onClick={filterProduct}
            type="primary"
            block
          >
            Apply Filter
          </Button>
        </div>
      </Modal>
    </Layout>
  );
};

export default CategoryProduct;
