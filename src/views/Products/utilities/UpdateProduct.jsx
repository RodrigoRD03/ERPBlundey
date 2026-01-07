import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import requests from "./requests";
import { MdOutlinePhotoCamera } from "react-icons/md";
import {
  TbAbc,
  TbBoxModel,
  TbCards,
  TbCategory,
  TbCoins,
  TbNumber,
} from "react-icons/tb";
import { FaRegCreditCard } from "react-icons/fa";
import { useUser } from "../../../Contexts/UserContext";

const UpdateProduct = () => {
  const { productID } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState(null);
  const [listCategories, setListCategories] = useState([]);
  const [listBrands, setListBrands] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const { userData } = useUser();

  useEffect(() => {
    requests.getProduct(productID).then((response) => {
      setProductData(response);
      setPreviewImage(`data:image/png;base64,${response.Imagen}`);
    });
    requests.getCategories().then(setListCategories);
    requests.getBrands().then(setListBrands);
  }, [productID]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es obligatorio."),
    img: Yup.mixed().nullable(),
    partNumber: Yup.string().required("El número de parte es obligatorio."),
    shortDescription: Yup.string().required(
      "La descripción corta es obligatoria."
    ),
    longDescription: Yup.string().required(
      "La descripción larga es obligatoria."
    ),
    price: Yup.number()
      .positive("El precio debe ser mayor a cero.")
      .required("El precio es obligatorio."),
    cost: Yup.number()
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
        setFieldValue("img", { file, base64: reader.result });
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("img", null);
    }
    setTouched("img", true);
  };

  const handleUpdateProduct = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: productData.ID,
        Nombre: values.name,
        Imagen: values.img?.base64
          ? values.img.base64.split(",")[1]
          : productData.Imagen, // Mantener la imagen original si no se cambia
        NumeroParte: values.partNumber,
        DescripcionCorta: values.shortDescription,
        DescripcionLarga: values.longDescription,
        PrecioVenta: values.price,
        Costo: values.cost,
        MarcaID: values.brandID,
        Modelo: values.model,
        CategoriaID: values.categoryID,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Editar",
        Contenido: `Edito el producto ${values.name}.`,
      };

      const response = await requests.updateProduct(object);

      if (response) {
        await requests.addLog(log);
        navigate("/Layout/Products");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return productData ? (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Products">Productos</Link> /{" "}
          <b>Actualizar Producto</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Actualizar Producto</p>
      </div>
      <div className="line-row" />
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos del Producto</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: productData.Nombre,
            img: "",
            partNumber: productData.NumeroParte,
            shortDescription: productData.DescripcionCorta,
            longDescription: productData.DescripcionLarga,
            price: productData.PrecioVenta,
            cost: productData.Costo,
            brandID: productData.MarcaID,
            model: productData.Modelo,
            categoryID: productData.CategoriaID,
          }}
          validationSchema={validationSchema}
          onSubmit={handleUpdateProduct}
          enableReinitialize
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
                      className="inputs-placeholder w-96 relative h-14 flex flex-rowd gap-2 p-2 border border-zinc-400 rounded-sm"
                      data-text="Marca"
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
                      data-text="Modelo"
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
                      data-text="Categoria"
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
                      data-text="Descripción Corta"
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
                        type="text"
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
                    type="text"
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
              <div className="w-full flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="self-end w-64 border-2 border-sovetec-primary px-3 py-2 text-sovetec-primary rounded-lg font-bold tracking-wide cursor-pointer hover:bg-sovetec-primary hover:text-white"
                >
                  Actualizar
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  ) : (
    <p>Cargando...</p>
  );
};

export default UpdateProduct;
