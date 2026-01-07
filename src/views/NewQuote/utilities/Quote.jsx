import { Link, useParams } from "react-router-dom";
import { LargeLogo } from "../../../constants";
import { useEffect, useState } from "react";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";
import { Button } from "@radix-ui/themes";
import { TbPlus, TbTrash } from "react-icons/tb";
import NewItem from "./NewItem";
import Conditions from "./Conditions";
import ViewPDF from "../../ViewPDF/ViewPDF";
import Finish from "./Finish";

const Quote = () => {
  const { enterpriseID, customerID, addressID, quoteID } = useParams();
  const [quoteData, setQuoteData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [addressData, setAddressData] = useState([]);
  const [userDataComplete, setUserDataComplete] = useState([]);
  const [createItem, setCreateItem] = useState(null);
  const [listItems, setListItems] = useState([]);
  const [conditions, setConditions] = useState(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [loading, setLoading] = useState(false);
  const [finishQuote, setFinishQuote] = useState(null);
  const { userData } = useUser();

  useEffect(() => {
    requests.getUserData(userData.ID).then((response) => {
      setUserDataComplete(response);
    });
    requests.getCustomer(customerID).then((response) => {
      setCustomerData(response);
    });
    requests.getAddress(addressID).then((response) => {
      setAddressData(response);
    });
    requests.getQuoteData(quoteID).then((response) => {
      setQuoteData(response);
      setListItems(response.productosServiciosPartidasDTOs);
    });
  }, []);

  const handleDeleteItemClick = async (ID) => {
    await requests.deleteItem(ID);
    window.location.reload();
  };

  const handleGetPdfClick = async () => {
    setLoading(true);
    const response = await requests.getBase(quoteID);
    setViewPdf(response);
    setLoading(false);
  };

  return (
    <>
      <div className="flex flex-col gap-2 p-4 max-h-screen overflow-y-scroll ">
        <div className="w-full flex flex-col gap-1">
          <p className="text-xs">
            <Link to="/Layout">Panel de Control</Link> /{"  "}
            <Link to="/Layout/NewQuote">Nueva Cotización</Link> /{" "}
            <Link
              to={`/Layout/NewQuote/Addresses/${enterpriseID}/${customerID}`}
            >
              Lista de Direcciones
            </Link>{" "}
            / <b>Cotización</b>
          </p>
          <p className="text-lg font-bold">Cotización</p>
          <div className="line-row" />
          <div className="flex gap-5 mt-2 mb-5">
            <div className="max-w-[1180px] w-full bg-white p-5 rounded-md flex flex-col gap-2">
              <div className="w-full flex justify-between">
                <img src={LargeLogo} className="w-80" alt="" />
                <p className="capitalize font-bold text-xl">
                  Fecha:{" "}
                  {new Date().toLocaleDateString("es-ES", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="flex justify-center">
                <p className="font-bold text-2xl">{quoteData.Version}</p>
              </div>
              <div className="max-w-[1000px] m-auto grid grid-cols-2 border-2 border-sovetec-primary rounded-md gap-0.5 bg-sovetec-primary overflow-hidden">
                <div className="bg-sovetec-primary h-12 flex items-center justify-center">
                  <p className="text-white">Datos del Ciente</p>
                </div>
                <div className="bg-sovetec-primary h-12 flex items-center justify-center">
                  <p className="text-white">Datos del Representante</p>
                </div>
                <div className="bg-white p-2 text-sm flex flex-col gap-1">
                  <p>
                    <b>Nombre:</b> {customerData.NombreCompleto}
                  </p>
                  <p>
                    <b>Empresa:</b> {customerData.Empresa}
                  </p>
                  <p>
                    <b>Dirección:</b> {addressData.Direccion}
                  </p>
                  <p>
                    <b>Municipio:</b>{" "}
                    {`${addressData.Municipio}, ${addressData.Estado} ${addressData.CodigoPostal}`}
                  </p>
                  <p>
                    <b>Teléfono:</b> {customerData.Telefono}
                  </p>
                  <p>
                    <b>E-Mail:</b> {customerData.Correo}
                  </p>
                </div>
                <div className="bg-white p-2 text-sm flex flex-col gap-1">
                  <p>
                    <b>Nombre:</b> {userDataComplete.NombreCompleto}
                  </p>
                  <p>
                    <b>Empresa:</b> Blundey S.A de C.V.
                  </p>
                  <p>
                    <b>Dirección:</b> 1ra. Cda. Amp. Lomas de Ozumbilla Mz.1
                    Lt.6, Col. Lomas de Ozumbilla
                  </p>
                  <p>
                    <b>Municipio:</b> Tecámac, Estado de México 55768
                  </p>
                  <p>
                    <b>Teléfono:</b> {userDataComplete.Telefono}
                  </p>
                  <p>
                    <b>E-Mail:</b> {userDataComplete.Correo}
                  </p>
                </div>
              </div>
              <div>
                <Button
                  variant="soft"
                  color="sky"
                  onClick={() => setCreateItem(true)}
                >
                  Agregar Partida{" "}
                  <span>
                    <TbPlus size="20" />
                  </span>
                </Button>
              </div>
              {listItems.length > 0 && (
                <div className="">
                  <table className=" border-zinc-500 text-center min-w-full border-collapse overflow-hidden">
                    <thead>
                      <tr className="border border-zinc-300">
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Part.
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Cant
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          U.SAT
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5 w-[500px]">
                          Descripción
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Fecha Entrega
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Precio U.
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Precio T.
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listItems.map((item, index) => (
                        <tr key={index} className="text-sm">
                          <td className="border border-zinc-300 p-1">
                            {item.Consecutivo}
                          </td>
                          <td className="border border-zinc-300 p-1">
                            {item.Cantidad}
                          </td>
                          <td className="border border-zinc-300 p-1">
                            <p>{item.UnidadSATCodigo}</p>
                            <p>{item.UnidadSAT}</p>
                          </td>
                          <td className="border border-zinc-300 p-1">
                            <div className="text-left ">
                              {item.UnidadSATCodigo === "H87" && (
                                <div className="flex flex-col gap-1.5">
                                  <p className="font-bold">
                                    {item.Descripcion}
                                  </p>
                                  <div>
                                    {item.Productos.map((item) => (
                                      <div
                                        key={item.ID}
                                        className="flex flex-col gap-.5"
                                      >
                                        <p>
                                          <b>Cantidad:</b> {item.Cantidad}{" "}
                                        </p>
                                        <p>
                                          <b>Modelo:</b> {item.Modelo}
                                        </p>
                                        <p>
                                          <b>Marca:</b> {item.Marca}{" "}
                                        </p>
                                        <p>
                                          <b>Categoria:</b> {item.Categoria}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {item.UnidadSATCodigo === "E48" && (
                                <div>
                                  <p>{item.Descripcion}</p>
                                  <div>
                                    {item.Servicios.map((item) => (
                                      <div key={item.ID}>
                                        <p>
                                          <b>{item.Servicio}</b>
                                        </p>
                                        <p>
                                          <b>Cantidad:</b> {item.Cantidad}
                                        </p>
                                        <p>{item.DescripcionLarga}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {(item.UnidadSATCodigo === "KT" ||
                                item.UnidadSATCodigo === "MTR") && (
                                <div>
                                  <p>{item.Descripcion}</p>
                                  {item.Productos.length == 0 ? (
                                    <></>
                                  ) : (
                                    <>
                                      <p>
                                        <b>Productos:</b>
                                      </p>
                                      <div>
                                        {item.Productos.map((item) => (
                                          <div key={item.ID}>
                                            <p>{item.Producto}</p>
                                            <p>
                                              <b>Cantidad:</b> {item.Cantidad}{" "}
                                              <b>Modelo:</b> {item.Modelo}
                                            </p>
                                            <p>
                                              <b>Marca:</b> {item.Marca}{" "}
                                              <b>Categoria:</b> {item.Categoria}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                  {item.Servicios.length == 0 ? (
                                    <></>
                                  ) : (
                                    <>
                                      <div>
                                        <p>
                                          <b>Servicios:</b>
                                        </p>
                                        {item.Servicios.map((item) => (
                                          <div key={item.ID}>
                                            <p>
                                              <b>{item.Servicio}</b>
                                            </p>
                                            <p>{item.DescripcionLarga}</p>
                                            <p>
                                              <b>Cantidad: </b>
                                              {item.Cantidad}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="border border-zinc-300 p-1">
                            <p>{item.TiempoEntrega}</p>
                          </td>
                          <td className="border border-zinc-300 p-1">
                            <p>
                              $
                              {!quoteData.Dolar ? (
                                <>
                                  {item.PrecioUnitario.toLocaleString("es-US")}
                                  MXN
                                </>
                              ) : (
                                <>
                                  {item.PrecioUnitario.toLocaleString("es-US")}
                                  US
                                </>
                              )}
                            </p>
                          </td>
                          <td className="border border-zinc-300">
                            <p>
                              $
                              {!quoteData.Dolar ? (
                                <>{item.Total.toLocaleString("es-US")} MXN</>
                              ) : (
                                <>{item.Total.toLocaleString("es-US")} US</>
                              )}
                            </p>
                          </td>
                          <td className="w-16 border border-zinc-300">
                            <span className="flex w-full h-full justify-center items-center text-red-500">
                              <TbTrash
                                size={22}
                                className="cursor-pointer"
                                onClick={() => handleDeleteItemClick(item.ID)}
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="w-full flex justify-end mt-4">
                    <table className="border">
                      <tbody>
                        <tr className="border">
                          <td className="border py-2 px-4 bg-lime-500">
                            <b className="text-white">Subtotal</b>
                          </td>
                          <td className="text-right border py-2 px-1">
                            ${" "}
                            {!quoteData.Dolar ? (
                              <>
                                {quoteData.Subtotal.toLocaleString("es-US")} MXN
                              </>
                            ) : (
                              <>
                                {quoteData.Subtotal.toLocaleString("es-US")} US
                              </>
                            )}
                          </td>
                        </tr>
                        <tr className="border">
                          <td className="border py-2 px-4 bg-lime-500">
                            <b className="text-white">IVA 16%</b>
                          </td>
                          <td className="text-right border py-2 px-1">
                            ${" "}
                            {!quoteData.Dolar ? (
                              <>{quoteData.Iva.toLocaleString("es-US")} MXN</>
                            ) : (
                              <>{quoteData.Iva.toLocaleString("es-US")} US</>
                            )}
                          </td>
                        </tr>
                        <tr className="border">
                          <td className="border py-2 px-4 bg-lime-500">
                            <b className="text-white">Total</b>
                          </td>
                          {!quoteData.Dolar ? (
                            <td className="text-right border py-2 px-1">
                              $ {quoteData.Total.toLocaleString("es-Us")} MXN
                            </td>
                          ) : (
                            <td className="text-right border py-2 px-1">
                              $ {quoteData.Total.toLocaleString("es-US")} US
                            </td>
                          )}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            <div className="bg-white w-max  h-max p-5 rounded-md sticky top-0">
              {!quoteData.TipoEnvio ? (
                <Button
                  variant="soft"
                  color="sky"
                  onClick={() => setConditions(true)}
                >
                  Condiciones Comerciales{" "}
                  <span>
                    <TbPlus size="20" />
                  </span>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="text-sm flex flex-col gap-1.5">
                    <p className="capitalize">
                      <b>Tipo de Envio:</b> {quoteData.TipoEnvio}
                    </p>
                    <p className="capitalize">
                      <b>Tipo de Pago:</b> {quoteData.TipoPago}
                    </p>
                    <p className="capitalize">
                      <b>Vencimiento:</b>{" "}
                      {new Date(quoteData.Vencimiento).toLocaleDateString(
                        "es-ES",
                        {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <Button
                    variant="surface"
                    color="yellow"
                    onClick={() => handleGetPdfClick()}
                    loading={loading}
                  >
                    Ver PDF
                  </Button>
                  <Button
                    variant="surface"
                    color="green"
                    onClick={() => setFinishQuote(true)}
                  >
                    Terminar Cotización
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        {createItem && (
          <NewItem
            quoteID={quoteID}
            listIDs={{
              enterpriseID: enterpriseID,
              customerID: customerID,
              addressID: addressID,
              quoteID: quoteID,
            }}
            close={() => setCreateItem(null)}
          />
        )}
        {conditions && (
          <Conditions quoteID={quoteID} close={() => setConditions(null)} />
        )}
        {viewPdf && (
          <ViewPDF
            base={viewPdf}
            version={quoteData.Version}
            close={() => setViewPdf(null)}
          />
        )}
        {finishQuote && (
          <Finish quoteID={quoteID} close={() => setFinishQuote(null)} />
        )}
      </div>
    </>
  );
};

export default Quote;
