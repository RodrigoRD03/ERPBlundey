import { ErrorMessage, Field, Form, Formik } from "formik"; 
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import requests from "./requests";
import { TbCards, TbCoins, TbPlus } from "react-icons/tb";

const InsertReferral = () => {
  const { id } = useParams();
  const [missings, setMissings] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");
  const [errorMessageDelivery, setErrorMessageDelivery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    requests.getMissingReferralsSales(id).then((response) => {
      setMissings(response);
      console.log("Productos faltantes:", response);
    });
  }, [id]);

  const handleSelectChange = (e, setFieldValue) => {
    const selectedDesc = e.target.value;
    const product = missings.find((m) => m.Descripcion === selectedDesc);
    setSelectedProduct(product);
    // Autollenamos el costo o cantidad si existe
    setFieldValue("cost", product?.Cantidad || 0);
  };

  const handleAddProduct = (values, resetForm) => {
    if (!selectedProduct) return;

    const newItem = {
      ...selectedProduct,
      Cantidad: values.cost || selectedProduct.Cantidad || 0,
    };

    setSelectedItems([...selectedItems, newItem]);

    // Eliminar producto de la lista
    const updated = missings.filter(
      (m) => m.Descripcion !== selectedProduct.Descripcion
    );
    setMissings(updated);

    // Reset
    setSelectedProduct(null);
    resetForm();
  };

  const handleDateChange = (e) => {
    setDeliveryDate(e.target.value);
  };

  const handleInsertReferralClick = async () => {
    if (!deliveryDate) {
      setErrorMessageDelivery("La fecha de entrega es obligatoria.");
      return;
    }
    const dateObj = new Date(deliveryDate);
    const object = {
      FechaEntrega: dateObj.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      OrdenVentaID: id,
      Detalles: selectedItems,
    };

    console.log(object);
    const response = await requests.insertReferral(object);
    if (response) {
      console.log(response);
      navigate("/Layout/Referrals");
    } else {
      alert("Error al insertar la remisión. Intente nuevamente.");
    }
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Referrals">Remisiones</Link> /{" "}
          <b>Insertar Remisión</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Insertar Remisión</p>
      </div>

      <div className="line-row" />

      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <div className="flex justify-between">
          <p className="text-lg">Datos de la Remisión</p>
        </div>

        <div className="line-row" />
        <div>
          <label
            className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
            data-text="Fecha  de Entrega"
          >
            <input
              className="w-full outline-none resize-none"
              type="date"
              value={deliveryDate}
              onChange={handleDateChange}
            />
            {errorMessageDelivery && (
              <div className="text-red-500 text-xs text-right m-0">
                {errorMessageDelivery}
              </div>
            )}
          </label>
        </div>

        <Formik
          initialValues={{
            date: "",
            brandID: "",
            cost: "",
          }}
          onSubmit={(values, { resetForm }) =>
            handleAddProduct(values, resetForm)
          }
        >
          {({ isSubmitting, setFieldValue, values }) => (
            <Form className="mt-2 flex flex-col gap-5">
              {/* SELECT de productos */}
              <div className="flex gap-2">
                <div>
                  <label
                    className="w-96 relative h-14 flex gap-2 p-2 border border-zinc-400 rounded-sm"
                    data-text="Producto *"
                    htmlFor="brandID"
                  >
                    <Field
                      as="select"
                      name="brandID"
                      id="brandID"
                      className="w-full outline-none resize-none appearance-none cursor-pointer"
                      onChange={(e) => handleSelectChange(e, setFieldValue)}
                    >
                      <option value="">Selecciona un producto</option>
                      {missings.map((item, index) => (
                        <option key={index} value={item.Descripcion}>
                          {item.Descripcion}
                        </option>
                      ))}
                    </Field>
                    <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                      <TbCards size="20" />
                    </span>
                  </label>
                  <ErrorMessage
                    name="brandID"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Input de cantidad o costo */}
                {selectedProduct && (
                  <div>
                    <label
                      className="inputs-placeholder w-36 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Cantidad"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
                        name="cost"
                        value={values.cost}
                        onChange={(e) => setFieldValue("cost", e.target.value)}
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbCoins size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="cost"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                )}
              </div>

              {/* Botón agregar */}
              <button
                type="submit"
                disabled={isSubmitting || !selectedProduct}
                className="self-end w-max border-2 border-emerald-500 px-3 py-2 text-emerald-500 rounded-lg font-semibold tracking-wide cursor-pointer hover:bg-emerald-500 hover:text-white text-sm"
              >
                <TbPlus size={20} className="inline-block ml-2" /> Agregar
              </button>
            </Form>
          )}
        </Formik>
        <div className="line-row" />
        {/* Tabla de productos seleccionados */}
        {selectedItems.length > 0 && (
          <div className="mt-5">
            <table className="border-collapse border border-zinc-400 text-sm">
              <thead>
                <tr className="bg-zinc-100">
                  <th className="border border-zinc-400 px-2 py-1">
                    Descripción
                  </th>
                  <th className="border border-zinc-400 px-2 py-1">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item, i) => (
                  <tr key={i}>
                    <td className="border border-zinc-400 px-2 py-1 max-w-96">
                      {item.Descripcion}
                    </td>
                    <td className="border border-zinc-400 px-2 py-1 text-center">
                      {item.Cantidad}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button
          type="submit"
          //   disabled={isSubmitting}
          className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
          onClick={handleInsertReferralClick}
        >
          Terminar Remisión
        </button>
      </div>
    </div>
  );
};

export default InsertReferral;
