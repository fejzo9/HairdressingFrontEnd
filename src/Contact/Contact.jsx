import React, { useState } from "react";
import "./Contact.css";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaLinkedin, FaFacebook, FaInstagram } from "react-icons/fa";

/* 
 * Arrow function način pisanja koda (ES6 pristup)
 */
const Contact = () => {
  /* 
   * React Hook useState za upravljanje stanjem forme. useState omogućava da ova stanja budu reaktivna – kada se promijene, React ponovo renderuje komponentu. 
   * formData: Objekt koji čuva vrijednosti polja forme (ime, email, poruka). formData prati unos korisnika u formu 
   * setFormData: Funkcija za ažuriranje stanja forme 
   */
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    message: "",
  });

  /* React Hook useState za upravljanje greškama
   * errors: Objekt koji čuva greške za polja forme (npr. ako je email nevalidan). errors prati validacione greške za svako polje. 
   * setErrors: Funkcija za ažuriranje stanja grešaka 
   * Početno stanje je prazan objekt {} 
   */
  const [errors, setErrors] = useState({});

   /*
    * Funkcija za praćenje unosa u formi, promjena u poljima forme (inputi i textarea)
    * Ažurira stanje forme (formData)
    * (e): Event objekat koji dolazi iz polja input ili textarea.
    * 
    * const { name, value } = e.target;
    *   e.target: Element koji je izazvao događaj (npr. <input>). Predstavlja polje (input ili textarea), koje korisnik mijenja
    *   name: Ime atributa polja (fullName, email, message), govori nam šta mijenjamo
    *   value: Vrijednost koju je korisnik unio u polje
    * 
    * setFormData({ ...formData, [name]: value });
    *   ...formData: Kopira postojeće stanje forme
    *   [name]: value: Mijenja samo ono polje koje je korisnik upravo promijenio
    * 
    * Kako radi? --> Kada korisnik unese tekst u polje sa name="email", 
    * funkcija ažurira samo email u formData. 
    * Ostala polja ostaju nepromijenjena zahvaljujući spread operatoru (...).
    */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  /* Funkcija za validaciju emaila
   * re.test() je JavaScript metoda koja provjerava da li string odgovara regexu. Ako je email ispravan, vraća true, inače false.
   * String(email): Osigurava da je email string (u slučaju da nije).
   * toLowerCase(): Pretvara email u mala slova kako bi validacija bila case-insensitive
   * Kako ovo radi? 1) Regex provjerava da li email ima ispravan format
   *                2) Funkcija osigurava da email bude u malim slovima prije provjere
   *                3) re.test() vraća true ako je email validan
   * 
   */
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // regularni regex izraz
    return re.test(String(email).toLowerCase());
  };

  /*
   * funkcija za validaciju forme, provjerava validnost podataka
   * handleSubmit sprječava default ponašanje forme (reload stranice) 
   * pokreće kada korisnik pošalje formu, provjerava unos, 
   * prikazuje greške ako ih ima, i šalje podatke ako je sve ispravno
   */
  const handleSubmit = (e) => {
    e.preventDefault(); // Sprečava default ponašanje forme (reload stranice pri slanju). Omogućava da se validacija i logika obrade forme prvo završe.
    let newErrors = {}; // Kreira prazan objekt za čuvanje grešaka u validaciji

    // validacija unosa
    if (!formData.fullName) newErrors.fullName = "Molimo unesite ime i prezime"; // Ako je prazno, dodaje se greška u newErrors.fullName
    if (!formData.email || !validateEmail(formData.email)) newErrors.email = "Molimo unesite ispravan email"; // Ako je prazno ili email nije validan (validateEmail funkcija), dodaje greška u newErrors.email
    if (!formData.message) newErrors.message = "Molimo unesite poruku"; // Ako je prazno, dodaje greška u newErrors.message

    // Ažurira stanje grešaka (errors) sa novim greškama
    // Ako je neko polje neispravno, greška se prikazuje na odgovarajućem mjestu u form
    setErrors(newErrors);

    // Ako nema grešaka
    // Provjerava da li je newErrors prazan (nema grešaka)
    if (Object.keys(newErrors).length === 0) {
      console.log("Form data submitted:", formData);
      alert("Hvala na poruci! Kontaktirat ćemo vas uskoro.");
      setFormData({ fullName: "", email: "", message: "" }); //
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-left">
        <h2>Kontaktirajte nas</h2>
        <div className="contact-info">
          <p><FaMapMarkerAlt /> Adresa: Sarajevo, Bosna i Hercegovina</p>
          <p><FaPhone /> Telefon (fiksni): 033 123 456</p>
          <p><FaPhone /> Telefon (mobitel): 061 987 654</p>
          <p><FaEnvelope /> Email: info@beauty.com</p>
          <p><FaLinkedin /> LinkedIn: linkedin.com/Beauty</p>
          <p><FaFacebook /> Facebook: facebook.com/Beauty</p>
          <p><FaInstagram /> Instagram: @Beauty</p>
        </div>
      </div>
      <div className="contact-right">
        <h2>Pošaljite nam poruku</h2>
        <form onSubmit={handleSubmit}>

          {/* name="fullName": name je ključ koji povezuje ovo polje sa odgovarajućim dijelom formData stanja */}
          {/* Kada se unos promijeni, funkcija handleChange koristi ovaj name za ažuriranje odgovarajućeg polja u formData */}
          {/* value={formData.fullName}: Vrijednost polja povezana sa stanjem formData.fullName. 
              Ovo osigurava kontrolisani unos: stanje forme uvijek definiše šta je u polju */}
          {/* Svaki put kada korisnik promijeni unos u polju, funkcija handleChange ažurira formData stanje */}
          <input
            type="text"
            name="fullName"
            placeholder="Ime i prezime" 
            value={formData.fullName}
            onChange={handleChange}
          />
          {/* Ovo je kondicionalni (uslovni) render (prikazuje se samo ako postoji greška za fullName)*/}
          {/* errors.fullName: Provjerava da li postoji greška u errors objektu*/}
          {/* Ako postoji, prikazuje se <span> element sa klasom error i sadržajem greške (npr. "Molimo unesite ime i prezime"). */}
          {errors.fullName && <span className="error">{errors.fullName}</span>}
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error">{errors.email}</span>}

          <textarea
            name="message"
            placeholder="Vaša poruka"
            rows="5"
            value={formData.message}
            onChange={handleChange}
          />
          {errors.message && <span className="error">{errors.message}</span>}

          <button type="submit">Pošalji</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
