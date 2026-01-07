import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { LuMapPin } from "react-icons/lu";
import { TbNumber123 } from "react-icons/tb";
import { BsPinMap } from "react-icons/bs";
import { FaRegMap } from "react-icons/fa";
import { GrMapLocation } from "react-icons/gr";
import * as Yup from "yup";

const UpdateAddress = () => {
  const { addressID } = useParams();
  const navigate = useNavigate();
  const [addressData, setAddressData] = useState(null);

  useEffect(() => {
    requests.getAddress(addressID).then((response) => {
      setAddressData(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    address: Yup.string().required("La dirección es obligatoria."),
    state: Yup.string().required("El estado es obligatorio."),
    colony: Yup.string().required("La colonia es obligatoria."),
    postalCode: Yup.string().required("El codigo postal es obligatorio."),
    municipality: Yup.string().required("El municipio es obligatorio."),
  });

  const handleUpdateAddressClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: addressID,
        Direccion: values.address,
        Estado: values.state,
        Colonia: values.colony,
        CodigoPostal: values.postalCode,
        Municipio: values.municipality,
        EmpresaID: addressData.EmpresaID,
      };
      const response = await requests.updateAddress(object);
      response &&
        navigate(`/Layout/Enterprises/Addresses/${addressData?.EmpresaID}`);
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
          <Link to="/Layout/Enterprises">Empresas</Link> /{" "}
          <Link to={`/Layout/Enterprises/Addresses/${addressData?.EmpresaID}`}>
            Direcciones
          </Link>{" "}
          / <b>Editar Dirección</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Editar Dirección</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Dirección</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            address: addressData?.Direccion || "",
            state: addressData?.Estado || "",
            colony: addressData?.Colonia || "",
            postalCode: addressData?.CodigoPostal || "",
            municipality: addressData?.Municipio || "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateAddressClick}
          enableReinitialize={true}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Dirección"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="address"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <GrMapLocation size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="address"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Estado"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="state"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <FaRegMap size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="state"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Colonia"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="colony"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <BsPinMap size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="colony"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Codigo Postal"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="postalCode"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber123 size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="postalCode"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Municipio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="municipality"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <LuMapPin size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="municipality"
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

export default UpdateAddress;
