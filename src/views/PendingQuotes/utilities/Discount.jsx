import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { IoClose } from "react-icons/io5";
import { TbPercentage } from "react-icons/tb";
import { useUser } from "../../../Contexts/UserContext";
import { p } from "@table-library/react-table-library/styles-492c6342";
import requests from "./requests";

const Discount = ({ itemID, close }) => {
  const { userData } = useUser();

  const getMaxDiscount = () => {
    if (userData?.Roles == "Vendedor Comisionista") return 10;
    if (userData?.Roles == "Vendedor con Sueldo + Comisión") return 10;
    if (userData?.Roles == "Supervisor") return 40;
    return 0; // Si no es Admin ni Supervisor, no permite descuento
  };

  const validationSchema = Yup.object().shape({
    discount: Yup.number()
      .typeError("El descuento debe ser un número válido.")
      .required("La cantidad es obligatoria.")
      .min(0, "No puedes añadir un descuento menor a 0%")
      .max(
        getMaxDiscount(),
        `No puedes añadir un descuento mayor del ${getMaxDiscount()}%`
      ),
  });

  const handleAddDiscountClick = async (values, { setSubmitting }) => {
    try {
      const response = await requests.addDiscountItem(itemID, values.discount);
      
      if (response) {
        window.location.reload();
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
          <p className="text-lg font-bold flex items-center">
            Agregar Descuento
          </p>
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
            discount: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddDiscountClick}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5">
              <div>
                <label
                  className="inputs-placeholder w-full relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Descuento"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="discount"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <TbPercentage size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="discount"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
              >
                Añadir
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Discount;
