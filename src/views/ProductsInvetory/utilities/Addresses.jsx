import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TbNumber123 } from "react-icons/tb";
import requests from "./requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useUser } from "../../../Contexts/UserContext";
import { IoClose } from "react-icons/io5";

const Addresses = ({ inventoryMovementID, product, onClose, movementType }) => {
  const { userData } = useUser();
  const theme = useTheme([getTheme()]);
  const [errorMessage, setErrorMessage] = useState([]);
  const [warehousesList, setWarehousesList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    AlmacenID: "",
    Seccion: "",
    Estante: "",
  });

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const res = await requests.getAllWarehouses();
        setWarehousesList(res);
      } catch (err) {
        console.error(err);
      }
    };
    fetchWarehouses();
  }, []);

  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    if (id !== "new") {
      setNewAddress({ AlmacenID: "", Seccion: "", Estante: "" });
    }
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedAddressObject = () => {
    if (selectedAddressId === "new") {
      return { id: "new", ...newAddress, Cantidad: 0, _isNew: true };
    }
    const existing = product.Ubicaciones?.find(
      (item) => item.ID === selectedAddressId
    );
    return existing ? { id: existing.ID, ...existing, _isNew: false } : null;
  };

  const handleSubmit = async (values) => {
    try {
      const selected = getSelectedAddressObject();
      let payload;

      if (selected._isNew) {
        payload = {
          Cantidad: values.quantity,
          TipoMovimiento: 1,
          ProductoInventarioID: product.ID,
          UsuarioID: userData.ID,
          AlmacenID: selected.AlmacenID,
          MovimientoInventarioID: inventoryMovementID,
          ProductoInventario: {
            Modelo: product.Modelo,
            Descripcion: product.Descripcion,
            CantidadDisponible: product.CantidadDisponible,
            Estatus: product.Estatus,
            CodigoBarras: product.CodigoBarras,
          },
          UbicacionProducto: {
            ID: 0,
            AlmacenID: selected.AlmacenID,
            Estante: selected.Estante,
            Seccion: selected.Seccion,
          },
        };
      } else {
        payload = {
          Cantidad: values.quantity,
          TipoMovimiento: 1,
          ProductoInventarioID: selected.ProductoInventarioID,
          UsuarioID: userData.ID,
          AlmacenID: selected.AlmacenID,
          MovimientoInventarioID: inventoryMovementID,
          UbicacionProducto: {
            ID: selected.ID,
            ProductoInventarioID: selected.ProductoInventarioID,
            AlmacenID: selected.AlmacenID,
            Estante: selected.Estante,
            Seccion: selected.Seccion,
          },
        };
      }

      console.log(payload);

      const response = await requests.insertInputs(payload);
      console.log(response);

      if (response.Success) {
        onClose();
      } else {
        setErrorMessage(response.Mensaje);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 🔹 Solo añadir fila "new" si es entrada
  const data = {
    nodes: [
      ...(product.Ubicaciones?.map((item) => ({ ...item, id: item.ID })) || []),
      ...(movementType === "Entrada"
        ? [{ id: "new", ...newAddress, Cantidad: 0, _isNew: true }]
        : []),
    ],
  };

  const COLUMNS = [
    {
      label: <HeaderCell>Seleccionar</HeaderCell>,
      renderCell: (item) => (
        <input
          type="checkbox"
          checked={selectedAddressId === item.id}
          onChange={() => handleSelectAddress(item.id)}
        />
      ),
    },
    {
      label: <HeaderCell>Nombre del Almacén</HeaderCell>,
      renderCell: (item) =>
        item._isNew ? (
          <select
            name="AlmacenID"
            value={newAddress.AlmacenID || ""}
            onChange={handleNewAddressChange}
            className="border px-2 py-1 rounded w-full"
          >
            <option value="">Seleccione un almacén</option>
            {(warehousesList || []).map((wh) => (
              <option key={wh.ID} value={wh.ID}>
                {wh.Nombre}
              </option>
            ))}
          </select>
        ) : (
          item.NombreAlmacen
        ),
    },
    {
      label: <HeaderCell>Sección</HeaderCell>,
      renderCell: (item) =>
        item._isNew ? (
          <input
            name="Seccion"
            value={newAddress.Seccion}
            onChange={handleNewAddressChange}
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          item.Seccion
        ),
    },
    {
      label: <HeaderCell>Estante</HeaderCell>,
      renderCell: (item) =>
        item._isNew ? (
          <input
            name="Estante"
            value={newAddress.Estante}
            onChange={handleNewAddressChange}
            className="border px-2 py-1 rounded w-full"
          />
        ) : (
          item.Estante
        ),
    },
    {
      label: <HeaderCell>Cantidad Actual</HeaderCell>,
      renderCell: (item) => item.Cantidad,
    },
  ];

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2 justify-center">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">
            Ubicaciones
          </p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => onClose()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <div className="table-Scroll relative bg-white max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
          <CompactTable
            columns={COLUMNS}
            data={data}
            theme={theme}
            layout={{ fixedHeader: true }}
          />
        </div>

        {selectedAddressId && (
          <Formik initialValues={{ quantity: "" }} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="mt-2 flex flex-col gap-5">
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Cantidad"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="text"
                      name="quantity"
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbNumber123 size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="quantity"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <ErrorMessage
                  name="quantity"
                  component="div"
                  className="text-red-500 text-xs"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide hover:bg-sovetec-primary hover:text-white"
                >
                  Agregar
                </button>
                {errorMessage && (
                  <p className="text-red-500 text-xs text-right mt-2">
                    {errorMessage}
                  </p>
                )}
              </Form>
            )}
          </Formik>
        )}
      </div>
    </div>
  );
};

const HeaderCell = ({ children }) => (
  <div className="bg-sovetec-primary w-full h-12 text-zinc-100 flex items-center pl-2">
    {children}
  </div>
);

export default Addresses;
