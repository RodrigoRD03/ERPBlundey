import { Callout } from "@radix-ui/themes";
import { ErrorMessage, Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { LuBadgeAlert } from "react-icons/lu";

const Concepts = ({
  keyUnits,
  dataProduct,
  conceptsReturn,
  conceptDeleted,
}) => {
  const [concepts, setConcepts] = useState([]);
  const [globalData, setGlobalData] = useState({});
  const [quantity, setQuantity] = useState(0);

  const validationSchema = Yup.object({
    descripcion: Yup.string().required("La descripción es obligatoria"),
    cantidad: Yup.number()
      .typeError("La cantidad debe ser un número")
      .required("La cantidad es obligatoria")
      .positive("Debe ser mayor a 0")
      .max(quantity, `No puede ser mayor a ${quantity}`),
    unidad: Yup.string().required("La unidad es obligatoria"),
    precioUnitario: Yup.number()
      .typeError("Debe ser un número válido")
      .required("El precio unitario es obligatorio")
      .min(0, "No puede ser negativo"),
    objetoImpuesto: Yup.string().required("Selecciona objeto de impuesto"),
    claveSAT: Yup.string()
      .required("La clave SAT es obligatoria")
      .matches(/^[0-9]+$/, "Debe contener solo números"),
  });

  const initialValues = {
    descripcion: "",
    descripcionAnticipo: "",
    cantidad: "",
    unidad: "H87",
    precioUnitario: "",
    iva: "",
    tieneIEPS: false,
    tieneIVA: true,
    retIVA: false,
    retISR: false,
    ivaPorcentaje: "16",
    iepsPorcentaje: "",
    retIVAPorcentaje: "",
    retISRPorcentaje: "",
    objetoImpuesto: "02",
    sku: "",
    claveSAT: "",
    complemento: "",
  };

  useEffect(() => {
    console.log(globalData);
  }, [globalData]);

  const handleDelete = (index) => {
    const updated = concepts.filter((_, i) => i !== index);
    setConcepts(updated);

    if (conceptDeleted) {
      conceptDeleted(updated);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-lg">Conceptos</p>
        <div className="line-row" />
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          conceptsReturn({
            ClaveProdServ: values.claveSAT,
            Cantidad: values.cantidad,
            ClaveUnidad: values.unidad,
            Unidad: keyUnits?.find((item) => item.key === values.unidad)?.name,
            ValorUnitario: values.precioUnitario,
            Importe: (values.cantidad * values.precioUnitario).toFixed(2),
            Descripcion:
              values.descripcion == "Anticipo"
                ? values.descripcionAnticipo
                : dataProduct?.find(
                    (item) => item.Descripcion === values.descripcion
                  )?.Descripcion,
            ObjetoImp: values.objetoImpuesto,
            NoIdentificacion: values.sku,
            Impuestos: {
              Traslados: [
                values.tieneIVA && {
                  Base: values.cantidad * values.precioUnitario,
                  Impuesto: "002",
                  TipoFactor: "Tasa",
                  TasaOCuota: Number(values.ivaPorcentaje) / 100,
                  Importe: (
                    (values.cantidad *
                      values.precioUnitario *
                      Number(values.ivaPorcentaje)) /
                    100
                  ).toFixed(2),
                },
                values.tieneIEPS && {
                  Base: values.cantidad * values.precioUnitario,
                  Impuesto: "001",
                  TipoFactor: "Tasa",
                  TasaOCuota: Number(values.iepsPorcentaje) / 100,
                  Importe: (
                    (values.cantidad *
                      values.precioUnitario *
                      Number(values.iepsPorcentaje)) /
                    100
                  ).toFixed(2),
                },
              ].filter(Boolean), // 👈 filtra los falsos
            },
          });
          const importe = (values.cantidad || 0) * (values.precioUnitario || 0);
          const newConcept = { ...values, importe };
          setConcepts([...concepts, newConcept]);
          resetForm();
        }}
      >
        {({ isSubmitting, values, setFieldValue }) => {
          setGlobalData(values);
          useEffect(() => {
            const selected = dataProduct?.find(
              (item) => item.Descripcion === values.descripcion
            );
            if (selected) {
              setFieldValue("sku", selected.NoIdentificacion || "");
              setFieldValue("claveSAT", selected.ClaveProdServ || "");
              setFieldValue("precioUnitario", selected.ValorUnitario || "");
              setFieldValue("cantidad", selected.Cantidad || "");
              setQuantity(selected.Cantidad || 0);
            }
            if (values.descripcion == "Anticipo") {
              setFieldValue("unidad","ACT");
            }
          }, [values.descripcion, dataProduct, setFieldValue]);

          return (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <Callout.Root className="self-start flex w-max" color="amber">
                <p className="self-start text-xs w-full flex gap-2 items-center">
                  <LuBadgeAlert size={22} /> Por favor ingresa la siguiente
                  información y después haz clic en “Agregar concepto” para
                  añadirlo al CFDI.
                </p>
              </Callout.Root>

              {/* --- Descripción --- */}
              <div className="flex gap-5 self-start">
                <div className="self-start flex flex-col w-max">
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Descripción"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="descripcion"
                    >
                      <option value="">Seleccionar</option>
                      {dataProduct?.map((item, index) => (
                        <option key={index} value={item.Descripcion}>
                          {item.Descripcion}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="descripcion"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                {values.descripcion == "Anticipo" && (
                  <div>
                    <label
                      className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                      data-text="Descripción del Anticipo"
                    >
                      <Field
                        className="w-full h-full outline-none border-2 border-white"
                        type="text"
                        name="descripcionAnticipo"
                        placeholder="Descripción del Anticipo"
                      />
                    </label>
                    <ErrorMessage
                      name="descripcionAnticipo"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                )}
              </div>
              {/* --- Cantidad, Unidad, Precio Unitario --- */}
              <div className="grid grid-cols-3 gap-4">
                {/* Cantidad */}
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Cantidad"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      type="number"
                      name="cantidad"
                      placeholder="Ej: 5"
                    />
                  </label>
                  <ErrorMessage
                    name="cantidad"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Unidad */}
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Unidad"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="unidad"
                    >
                      <option value="">Seleccionar</option>
                      {keyUnits?.map((item, index) => (
                        <option key={index} value={item.key}>
                          {item.key} - {item.name}
                        </option>
                      ))}
                    </Field>
                  </label>
                  <ErrorMessage
                    name="unidad"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Precio Unitario */}
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Precio unitario"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      type="number"
                      name="precioUnitario"
                      placeholder="0.00"
                    />
                  </label>
                  <ErrorMessage
                    name="precioUnitario"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>

                {/* Importe */}
                <div>
                  <p>Importe</p>
                  <p>{values.precioUnitario.toLocaleString("en-US")}</p>
                </div>
              </div>

              {/* --- Impuestos --- */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {/* IVA e IEPS */}
                <div className="flex w-full gap-4">
                  <div className="flex flex-col gap-4 border border-zinc-300 rounded-md w-full p-3 grid-flow-col-dense">
                    <p>Traslados</p>

                    {/* --- IVA --- */}
                    <div className="flex items-center gap-8 w-full justify-between">
                      <div className="flex gap-2 items-center">
                        <Field name="tieneIVA">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="checkbox"
                              id="tieneIVA"
                              checked={field.value}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                form.setFieldValue("tieneIVA", checked);
                                // Si activa IVA, desactiva IEPS
                                if (checked) {
                                  form.setFieldValue("tieneIEPS", false);
                                }
                              }}
                            />
                          )}
                        </Field>
                        <label htmlFor="tieneIVA">IVA</label>
                      </div>

                      <div>
                        <label className="inputs-placeholder relative w-max h-12 flex p-2 border border-zinc-400 rounded-sm">
                          <Field
                            className="w-full h-full outline-none border-2 border-white"
                            as="select"
                            name="ivaPorcentaje"
                          >
                            <option value="">Selec.</option>
                            <option value="16">16%</option>
                            <option value="8">8%</option>
                            <option value="4">4%</option>
                            <option value="0">0%</option>
                          </Field>
                        </label>
                        <ErrorMessage
                          name="ivaPorcentaje"
                          component="div"
                          className="text-red-500 text-xs text-right m-0"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>
                          $
                          {(() => {
                            const base =
                              Number(values.precioUnitario || 0) *
                              Number(values.cantidad || 1);
                            const ieps = values.tieneIEPS
                              ? base *
                                (Number(values.iepsPorcentaje || 0) / 100)
                              : 0;
                            const iva = values.tieneIVA
                              ? (base + ieps) *
                                (Number(values.ivaPorcentaje || 0) / 100)
                              : 0;
                            return iva.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            });
                          })()}
                        </label>
                      </div>
                    </div>

                    {/* --- IEPS --- */}
                    <div className="flex items-center gap-8 w-full justify-between">
                      <div className="flex gap-2 items-center">
                        <Field name="tieneIEPS">
                          {({ field, form }) => (
                            <input
                              {...field}
                              type="checkbox"
                              id="tieneIEPS"
                              checked={field.value}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                form.setFieldValue("tieneIEPS", checked);
                                // Si activa IEPS, desactiva retIVA
                                if (checked) {
                                  form.setFieldValue("retIVA", false);
                                }
                              }}
                            />
                          )}
                        </Field>
                        <label htmlFor="tieneIEPS">IEPS</label>
                      </div>

                      <div>
                        <label className="inputs-placeholder relative w-max h-12 flex p-2 border border-zinc-400 rounded-sm">
                          <Field
                            className="w-full h-full outline-none border-2 border-white"
                            as="select"
                            name="iepsPorcentaje"
                          >
                            <option value="">Selec.</option>
                            <option value="160">160%</option>
                            <option value="53">53%</option>
                            <option value="50">50%</option>
                            <option value="30.4">30.4%</option>
                            <option value="26.5">26.5%</option>
                            <option value="25">25%</option>
                            <option value="9">9%</option>
                            <option value="8">8%</option>
                            <option value="7">7%</option>
                            <option value="6">6%</option>
                          </Field>
                        </label>
                        <ErrorMessage
                          name="iepsPorcentaje"
                          component="div"
                          className="text-red-500 text-xs text-right m-0"
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <label>
                          $
                          {(() => {
                            const base =
                              Number(values.precioUnitario || 0) *
                              Number(values.cantidad || 1);
                            const ieps = values.tieneIEPS
                              ? base *
                                (Number(values.iepsPorcentaje || 0) / 100)
                              : 0;
                            return ieps.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                            });
                          })()}
                        </label>
                      </div>
                    </div>

                    {/* --- TOTAL --- */}
                    <div className="flex justify-end mt-2 border-t border-zinc-300 pt-2">
                      <p className="text-sm font-semibold">
                        Total con impuestos:&nbsp;
                        {(() => {
                          const base =
                            Number(values.precioUnitario || 0) *
                            Number(values.cantidad || 1);
                          const ieps = values.tieneIEPS
                            ? base * (Number(values.iepsPorcentaje || 0) / 100)
                            : 0;
                          const iva = values.tieneIVA
                            ? (base + ieps) *
                              (Number(values.ivaPorcentaje || 0) / 100)
                            : 0;
                          const total = base + ieps + iva;
                          return `$${total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                          })}`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- Descuento y Objeto de impuesto --- */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Objeto de impuesto"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      as="select"
                      name="objetoImpuesto"
                    >
                      <option value="">Seleccionar</option>
                      <option value="01">No objeto de impuesto</option>
                      <option value="02">Sí objeto de impuesto</option>
                      <option value="03">
                        Sí objeto de impuesto y no obligado al desglose
                      </option>
                      <option value="04">
                        Sí objeto de impuesto y no causa impuesto
                      </option>
                    </Field>
                  </label>
                  <ErrorMessage
                    name="objetoImpuesto"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>{" "}
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="SKU"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      type="text"
                      name="sku"
                      placeholder="Código ID (SKU)"
                    />
                  </label>
                  <ErrorMessage
                    name="sku"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
                <div>
                  <label
                    className="inputs-placeholder relative w-96 h-12 flex p-2 border border-zinc-400 rounded-sm"
                    data-text="Clave SAT"
                  >
                    <Field
                      className="w-full h-full outline-none border-2 border-white"
                      type="text"
                      name="claveSAT"
                      placeholder="Clave de SAT"
                    />
                  </label>
                  <ErrorMessage
                    name="claveSAT"
                    component="div"
                    className="text-red-500 text-xs text-right m-0"
                  />
                </div>
              </div>

              {/* --- Botón --- */}
              <div className="w-full flex justify-end gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Agregar Concepto
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
      {concepts.length > 0 && (
        <div className="mt-6">
          <p className="text-lg font-semibold mb-2">Conceptos agregados</p>
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">Descripción</th>
                <th className="border px-2 py-1">Cantidad</th>
                <th className="border px-2 py-1">Unidad</th>
                <th className="border px-2 py-1">Precio</th>
                <th className="border px-2 py-1">Importe</th>
                <th className="border px-2 py-1">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {concepts.map((concept, index) => (
                <tr key={index} className="text-center">
                  <td className="border px-2 py-1 w-96">
                    {concept.descripcion}
                  </td>
                  <td className="border px-2 py-1">{concept.cantidad}</td>
                  <td className="border px-2 py-1">{concept.unidad}</td>
                  <td className="border px-2 py-1">
                    ${concept.precioUnitario}
                  </td>
                  <td className="border px-2 py-1">
                    ${concept.importe.toFixed(2)}
                  </td>
                  <td className="border px-2 py-1">
                    <button
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
    </div>
  );
};

export default Concepts;
