import { useEffect, useState, useCallback } from "react";
import * as Yup from "yup";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Select from "react-select";
import { TbAbc, TbClock, TbNumber123, TbPlus, TbTrash } from "react-icons/tb";
import { Separator, Spinner } from "@radix-ui/themes";

const CustomServiceSelect = ({ field, form, options }) => {
  return (
    <Select
      options={options}
      value={options.find((option) => option.value === field.value) || null}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      isSearchable
      className="w-96"
      placeholder="Selecciona el Servicio"
    />
  );
};

const CustomPieceSelect = ({ field, form, options }) => {
  return (
    <Select
      options={options}
      value={options.find((option) => option.value === field.value) || null}
      onChange={(option) => form.setFieldValue(field.name, option.value)}
      onBlur={() => form.setFieldTouched(field.name, true)}
      isSearchable
      className="w-96"
      placeholder="Selecciona un Producto"
    />
  );
};

const Proyect = ({ itemID, quoteID, navigateClick }) => {
  const [listPiecesTable, setListPiecesTable] = useState([]);
  const [listServicesTable, setListServicesTable] = useState([]);
  const [listServices, setListServices] = useState([]);
  const [listProducts, setListProducts] = useState([]);
  const [priceService, setPriceService] = useState("");
  const [pricePiece, setPricePiece] = useState("");
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    const fetchQuoteData = async () => {
      const response = await requests.getQuoteData(quoteID);
      setListPiecesTable(
        response.productosServiciosPartidasDTOs[
          response.productosServiciosPartidasDTOs.length - 1
        ].Productos
      );
      setListServicesTable(
        response.productosServiciosPartidasDTOs[
          response.productosServiciosPartidasDTOs.length - 1
        ].Servicios
      );
    };
    const fetchServices = async () => {
      const response = await requests.getServicesSelect();
      setListServices(response);
    };
    const fetchProducts = async () => {
      const response = await requests.getProductsSelect();
      setListProducts(response);
    };
    fetchQuoteData();
    fetchServices();
    fetchProducts();
  }, []);

  const validationSchemaService = Yup.object().shape({
    longDescription: Yup.string().required(
      "La descripción larga es obligatoria."
    ),
    serviceID: Yup.string().required("El servicio es un campo obligatorio."),
    quantity: Yup.string().required("La cantidad es obligatoria."),
  });

  const validationSchemaPiece = Yup.object().shape({
    productID: Yup.string().required("El producto es un campo obligatorio."),
    quantity: Yup.string().required("La cantidad es obligatoria."),
  });

  const validationSchemaTime = Yup.object().shape({
    deliveryTime: Yup.string().required(
      "El tiempo de entrega campo obligatorio."
    ),
  });

  const fetchPriceService = useCallback(async (serviceID) => {
    if (serviceID) {
      const response = await requests.getPriceService(serviceID);
      setPriceService(response);
    }
  }, []);

  const fetchPricePiece = useCallback(async (productID) => {
    if (productID) {
      const response = await requests.getPriceProduct(productID);
      setPricePiece(response);
    }
  }, []);

  const handleAddItemServiceClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        PartidaID: itemID,
        ServicioID: values.serviceID,
        Cantidad: values.quantity,
        PrecioUnitario: priceService,
        DescripcionLarga: values.longDescription,
      };
      const addServiceResponse = await requests.addServiceItem(object);
      if (addServiceResponse) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddItemPieceClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        PartidaID: itemID,
        ProductoID: values.productID,
        Cantidad: values.quantity,
        PrecioUnitario: pricePiece,
      };

      const addProductResponse = await requests.addProductItem(object);
      if (addProductResponse) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeliveryTimeClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const deliveryResponse = await requests.dateDelivery(
        itemID,
        values.deliveryTime
      );

      if (deliveryResponse == true) {
        navigateClick();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProductClick = async (ID) => {
    const response = await requests.deleteProductItem(ID);
    if (response) {
      window.location.reload();
    }
  };

  const handleDeleteServiceClick = async (ID) => {
    const response = await requests.deleteServiceItem(ID);
    if (response) {
      window.location.reload();
    }
  };

  return (
    <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md mb-5">
      <p className="text-lg">Partida de Proyecto</p>
      <div className="line-row" />
      <div className="h-max flex gap-5">
        <Formik
          initialValues={{
            price: "",
            productID: "",
            quantity: "",
          }}
          validationSchema={validationSchemaPiece}
          onSubmit={handleAddItemPieceClick}
        >
          {({ isSubmitting, values }) => {
            // Hacer la petición cuando 'brandID' cambie
            useEffect(() => {
              fetchPricePiece(values.productID);
            }, [values.productID, fetchPricePiece]);

            return (
              <Form className="mt-2 flex flex-col gap-5 ">
                <div className="w-96">
                  <label className="block text-sm font-semibold text-gray-600">
                    Selecciona el producto:
                  </label>
                  <Field
                    name="productID"
                    component={CustomPieceSelect}
                    options={listProducts || []} // Evita errores si aún no se ha cargado
                  />
                  <ErrorMessage
                    name="productID"
                    component="div"
                    className="text-red-500 text-xs text-right"
                  />
                </div>
                <div className="w-full flex justify-between">
                  <div>
                    <label
                      className="inputs-placeholder w-36 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Cantidad"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
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
                  {pricePiece && (
                    <div className="">
                      <p className="text-sm text-gray-600">
                        Precio Unitario: $ {pricePiece.toLocaleString("en-US")}
                      </p>
                    </div>
                  )}
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || loader}
                    className="self-end w-64 border-2 flex gap-2 justify-center border-lime-600 px-3 py-2 text-lime-600 rounded-lg font-bold tracking-wide cursor-pointer hover:bg-lime-600 hover:text-white"
                  >
                    {loader ? (
                      <Spinner color="gray" />
                    ) : (
                      <>
                        Agregar <TbPlus size={24} />
                      </>
                    )}
                  </button>
                </div>
                {listPiecesTable.length > 0 && (
                  <table className=" border-zinc-500 text-center w-96 border-collapse overflow-hidden">
                    <thead>
                      <tr className="border border-zinc-300">
                        <th className="bg-sovetec-primary text-white text-sm p-1.5 w-[200px]">
                          Producto.
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Cant
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Precio
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listPiecesTable.map((item, index) => (
                        <tr
                          key={index}
                          className="text-sm border border-transparent border-b-zinc-300 "
                        >
                          <td className="p-1 py-3">{item.Producto}</td>
                          <td className="p-1 py-3">{item.Cantidad}</td>
                          <td className="p-1 py-3">
                            <p>
                              $
                              {(
                                item.PrecioUnitario * item.Cantidad
                              ).toLocaleString("en-US")}
                            </p>
                          </td>
                          <td className="p-1 py-3">
                            <span className="flex w-full h-full justify-center items-center text-red-500">
                              <TbTrash
                                size={22}
                                className="cursor-pointer"
                                onClick={() =>
                                  handleDeleteProductClick(item.ID)
                                }
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Form>
            );
          }}
        </Formik>
        <Separator orientation="vertical" size="4" />
        <Formik
          initialValues={{
            longDescription: "",
            serviceID: "",
            quantity: "",
          }}
          validationSchema={validationSchemaService}
          onSubmit={handleAddItemServiceClick}
        >
          {({ isSubmitting, values }) => {
            // Hacer la petición cuando 'brandID' cambie
            useEffect(() => {
              fetchPriceService(values.serviceID);
            }, [values.serviceID, fetchPriceService]);
            return (
              <Form className="mt-2 flex flex-col gap-5 ">
                <div className="w-96">
                  <label className="block text-sm font-semibold text-gray-600">
                    Selecciona el Servicio:
                  </label>
                  <Field
                    name="serviceID"
                    component={CustomServiceSelect}
                    options={listServices || []} // Evita errores si aún no se ha cargado
                  />
                  <ErrorMessage
                    name="serviceID"
                    component="div"
                    className="text-red-500 text-xs text-right"
                  />
                </div>
                <div className="w-full flex justify-between">
                  <div>
                    <label
                      className="inputs-placeholder w-36 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Cantidad"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
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
                  {priceService && (
                    <div className="">
                      <p className="text-sm text-gray-600">
                        Precio Unitario: ${" "}
                        {priceService.toLocaleString("en-US")}
                      </p>
                    </div>
                  )}
                </div>
                <div>
                  <label
                    className="inputs-placeholder w-96 h-36 relative  flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Descripción Larga"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      as="textarea"
                      name="longDescription"
                    />
                    <span className="min-w-10 min-h-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbAbc size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="longDescription"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div className="w-full flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || loader}
                    className="self-end w-64 flex gap-2 justify-center border-2 border-lime-600 px-3 py-2 text-lime-600 rounded-lg font-bold tracking-wide cursor-pointer hover:bg-lime-600 hover:text-white"
                  >
                    {loader ? (
                      <Spinner color="gray" />
                    ) : (
                      <>
                        Agregar <TbPlus size={24} />
                      </>
                    )}
                  </button>
                </div>
                {listServicesTable.length > 0 && (
                  <table className=" border-zinc-500 text-center border-collapse overflow-hidden">
                    <thead>
                      <tr className="border border-zinc-300">
                        <th className="bg-sovetec-primary text-white text-sm p-1.5 w-[400px]">
                          Producto.
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Cant
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Precio
                        </th>
                        <th className="bg-sovetec-primary text-white text-sm p-1.5">
                          Eliminar
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {listServicesTable.map((item, index) => (
                        <tr
                          key={index}
                          className="text-sm border border-transparent border-b-zinc-300 "
                        >
                          <td className="p-1 py-3">{item.Servicio}</td>
                          <td className="p-1 py-3">{item.Cantidad}</td>
                          <td className="p-1 py-3">
                            <p>
                              $
                              {(
                                item.PrecioUnitario * item.Cantidad
                              ).toLocaleString("en-US")}
                            </p>
                          </td>
                          <td className="p-1 py-3">
                            <span className="flex w-full h-full justify-center items-center text-red-500">
                              <TbTrash
                                size={22}
                                className="cursor-pointer"
                                onClick={() =>
                                  handleDeleteServiceClick(item.ID)
                                }
                              />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </Form>
            );
          }}
        </Formik>
      </div>
      {(listPiecesTable.length > 0 || listServicesTable.length > 0) && (
        <>
          <div className="line-row" />
          <Formik
            initialValues={{
              deliveryTime: "",
            }}
            validationSchema={validationSchemaTime}
            onSubmit={handleDeliveryTimeClick}
          >
            {({ isSubmitting }) => (
              <Form className="mt-2 flex gap-5">
                <div className="w-full flex flex-col items-end justify-end gap-4">
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Tiempo de Entrega de la Partida"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="date"
                        name="deliveryTime"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbClock size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="deliveryTime"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting || loader}
                    className="self-end w-64 flex justify-center items-center border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                  >
                    {loader ? <Spinner color="gray" /> : <>Confirmar</>}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </>
      )}
    </div>
  );
};

export default Proyect;
