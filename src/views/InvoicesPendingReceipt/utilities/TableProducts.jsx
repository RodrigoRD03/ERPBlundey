import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { Button, Tooltip } from "@radix-ui/themes";
import { TbTrash } from "react-icons/tb";

const TableProducts = ({ productsList, deleteProducts }) => {
  const theme = useTheme([
    getTheme(),
    {
      Row: `
        &:nth-of-type(odd) {
          background-color: #f7f7f7;
        }
        &:nth-of-type(even) {
          background-color: #e5e5e5;
        }
      `,
    },
  ]);

  const data = {
    nodes: productsList.map((item) => ({
      ...item,
      id: item.ID, // requerido por table-library
    })),
  };

  const COLUMNS = [
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Modelo
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Modelo}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Producto
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Producto}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Cantidad
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">{item.Cantidad}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center pl-2 text-sm">
          Total
        </div>
      ),
      renderCell: (item) => (
        <p className="font-normal capitalize">${item.Total.toLocaleString("en-US")}</p>
      ),
      resize: true,
    },
    {
      label: (
        <div className="bg-sovetec-primary h-12 text-zinc-100 flex items-center justify-center text-sm">
          Acciones
        </div>
      ),
      renderCell: (item) => (
        <div className="flex justify-center">
          <Tooltip content="Eliminar">
            <Button
              variant="soft"
              color="red"
              onClick={() => deleteProducts(item.ID)}
            >
              <TbTrash size={20} />
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div className="table-Scroll relative bg-white mb-2 max-w-200 rounded-md overflow-hidden border border-zinc-300 max-h-[720px] ">
      <div className="">
        <CompactTable
          columns={COLUMNS}
          data={data}
          theme={theme}
          layout={{ fixedHeader: true }}
        />
      </div>
    </div>
  );
};

export default TableProducts;
