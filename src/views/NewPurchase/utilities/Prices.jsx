import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { RiCloseFill } from "react-icons/ri";
import { TbNumber123 } from "react-icons/tb";
import { PiCurrencyCircleDollarBold } from "react-icons/pi";
import requests from "./requests";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Prices = ({ orderID, supplierID, type, quoteID, close }) => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const validationSchema = Yup.object().shape({
    quantity: Yup.string().required("La cantidad es obligatoria."),
    unitPrice: Yup.mixed().required("El precio unitario es obligatorio."),
    deliveryTime: Yup.string().required("El tiempo de entrega es obligatorio."),
  });

  const handleAddOrderClick = async (values, { setSubmitting }) => {
    try {
      if (type == "Producto") {
        const object = {
          OrdenCompraProveedorID: supplierID,
          ProductoPartidaID: orderID,
          Cantidad: values.quantity,
          PrecioUnitario: values.unitPrice,
          TiempoEntrega: values.deliveryTime,
        };

        const response = await requests.addPurchaseOrderProduct(object);
        if (response.Exitoso) {
          window.location.reload();
        } else {
          setErrorMessage(response.Mensaje);
        }
      } else {
        const object = {
          OrdenCompraProveedorID: supplierID,
          ServicioPartidaID: orderID,
          Cantidad: values.quantity,
          PrecioUnitario: values.unitPrice,
          TiempoEntrega: values.deliveryTime,
        };
        const response = await requests.addPurchaseOrderService(object);
        if (response.Exitoso) {
          window.location.reload();
        } else {
          setErrorMessage(response.Mensaje);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Precios del Proveedor</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{
            quantity: "",
            unitPrice: "",
            deliveryTime: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddOrderClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
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
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Precio Unitario"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="unitPrice"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <PiCurrencyCircleDollarBold size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="unitPrice"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Tiempo de Entrega"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="date"
                    name="deliveryTime"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <PiCurrencyCircleDollarBold size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="deliveryTime"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs text-right m-0 max-w-[400px]">
                  {errorMessage}
                </div>
              )}
              <div className="w-full flex justify-end gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Agregar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Prices;
