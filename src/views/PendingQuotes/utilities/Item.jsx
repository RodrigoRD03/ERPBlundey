import { Link, useNavigate, useParams } from "react-router-dom";
import PieceOrMeter from "./PieceOrMeter";
import Proyect from "./Proyect";
import Service from "./Service";

const Item = () => {
  const { enterpriseID, customerID, addressID, quoteID, itemID, itemType } =
    useParams();
  const navigate = useNavigate();

  const handleNavigateClick = () => {
    navigate(
      `/Layout/NewQuote/Quote/${enterpriseID}/${customerID}/${addressID}/${quoteID}`
    );
  };

  return (
    <div className="flex flex-col gap-2 m-4">
      <div className="w-full flex flex-col gap-1">
        <p className="text-xs">
          <Link to="/Layout">Panel de Control</Link> /{" "}
          <Link to="/Layout/NewQuote">Nueva Cotización</Link> /{" "}
          <Link to={`/Layout/NewQuote/Addresses/${enterpriseID}/${customerID}`}>
            Lista de Direcciones
          </Link>{" "}
          /{" "}
          <Link
            to={`/Layout/NewQuote/Quote/${enterpriseID}/${customerID}/${addressID}/${quoteID}`}
          >
            Cotización
          </Link>{" "}
          / <b>Nueva Partida</b>
        </p>
        <p className="text-lg font-bold">Nueva Partida</p>
        <div className="line-row" />
      </div>
      {(itemType == 2 || itemType == 4) && (
        <PieceOrMeter itemID={itemID} navigateClick={handleNavigateClick} />
      )}
      {itemType == 1 && (
        <Proyect
          itemID={itemID}
          quoteID={quoteID}
          navigateClick={handleNavigateClick}
        />
      )}
      {itemType == 3 && (
        <Service itemID={itemID} navigateClick={handleNavigateClick} />
      )}
    </div>
  );
};

export default Item;
