import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import requests from "./requests";
import {
  TbDownload,
  TbFile,
  TbPaperclip,
  TbSend,
  TbUser,
} from "react-icons/tb";
import { useUser } from "../../../Contexts/UserContext";
import Files from "./FIles";
import { Tooltip } from "@radix-ui/themes";

const FilesComments = ({ commentID }) => {
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    requests.getCommentsFilesGroupTask(commentID).then((response) => {
      setFilesList(response);
    });
  }, []);

  const handleDownloadFileClick = (ID, name) => {
    requests.downloadFileForGroupTask(ID).then((response) => {
      const base64Data = response.split(",")[1];

      const downloadLink = document.createElement("a");
      downloadLink.href = `data:application/pdf;base64,${base64Data}`;
      downloadLink.download = `${name}`;
      downloadLink.click();
    });
  };

  return (
    <>
      {filesList.length > 0 && (
        <div>
          {filesList.map((file, index) => (
            <div
              key={index}
              className="flex justify-between gap-2 bg-zinc-50 p-1 rounded-full border border-zinc-200 cursor-pointer"
              onClick={() =>
                handleDownloadFileClick(file.ID, file.NombreArchivo)
              }
            >
              <div className="flex items-center gap-2">
                <span className="bg-white size-10 border border-zinc-500 flex justify-center items-center rounded-full">
                  <TbFile />
                </span>
                <Tooltip content={file.NombreArchivo}>
                  <p className="text-sm truncate max-w-[140px] font-semibold">
                    {file.NombreArchivo}
                  </p>
                </Tooltip>
              </div>
              <span className="size-10 bg-white border border-blue-400 flex justify-center items-center rounded-full text-blue-400 hover:bg-blue-400 hover:text-white">
                <TbDownload />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const Comments = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const { userData } = useUser();
  const [fileName, setFileName] = useState("");
  const [fileNameWithoutExt, setFileNameWithoutExt] = useState("");
  const [fileBase64, setFileBase64] = useState("");
  const [comment, setComment] = useState("");
  const [commentsList, setCommentsList] = useState([]);

  useEffect(() => {
    requests.getGroupTask(id).then((response) => {
      console.log(response);
      setTitle(response.Titulo);
      setDescription(response.Descripcion);
      setDate(response.Fecha);
      // setFileName(response.NombreArchivo);
    });
    requests.getCommentsGroupTask(id).then((response) => {
      setCommentsList(response);
    });
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // quitar el header
      setFileBase64(base64String);
    };
    reader.readAsDataURL(file);

    const name = file.name;
    setFileName(name);
    setFileNameWithoutExt(name.replace(/\.pdf$/i, ""));
  };

  const handelCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleAddCommentClick = async (e) => {
    e.preventDefault();

    // Verificar que haya un comentario
    if (comment.trim() === "") {
      return;
    }

    // Objeto del comentario
    const commentObject = {
      Respuesta: comment,
      UsuarioID: userData.ID,
      ActividadesCompartidasID: id,
    };

    // Guardar comentario
    const response = await requests.addCommentGroupTask(commentObject);

    // Solo subir archivo si se seleccionó uno
    if (response && fileBase64 !== "") {
      const fileObject = {
        Archivo: fileBase64,
        NombreArchivo: fileNameWithoutExt,
        RespuestasActividadesCompartidasID: response,
      };
      await requests.addCommentFileGroupTask(fileObject);
    }

    // Recargar la vista
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/GroupTasks">Tareas Compartidas</Link> /
          <b>Comentarios</b>
        </p>
        <p className="text-lg font-bold tracking-wide">Comentarios</p>
      </div>
      <div className="line-row" />
      <div className="bg-white max-w-[1000px] flex flex-col justify-between gap-2 p-4 rounded-xl">
        <div className="p-2 flex justify-between w-full border border-dashed border-zinc-300 rounded-lg">
          <div className="max-w-180 flex flex-col gap-2">
            <p className="font-semibold text-base">{title}</p>
            <p className="text-sm">{description}</p>
            <Files taskID={id} />
          </div>
          <div className="text-sm flex flex-col gap-1 ">
            <p>Fecha y hora de creación:</p>
            <p className="font-semibold">{date}</p>
          </div>
        </div>

        <div className="line-row" />
        <div className="w-full border border-zinc-300 flex flex-col gap-2 p-2 rounded">
          {commentsList.map((item, index) => (
            <div key={index}>
              {item.NombreUsuario == userData.NombreCompleto ? (
                <div className="w-full px-2 flex justify-end gap-2">
                  <FilesComments commentID={item.ID} />
                  <div className="max-w-96 flex flex-col bg-blue-400 px-4 py-2 rounded-tl rounded-bl rounded-br">
                    <p className="text-end text-xs text-zinc-200">Tú</p>
                    <p className="text-sm text-white text-end">
                      {item.Respuesta}
                    </p>
                    <p className="text-end text-[10px] text-blue-200">
                      {item.Fecha}
                    </p>
                  </div>
                  <span className="size-8 border border-zinc-400 text-zinc-400 rounded-full flex justify-center items-center">
                    <TbUser />
                  </span>
                </div>
              ) : (
                <div className="w-full px-2 flex gap-2">
                  <span className="size-8 border border-zinc-400 text-zinc-400 rounded-full flex justify-center items-center">
                    <TbUser />
                  </span>
                  <div className="max-w-96 flex flex-col bg-purple-400 px-4 py-2 rounded-tr rounded-bl rounded-br">
                    <p className=" text-xs text-zinc-200 max-w-42 truncate">
                      {item.NombreUsuario}
                    </p>
                    <p className="text-sm text-white">{item.Respuesta}</p>
                    <p className="text-[10px] text-purple-200">{item.Fecha}</p>
                  </div>
                  <FilesComments commentID={item.ID} />
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          className="border border-zinc-300 flex flex-col justify-between rounded"
          onSubmit={handleAddCommentClick}
        >
          <div className="w-full px-4 flex items-center gap-4 py-2">
            <div className="w-full">
              <input
                className="w-full h-12 px-2 outline-none"
                type="text"
                value={comment}
                onChange={handelCommentChange}
                placeholder="Responder.."
              />
            </div>
            {fileName ? (
              <div className="w-max h-12 border border-dashed rounded flex justify-center items-center border-zinc-300 bg-zinc-100 px-4 text-sm text-zinc-600 ">
                <p>{fileName}</p>
              </div>
            ) : (
              <label
                htmlFor="document"
                className="min-w-10 min-h-10 flex justify-center items-center rounded-full cursor-pointer hover:bg-zinc-100"
              >
                <input
                  className="hidden"
                  type="file"
                  id="document"
                  accept=".pdf"
                  onChange={handleFileChange}
                />
                <TbPaperclip size={20} />
              </label>
            )}

            <button
              type="submit"
              className="min-w-10 min-h-10 bg-blue-500 rounded-full flex justify-center items-center text-white hover:bg-blue-700"
            >
              <TbSend size={20} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Comments;
