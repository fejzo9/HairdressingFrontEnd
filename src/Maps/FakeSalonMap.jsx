import "./FakeSalonMap.css";
import SalonsPage from '../Salons/SalonsPage';

function FakeSalonMap(){
    return(
        <div className="mapa">
            <SalonsPage />
            <h2>Hairdressing Salon Maps</h2>
            <img src="/maps2.png" alt="Maps of Salon" style={{ width: "100%", height: "auto" }}/>
        </div>
    );
}

export default FakeSalonMap;