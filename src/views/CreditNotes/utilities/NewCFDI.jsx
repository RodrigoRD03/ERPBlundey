import { Callout } from "@radix-ui/themes";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { LuBadgeAlert } from "react-icons/lu";
import { useState } from "react";

const NewCFDI = ({
  usesCFDI,
  paymentsMethods,
  textSystems,
  textSystem,
  onChangeCFDI,
  orderPedido,
  typesRelationships,
  relatedInvoices,
  relatedListReturn,
  relatedDeleted,
  relatedUUID,
}) => {
  const [relatedList, setRelatedList] = useState([]);

  const validationSchema = Yup.object({
    tipoCFDI: Yup.string().required("El tipo de CFDI es obligatorio"),
    fechaCFDI: Yup.string().required("La fecha de CFDI es obligatoria"),
    regimenFiscal: Yup.string().required("El régimen fiscal es obligatorio"),
    cliente: Yup.string().required("El cliente es obligatorio"),
    usoCFDI: Yup.string().required("El uso de CFDI es obligatorio"),
    metodoPago: Yup.string().required("El método de pago es obligatorio"),
    formaPago: Yup.string().required("La forma de pago es obligatoria"),
    serie: Yup.string().required("La serie es obligatoria"),
    moneda: Yup.string().required("La moneda es obligatoria"),
    decimales: Yup.string().required("Los decimales son obligatorios"),
    ordenPedido: Yup.string()
      .required("El número de orden/pedido es obligatorio")
      .matches(/^[a-zA-Z0-9-]+$/, "Solo se permiten letras, números y guiones"),
  });

  const initialValues = {
    tipoCFDI: "nota_credito",
    fechaCFDI: "0",
    regimenFiscal: textSystem,
    cliente: "",
    usoCFDI: "",
    metodoPago: "PUE",
    formaPago: "03",
    moneda: "MXN",
    decimales: "2",
    ordenPedido: orderPedido,
    condicionesPago: "",
    numeroCuenta: "",
    precioDolar: "",
    relatedCFDI: "Si",
    tipoRelacion: "01",
    cfdiRelacionados: relatedUUID,
  };

  return (
    <div>
      <p className="text-lg">Datos de la Factura</p>
      <div className="line-row" />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => console.log(values)}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          onChangeCFDI(values);

          // 🔹 Cuando cambia el UUID relacionado
          const handleAddRelated = () => {
            if (values.tipoRelacion && values.cfdiRelacionados) {
              const exists = relatedList.some(
                (item) => item.uuid === values.cfdiRelacionados
              );
              if (!exists) {
                const newRelation = {
                  tipoRelacion: values.tipoRelacion,
                  uuid: values.cfdiRelacionados,
                };
                setRelatedList([...relatedList, newRelation]);
                relatedListReturn([...relatedList, newRelation]);
                // Limpia los campos
                setFieldValue("tipoRelacion", "");
                setFieldValue("cfdiRelacionados", "");
              }
            }
          };

          // 🔹 Eliminar un UUID de la lista
          const handleDelete = (index) => {
            const updated = relatedList.filter((_, i) => i !== index);
            setRelatedList(updated);
            relatedDeleted(updated);
          };

          return (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <Callout.Root className="self-start flex" color="amber">
                <p className="self-start text-xs w-full flex gap-2 items-center">
                  <LuBadgeAlert size={22} /> Por favor ingresa la siguiente
                  información para la creación de la factura. Los campos
                  marcados con * son obligatorios.
                </p>
              </Callout.Root>

              {/* --- PRIMERA SECCIÓN --- */}
              <div className="grid grid-cols-2 gap-4">
                {/* Tipo de CFDI */}
                <div>
                  <label
                    data-text="Tipo de CFDI *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="tipoCFDI"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione tipo</option>
                      <option value="nota_credito">Nota de Crédito</option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="tipoCFDI"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Fecha de CFDI */}
                <div>
                  <label
                    data-text="Fecha de CFDI *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="fechaCFDI"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Selecciona fecha</option>
                      <option value="0">Timbrar con fecha actual</option>
                      <option value="1">Timbrar con fecha de ayer</option>
                      <option value="2">
                        Timbrar con fecha de hace dos días
                      </option>
                      <option value="3">
                        Timbrar con fecha de hace tres días
                      </option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="fechaCFDI"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Régimen Fiscal */}
                <div>
                  <label
                    data-text="Régimen Fiscal del Emisor *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="regimenFiscal"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione régimen</option>
                      {textSystems?.map((item, i) => (
                        <option key={i} value={item.key}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="regimenFiscal"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Uso CFDI */}
                <div>
                  <label
                    data-text="Uso CFDI *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="usoCFDI"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione uso</option>
                      {usesCFDI?.map((item, i) => (
                        <option key={i} value={item.key}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="usoCFDI"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>

              {/* --- SEGUNDA SECCIÓN --- */}
              <div className="grid grid-cols-3 gap-4">
                {/* Método de pago */}
                <div>
                  <label
                    data-text="Método de pago *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="metodoPago"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione método</option>
                      <option value="PUE">Pago en una sola exhibición</option>
                      <option value="PPD">
                        Pago en parcialidades o diferido
                      </option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="metodoPago"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Forma de pago */}
                <div>
                  <label
                    data-text="Forma de pago *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="formaPago"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione forma</option>
                      {paymentsMethods?.map((item, i) => (
                        <option key={i} value={item.key}>
                          {item.name}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="formaPago"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Moneda */}
                <div>
                  <label
                    data-text="Moneda *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="moneda"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione moneda</option>
                      <option value="MXN">MXN</option>
                      <option value="USD">USD</option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="moneda"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Precio Dolar */}

                {values.moneda === "USD" && (
                  <div>
                    <label
                      data-text="Precio del Dólar *"
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        type="number"
                        name="precioDolar"
                        placeholder="Precio en Dólares"
                        className="w-full h-full outline-none border-2 border-white"
                      />
                    </label>
                    <ErrorMessage
                      name="precioDolar"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                )}

                {/* Decimales */}
                <div>
                  <label
                    data-text="Número de decimales * "
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="decimales"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione decimales</option>
                      <option value="2">2</option>
                      <option value="4">4</option>
                      <option value="6">6</option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="decimales"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Orden/Pedido */}
                <div>
                  <label
                    data-text="No. de orden/pedido *"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      type="text"
                      name="ordenPedido"
                      placeholder="No. de pedido"
                      className="w-full h-full outline-none border-2 border-white"
                    />
                  </label>
                  <ErrorMessage
                    name="ordenPedido"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>
              <div className="w-full">
                <p>Datos de Remisión</p>
                <div className="line-row" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-max self-start">
                <div>
                  <label
                    data-text="Condiciones de pago"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      type="text"
                      name="condicionesPago"
                      placeholder="Condiciones de pago"
                      className="w-full h-full outline-none border-2 border-white"
                    />
                  </label>
                  <ErrorMessage
                    name="condicionesPago"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    data-text="Número de Cuenta"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      type="text"
                      name="numeroCuenta"
                      placeholder="Número de Cuenta"
                      className="w-full h-full outline-none border-2 border-white"
                    />
                  </label>
                  <ErrorMessage
                    name="numeroCuenta"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>
              {/* === Relación CFDI === */}
              <div className="w-full mt-4">
                <p className="text-md ">Relación CFDI (SAT 4.0)</p>
                <div className="line-row" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* ¿Tiene CFDI relacionado? */}
                <div>
                  <label
                    data-text="¿Tiene CFDI relacionado?"
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                  >
                    <Field
                      as="select"
                      name="relatedCFDI"
                      className="w-full h-full outline-none border-2 border-white"
                    >
                      <option value="">Seleccione</option>
                      <option value="No">No</option>
                      <option value="Si">Sí</option>
                    </Field>
                  </label>
                </div>

                {/* Tipo de relación */}
                {values.relatedCFDI === "Si" && (
                  <div>
                    <label
                      data-text="Tipo de Relación"
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    >
                      <Field
                        as="select"
                        name="tipoRelacion"
                        className="w-full h-full outline-none border-2 border-white"
                      >
                        <option value="">Seleccione tipo</option>
                        {typesRelationships?.map((item, index) => (
                          <option key={index} value={item.key}>
                            {item.name}
                          </option>
                        ))}
                      </Field>
                    </label>
                  </div>
                )}

                {/* UUID relacionado */}
                {values.relatedCFDI === "Si" && (
                  <>
                    <div className="flex items-center gap-2">
                      <label
                        data-text="UUID relacionado"
                        className="inputs-placeholder relative w-80 h-12 flex p-2 border border-zinc-400 rounded-sm"
                      >
                        <Field
                          as="select"
                          name="cfdiRelacionados"
                          className="w-full h-full outline-none border-2 border-white"
                        >
                          <option value="">Seleccione UUID</option>
                          {relatedInvoices?.map((item, index) => (
                            <option key={index} value={item.UUID}>
                              {item.UUID}
                            </option>
                          ))}
                        </Field>
                      </label>
                    </div>
                    <div />
                    <div />
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddRelated}
                        className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white "
                      >
                        Agregar Relación
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* 🔹 Tabla de relaciones agregadas */}
              {relatedList.length > 0 && (
                <div className="mt-4 w-full">
                  <p className="text-sm font-semibold mb-2">
                    CFDIs relacionados agregados
                  </p>
                  <table className="min-w-full border border-gray-300 text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border px-2 py-1">Tipo relación</th>
                        <th className="border px-2 py-1">UUID relacionado</th>
                        <th className="border px-2 py-1">Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {relatedList.map((item, index) => (
                        <tr key={index}>
                          <td className="border px-2 py-1 text-center">
                            {item.tipoRelacion}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            {item.uuid}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <button
                              type="button"
                              onClick={() => handleDelete(index)}
                              className="text-red-600 hover:underline"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};

export default NewCFDI;
