import "./Home.css";
import Header from "../Header/Header.jsx";
import SalonsPage from '../Salons/SalonsPage';

function Home() {
  return (
    <div className="home">
      <Header />
      <SalonsPage />
    </div>
  );
}

export default Home;