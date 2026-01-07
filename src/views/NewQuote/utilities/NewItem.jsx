import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import requests from "./requests";
import { TbAbc, TbNumber, TbNumber123, TbPageBreak } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import { Spinner } from "@radix-ui/themes";

const NewItem = ({ quoteID, listIDs, close }) => {
  const [unitsSatList, setUnitsSatList] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    requests.getSatUnits().then((response) => {
      setUnitsSatList(response);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    quantity: Yup.string().required("La cantidad es obligatoria."),
    unitSat: Yup.string().required("La unidad del SAT es obligatoria."),
  });

  const handleCreateItemClick = async (values, { setSubmitting }) => {
    setLoader(true);
    try {
      const object = {
        Cantidad: values.quantity,
        CotizacionID: quoteID,
        UnidadSATID: values.unitSat,
        Descripcion: values.description,
        NumeroRequisicion: values.requisitionNumber,
      };
      const response = await requests.createItem(object);

      if (response.data != 0) {
        navigate(
          `/Layout/NewQuote/Item/${listIDs.enterpriseID}/${listIDs.customerID}/${listIDs.addressID}/${listIDs.quoteID}/${response}/${values.unitSat}`
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="w-96 bg-white p-5 rounded-md flex flex-col gap-2 justify-center">
        <div className="flex justify-between">
          <p className="text-lg font-bold flex items-center">Nueva Partida</p>
          <span
            className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer  hover:bg-red-500 hover:text-white"
            onClick={() => close()}
          >
            <IoClose size={24} />
          </span>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{
            quantity: "",
            unitSat: "",
            requisitionNumber: "",
            description: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreateItemClick}
        >
          {({ isSubmitting, values }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
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
                  className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Unidad de SAT"
                >
                  <Field
                    className="w-full outline-none resize-none border-2 !border-white cursor-pointer"
                    as="select"
                    name="unitSat"
                  >
                    <option value="">Seleccione una Opción</option>
                    {unitsSatList.map((unit, index) => (
                      <option key={index} value={unit.ID}>
                        {unit.Descripcion} - {unit.Codigo}
                      </option>
                    ))}
                  </Field>
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPageBreak size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="unitSat"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div>
                <label
                  className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Número de Requisición"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="text"
                    name="requisitionNumber"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbNumber size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="requisitionNumber"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              {values.unitSat != 2 &&
              values.unitSat != "" &&
              values.unitSat != 4 ? (
                <div>
                  <label
                    className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Descripción"
                  >
                    <Field
                      className="w-full outline-none resize-none"
                      type="text"
                      name="description"
                    />
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                      <TbAbc size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              ) : (
                <></>
              )}
              <button
                type="submit"
                disabled={isSubmitting || loader}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {loader ? <Spinner /> : "Añadir"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewItem;
