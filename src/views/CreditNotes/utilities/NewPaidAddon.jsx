import NewCFDI from "./NewCFDI";
import Concepts from "./Concepts";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import requests from "./requests";
import { useState, useEffect } from "react";

const NewPaidAddon = () => {
  const { UID } = useParams();
  const [dataForms, setDataForms] = useState([]);
  const [usesCFDI, setUsesCFDI] = useState([]);
  const [paymentsMethods, setPaymentsMethods] = useState([]);
  const [textSystems, setTextSystems] = useState([]);
  const [keyUnits, setKeyUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cfdiData, setCfdiData] = useState({});
  const [concepts, setConcepts] = useState([]);
  const [textSystem, setTextSystem] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const navigate = useNavigate();
  const [ID, setID] = useState(null);

  const fetchGetDataForms = async () => {
    try {
      setLoading(true);
      const response = await requests.getDataForms(UID);
      console.log("fack", response);
      setDataForms(response || []);
      setUsesCFDI(response?.UsosCfdi || []);
      setPaymentsMethods(response?.FormasPago || []);
      setTextSystems(response?.RegimenFiscal || []);
      setKeyUnits(response?.Conceptos?.ClavesUnidad || []);
      setTextSystem(response?.cliente.RegimenId || null);
      setID(response.OrdenVentaID || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGetDataForms();
  }, []);

  useEffect(() => {
    console.log("Concepts updated:", concepts);
  }, [concepts]);

  const handleCreatePaidAddon = async (values, { setSubmitting }) => {
    // 🔄 Transformar relaciones antes de enviarlas
    // --- 🔄 Construir CfdiRelacionados según los datos del formulario ---
    let cfdiRelacionadosFormatted = [];
    console.log("hola");

    // Caso 1: Si se eligió un CFDI relacionado simple
    if (relatedList?.tipoRelacion && relatedList?.cfdiRelacionados) {
      cfdiRelacionadosFormatted = [
        {
          TipoRelacion: relatedList.tipoRelacion,
          UUID: [relatedList.cfdiRelacionados], // 👈 Ojo: aquí usas cfdiRelacionados, no uuid
        },
      ];
    }

    // Caso 2: Si vienes de un arreglo acumulado (por si luego agregas varios)
    else if (Array.isArray(relatedList) && relatedList.length > 0) {
      const grouped = {};

      relatedList.forEach((rel) => {
        if (!grouped[rel.tipoRelacion]) grouped[rel.tipoRelacion] = [];
        grouped[rel.tipoRelacion].push(rel.uuid);
      });

      cfdiRelacionadosFormatted = Object.entries(grouped).map(
        ([tipo, uuids]) => ({
          TipoRelacion: tipo,
          UUID: uuids,
        })
      );
    }

    try {
      const object = {
        Receptor: {
          UID: dataForms?.cliente?.UID || "",
        },
        TipoDocumento: cfdiData.tipoCFDI,
        RegimenFiscal: cfdiData.regimenFiscal,
        Conceptos: concepts,
        UsoCFDI: cfdiData.usoCFDI,
        Serie: 5488075,
        FormaPago: cfdiData.formaPago,
        MetodoPago: cfdiData.metodoPago,
        Moneda: cfdiData.moneda,
        EnviarCorreo: values.mail,
        Comentarios: values.comments,
        NumOrder: cfdiData.ordenPedido,
        PrecioDolar: cfdiData.moneda == "USD" ? cfdiData.precioDolar : 0,
        BorradorSiFalla: "0",
        Draft: "0",
        FechaFromAPI: cfdiData.fechaCFDI,
        CfdiRelacionados: cfdiRelacionadosFormatted,
      };

      console.log(object);

      const response = await requests.insertPaidAddon(ID, object);
      console.log(response);

      response.Success
        ? navigate("/Layout/InvoicesPendingIssue")
        : setErrorMessage(
            response.Error.message || "Error al crear la factura"
          );
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  console.log(relatedList);

  if (loading) {
    // 👇 Loader visible mientras se cargan los datos
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-sovetec-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600 text-sm">Cargando información...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/CreditNotes">Notas de Crédito</Link> /{" "}
          <b>Nueva Factura</b>
        </p>
        <p className="text-lg font-bold">Nueva Factura</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md mb-12">
        <NewCFDI
          usesCFDI={usesCFDI}
          paymentsMethods={paymentsMethods}
          textSystems={textSystems}
          textSystem={textSystem}
          onChangeCFDI={(values) => {
            setCfdiData(values);
          }}
          orderPedido={dataForms?.Orden || ""}
          typesRelationships={dataForms?.TiposRelacion.data || []}
          relatedInvoices={dataForms?.FacturasRelacionar || []}
          relatedListReturn={(newRelatedList) => setRelatedList(newRelatedList)}
          relatedDeleted={(updatedRelatedList) =>
            setRelatedList(updatedRelatedList)
          }
          relatedUUID={dataForms?.FacturaRelacionadaUUID || []}
        />
        <Concepts
          keyUnits={keyUnits}
          dataProduct={
            dataForms?.Conceptos.PosiblesProductosServiciosPorFacturar || []
          }
          conceptsReturn={(newConcept) =>
            setConcepts([...concepts, newConcept])
          }
          conceptDeleted={(updatedConcepts) => setConcepts(updatedConcepts)}
        />
        <Formik
          initialValues={{
            comments: "",
            mail: "",
          }}
          // validationSchema={validationSchema}
          onSubmit={handleCreatePaidAddon}
        >
          {({ isSubmitting }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div className="self-start">
                <label
                  className="inputs-placeholder relative w-96 h-45 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Comentarios"
                >
                  <Field
                    className="w-96 h-full outline-none border-2 border-white resize-none"
                    as="textarea"
                    name="comments"
                  />
                </label>
                <ErrorMessage
                  name="comments"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>

              <div className="flex justify-between w-full">
                <div>
                  <label htmlFor="" className="flex gap-2">
                    <Field name="mail">
                      {({ field }) => (
                        <input
                          {...field}
                          type="checkbox"
                          id="mail"
                          checked={field.value}
                        />
                      )}
                    </Field>
                    Enviar por correo electrónico
                  </label>
                </div>
              </div>

              <div className="w-full flex flex-col justify-end gap-5">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Generar CFDI
                </button>
                {errorMessage && (
                  <div className="text-red-500 text-sm self-end max-w-116 text-right">
                    {errorMessage}
                  </div>
                )}
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default NewPaidAddon;
