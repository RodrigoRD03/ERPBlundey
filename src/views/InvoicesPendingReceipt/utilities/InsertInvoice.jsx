import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import requests from "./requests";
import TableProducts from "./TableProducts";
import { Spinner } from "@radix-ui/themes";
import TableServices from "./TableServices";

const InsertInvoice = () => {
  const { supplierID } = useParams();

  const [productos, setProductos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [productosTabla, setProductosTabla] = useState([]);
  const [serviciosTabla, setServiciosTabla] = useState([]);
  const [xmlName, setXmlName] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [noXML, setNoXML] = useState(false);
  const [paymentsTypes, setPaymentsTypes] = useState([]);
  const [paymentsMethods, setPaymentsMethods] = useState([]);
  const [cfdiUse, setCfdiUse] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getSupplierInvoiceData(supplierID).then((response) => {
      setProductos(response?.data?.ordenCompraProveedor?.Productos || []);
      setServicios(response?.data?.ordenCompraProveedor?.Servicios || []);
      setPaymentsTypes(response?.data?.formasPago);
      setPaymentsMethods(response?.data?.metodosPago);
      setCfdiUse(response?.data?.usosCfdi);
    });
  }, [supplierID]);

  const toBase64 = (file, setFieldValue, fieldName, setFileName) => {
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFieldValue(fieldName, reader.result.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  const handleAddProducto = (id) => {
    const item = productos.find((p) => p.ID.toString() === id);
    if (!item) return;
    setProductosTabla((prev) => [...prev, item]);
  };

  const handleAddServicio = (id) => {
    const item = servicios.find((s) => s.ID.toString() === id);
    if (!item) return;
    setServiciosTabla((prev) => [...prev, item]);
  };

  const handleDeleteProducto = (id) => {
    setProductosTabla((prev) => prev.filter((i) => i.ID !== id));
  };

  const handleDeleteServicio = (id) => {
    setServiciosTabla((prev) => prev.filter((i) => i.ID !== id));
  };

  const availableProductos = productos.filter(
    (p) => !productosTabla.some((t) => t.ID === p.ID)
  );

  const availableServicios = servicios.filter(
    (s) => !serviciosTabla.some((t) => t.ID === s.ID)
  );

  const validationSchema = Yup.object({
    pdf: Yup.string().required("PDF requerido"),
  });

  const downloadBase64File = (base64, fileName, mime) => {
    const link = document.createElement("a");
    link.href = `data:${mime};base64,${base64}`;
    link.download = fileName;
    link.click();
  };

  return (
    <div className="flex flex-col gap-4 m-4">
      <div>
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/InvoicesPendingReceipt">
            Facturas Pendientes de Recepción
          </Link>{" "}
          / <b>Capturar</b>
        </p>
        <p className="text-lg font-bold">Capturar</p>
      </div>

      <div className="line-row" />

      <div className="bg-white w-max p-5 rounded-md shadow-md">
        <Formik
          initialValues={{
            xml: "",
            pdf: "",
            MetodoPago: "",
            TotalMN: "",
            TotalUSD: "",
            FolioFiscal: "",
            Folio: "",
            Serie: "",
            Moneda: "MXN",
            FormaPago: "",
            TipoCambio: "",
            UsoCFDI: "",
          }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoader(true);

            const payloadBase = {
              OrdenCompraProveedorID: supplierID,
              XML: noXML ? null : values.xml,
              PDF: values.pdf,
              Productos: productosTabla,
              Servicios: serviciosTabla,
            };

            let response;

            if (!noXML) {
              response = await requests.insertInvoiceReceipt(payloadBase);
            } else {
              response = await requests.insertInvoiceReceiptManual({
                ...payloadBase,
                MetodoPago: values.MetodoPago,
                TotalMN: values.TotalMN,
                TotalUSD: values.TotalUSD,
                FolioFiscal: values.FolioFiscal,
                Folio: values.Folio,
                Serie: values.Serie,
                Moneda: values.Moneda,
                FormaPago: values.FormaPago,
                TipoCambio: values.TipoCambio,
                UsoCFDI: values.UsoCFDI,
              });
            }

            if (!response.data.Exitoso) {
              setErrorMessage(response?.data?.Mensaje);
              setLoader(false);
              return;
            }

            downloadBase64File(
              response.data.Mensaje,
              "Productos y Servicios Faltantes.pdf",
              "application/pdf"
            );
            navigate("/Layout/InvoicesPendingReceipt");
          }}
        >
          {({ values, setFieldValue }) => (
            <Form className="flex flex-col gap-6">
              <label className="w-80 h-32 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer">
                <input
                  type="file"
                  accept=".pdf"
                  hidden
                  onChange={(e) =>
                    toBase64(
                      e.target.files[0],
                      setFieldValue,
                      "pdf",
                      setPdfName
                    )
                  }
                />
                <p>{pdfName || "Selecciona el PDF"}</p>
              </label>

              {!noXML && (
                <label className="w-80 h-32 flex items-center justify-center border-2 border-dashed rounded-xl cursor-pointer">
                  <input
                    type="file"
                    accept=".xml"
                    hidden
                    onChange={(e) =>
                      toBase64(
                        e.target.files[0],
                        setFieldValue,
                        "xml",
                        setXmlName
                      )
                    }
                  />
                  <p>{xmlName || "Selecciona el XML"}</p>
                </label>
              )}

              <label className="flex gap-2 items-center text-sm">
                <input
                  type="checkbox"
                  checked={noXML}
                  onChange={() => setNoXML(!noXML)}
                />
                No tengo XML
              </label>

              {noXML && (
                <div className="grid grid-cols-3 gap-4">
                  {/* Método de Pago */}
                  <div>
                    <label
                      data-text="Método de Pago"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        as="select"
                        name="MetodoPago"
                        className="w-full outline-none border-2 border-white"
                      >
                        <option value="">Seleccione el Metodo de Pago</option>
                        {paymentsMethods.map((item, index) => (
                          <option key={index} value={item.key}>
                            {item.name}
                          </option>
                        ))}
                      </Field>
                    </label>
                    <ErrorMessage
                      name="MetodoPago"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Moneda */}
                  <div>
                    <label
                      data-text="Moneda"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        as="select"
                        name="Moneda"
                        className="w-full outline-none border-2 border-white"
                      >
                        <option value="">Selecctione una Moneda</option>
                        <option value="MXN">MXN</option>
                        <option value="USD">USD</option>
                      </Field>
                    </label>
                    <ErrorMessage
                      name="Moneda"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Total MN */}
                  {values.Moneda === "MXN" && (
                    <div>
                      <label
                        data-text="Total MN"
                        className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                      >
                        <Field
                          name="TotalMN"
                          className="w-full outline-none border-2 border-white"
                        />
                      </label>
                      <ErrorMessage
                        name="TotalMN"
                        component="div"
                        className="text-red-500 text-xs text-right"
                      />
                    </div>
                  )}

                  {values.Moneda === "USD" && (
                    <>
                      {/* Total USD */}
                      <div>
                        <label
                          data-text="Total USD"
                          className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                        >
                          <Field
                            name="TotalUSD"
                            className="w-full outline-none border-2 border-white"
                          />
                        </label>
                        <ErrorMessage
                          name="TotalUSD"
                          component="div"
                          className="text-red-500 text-xs text-right"
                        />
                      </div>
                      {/* Tipo de Cambio */}
                      <div>
                        <label
                          data-text="Tipo de Cambio"
                          className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                        >
                          <Field
                            name="TipoCambio"
                            className="w-full outline-none border-2 border-white"
                          />
                        </label>
                        <ErrorMessage
                          name="TipoCambio"
                          component="div"
                          className="text-red-500 text-xs text-right"
                        />
                      </div>
                    </>
                  )}
                  {/* Folio Fiscal */}
                  <div>
                    <label
                      data-text="Folio Fiscal"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        name="FolioFiscal"
                        className="w-full outline-none border-2 border-white"
                      />
                    </label>
                    <ErrorMessage
                      name="FolioFiscal"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Folio */}
                  <div>
                    <label
                      data-text="Folio"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        name="Folio"
                        className="w-full outline-none border-2 border-white"
                      />
                    </label>
                    <ErrorMessage
                      name="Folio"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Serie */}
                  <div>
                    <label
                      data-text="Serie"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        name="Serie"
                        className="w-full outline-none border-2 border-white"
                      />
                    </label>
                    <ErrorMessage
                      name="Serie"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Forma de Pago */}
                  <div>
                    <label
                      data-text="Forma de Pago"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        name="FormaPago"
                        as="select"
                        className="w-full outline-none border-2 border-white"
                      >
                        <option value="">Selecciona una forma de pago</option>
                        {paymentsTypes.map((item, index) => (
                          <option key={index} value={item.key}>
                            {item.name}
                          </option>
                        ))}
                      </Field>
                    </label>
                    <ErrorMessage
                      name="FormaPago"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>

                  {/* Uso CFDI */}
                  <div>
                    <label
                      data-text="Uso de CFDI"
                      className="inputs-placeholder relative w-96 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        as="select"
                        name="UsoCFDI"
                        className="w-full outline-none border-2 border-white"
                      >
                        <option value="">Seleccione el uso de CFDI</option>
                        {cfdiUse.map((item, index) => (
                          <option key={index} value={item.key}>
                            {item.name}
                          </option>
                        ))}
                      </Field>
                    </label>
                    <ErrorMessage
                      name="UsoCFDI"
                      component="div"
                      className="text-red-500 text-xs text-right"
                    />
                  </div>
                </div>
              )}

              {productos.length > 0 && (
                <label
                  data-text="Productos"
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                >
                  <select
                    onChange={(e) => handleAddProducto(e.target.value)}
                    className="w-full border-2 border-white outline-none"
                  >
                    <option value="">Productos</option>
                    {availableProductos.map((p) => (
                      <option key={p.ID} value={p.ID}>
                        {p.Modelo}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {servicios.length > 0 && (
                <label
                  data-text="Servicios"
                  className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                >
                  <select
                    onChange={(e) => handleAddServicio(e.target.value)}
                    className="w-full border-2 border-white outline-none"
                  >
                    <option value="">Servicios</option>
                    {availableServicios.map((s) => (
                      <option key={s.ID} value={s.ID}>
                        {s.Servicio}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {productosTabla.length > 0 && (
                <TableProducts
                  productsList={[...productosTabla]}
                  deleteProducts={(id) => {
                    handleDeleteProducto(id);
                  }}
                />
              )}
              {serviciosTabla.length > 0 && (
                <TableServices
                  servicesList={[...serviciosTabla]}
                  deleteService={(id) => {
                    handleDeleteServicio(id);
                  }}
                />
              )}

              {loader ? (
                <div className="self-end w-64 h-13 border-2 px-3 py-2 rounded-lg flex justify-center items-center">
                  <Spinner />
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={!productosTabla.length && !serviciosTabla.length}
                  className="self-end w-64 border-2 px-3 py-2 rounded-lg font-bold"
                >
                  Capturar
                </button>
              )}

              {errorMessage && (
                <div className="text-red-500 text-sm self-end max-w-116 text-right">
                  {errorMessage}
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default InsertInvoice;
