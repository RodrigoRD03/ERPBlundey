import React, { useRef, useState, useEffect } from "react";
import { TbAbc, TbNumber123, TbSearch, TbUser } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import requests from "./requests";
import Addresses from "./Addresses";

const Outputs = () => {
  const { ID } = useParams();
  const firstInputRef = useRef(null);
  const [barCode, setBarCode] = useState("");
  const [showAddresses, setShowAddresses] = useState(false);
  const [productData, setProductData] = useState({});
  const [movementList, setMovementList] = useState([]);
  const [formValues, setFormValues] = useState({
    motivo: "",
    recibidoPor: "",
    proveedor: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  const theme = useTheme([
    getTheme(),
    {
      Row: `
          &:nth-of-type(odd) {
            background-color: #f7f7f7;
          }
          &:nth-of-type(even) {
            background-color: #G9G9G9;
          }
        `,
    },
  ]);

  const fetchInventoryMovement = async () => {
    try {
      const response = await requests.getInventoryMovementWatch(ID);

      if (Array.isArray(response)) {
        setMovementList(response);
      } else {
        setMovementList([]);
      }
    } catch (error) {
      console.log(error);
      setMovementList([]);
    }
  };

  useEffect(() => {
    fetchInventoryMovement();
  }, []);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  const fetchBarCode = async (e) => {
    e.preventDefault();
    try {
      const response = await requests.checkBarCode(barCode);

      if (response?.Success) {
        setProductData(response.Producto);
        setShowAddresses(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleBarCodeChange = (event) => {
    setBarCode(event.target.value);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const data = {
    nodes: (movementList ?? []).map((item) => ({
      ...item,
      id: item.ID ?? Math.random(),
    })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Modelo Producto
        </div>
      ),
      renderCell: (item) => <p>{item.ModeloProducto}</p>,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => <p>{item.Cantidad}</p>,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2">
          Fecha Movimiento
        </div>
      ),
      renderCell: (item) => <p>{item.FechaMovimiento}</p>,
    },
  ];

  const handleSubmitForm = async (e) => {
    e.preventDefault();

    if (!formValues.motivo || !formValues.recibidoPor) {
      setErrorMessage("Por favor, completa los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);

    try {
      const object = {
        ID: ID,
        TipoMovimiento: "Salida",
        Motivo: formValues.motivo,
        Recibido: formValues.recibidoPor,
      };

      const response = await requests.postFinishMovement(object);

      if (response.Success) {
        navigate(`/Layout/ProductsInventory`);
      }
    } catch (error) {
      console.error(error);
      alert("Ocurrió un error al registrar la salida");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/ProductsInventory">Productos del Inventario</Link> /{" "}
          <b>Salidas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Salidas</p>
        <div className="line-row" />
      </div>

      {/* Input código de barras */}
      <div className="flex gap-4 bg-white w-max">
        <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md">
          <form className="flex items-center gap-2" onSubmit={fetchBarCode}>
            <label
              className="inputs-placeholder w-96 relative h-14 flex gap-2 p-2 border border-zinc-400 rounded-sm"
              data-text="Código de Barras"
            >
              <input
                ref={firstInputRef}
                className="w-full outline-none"
                type="text"
                onChange={handleBarCodeChange}
                value={barCode}
              />
              <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                <TbNumber123 size="20" />
              </span>
            </label>
            <button
              type="submit"
              className="w-12 h-12 bg-sovetec-thirty rounded-full flex justify-center items-center text-white hover:bg-sovetec-primary"
            >
              <TbSearch size={24} />
            </button>
          </form>
        </div>
      </div>

      {errorMessage && <p className="text-red-600 text-xs">{errorMessage}</p>}

      {data.nodes.length > 0 ? (
        <div>
          <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-md max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
            <CompactTable
              columns={COLUMNS}
              data={data}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          </div>

          <form
            className="bg-white p-4 rounded-md shadow-md w-max grid grid-cols-2 gap-3"
            onSubmit={handleSubmitForm}
          >
            <div>
              <label
                className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                data-text="Motivo"
              >
                <input
                  className="w-full outline-none resize-none"
                  type="text"
                  name="motivo"
                  value={formValues.motivo}
                  onChange={handleInputChange}
                />
                <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                  <TbAbc size="20" />
                </span>
              </label>
            </div>

            <div>
              <label
                className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                data-text="Recibido por:"
              >
                <input
                  className="w-full outline-none resize-none"
                  type="text"
                  name="recibidoPor"
                  value={formValues.recibidoPor}
                  onChange={handleInputChange}
                />
                <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                  <TbUser size="20" />
                </span>
              </label>
            </div>

            <div />
            <div className="w-full flex flex-col justify-end ">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-sovetec-primary hover:text-white"
                }`}
              >
                {isSubmitting ? "Procesando..." : "Terminar Entrada"}
              </button>
              {errorMessage && (
                <p className="text-red-500 text-xs text-right mt-2">
                  {errorMessage}
                </p>
              )}
            </div>
          </form>
        </div>
      ) : (
        <div className="table-Scroll relative bg-white mr-5 mb-2 shadow-xl max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <div className="p-6 text-center text-gray-500">
            No hay datos para mostrar
          </div>
        </div>
      )}

      {showAddresses && productData && (
        <Addresses
          inventoryMovementID={ID}
          product={productData}
          onClose={() => {
            setShowAddresses(false);
            setProductData(null);
            fetchInventoryMovement();
          }}
          movementType="Salida"
        />
      )}
    </div>
  );
};

export default Outputs;
