import React from "react";
import "./AboutUs.css"; // Stilizacija stranice

function AboutUs() {
  return (
    <div className="about-us">
      <div className="about-container">

            <div className="about-left">
                <img
                    src="/about-us-1.jpg"
                    alt="About Us"
                    className="about-image"
                />
            </div>

            <div className="about-right">
                <h1 className="about-heading">
                <span className="highlight">Beauty</span>   O nama
                </h1>
                <p  className="about-text">Dobrodošli! <br/> Upoznajte našu priču, tim i vrijednosti koje nas pokreću.</p>
            </div>
     </div>

      <div className="about-mission">
            <h2>Naša Misija</h2>
            <p>
            Cilj nam je da pružimo kvalitetne usluge, olakšamo rezervacije i 
            omogućimo korisnicima brzi pristup najboljim salonima u gradu.
            </p>

            <div className="mission-items-container">
                <div className="mission-item">
                    <h3>Šta radimo?</h3>
                    <p>- Pojednostavljujemo proces rezervacije termina</p>
                    <p>- Pomažemo salonima u upravljanju terminima</p>
                    <img src="/sta-radimo-icon.png" alt="Doing" width={180} height={180} />
                </div>

                <div className="mission-item">
                    <h3>Za koga radimo?</h3>
                    <p>- Za korisnike koji žele lako pronaći slobodan termin</p>
                    <p>- Za frizerske salone koji žele bolju organizaciju</p>
                    <img src="/za-koga-radimo-icon.png" alt="Doing" width={180} height={180} />
                </div>

                <div className="mission-item">
                    <h3>Koje vrijednosti nudimo?</h3>
                    <p>- Štedimo korisnicima vrijeme i trud</p>
                    <p>- Unapređujemo poslovanje frizerskih salona</p>
                    <img src="/values-icon.png" alt="Doing" width={180} height={180} />
                </div>
            </div>
                <div className="mission-item-goals">
                    <h3>Ciljevi</h3>
                    <ul>
                        <li>Pojednostaviti zakazivanje termina u frizerskim salonima kroz modernu i intuitivnu aplikaciju koja povezuje korisnike i frizerske salone, štedi vrijeme i unapređuje korisničko iskustvo</li>
                        <li>Omogućiti korisnicima brz i jednostavan način zakazivanja frizerskih usluga, pružajući im slobodu i kontrolu nad njihovim vremenom</li>
                        <li>Pružiti frizerskim salonima alat za unapređenje poslovanja kroz bolju organizaciju i optimizaciju rezervacija</li>
                        <li>Stvoriti most između korisnika i frizerskih salona, čineći zakazivanje jednostavnijim za korisnike i efikasnijim za salone</li>
                    </ul>
                </div>
        </div>

      <div className="about-story">
        <h2>Naša Priča</h2>
        <p>
          Ideja o ovoj aplikaciji nastala je iz potrebe da pojednostavimo proces rezervacije termina 
          u frizerskim salonima i salonima ljepote, te iz potrebe da znamo ko su najbolji zaposleni profesionalci u našem okruženju koji pružaju usluge i koji su prepoznati od strane zajednice, kako bismo mogli na brz i jednostavan način da se rezervišemo u terminu koji nam odgovara.  </p>
      </div>

      <div className="about-vision">
        <h2>Naša Vizija</h2>
        <p>
            Stvariti brend za rezervaciju termina i biti prva aplikacija na koju svi pomisle kada žele brzu i kvalitetnu rezervaciju frizerskih usluga ili usluga salona ljepote.
        </p>
      </div>

      <div className="about-team">
        <h2>Upoznajte naš tim</h2>
        <div className="team-member">
          <img src="/assets/fejzo.jpg" alt="Fejzullah Ždralović" />
          <h3>Fejzullah Ždralović</h3>
          <p>Programer i vizionar ovog projekta.</p>
        </div>
        <div className="team-member">
          <img src="/assets/ena.jpg" alt="Ena" />
          <h3>Ena Forto</h3>
          <p>Koordinator dizajna i UX/UI stručnjak.</p>
        </div>
      </div>

      <div className="about-stats">
        <h2>Naši Rezultati</h2>
        <ul>
          <li>Preko 1000 zadovoljnih korisnika</li>
          <li>Partnerstvo sa 20 najboljih salona</li>
          <li>5 godina iskustva u industriji</li>
        </ul>
      </div>

      <div className="about-contact">
        <h2>Kontaktirajte Nas</h2>
        <p>
          Za sve informacije i saradnju, slobodno nas kontaktirajte putem naše{" "}
          <a href="/contact">kontakt stranice</a>.
        </p>
      </div>
    </div>
  );
}

export default AboutUs;
