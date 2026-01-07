import { useEffect, useState } from "react";
import requests from "./requests";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { MdOutlinePhotoCamera } from "react-icons/md";
import { TbCards } from "react-icons/tb";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useUser } from "../../../Contexts/UserContext";

const UpdateBrand = () => {
  const { brandID } = useParams();
  const [brandData, setBrandData] = useState(null); // Cambiar a null
  const [previewImage, setPreviewImage] = useState(null);
  const { userData } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    requests.getBrand(brandID).then((response) => {
      setBrandData(response);
      setPreviewImage(response.Imagen);
    });
  }, [brandID]);

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("El nombre de la marca es obligario."),
    img: Yup.string().required("La imagen es obligatoria"),
  });

  const handleImageChange = (event, setFieldValue, setTouched) => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(",")[1];
        setFieldValue("img", base64String);
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      setFieldValue("img", "");
    }
    setTouched("img", true);
  };

  const handleAddBrandClick = async (values, { setSubmitting }) => {
    try {
      const object = {
        ID: brandData.ID,
        NombreCompleto: values.name,
        Imagen: values.img,
      };

      const log = {
        UsuarioID: userData.ID,
        Accion: "Editar",
        Contenido: `Edito la marca ${values.name}.`,
      };

      const response = await requests.updateBrand(object);

      if (response.data == true) {
        await requests.addLog(log);
        navigate("/Layout/Brands");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  // Asegúrate de que brandData esté disponible antes de renderizar el formulario
  if (!brandData) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/Brands">Marcas</Link> / <b>Editar Marca</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Editar Marca</p>
        <div className="line-row" />
      </div>
      <div className="bg-white w-max flex flex-col gap-2 p-5 rounded-md shadow-md">
        <p className="text-lg">Datos de la Marca</p>
        <div className="line-row" />
        <Formik
          initialValues={{
            name: brandData?.NombreCompleto || "", // Usa un valor por defecto vacío si no hay datos
            img: brandData?.Imagen || "", // Si hay una imagen existente, usarla como valor inicial
          }}
          validationSchema={validationSchema}
          onSubmit={handleAddBrandClick}
          enableReinitialize={true} // Permite que Formik se reinicialice cuando brandData cambie
        >
          {({ isSubmitting, setFieldValue, setTouched, values }) => (
            <Form className="mt-2 flex flex-col gap-5">
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
                  {values.img || previewImage ? (
                    <img
                      src={
                        values.img.startsWith("data:image")
                          ? values.img
                          : `data:image/webp;base64,${values.img}`
                      }
                      alt="Vista previa"
                      className="w-full h-full object-contain rounded-sm"
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

              <div>
                <label
                  className="inputs-placeholder w-96 relative h-14 flex flex-row gap-2 p-2 border border-zinc-400 rounded-sm"
                  data-text="Nombre de la Marca"
                >
                  <Field
                    className="w-full h-full outline-none"
                    type="text"
                    name="name"
                  />
                  <span className="min-w-10 min-h-10 bg-zinc-100 flex justify-center items-center rounded-sm text-sovetec-primary">
                    <TbCards size="20" />
                  </span>
                </label>
                <ErrorMessage
                  name="name"
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

export default UpdateBrand;
