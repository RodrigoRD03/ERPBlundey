import { Button } from "@radix-ui/themes";
import { IoClose } from "react-icons/io5";
import { TbDownload } from "react-icons/tb";

const ViewPDF = ({ base, version, close }) => {
  const downloadPDF = () => {
    const byteCharacters = atob(base);
    const byteNumbers = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const blob = new Blob([byteNumbers], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = version;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute w-full min-h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-50">
      <div className="w-[1024px] h-[800px] bg-white p-5 rounded-md flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Ver Archivo</p>
          <div className="flex gap-3">
            <span
              className="size-10 bg-zinc-200 flex justify-center items-center rounded-full cursor-pointer hover:bg-red-500 hover:text-white"
              onClick={close}
            >
              <IoClose size={24} />
            </span>
          </div>
        </div>
        <div className="line-row" />
        <div className="relative w-full h-full">
          <iframe
            title="Embedded PDF"
            className="w-full h-full"
            src={`data:application/pdf;base64,${base}`}
          ></iframe>
          {/* <div className="absolute top-4.5 left-15 w-68 whitespace-nowrap overflow-hidden text-ellipsis inline-block text-white text-sm bg-[#323639]">
            {version}
          </div> */}
          <button
            className="absolute right-21 top-2 size-10"
            onClick={downloadPDF}
          />
        </div>
      </div>
    </div>
  );
};

export default ViewPDF;
