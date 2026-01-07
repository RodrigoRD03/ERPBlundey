import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import {
  TbAlertSmall,
  TbBox,
  TbNumber123,
  TbQuestionMark,
} from "react-icons/tb";

const UpdateRegister = () => {
  const { registerID } = useParams();
  const [regiesterData, setRegisterData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getRegister(registerID).then((response) => {
      setRegisterData(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    reason: Yup.string()
      .required("El motivo es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),
    quantity: Yup.number()
      .nullable()
      .transform((value, originalValue) =>
        String(originalValue).trim() === "" ? null : value
      )
      .positive("Debe ser un número positivo.")
      .typeError("Debe ser un número válido."),
    concept: Yup.string()
      .required("El número de factura es obligatorio.")
      .min(1, "Debe tener al menos 1 carácter."),
    delivered: Yup.string()
      .required("El campo entregado por es obligatorio.")
      .min(3, "Debe tener al menos 3 caracteres."),
  });

  const handleUpdateRegisterClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: registerID,
        Motivo: values.reason,
        Cantidad: values.quantity,
        NoFactura: values.concept,
        Entregado: values.delivered,
      };

      const response = await requests.updateRegister(object);
      if (response) {
        navigate("/Layout/PettyCash");
      } else {
        setErrorMessage(
          "Cantidad rebasa el limite disponible, ingrese otro cheque."
        );
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
          <Link to="/Layout/PettyCash">Caja Chica</Link> /{" "}
          <b>Actualizar Registro</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Actualizar Registro</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Registro</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            reason: regiesterData?.Motivo,
            quantity: regiesterData?.Cantidad,
            concept: regiesterData?.NoFactura,
            delivered: regiesterData?.Entregado,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateRegisterClick}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Motivo"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="reason"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbQuestionMark size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="reason"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Cantidad"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
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
                  data-text="No. de Factura"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="concept"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbAlertSmall size="27" />
                  </span>
                </label>
                <ErrorMessage
                  name="concept"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Entregado por:"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="delivered"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbBox size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="delivered"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {errorMessage && (
                <div className="text-red-500 text-xs text-right m-0">
                  {errorMessage}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Actualizar Registro
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateRegister;
