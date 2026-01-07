import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import { TbPercentage, TbTargetArrow } from "react-icons/tb";

const UpdateTarget = () => {
  const [targetData, setTargetData] = useState({});
  const { targetID } = useParams();
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getVendorTarget(targetID).then((response) => {
      setTargetData(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    target: Yup.mixed().required("La meta de ventas es obligatorio."),
    percent: Yup.string().required("El porcentaje de comisión es obligatorio."),
  });

  const handleUpdateTargetClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: targetData.ID,
        MetaVentas: values.target,
        PorcentajeComision: values.percent,
        UsuarioID: targetData.UsuarioID,
      };

      const response = await requests.updateVendorsTarget(object);

      if (response == true) {
        navigate("/Layout/VendorTarget");
      } else {
        return;
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
          <Link to="/Layout/VendorTarget">Metas de Vendedores</Link> /{" "}
          <b>Nueva Meta</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nueva Meta</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Meta</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            target: targetData?.MetaVentas,
            percent: targetData?.PorcentajeComision,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateTargetClick}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Meta de Ventas"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="target"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbTargetArrow size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="target"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Porcentaje de Comisión"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="percent"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPercentage size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="percent"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Actualizar
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default UpdateTarget;
