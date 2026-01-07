import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { TbNumber123 } from "react-icons/tb";
import requests from "./requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { useUser } from "../../../Contexts/UserContext";
import { IoClose } from "react-icons/io5";

// Subcomponente para seleccionar una ubicación
const AddressSelector = ({
  product,
  warehousesList,
  selectedId,
  onSelect,
  newAddress,
  onNewAddressChange,
  allowNew,
}) => {
  const theme = useTheme([getTheme()]);

  const data = {
    nodes: [
      ...(product.Ubicaciones?.map((item) => ({ ...item, id: item.ID })) || []),
      ...(allowNew
        ? [{ id: "new", ...newAddress, Cantidad: 0, _isNew: true }]
        : []),
    ],
  };

  const COLUMNS = [
    {
      label: <HeaderCell>Seleccionar</HeaderCell>,
      renderCell: (item) => (
        <input
          type="radio"
          checked={selectedId === item.id}
          onChange={() => onSelect(item.id)}
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
            onChange={onNewAddressChange}
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
            onChange={onNewAddressChange}
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
            onChange={onNewAddressChange}
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
    <div className="table-Scroll relative bg-white max-w-[1280px] rounded-md overflow-hidden border border-zinc-300 max-h-[360px] overflow-y-scroll">
      <CompactTable
        columns={COLUMNS}
        data={data}
        theme={theme}
        layout={{ fixedHeader: true }}
      />
    </div>
  );
};

// Componente principal para ajuste
const AdjustAddresses = ({ inventoryMovementID, product, onClose }) => {
  const { userData } = useUser();
  console.log(product);

  const [warehousesList, setWarehousesList] = useState([]);

  const [originId, setOriginId] = useState(null);
  const [destinationId, setDestinationId] = useState(null);

  const [newDestination, setNewDestination] = useState({
    AlmacenID: "",
    Seccion: "",
    Estante: "",
  });

  const [errorMessage, setErrorMessage] = useState(null);

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

  const handleNewDestinationChange = (e) => {
    const { name, value } = e.target;
    setNewDestination((prev) => ({ ...prev, [name]: value }));
  };

  const getSelectedDestinationObject = () => {
    if (destinationId === "new") {
      return { id: "new", ...newDestination, Cantidad: 0, _isNew: true };
    }
    const existing = product.Ubicaciones?.find(
      (item) => item.ID === destinationId
    );
    return existing ? { id: existing.ID, ...existing, _isNew: false } : null;
  };

  const handleSubmit = async (values) => {
    try {
      const destination = getSelectedDestinationObject(); // destino
      const origin = product.Ubicaciones.find((item) => item.ID === originId); // origen

      if (!origin) return;

      const payload = {
        Cantidad: Number(values.quantity),
        TipoMovimiento: "Ajuste", // Ajuste
        ProductoInventarioID: product.ID,
        MovimientoInventarioID: inventoryMovementID,
        AlmacenID: origin.AlmacenID,
        UbicacionProducto: {
          ID: origin.ID,
          UbicacionAjusteID: destination._isNew ? 0 : destination.id,
          ...(destination._isNew && {
            Estante: destination.Estante,
            Seccion: destination.Seccion,
            AlmacenID: destination.AlmacenID,
            ProductoInventarioID: product.ID,
          }),
        },
      };

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

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-4 justify-center w-[90%] max-w-[1300px]">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">Ubicaciones</p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => onClose()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <p className="font-bold mt-2">Ubicación Actual</p>
        <AddressSelector
          product={product}
          warehousesList={warehousesList}
          selectedId={originId}
          onSelect={setOriginId}
          newAddress={{}} // no se permite crear nueva aquí
          onNewAddressChange={() => {}}
          allowNew={false}
        />

        <p className="font-bold mt-4">Ubicación Nueva / Destino</p>
        <AddressSelector
          product={product}
          warehousesList={warehousesList}
          selectedId={destinationId}
          onSelect={setDestinationId}
          newAddress={newDestination}
          onNewAddressChange={handleNewDestinationChange}
          allowNew={true}
        />

        {originId && destinationId && (
          <Formik initialValues={{ quantity: "" }} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form className="mt-4 flex flex-col gap-4">
                <label
                  className="inputs-placeholder w-64 relative h-16 flex gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Cantidad"
                >
                  <Field
                    type="text"
                    name="quantity"
                    className="w-full outline-none"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbNumber123 size={20} />
                  </span>
                </label>
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
                  Aplicar Ajuste
                </button>
                {errorMessage && (
                  <p className="text-red-500 text-xs">{errorMessage}</p>
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

export default AdjustAddresses;
