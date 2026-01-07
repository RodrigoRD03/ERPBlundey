import { ErrorMessage, Field, Form, Formik } from "formik";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import {
  TbAbc,
  TbBoxModel,
  TbCards,
  TbCategory,
  TbCoins,
  TbNumber,
  TbQuestionMark,
} from "react-icons/tb";
import requests from "./requests";
import { FaRegCreditCard } from "react-icons/fa";
import { Tooltip } from "@radix-ui/themes";
import { useUser } from "../../../Contexts/UserContext";

const AddProduct = () => {
  const [previewImage, setPreviewImage] = useState(null);
  const [listCategories, setListCategories] = useState([]);
  const [listBrands, setListBrands] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [priceDollar, setPriceDollar] = useState("");
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getCategories().then((response) => {
      setListCategories(response);
    });
    requests.getBrands().then((response) => {
      setListBrands(response);
    });
    requests.getDollarPrice().then((response) => {
      const length = response.bmx.series[0].datos.length;
      setPriceDollar(response.bmx.series[0].datos[length - 2].dato);
    });
  }, []);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio."),
    img: Yup.mixed().required("La imagen es obligatoria."),
    partNumber: Yup.string().required("El número de parte es obligatorio."),
    shortDescription: Yup.string().required(
      "La descripción corta es obligatoria."
    ),
    longDescription: Yup.string().required(
      "La descripción larga es obligatoria."
    ),
    price: Yup.number()
      .typeError("El precio debe ser un número.")
      .positive("El precio debe ser mayor a cero.")
      .required("El precio de venta es obligatorio."),
    cost: Yup.number()
      .typeError("El costo debe ser un número.")
      .positive("El costo debe ser mayor a cero.")
      .required("El costo es obligatorio."),
    brandID: Yup.string().required("La marca es obligatoria."),
    model: Yup.string().required("El modelo es obligatorio."),
    categoryID: Yup.string().required("La categoría es obligatoria."),
  });

  const handleImageChange = (event, setFieldValue, setTouched) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFieldValue("img", { file: file, base64: reader.result }); // Guardar un objeto en lugar de solo un string
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("img", null);
    }
    setTouched("img", true);
  };

  const handleAddProductClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        Nombre: values.name,
        Imagen: values.img?.base64.split(",")[1] || "", // Extrae solo la base64
        NumeroParte: values.partNumber,
        DescripcionCorta: values.shortDescription,
        DescripcionLarga: values.longDescription,
        PrecioVenta: values.price,
        Costo: values.cost,
        MarcaID: values.brandID,
        Modelo: values.model,
        CategoriaID: values.categoryID,
        Dolar: values.dollarProducts,
      };

      console.log(object);
      

      const log = {
        UsuarioID: userData.ID,
        Accion: "Crear",
        Contenido: `Añadio el producto ${values.name}.`,
      };

      const response = await requests.addProduct(object);

      if (response == true) {
        await requests.addLog(log);
        navigate("/Layout/Products");
      } else {
        setErrorMessage("Producto ya creado.");
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
          <Link to="/Layout/Products">Productos</Link> / <b>Nuevo Producto</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Nuevo Producto</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <div className="flex justify-between">
          <p className="text-lg">Datos Producto</p>
          <Tooltip content="Los campos marcados con * aparecen en la cotización. Por defecto, se utiliza la descripción corta como título, pero si en la partida se selecciona la descripción larga, esta la reemplazará.">
            <span className="size-8 bg-sky-500 flex justify-center items-center text-white rounded-full">
              <TbQuestionMark size="18" />
            </span>
          </Tooltip>
        </div>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: "",
            img: "",
            partNumber: "",
            shortDescription: "",
            longDescription: "",
            price: "",
            cost: "",
            brandID: "",
            model: "",
            categoryID: "",
            dollarProducts: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddProductClick}
        >
          {({ isSubmitting, setFieldValue, setTouched }) => (
            <Form className="mt-2 flex flex-col gap-5 items-center">
              <div>
                <label
                  className="inputs-placeholder relative w-96 h-36 flex flex-row justify-center items-center gap-2 px-2 py-4 border border-dashed border-zinc-400 rounded-sm cursor-pointer"
                  data-text="Agregar Imagen"
                >
                  <input
                    className="w-full h-full outline-none hidden"
                    type="file"
                    name="img"
                    accept="image/png, image/jpeg"
                    onChange={(event) =>
                      handleImageChange(event, setFieldValue, setTouched)
                    }
                  />
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Vista previa"
                      className="w-full h-full  object-contain rounded-sm"
                    />
                  ) : (
                    <span className="w-28 h-28 bg-zinc-200 flex justify-center items-center text-zinc-400 rounded-full">
                      <MdOutlinePhotoCamera size={40} />
                    </span>
                  )}
                </label>
                <ErrorMessage
                  name="img"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="flex flex-row gap-4">
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Nombre"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="name"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbAbc size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className=" w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Marca *"
                      htmlFor="#brandID"
                    >
                      <Field
                        className="w-full outline-none resize-none appearance-none cursor-pointer"
                        as="select"
                        name="brandID"
                        id="brandID"
                      >
                        <option value="" disabled>
                          Selecciona una marca
                        </option>
                        {listBrands.map((brand, index) => (
                          <option key={index} value={brand.ID}>
                            {brand.NombreCompleto}
                          </option>
                        ))}
                      </Field>
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbCards size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="brandID"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Modelo *"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="model"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbBoxModel size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="model"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Categoria *"
                      htmlFor="#categoryID"
                    >
                      <Field
                        className="w-full outline-none resize-none appearance-none cursor-pointer"
                        as="select"
                        name="categoryID"
                        id="brandID"
                      >
                        <option value="" disabled>
                          Selecciona una Categoria
                        </option>
                        {listCategories.map((category, index) => (
                          <option key={index} value={category.ID}>
                            {category.Nombre}
                          </option>
                        ))}
                      </Field>
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbCategory size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="categoryID"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Numero de SAT"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="text"
                        name="partNumber"
                      />
                      <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbNumber size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="partNumber"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-32 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Descripción Corta (Titulo de la Partida)"
                    >
                      <Field
                        className="w-full h-full outline-none resize-none"
                        as="textarea"
                        name="shortDescription"
                      />
                      <span className="min-w-10 max-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbAbc size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="shortDescription"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-32 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Descripción Larga"
                    >
                      <Field
                        className="w-full h-full outline-none resize-none"
                        as="textarea"
                        name="longDescription"
                      />
                      <span className="min-w-10 max-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                        <TbAbc size="20" />
                      </span>
                    </label>
                    <ErrorMessage
                      name="longDescription"
                      component="div"
                      className="text-red-500 text-xs text-right m-0"
                    />
                  </div>
                  <div>
                    <label
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Costo"
                    >
                      <Field
                        className="w-full outline-none resize-none"
                        type="number"
                        name="cost"
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
                </div>
              </div>
              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Precio"
                >
                  <Field
                    className="w-full outline-none resize-none"
                    type="number"
                    name="price"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center  rounded-sm text-sovetec-primary">
                    <FaRegCreditCard size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 text-xs text-right m-0"
                />
              </div>
              <div className="w-full flex justify-end gap-5">
                <div className="flex items-center justify-end gap-2">
                  <label
                    htmlFor="dollarProducts"
                    className="text-gray-700 cursor-pointer flex gap-2 items-center text-sm"
                  >
                    <Field
                      type="checkbox"
                      name="dollarProducts"
                      className="hidden peer"
                      id="dollarProducts"
                    />
                    <div className="text-right">
                      <p>Producto en dolares</p>
                      <p className="text-xs">
                        Precio del Dolar: $ {priceDollar}
                      </p>
                    </div>
                    <div className="w-5 h-5 border-2 border-gray-400 rounded-md flex items-center justify-center transition peer-checked:bg-blue-500 peer-checked:border-blue-500">
                      <svg
                        className="w-4 h-4 bg-r text-white scale-100 transition-transform duration-200"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20.707 5.293a1 1 0 010 1.414l-11 11a1 1 0 01-1.414 0l-5-5a1 1 0 011.414-1.414L9 14.586l10.293-10.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
                {errorMessage && (
                  <div className=" text-red-500 text-xs text-right m-0 flex items-center">
                    <p>{errorMessage}</p>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Agregar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProduct;
