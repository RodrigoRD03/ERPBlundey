import React, { useEffect, useState } from "react";
import requests from "./requests";
import { RiCloseFill } from "react-icons/ri";
import ViewPDF from "../../ViewPDF/ViewPDF";
import { Button } from "@radix-ui/themes";
import Select from "react-select";
import { TbArrowRight } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const InitPurchase = ({ orderID, quoteID, close }) => {
  const [potentialSuppliers, setPotentialSuppliers] = useState("");
  const [listSuppliers, setListSuppliers] = useState([]);
  const [supplierSelected, setSupplierSelected] = useState("");
  const [orderPurchaseID, setOrderPurchaseID] = useState("");
  const [viewPDF, setViewPDF] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getPotentialSuppliers(quoteID).then((response) => {
      setPotentialSuppliers(response);
    });
    requests.getSellersSelect().then((response) => {
      setListSuppliers(response);
    });
  }, []);

  const handleSelectSupplierChange = (event) => {
    setSupplierSelected(event);
  };

  const handleInitPurchaseClick = async () => {
    const object = {
      ProveedorID: supplierSelected.value,
      OrdenCompraID: orderID,
    };
    const response = await requests.addOrderSupplier(object);
    navigate(`/Layout/NewPurchase/Orders/${quoteID}/${response}`);
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Iniciar Orden</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        {potentialSuppliers && (
          <Button variant="soft" color="sky" onClick={() => setViewPDF(true)}>
            Posibles Proveedores
          </Button>
        )}
        <Select
          className="w-80 app__BrandSuppliers-Form--select"
          value={supplierSelected}
          onChange={handleSelectSupplierChange}
          options={listSuppliers}
          isSearchable={true}
          placeholder="Seleccione un Proveedor"
        />
        <div className="w-full flex justify-end gap-5">
          <button
            type="submit"
            className="self-end w-64 border-2 flex justify-center items-center gap-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
            onClick={() => handleInitPurchaseClick()}
          >
            <p>Iniciar</p>{" "}
            <span>
              <TbArrowRight size="20" />
            </span>
          </button>
        </div>
      </div>
      {viewPDF && (
        <ViewPDF
          base={potentialSuppliers}
          version="Posibles Compradores"
          close={() => setViewPDF(null)}
        />
      )}
    </div>
  );
};

export default InitPurchase;
