import { Formik, Form, Field, ErrorMessage } from "formik";
import React from "react";
import { RiCloseFill } from "react-icons/ri";
import { TbAbc, TbCalendar } from "react-icons/tb";
import * as Yup from "yup";
import requests from "./requests";
import { useNavigate } from "react-router-dom";

const PurchaseReceived = ({ purchaseID, close }) => {
  const validationSchema = Yup.object().shape({
    date: Yup.string().required("La fecha es obligatoria."),
    comments: Yup.mixed().required("Las observaciones son obligatorias."),
  });

  const handlePurchaseReceipttClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        OrdenCompraProveedorID: purchaseID,
        FechaRecepcion: values.date,
        Estado: values.comments,
      };

      const response = await requests.checkReceiptOrder(object);
      if (response == true) {
        window.location.reload();
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
          <p className="text-lg font-bold">Compra Recibida</p>
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
            date: "",
            comments: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handlePurchaseReceipttClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Fecha de Recibido"
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
                <label
                  className="inputs-placeholder w-96 relative h-48 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Observaciones"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    as="textarea"
                    name="comments"
                  />
                  <span className="min-w-10 h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAbc size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="comments"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Aceptar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PurchaseReceived;
