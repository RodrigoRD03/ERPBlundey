import { useEffect, useState } from "react";
import requests from "./requests";
import { useUser } from "../../../Contexts/UserContext";
import { Link } from "react-router-dom";
import { BlobRed, BlobGreen, BlobYellow } from "../../../constants";
import { BsBoxSeam } from "react-icons/bs";
import {
  TbCircleX,
  TbReceiptRefund,
  TbRosetteDiscountCheck,
} from "react-icons/tb";

const Quotes = () => {
  const { userData } = useUser();
  const [numberPending, setNumberPending] = useState(0);
  const [numberComplete, setNumberComplete] = useState(0);
  const [numberCancel, setNumberCancel] = useState(0);

  useEffect(() => {
    if (userData.Roles == "Supervisor") {
      requests.getPendingPricesSupervisor(userData.ID).then((returned) => {
        setNumberPending(returned.length);
      });

      requests.getPricesCompleteSupervisor(userData.ID).then((returns) => {
        setNumberComplete(returns.length);
      });

      requests.getPricesCancelSupervisor(userData.ID).then((returns) => {
        setNumberCancel(returns.length);
      });
    } else if (userData.Roles == "Administrador") {
      requests.getPricePendingAdmin().then((returns) => {
        setNumberPending(returns.length);
      });

      requests.getPriceCompleteAdmin().then((returns) => {
        setNumberComplete(returns.length);
      });

      requests.getPricesCancelAdmin().then((returns) => {
        setNumberCancel(returns.length);
      });
    } else {
      requests.getPricesPendingSeller(userData.ID).then((returns) => {
        setNumberPending(returns.length);
      });

      requests.getPricesCompleteSeller(userData.ID).then((returns) => {
        setNumberComplete(returns.length);
      });

      requests.getPricesCancelSeller(userData.ID).then((returns) => {
        setNumberCancel(returns.length);
      });
    }
  }, []);
  return (
    <div className="flex gap-5">
      <Link
        to="/Layout/HistoryQuotes"
        className="relative w-76 h-48 bg-amber-500 p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
      >
        <div className="absolute w-[410px] -top-2 -left-20 z-0 blob">
          <img className="w-full h-full" src={BlobYellow} alt="" />
        </div>
        <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
          <span className="text-white ">
            <TbReceiptRefund size={24} />
          </span>
        </div>
        <div className="absolute top-3 right-4 text-xs text-white">
          <p>Cotizaciones</p>
        </div>
        <div className="absolute text-white flex z-40 bottom-8 gap-2">
          <p className="text-6xl font-semibold">{numberPending}</p>
          <p className="w-28 text-sm">Pendientes</p>
        </div>
        <span className="absolute -bottom-6 -right-2 z-10 text-amber-200">
          <TbReceiptRefund size={140} />.
        </span>
      </Link>
      <Link
        to="/Layout/HistoryQuotes"
        className="relative w-76 h-48 bg-red-800 p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
      >
        <div className="absolute w-[410px] -top-2 -left-20 z-0  blob-reverse ">
          <img className="w-full h-full" src={BlobRed} alt="" />
        </div>
        <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
          <span className="text-white ">
            <TbCircleX size={24} />
          </span>
        </div>
        <div className="absolute top-3 right-4 text-xs text-white">
          <p>Cotizaciones</p>
        </div>
        <div className="absolute text-white  flex z-40 bottom-8 gap-2">
          <p className="text-6xl font-semibold ">{numberCancel}</p>
          <p className="w-28 text-sm text-red-900">Canceladas en el mes</p>
        </div>
        <span className="absolute -bottom-8 -right-2 z-10 text-red-200">
          <TbCircleX size={140} />.
        </span>
      </Link>
      <Link
        to="/Layout/HistoryQuotes"
        className="relative w-76 h-48 bg-green-600 p-4 rounded-xl overflow-hidden flex items-center shadow-md card"
      >
        <div className="absolute w-[410px] rotate-45 -top-2 -left-20 z-0 blob">
          <img className="w-full h-full" src={BlobGreen} alt="" />
        </div>
        <div className="absolute top-4 left-4 size-10 bg-white/30 backdrop-blur-lg border border-white/40 rounded-xl shadow-lg flex justify-center items-center">
          <span className="text-white ">
            <TbRosetteDiscountCheck size={24} />
          </span>
        </div>
        <div className="absolute top-3 right-4 text-xs text-white">
          <p>Cotizaciones</p>
        </div>
        <div className="absolute text-white  flex z-40 bottom-8 gap-2">
          <p className="text-6xl font-semibold">{numberComplete}</p>
          <p className="w-28 text-sm text-green-900">Completadas en el mes</p>
        </div>
        <span className="absolute -bottom-8 -right-2 z-10 text-green-200">
          <TbRosetteDiscountCheck size={140} />.
        </span>
      </Link>
    </div>
  );
};

export default Quotes;
