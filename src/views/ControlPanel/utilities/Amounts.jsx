import { useEffect, useState } from "react";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";
import { Doughnut } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const formatCurrency = (value) => {
  return Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const Amounts = () => {
  const { userData } = useUser();
  const [dataChart, setDataChart] = useState(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (userData.Roles == "Administrador") {
      requests.getPricesChartAdmin().then((returned) => {
        setDataChart(returned);
        setTotal(
          returned.Completadas + returned.Pendientes + returned.Canceladas
        );
      });
    } else if (userData.Roles == "Supervisor") {
      requests.getPricesChartSupervisor(userData.ID).then((returned) => {
        setDataChart(returned);
        setTotal(
          returned.Completadas + returned.Pendientes + returned.Canceladas
        );
      });
    } else {
      requests.getPricesChartSeller(userData.ID).then((returned) => {
        setDataChart(returned);
        setTotal(
          returned.Completadas + returned.Pendientes + returned.Canceladas
        );
      });
    }
  }, []);
  const data = dataChart
    ? {
        labels: ["Completadas", "Pendientes", "Canceladas"],
        datasets: [
          {
            label: "Total: $",
            data: [
              dataChart?.Completadas,
              dataChart?.Pendientes,
              dataChart?.Canceladas,
            ],
            backgroundColor: [
              "rgb(134, 239, 172)",
              "rgb(252, 211, 77)",
              "rgb(252, 165, 165)",
            ],
          },
        ],
      }
    : {};

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    cutout: "65%",
  };

  return (
    <div
      className={`${
        userData.Roles != "Supervisor"
          ? "w-[628px] h-[404px]"
          : "w-[304px] h-[616px]"
      } " border border-zinc-300 flex flex-col rounded-xl bg-white overflow-hidden shadow-md "`}
    >
      <div className="w-full border-transparent border-b border-b-zinc-300 py-2 px-4 text-zinc-600">
        Cotizaciones del Mes
      </div>
      {userData.Roles == "Supervisor" ? (
        <div className="flex flex-col gap-[1px] bg-zinc-300">
          <div className="flex flex-col justify-center w-full h-full bg-green-300 px-4 text-green-800">
            <p className="text-sm">Completadas</p>
            <p> $ {formatCurrency(dataChart?.Completadas)}</p>
          </div>
          <div className="flex flex-col justify-center w-full h-full bg-amber-300 px-4 text-amber-800">
            <p className="text-sm">Pendientes</p>
            <p>$ {formatCurrency(dataChart?.Pendientes)}</p>
          </div>
          <div className="flex flex-col justify-center w-full h-full bg-red-300 px-4 text-red-900">
            <p className="text-sm">Canceladas</p>
            <p>$ {formatCurrency(dataChart?.Canceladas)}</p>
          </div>
          <div className="flex flex-col justify-center w-full h-full bg-white px-4">
            <p>Total</p> <p>$ {formatCurrency(total)}</p>
          </div>
          <div className="w-full h-[360px] p-2 flex justify-center items-center bg-white">
            {dataChart && <Doughnut data={data} options={options} />}
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex">
          <div className="w-[250px] max-w-[300px] border-transparent border-r border-r-zinc-300 text-zinc-600 flex flex-col gap-[1px] justify-between bg-zinc-300">
            <div className="flex flex-col justify-center w-full h-full bg-green-300 px-4 text-green-800">
              <p className="text-sm">Completadas</p>
              <p> $ {formatCurrency(dataChart?.Completadas)}</p>
            </div>
            <div className="flex flex-col justify-center w-full h-full bg-amber-300 px-4 text-amber-800">
              <p className="text-sm">Pendientes</p>
              <p>$ {formatCurrency(dataChart?.Pendientes)}</p>
            </div>
            <div className="flex flex-col justify-center w-full h-full bg-red-300 px-4 text-red-900">
              <p className="text-sm">Canceladas</p>
              <p>$ {formatCurrency(dataChart?.Canceladas)}</p>
            </div>
            <div className="flex flex-col justify-center w-full h-full bg-white px-4">
              <p>Total</p> <p>$ {formatCurrency(total)}</p>
            </div>
          </div>
          <div className="w-full h-[360px] p-2 flex justify-center items-center">
            {dataChart && <Doughnut data={data} options={options} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Amounts;
