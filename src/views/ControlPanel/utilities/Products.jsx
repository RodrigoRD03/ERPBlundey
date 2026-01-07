import { useEffect, useState } from "react";
import requests from "./requests";
import { BsBoxSeam } from "react-icons/bs";
import { BlobBlue } from "../../../constants/";
import { Link } from "react-router-dom";

const Products = () => {
  const [numberProducts, setNumberProducts] = useState(0);
  useEffect(() => {
    requests.getProductsCount().then((response) => {
      setNumberProducts(response);
    });
  }, []);

  return (
    <Link
      to="/Layout/Products"
      className="relative w-76 h-48 bg-sovetec-primary p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
    >
      <div className="absolute w-[410px] -top-2 -left-20 z-0 blob">
        <img className="w-full h-full" src={BlobBlue} alt="" />
      </div>
      <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
        <span className="text-white ">
          <BsBoxSeam size={24} />
        </span>
      </div>
      <div className="absolute text-white  flex z-40 bottom-8 gap-2">
        <p className="text-6xl font-semibold">{numberProducts}</p>
        <p className="w-20 text-sm">Total de Productos</p>
      </div>
      <span className="absolute -bottom-4 right-2 z-10 text-sovetec-fifty">
        <BsBoxSeam size={140} />.
      </span>
    </Link>
  );
};

export default Products;
