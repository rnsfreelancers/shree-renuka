import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import toast from "react-hot-toast";
import Invoice from "./../assests/invoice.svg"
import ReturnIc from "./../assests/Return-Icon.png"
import OIP from "./../assests/OIP.jpg"
import { NavLink } from "react-router-dom";
const ProductDetails = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({});
  const [cart, setCart] = useCart();
  const [relatedProducts, setRelatedProducts] = useState([]);

  //initalp details
  useEffect(() => {
    if (params?.slug) getProduct();
  }, [params?.slug]);
  //getProduct
  const getProduct = async () => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/get-product/${params.slug}`
      );
      setProduct(data?.product);
      getSimilarProduct(data?.product._id, data?.product.category._id);
    } catch (error) {
      console.log(error);
    }
  };
  //get similar product
  const getSimilarProduct = async (pid, cid) => {
    try {
      const { data } = await axios.get(
        `/api/v1/product/related-product/${pid}/${cid}`
      );
      setRelatedProducts(data?.products);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`/api/v1/product/product-photo/${product._id}`}
            className="card-img-top"
            alt={product.name}
            height={"350px"}
            width={"350px"}
          />
        </div>
        <div className="col-md-6 ">
          <h5>{product.description}</h5>
          <p>by&nbsp;<spna>{product.name}</spna></p>
          <p><img src={Invoice}></img>&nbsp;Get GST invoice</p>
          <p><img src={ReturnIc} style={{width: "20px"}}></img>&nbsp;30 Days return policy</p>
          <p><img src={OIP} style={{width: "20px"}}></img>&nbsp;100% ORIGINAL Products</p>
          <p>Get Awesome Offer</p>
          <button class="btn btn-secondary ms-1">ADD TO CART</button>
          <a href="tel:+919695687302"><button class="btn btn-secondary ms-1">Call Us</button></a>
          <button class="btn btn-secondary ms-1"><NavLink to="/customerSupport" className="nav-link">
              Visit Shop
            </NavLink></button>
        </div>
      </div>
      <hr />
      <div style={{marginLeft: "20px"}}>
        <h4 >Products Description</h4>
        <h6>Brand : {product.name}</h6>
        <h6>Category : {product?.category?.name}</h6>
          <h6>Color: {product.color}</h6>
          <h6>{product.des1}</h6>
          <h6>{product.des2}</h6>
          <h6>{product.des3}</h6>
          <h6>{product.des4}</h6>
          <h6>{product.des5}</h6>
      </div>
      <div className="row container">
        <h6>Similar Products</h6>
        {relatedProducts.length < 1 && (
          <p className="text-center">No Similar Products found</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProducts?.map((p) => (
            <div className="card m-2 product-card" key={p._id} onClick={() => navigate(`/product/${p.slug}`)}>
                <img
                  src={`/api/v1/product/product-photo/${p._id}`}
                  className="card-img-top"
                  alt={p.name}
                />
                <div className="card-body">
                  <p className="card-text">
                    {p.description.substring(0, 30)}...
                  </p>
                  <h5 className="card-title">{p.name}</h5>
                  <h3>{p.size}</h3>
                  <div className="card-buttons">
                    <button
                      className="btn btn-secondary"
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
    </Layout>
  );
};

export default ProductDetails;
