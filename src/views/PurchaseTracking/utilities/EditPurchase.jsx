import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import requests from "./requests";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbTrash } from "react-icons/tb";

const EditPurchase = () => {
  const { purchaseId } = useParams();
  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);

  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #f7f7f7;
        }
        &:nth-of-type(even) {
          background-color: #e2e2e2;
        }
      `,
    },
  ]);

  useEffect(() => {
    requests.getOrderPurchasePS(purchaseId).then((response) => {
      console.log(response);

      if (response?.Productos) {
        setProductos(response.Productos.map((p, i) => ({ ...p, id: i + 1 })));
      }
      if (response?.Servicios) {
        setServicios(response.Servicios.map((s, i) => ({ ...s, id: i + 1 })));
      }
    });
  }, [purchaseId]);

  const dataProductos = { nodes: productos };
  const dataServicios = { nodes: servicios };

  const handleDeleteProduct = (id) => {
    requests.deleteProductOrderPurchase(id).then((response) => {
      response && window.location.reload();
    });
  };
  const handleDeleteService = (id) => {
    requests.deleteServiceOrderPurchase(id).then((response) => {
      response && window.location.reload();
    });
  };

  const COLUMNS_PRODUCTOS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => item.Cantidad,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Producto
        </div>
      ),
      renderCell: (item) => item.Producto,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Marca
        </div>
      ),
      renderCell: (item) => item.Marca,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Modelo
        </div>
      ),
      renderCell: (item) => item.Modelo,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Precio Unitario
        </div>
      ),
      renderCell: (item) => `$ ${item.PrecioUnitario.toLocaleString("es-MX")}`,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => `$ ${item.Total.toLocaleString("es-MX")}`,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="red"
              onClick={() => handleDeleteProduct(item.ID)}
            >
              <TbTrash size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  const COLUMNS_SERVICIOS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Cantidad
        </div>
      ),
      renderCell: (item) => item.Cantidad,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Servicio
        </div>
      ),
      renderCell: (item) => item.Servicio,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Precio Unitario
        </div>
      ),
      renderCell: (item) => `$ ${item.PrecioUnitario.toLocaleString("es-MX")}`,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Total
        </div>
      ),
      renderCell: (item) => `$ ${item.Total.toLocaleString("es-MX")}`,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-2">
          <Tooltip content="Editar">
            <Button
              variant="soft"
              color="red"
              onClick={() => handleDeleteService(item.ID)}
            >
              <TbTrash size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/PurchaseTracking">Seguimiento de Compras</Link> /{" "}
          <b>Editar Compra</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Editar Compra</p>
      </div>
      <div className="line-row" />

      {dataProductos.nodes.length > 0 && (
        <div>
          <p className="font-semibold text-lg mb-2">Productos</p>
          <div className="table-Scroll relative bg-white mb-4 shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
            <CompactTable
              columns={COLUMNS_PRODUCTOS}
              data={dataProductos}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          </div>
        </div>
      )}

      {dataServicios.nodes.length > 0 && (
        <div>
          <p className="font-semibold text-lg mb-2">Servicios</p>
          <div className="table-Scroll relative bg-white shadow-xl rounded-md overflow-hidden border border-zinc-300 max-h-[720px] overflow-y-scroll">
            <CompactTable
              columns={COLUMNS_SERVICIOS}
              data={dataServicios}
              theme={theme}
              layout={{ fixedHeader: true }}
            />
          </div>
        </div>
      )}

      {dataProductos.nodes.length === 0 && dataServicios.nodes.length === 0 && (
        <div className="text-center py-4 text-gray-500 bg-white rounded-sm">
          No hay productos ni servicios disponibles.
        </div>
      )}
    </div>
  );
};

export default EditPurchase;
