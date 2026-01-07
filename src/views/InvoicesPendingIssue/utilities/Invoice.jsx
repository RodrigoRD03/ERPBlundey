import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  TbArrowBack,
  TbCalendar,
  TbFileTypePdf,
  TbNumber,
  TbNumber123,
} from "react-icons/tb";
import * as Yup from "yup";
import { Button } from "@radix-ui/themes";

const formatCurrency = (value) => {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Invoice = () => {
  const { base64 } = useParams();
  const [invoiceData, setInvoiceData] = useState([]);
  const [fileName, setFileName] = useState("Adjunta el archivo PDF");
  const [fileBase64, setFileBase64] = useState("");
  const [missingProducts, setMissingProducts] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    requests.uploadXML({ XML: base64 }).then((response) => {
      setInvoiceData(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    orderPurchase: Yup.string().required(
      "La orden de compra nombre es obligatoria."
    ),
    date: Yup.string().required("La fecha programada de pago obligatoria."),
  });

  const handleFileUpload = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file && file.type === "application/pdf") {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        const nameWithoutExt = file.name.replace(/\.pdf$/i, "");
        setFileName(nameWithoutExt);
        setFileBase64(base64String);
        setFieldValue("file", ""); // Limpiar el input
      };
    }
  };

  const handleAddInvoiceClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        DatosFiscalesID: invoiceData.DatosFiscalesID,
        OrdenVentaID: values.orderPurchase,
        NumeroFactura: invoiceData.NumeroFactura,
        MetodoPago: invoiceData.MetodoPago,
        TotalMN: invoiceData.TotalMN,
        TotalUSD: invoiceData.TotalUSD,
        PrecioUSD: invoiceData.PrecioUSD,
        FolioFiscal: invoiceData.FolioFiscal,
        PDF: fileBase64,
        FechaProgramada: values.date,
        NumeroPagos: values.number,
        XML: base64,
        Productos: invoiceData.Productos,
        TipoFactura: "Emisor",
      };

      const response = await requests.insertInvoice(object, values.sendMail);
      if (response.Exitoso) {
        navigate("/Layout/InvoicesPendingIssue");
      } else {
        setMissingProducts(response.Mensaje);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/InvoicesPendingIssue">
            Facturas Pendientes de Emisión
          </Link>{" "}
          / <b>Datos de la Factura</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Datos de la Factura</p>
      </div>
      <div className="line-row" />
      <div className="flex gap-2">
        <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
          <p className="text-lg font-bold">Datos Fiscales del cliente.</p>
          <p className="text-sm">
            <b>RFC: </b>
            {invoiceData.RFC}
          </p>
          <p className="text-lg font-bold">Datos de la Factura.</p>
          <p className="text-sm">
            <b>Folio Fiscal: </b>
            {invoiceData.FolioFiscal}
          </p>
          <div className="text-sm flex gap-1">
            <b>Metodo de Pago: </b>
            {invoiceData.MetodoPago ? (
              <p>{invoiceData.MetodoPago}</p>
            ) : (
              <p className="text-red-400">Factura Invalida</p>
            )}
          </div>
          <p className="text-sm">
            <b>Numero de Factura: </b>
            {invoiceData.NumeroFactura}
          </p>
          <p className="text-sm">
            {invoiceData.TotalMN > 0 ? (
              <>
                <b>Total M.N: </b>${formatCurrency(invoiceData.TotalMN)}
              </>
            ) : (
              <>
                <b>Total USD: </b>${formatCurrency(invoiceData.TotalUSD)}
              </>
            )}
          </p>
          <Formik
            initialValues={{
              orderPurchase: "",
              number: "",
              date: "",
              pdf: "",
              sendMail: false,
            }}
            validationSchema={validationSchema}
            onSubmit={handleAddInvoiceClick}
          >
            {({ isSubmitting, setFieldValue }) => (
              <Form className="mt-2 flex flex-col gap-5 items-center">
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Orden de Compra"
                  >
                    <Field
                      className="w-full outline-none resize-none border-2 border-white"
                      as="select"
                      name="orderPurchase"
                    >
                      <option className="border-2 border-white" value="">
                        Selecciona una orden de compra
                      </option>
                      {invoiceData?.Ordenes?.map((order, index) => (
                        <option key={index} value={order.value}>
                          {order.label}
                        </option>
                      ))}
                    </Field>
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbNumber size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="orderPurchase"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {invoiceData.MetodoPago == "PPD" && (
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Numero de Pagos"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
                        name="number"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbNumber123 size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="number"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                )}
                <div>
                  <label
                    className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Fecha Programada de Pago"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="date"
                      name="date"
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbCalendar size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="date"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label className="w-96 border border-zinc-500 border-dashed flex p-2 rounded-md items-center gap-2 hover:bg-zinc-200 cursor-pointer">
                    <input
                      name="pdf"
                      className="hidden"
                      type="file"
                      accept=".pdf"
                      onChange={(event) =>
                        handleFileUpload(event, setFieldValue)
                      }
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                      <TbFileTypePdf size="20" />
                    </span>
                    <p className="whitespace-nowrap overflow-hidden text-ellipsis inline-block">
                      {fileName}
                    </p>
                  </label>
                  <ErrorMessage
                    name="pdf"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div className="self-start gap-2">
                  <label
                    htmlFor="sendMail"
                    className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                  >
                    <Field
                      type="checkbox"
                      name="sendMail"
                      className="hidden peer"
                      id="sendMail"
                    />
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-green-600 peer-checked:border-green-600">
                      <svg
                        className="w-4 h-4 bg-r text-white scale-100 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    Enviar correo al cliente.
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Enviar
                </button>
              </Form>
            )}
          </Formik>
        </div>
        {missingProducts.length > 0 && (
          <div className="bg-white w-[400px] flex flex-col gap-2 p-5 rounded-md shadow-md">
            <div className="flex justify-between">
              <p className="font-bold">Productos Faltantes</p>
              <Button
                color="amber"
                variant="surface"
                onClick={() => navigate("/Layout/InvoicesPendingIssue")}
              >
                <TbArrowBack size={20} />
                Regresar
              </Button>
            </div>
            <table className=" border-zinc-500 text-center min-w-full border-collapse overflow-hidden">
              <thead>
                <tr className="border border-zinc-300">
                  <th className="bg-sovetec-primary text-white text-sm p-1.5">
                    #
                  </th>
                  <th className="bg-sovetec-primary text-white text-sm p-1.5">
                    Producto
                  </th>
                </tr>
              </thead>
              <tbody>
                {missingProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="border border-zinc-300 p-1">{index}</td>
                    <td className="border border-zinc-300 p-1">{product}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoice;
