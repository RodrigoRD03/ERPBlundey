import { useEffect, useState } from "react";
import requests from "./requests";
import { TbDownload } from "react-icons/tb";

const Files = ({ taskID }) => {
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    requests.getFilesTasks(taskID).then((response) => {
      setFilesList(response);
      console.log(response, "Hola");
    });
  }, []);

  const handleDownloadFileClick = (ID, name) => {
    requests.getFileTask(ID).then((response) => {

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
        <div className="border border-dashed border-zinc-400 rounded-lg grid grid-cols-2 gap-1 p-1">
          {filesList.map((file, index) => (
            <div
              key={index}
              className="flex justify-between bg-zinc-50 p-1 rounded border border-zinc-200 cursor-pointer"
              onClick={() => handleDownloadFileClick(file.ID, file.NombreArchivo)}
            >
              <p className="text-xs truncate max-w-[160px] font-semibold">
                {file.NombreArchivo}
              </p>
              <span className="text-green-400">
                <TbDownload />
              </span>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default Files;
