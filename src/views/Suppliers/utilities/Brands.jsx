import { useEffect, useState } from "react";
import requests from "./requests";
import { Link, useParams } from "react-router-dom";
import Select from "react-select";
import { GoPlus } from "react-icons/go";
import { TbSearch, TbTrash } from "react-icons/tb";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";

const Brands = () => {
  const [listBrandsSelect, setListBrandsSelect] = useState([]);
  const [listBrandsSuppliers, setListBrandsSuppliers] = useState([]);
  const [selectedBrand, setSeletedBrand] = useState("");
  const [search, setSearch] = useState("");
  const { supplierID } = useParams();
  let data = listBrandsSuppliers;

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

  useEffect(() => {
    requests.getBrandsSupplier(supplierID).then((response) => {
      setListBrandsSuppliers(response);
    });
    requests.getBrandsSelect().then((response) => {
      setListBrandsSelect(response);
    });
  }, []);

  const handleSelectBrandChange = (event) => {
    setSeletedBrand(event);
  };

  const handleAddBrandClick = async () => {
    const response = await requests.addBrandSupplier({
      ProveedorID: supplierID,
      MarcaID: selectedBrand.value,
    });
    response && window.location.reload();
  };

  const handleDeleteBrandClick = async (ID) => {
    const response = await requests.deleteBrandSupplier(ID);
    response && window.location.reload();
  };

  data = {
    nodes: listBrandsSuppliers
      .filter((item) => item.Marca.toLowerCase().includes(search.toLowerCase()))
      .map((item) => ({ ...item, id: item.ID })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          #
        </div>
      ),
      renderCell: (item) => <p className="font-bold capitalize">{item.ID}</p>,
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Nombre de la Marca
        </div>
      ),
      renderCell: (item) => (
        <p className="font-bold capitalize">{item.Marca}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary w- h-12 text-zinc-100 flex items-center pl-2">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="font-bold capitalize flex justify-center items-center gap-3">
          <Tooltip content="Eliminar">
            <Button
              variant="soft"
              color="red"
              onClick={() => handleDeleteBrandClick(item.ID)}
            >
              <TbTrash size={24} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Suppliers">Preveedores</Link> / <b>Marcas</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Marcas</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <div className="flex gap-2">
          <Select
            className="w-64 app__BrandSuppliers-Form--select"
            value={selectedBrand}
            onChange={handleSelectBrandChange}
            options={listBrandsSelect}
            isSearchable={true}
            placeholder="Selecciona una Marca"
          />
          {selectedBrand && (
            <button
              className="size-9.5 flex justify-center items-center rounded-sm bg-sovetec-fourty text-white hover:bg-sovetec-primary"
              onClick={() => handleAddBrandClick()}
            >
              <GoPlus size={20} />
            </button>
          )}
        </div>
        {listBrandsSuppliers.length > 0 ? (
          <div className="table-Scroll relative bg-white mr-5 mb-2  rounded-md overflow-hidden border border-zinc-300 pb-2 max-h-[720px] overflow-y-scroll">
            <div className="">
              <CompactTable
                columns={COLUMNS}
                data={data}
                theme={theme}
                layout={{ fixedHeader: true }}
              />
            </div>
          </div>
        ) : (
          <div className="w-96 flex flex-col justify-center items-center py-5 border border-zinc-300 rounded-sm text-zinc-500">
            <span>
              <TbSearch size={27} />
            </span>
            <p>Sin marcas, agrege una.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Brands;
