import "./Home.css";
import Header from "../Header/Header.jsx";
import FakeMap from "../Maps/FakeSalonMap.jsx";

function Home() {
  return (
    <div className="home">
      <Header />
      <FakeMap />
    </div>
  );
}

export default Home;