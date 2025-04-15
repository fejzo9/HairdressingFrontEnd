import React from "react";
import pic1 from "/ena.jpg";
import pic2 from "/fejzo.png";
import Card from "../Card/Card.jsx";
import Header from "../Header/Header.jsx";
import "./AboutUs.css"; 

function AboutUs() {
  return (
    <div className="about-us">
      <div className="header">
        <Header />
      </div>
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
          <div className="mission-item">
          <img src="/story-icon.png" alt="Doing" width={180} height={180} />
          </div>
      </div>

      <div className="about-story">
        <h2>Naša Vizija</h2>
        <p>
            Stvariti brend za rezervaciju termina i biti prva aplikacija na koju svi pomisle kada žele brzu i kvalitetnu rezervaciju frizerskih usluga ili usluga salona ljepote.
        </p>
        <div className="mission-item">
          <img src="/vision-icon.png" alt="Doing" width={180} height={180} />
          </div>
      </div>

      <div className="about-team">
        <h2>Upoznajte naš tim</h2>
        <div className="members">
           {/* <div className="team-member">
           <a href="https://www.linkedin.com/in/ena-forto-2610a32a2/">
             <Card pic={pic1} name="Ena Forto-Ždralović" desc="Vlasnica i direktorica Beauty aplikacije. Odgovorna za finansije, prodaju i pravne regulative." /> 
            </a>  
          </div> */}
          <div className="team-member">
            <a href="https://github.com/fejzo9">
              <Card pic={pic2} name="Fejzullah Ždralović" desc="Inžinjer elektrotehnike, glavni developer, odgovoran za cjelokupni razvoj aplikacije." />
            </a>
          </div>
        </div>
      </div>

      <div className="contact-us">
        <h2>Kontaktirajte Nas</h2>
        <p>
          Za sve informacije i saradnju, slobodno nas kontaktirajte putem naše{" "}
          <a className="contact-link" href="/contact">kontakt stranice</a>.
        </p>
        <div className="mission-item">
        <a className="contact-link" href="/contact"><img src="/contact-icon.png" alt="Doing" width={180} height={180} /> </a>
          </div>
      </div>

    </div>
  );
}

export default AboutUs;
