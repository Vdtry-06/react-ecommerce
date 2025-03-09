import React, {use, useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { getToken } from "../../service/localStorage";
import ProductList from "../common/ProductList";
import Pagination from "../common/Pagination";
import ApiService from "../../service/ApiService";
import "../../static/style/home.css";

const Home = () => {

    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [error, setError] = useState(null);
    const itemsPerPage = 3;
    
    useEffect(() => {

        const fetchProducts = async () => {
            try {
                let allProducts = [];
                const searchParams = new URLSearchParams(location.search);
                const searchItem = searchParams.get("search");
        
                if (searchItem) {
                    const response = await ApiService.getProductByName(searchItem);
                    console.log("Search Results:", response);
                    allProducts = response.data || [];
                } else {
                    const response = await ApiService.getAllProduct(currentPage, itemsPerPage);
                    console.log("Fetched Products:", response);
                    allProducts = response.data || [];
                }
        
                setTotalPages(Math.ceil(allProducts.length / itemsPerPage));
                setProducts(allProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
                console.log("Updated Products:", allProducts);
                
            } catch (error) {
                setError(error.response?.data?.message || error.message || "An error occurred");
            }
        };
        
        fetchProducts();
    }, [location.search, currentPage]);

    return (
        <div className="home">
            {error ? (
                <p className="error-message">{error}</p>
            ): (
                <div>
                    <ProductList products={products} />
                    <Pagination
                        currentPage={currentPage} 
                        totalPages={totalPages} 
                        onPageChange={(page)=> setCurrentPage(page)} />
                </div>
            )}
        </div>
    );

}

export default Home;