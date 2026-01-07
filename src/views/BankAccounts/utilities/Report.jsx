import { DateRangePicker } from "react-date-range";
import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { RiCloseFill } from "react-icons/ri";
import requests from "./requests";

const Report = ({ accountID, close }) => {
  const [mode, setMode] = useState("range"); // "range" o "year"
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    setLoading(true);
    try {
      if (mode === "range") {
        const object = {
          CuentaBancariaID: accountID,
          Inicio: range[0].startDate.toISOString().split('T')[0],
          Final: range[0].endDate.toISOString().split('T')[0],
        };
        
        const response = await requests.getReportRangeExcel(object);
        const byteCharacters = atob(response);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.ms-excel",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Reporte`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Puedes hacer algo con el archivo, como descargarlo
      } else {
        const response = await requests.getReportAnioExcel(
          selectedYear,
          accountID
        );
        const byteCharacters = atob(response);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {
          type: "application/vnd.ms-excel",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `Reporte`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        // Puedes hacer algo con el archivo, como descargarlo
      }
    } catch (error) {
      console.error("Error generando el reporte:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute w-full h-full top-0 left-0 bg-[#00000067] flex justify-center items-center z-10">
      <div className="bg-white p-5 rounded-md flex flex-col gap-4 w-max ">
        <div className="flex justify-between items-center">
          <p className="text-lg font-bold">Reportes</p>
          <span
            className="size-10 rounded-full flex justify-center items-center bg-zinc-300 text-white cursor-pointer hover:bg-red-500"
            onClick={() => close()}
          >
            <RiCloseFill size={24} />
          </span>
        </div>

        {/* Botones de selección de modo */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("range")}
            className={`flex-1 py-2 rounded ${
              mode === "range" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Por rango
          </button>
          <button
            onClick={() => setMode("year")}
            className={`flex-1 py-2 rounded ${
              mode === "year" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            Por año
          </button>
        </div>

        {/* Selector de rango o año */}
        {mode === "range" ? (
          <DateRangePicker
            locale={es}
            onChange={(item) => setRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={1}
            ranges={range}
            direction="vertical"
            className="w-full"
          />
        ) : (
          <div>
            <p>Selecciona el año:</p>
            <DatePicker
              selected={selectedYear}
              onChange={(date) => setSelectedYear(date)}
              showYearPicker
              dateFormat="yyyy"
              className="border px-2 py-1 w-full rounded"
            />
          </div>
        )}

        {/* Botón de generar */}
        <button
          onClick={handleGenerateReport}
          className="bg-green-500 hover:bg-green-600 text-white rounded py-2"
        >
          Generar reporte
        </button>
      </div>
    </div>
  );
};

export default Report;
