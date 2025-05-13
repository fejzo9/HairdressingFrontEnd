import "./Home.css";
import Header from "../Header/Header.jsx";
import SalonsPage from '../Salons/SalonsPage';
import FakeMap from "../Maps/FakeSalonMap.jsx";

function Home() {
  return (
    <div className="home">
      <Header />
      <SalonsPage />
      {/* <FakeMap /> */}
    </div>
  );
}

export default Home;