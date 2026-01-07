import React, { useEffect, useState } from "react";
import requests from "./requests";
import { TbDownload, TbFile } from "react-icons/tb";
import { Tooltip } from "@radix-ui/themes";

const Files = ({ taskID }) => {
  const [filesList, setFilesList] = useState([]);

  useEffect(() => {
    requests.getFilesForGroupTask(taskID).then((response) => {
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
      {filesList.length > 0 ? (
        <>
          <div className="line-row" />
          <div
            className={
              filesList.length > 2
                ? "bg-white border border-dashed border-zinc-400 rounded-4xl grid grid-cols-2 gap-1 p-1"
                : "bg-white border border-dashed border-zinc-400 rounded-full grid grid-cols-2 gap-1 p-1"
            }
          >
            {filesList.map((file, index) => (
              <div
                key={index}
                className="flex justify-between bg-zinc-50 p-1 rounded-full border border-zinc-200 cursor-pointer"
                onClick={() =>
                  handleDownloadFileClick(file.ID, file.NombreArchivo)
                }
              >
                <div className="flex items-center gap-2">
                  <span className="bg-white size-10 border border-zinc-500 flex justify-center items-center rounded-full">
                    <TbFile />
                  </span>
                  <Tooltip content={file.NombreArchivo}>
                    <p className="text-sm truncate max-w-[160px] font-semibold">
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
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default Files;
