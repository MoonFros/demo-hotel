import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  UserRound,
  Users,
  X,
} from 'lucide-react';
import { hotelImages, siteConfig } from './config/site.js';

const navItems = [
  ['Home', '#home'],
  ['About', '#about'],
  ['Rooms & Suites', '#rooms'],
  ['Location', '#location'],
  ['Contact', '#contact'],
];

const roomPlaceholders = [
  { id: '01', image: hotelImages.roomOne, alt: 'Illustrative placeholder of a modest, tidy hotel room; not an actual Topmax room.' },
  { id: '02', image: hotelImages.roomTwo, alt: 'Illustrative placeholder of a comfortable city-hotel room; not an actual Topmax room.' },
];

function Reveal({ children, className = '', delay = 0, as: Element = 'div' }) {
  const elementRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || !('IntersectionObserver' in window)) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Element
      ref={elementRef}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ '--reveal-delay': `${delay}ms` }}
    >
      {children}
    </Element>
  );
}

function SectionLabel({ children, light = false }) {
  return <p className={`section-label ${light ? 'section-label--light' : ''}`}>{children}</p>;
}

function Wordmark({ light = false }) {
  return (
    <a className={`wordmark ${light ? 'wordmark--light' : ''}`} href="#home" aria-label={`${siteConfig.name}, home`}>
      <span className="wordmark__symbol" aria-hidden="true">T</span>
      <span className="wordmark__text">
        <span className="wordmark__name">TOPMAX</span>
        <span className="wordmark__descriptor">EXECUTIVE HOTEL <i>&</i> SUITES</span>
      </span>
    </a>
  );
}

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 28);
    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.body.classList.add('menu-is-open');
    window.addEventListener('keydown', closeOnEscape);
    return () => {
      document.body.classList.remove('menu-is-open');
      window.removeEventListener('keydown', closeOnEscape);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''} ${menuOpen ? 'site-header--menu-open' : ''}`}>
      <div className="site-header__inner page-container">
        <Wordmark light={!scrolled && !menuOpen} />
        <nav className="desktop-nav" aria-label="Main navigation">
          {navItems.map(([label, href]) => <a key={label} href={href}>{label}</a>)}
          <a className="nav-book-button" href="#booking">Book a room <ArrowUpRight size={15} strokeWidth={1.7} /></a>
        </nav>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={23} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </div>
      <div id="mobile-navigation" className={`mobile-nav ${menuOpen ? 'mobile-nav--open' : ''}`} aria-hidden={!menuOpen}>
        <div className="mobile-nav__top"><span>MENU</span><span>BDPA · BENIN CITY</span></div>
        <nav aria-label="Mobile navigation">
          {navItems.map(([label, href], index) => (
            <a key={label} href={href} onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
              <span className="mobile-nav__index">0{index + 1}</span><span>{label}</span><ArrowUpRight size={19} strokeWidth={1.4} />
            </a>
          ))}
        </nav>
        <a className="mobile-nav__book" href="#booking" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>Book a room <ArrowUpRight size={18} /></a>
        <p className="mobile-nav__foot">A comfortable base in Benin City.</p>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__image" style={{ backgroundImage: `url("${hotelImages.building}")` }} aria-hidden="true" />
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__inner page-container">
        <div className="hero__content">
          <p className="hero__location"><MapPin size={15} strokeWidth={1.6} /> BDPA <span>·</span> NEAR UNIBEN <span>·</span> BENIN CITY</p>
          <h1 id="hero-title">A Comfortable Place to <em>Call Home,</em><span>Even for a Night.</span></h1>
          <p className="hero__intro">Discover comfortable accommodation and convenient stays at Topmax Executive Hotel & Suites.</p>
          <div className="hero__actions">
            <a className="button button--gold" href="#rooms">Explore our rooms <ArrowUpRight size={17} strokeWidth={1.7} /></a>
            <a className="button button--text-light" href="#booking">Make an enquiry <ArrowRight size={17} strokeWidth={1.6} /></a>
          </div>
        </div>
        <div className="hero__bottom">
          <a className="scroll-cue" href="#about"><span className="scroll-cue__icon"><ArrowRight size={14} strokeWidth={1.5} /></span><span>Get to know Topmax</span></a>
          <p className="image-credit">Illustrative building placeholder · actual Topmax photo not supplied</p>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about section-space" id="about">
      <div className="page-container about__grid">
        <Reveal className="about__copy">
          <SectionLabel>ABOUT THE HOTEL</SectionLabel>
          <h2>Comfort Meets <em>Convenience.</em></h2>
          <p className="about__lead">A welcoming place to stay in BDPA, close to the University of Benin.</p>
          <p className="about__body">Topmax Executive Hotel & Suites is a practical base for visitors to Benin City—whether you’re travelling for work, visiting family, or coming to see a student at UNIBEN. Share what you need before you arrive, and ask the hotel directly about current room options and rates.</p>
          <a className="text-link" href="#rooms">See room information <ArrowUpRight size={16} strokeWidth={1.6} /></a>
        </Reveal>
        <Reveal className="about__visual" delay={120}>
          <figure className="editorial-photo">
            <img src={hotelImages.reception} alt="Illustrative placeholder of a simple hotel reception; not Topmax's actual reception" loading="lazy" />
            <figcaption>Illustrative reception image · replace with approved Topmax photo</figcaption>
          </figure>
          <div className="about__location-mark"><MapPin size={15} /><span>BDPA<br />BENIN CITY</span></div>
          <span className="about__rule" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}

function RoomCard({ room }) {
  return (
    <article className="room-card">
      <figure className="room-card__photo">
        <img src={room.image} alt={room.alt} loading="lazy" />
        <figcaption>Illustrative room photo · not an actual Topmax room</figcaption>
      </figure>
      <div className="room-card__body">
        <div className="room-card__overline"><span>ROOM {room.id}</span><span>DETAILS PENDING</span></div>
        <h3>Room category to be confirmed</h3>
        <p>Room names and descriptions haven’t been supplied yet. Enquire for current room options and rates before you plan your stay.</p>
        <div className="room-card__facts">
          <div><span>AMENITIES</span><b>To be confirmed</b></div>
          <div><span>ROOM RATE</span><b>Ask the hotel</b></div>
        </div>
        <a className="room-card__link" href="#booking">Enquire about this room <ArrowUpRight size={16} strokeWidth={1.6} /></a>
      </div>
    </article>
  );
}

function Rooms() {
  return (
    <section className="rooms section-space" id="rooms">
      <div className="page-container">
        <Reveal className="rooms__heading">
          <div>
            <SectionLabel>ROOMS & SUITES</SectionLabel>
            <h2>Find a Room That <em>Suits Your Stay.</em></h2>
          </div>
          <p>Choose a stay that works for your visit. Verified room names, amenities and rates will be added as soon as the hotel provides them.</p>
        </Reveal>
        <div className="rooms__grid">
          {roomPlaceholders.map((room, index) => <Reveal key={room.id} delay={index * 100}><RoomCard room={room} /></Reveal>)}
        </div>
        <p className="rooms__note"><BedDouble size={15} /> Placeholder photography only. No room type, amenity or price is being represented as confirmed.</p>
      </div>
    </section>
  );
}

const stayReasons = [
  {
    number: '01',
    title: 'A convenient address',
    text: 'In BDPA, near the University of Benin—well placed for visits around the city.',
    icon: MapPin,
  },
  {
    number: '02',
    title: 'Comfort & cleanliness',
    text: 'Comfortable accommodation, with a clean and straightforward feel at the heart of the stay.',
    icon: BedDouble,
  },
  {
    number: '03',
    title: 'Your own space',
    text: 'Room for privacy and a pause between family visits, work or travel.',
    icon: UserRound,
  },
  {
    number: '04',
    title: 'Clear, welcoming enquiries',
    text: 'A straightforward way to ask about room options and current rates before you make a plan.',
    icon: MessageCircle,
  },
];

function WhyStay() {
  return (
    <section className="why section-space" id="why-stay">
      <div className="page-container">
        <Reveal className="why__heading">
          <SectionLabel>WHY STAY WITH US?</SectionLabel>
          <h2>Thoughtful about <em>the things that matter.</em></h2>
          <p>Comfort, convenience and straightforward information—without promises about unconfirmed facilities.</p>
        </Reveal>
        <div className="why__grid">
          {stayReasons.map(({ number, title, text, icon: Icon }, index) => (
            <Reveal key={number} className="why-item" delay={index * 70}>
              <div className="why-item__top"><span>{number}</span><Icon size={20} strokeWidth={1.4} aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </Reveal>
          ))}
        </div>
        <div className="why__value-note"><span>VALUE, WITHOUT GUESSWORK</span><p>Room prices are not published until confirmed. Contact the hotel for current rates.</p></div>
      </div>
    </section>
  );
}

function localDateValue(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function routeEnquiry(message, setResult) {
  const encodedMessage = encodeURIComponent(message);
  if (siteConfig.whatsapp.trim()) {
    window.open(`https://wa.me/${siteConfig.whatsapp.trim()}?text=${encodedMessage}`, '_blank', 'noopener,noreferrer');
    setResult({ text: 'A WhatsApp draft is open. Review it and press send there to complete your enquiry.', draft: '' });
    return;
  }
  if (siteConfig.email.trim()) {
    window.location.href = `mailto:${siteConfig.email.trim()}?subject=${encodeURIComponent('Room enquiry for Topmax Executive Hotel & Suites')}&body=${encodedMessage}`;
    setResult({ text: 'Your email app has opened with this enquiry. Review and send it there to complete your request.', draft: '' });
    return;
  }
  setResult({
    text: 'The hotel’s WhatsApp and email details have not been provided for this page. Your enquiry has not been sent; copy the prepared message below.',
    draft: message,
  });
}

function EnquiryResult({ result }) {
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);

  useEffect(() => {
    setCopied(false);
    setCopyFailed(false);
  }, [result?.draft, result?.text]);

  if (!result?.text) return null;

  const copyDraft = async () => {
    try {
      await navigator.clipboard.writeText(result.draft);
      setCopied(true);
      setCopyFailed(false);
    } catch {
      setCopyFailed(true);
    }
  };

  return (
    <div className="enquiry-result" role="status" aria-live="polite">
      <p>{result.text}</p>
      {result.draft && (
        <>
          <label className="sr-only" htmlFor="prepared-enquiry">Prepared enquiry</label>
          <textarea id="prepared-enquiry" value={result.draft} readOnly rows={5} />
          <button className="copy-button" type="button" onClick={copyDraft}>
            {copied ? <Check size={15} /> : <Copy size={15} />}{copied ? 'Copied to clipboard' : 'Copy enquiry'}
          </button>
          {copyFailed && <p className="enquiry-result__hint">Copy was blocked by your browser. Select the text above and copy it manually.</p>}
        </>
      )}
    </div>
  );
}

function Booking() {
  const [values, setValues] = useState({
    name: '',
    guestPhone: '',
    roomPreference: 'No specific preference',
    checkIn: '',
    checkOut: '',
    guests: '',
    message: '',
  });
  const [result, setResult] = useState(null);
  const today = localDateValue();

  const updateField = (event) => {
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));
    setResult(null);
  };

  const submitBooking = (event) => {
    event.preventDefault();
    if (values.checkOut <= values.checkIn) {
      setResult({ text: 'Please choose a check-out date that is after your check-in date.' });
      return;
    }

    const message = [
      `Booking enquiry for ${siteConfig.name}`,
      `Guest name: ${values.name}`,
      `Guest phone: ${values.guestPhone}`,
      `Preferred room category: ${values.roomPreference}`,
      `Check-in: ${values.checkIn}`,
      `Check-out: ${values.checkOut}`,
      `Number of guests: ${values.guests}`,
      `Additional message: ${values.message.trim() || 'None'}`,
    ].join('\n');
    routeEnquiry(message, setResult);
  };

  return (
    <section className="booking-section section-space" id="booking">
      <div className="page-container booking-section__grid">
        <Reveal className="booking-section__intro">
          <SectionLabel light>BOOK A ROOM</SectionLabel>
          <h2>Tell us what <em>you need.</em></h2>
          <p>Share your dates and room preference. This is an enquiry form, not an automated availability checker—the hotel will confirm room options and rates.</p>
          <div className="booking-section__promise"><span>01</span><p>No instant booking claims.<br />Just a clear request to the hotel.</p></div>
          <div className="booking-section__contact-hint"><MessageCircle size={17} /><span>Configured contact details are required before enquiries can be sent from this page.</span></div>
        </Reveal>
        <Reveal className="booking-panel" delay={100}>
          <form className="booking-form" onSubmit={submitBooking}>
            <div className="booking-form__heading"><span>STAY ENQUIRY</span><span>ALL FIELDS MARKED * ARE REQUIRED</span></div>
            <div className="booking-form__grid">
              <label className="form-field"><span>Guest name <i>*</i></span><input name="name" value={values.name} onChange={updateField} type="text" autoComplete="name" placeholder="Your full name" required /></label>
              <label className="form-field"><span>Phone number <i>*</i></span><input name="guestPhone" value={values.guestPhone} onChange={updateField} type="tel" inputMode="tel" autoComplete="tel" minLength="7" placeholder="Your contact number" required /></label>
              <label className="form-field"><span>Preferred room category</span><select name="roomPreference" value={values.roomPreference} onChange={updateField}><option>No specific preference</option><option>I have a room type in mind</option></select></label>
              <label className="form-field"><span>Number of guests <i>*</i></span><span className="field-with-icon"><Users size={16} /><input name="guests" value={values.guests} onChange={updateField} type="number" min="1" step="1" placeholder="Select guests" required /></span></label>
              <label className="form-field"><span>Check-in date <i>*</i></span><span className="field-with-icon"><CalendarDays size={16} /><input name="checkIn" value={values.checkIn} onChange={updateField} type="date" min={today} required /></span></label>
              <label className="form-field"><span>Check-out date <i>*</i></span><span className="field-with-icon"><CalendarDays size={16} /><input name="checkOut" value={values.checkOut} onChange={updateField} type="date" min={values.checkIn || today} required /></span></label>
              <label className="form-field form-field--full"><span>Additional message</span><textarea name="message" value={values.message} onChange={updateField} rows="3" placeholder="Any questions or details you’d like to share?" /></label>
            </div>
            <div className="booking-form__submit-row">
              <button className="button button--green" type="submit">Send booking enquiry <ArrowUpRight size={17} strokeWidth={1.6} /></button>
              <span>Your details are included only in the enquiry you prepare.</span>
            </div>
            <EnquiryResult result={result} />
          </form>
        </Reveal>
      </div>
    </section>
  );
}

function Location() {
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(siteConfig.mapSearch)}&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(`${siteConfig.name}, ${siteConfig.mapSearch}`)}`;

  return (
    <section className="location section-space" id="location">
      <div className="page-container">
        <Reveal className="location__heading">
          <div><SectionLabel>LOCATION</SectionLabel><h2>Stay Close to Where <em>You Need to Be.</em></h2></div>
          <p>BDPA, near the University of Benin—an easy landmark for your visit to Benin City.</p>
        </Reveal>
        <div className="location__grid">
          <Reveal className="location__details">
            <div className="location__address-icon"><MapPin size={20} strokeWidth={1.5} /></div>
            <span className="location__overline">ADDRESS PROVIDED</span>
            <h3>{siteConfig.address}</h3>
            <p>The full street address and exact hotel pin have not been supplied yet. The map below points to the BDPA area only.</p>
            <a className="button button--green" href={directionsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={17} strokeWidth={1.6} /></a>
          </Reveal>
          <Reveal className="map-frame" delay={110}>
            <iframe title="Google Maps area search for BDPA, Benin City" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen />
            <div className="map-frame__tag"><MapPin size={15} /> BDPA · NEAR UNIBEN</div>
            <div className="map-frame__note">Approximate area · exact hotel pin pending</div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ContactMethod({ icon: Icon, label, value, href, note, external = false }) {
  return (
    <article className="contact-method">
      <span className="contact-method__icon"><Icon size={19} strokeWidth={1.5} /></span>
      <span className="contact-method__label">{label}</span>
      {href ? <a className="contact-method__value" href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{value}<ArrowUpRight size={15} /></a> : <span className="contact-method__value contact-method__value--pending">{value}</span>}
      {note && <p>{note}</p>}
    </article>
  );
}

function Contact() {
  const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, '');
  const whatsappHref = siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : '#booking';
  const emailHref = siteConfig.email ? `mailto:${siteConfig.email}` : undefined;

  return (
    <section className="contact section-space" id="contact">
      <div className="page-container">
        <Reveal className="contact__heading">
          <div><SectionLabel>CONTACT TOPMAX</SectionLabel><h2>Let’s make your <em>stay simple.</em></h2></div>
          <p>Need to ask about a room, current rates or getting here? Reach out through a verified contact channel, or start with a booking enquiry.</p>
        </Reveal>
        <div className="contact__methods">
          <ContactMethod icon={Phone} label="TELEPHONE" value={siteConfig.phone || 'Number to be confirmed'} href={siteConfig.phone ? `tel:${phoneDigits}` : undefined} note={siteConfig.phone ? 'Call the hotel' : 'Hotel telephone details have not been supplied.'} />
          <ContactMethod icon={MessageCircle} label="WHATSAPP" value={siteConfig.whatsapp ? 'Message the hotel' : 'Number to be confirmed'} href={whatsappHref} external={Boolean(siteConfig.whatsapp)} note={siteConfig.whatsapp ? 'Enquiries open in WhatsApp' : 'Use the form until a number is provided.'} />
          <ContactMethod icon={Mail} label="EMAIL" value={siteConfig.email || 'Email to be confirmed'} href={emailHref} note={siteConfig.email ? 'Send a direct enquiry' : 'Email details have not been supplied.'} />
          <ContactMethod icon={MapPin} label="LOCATION" value="BDPA · Near UNIBEN" href="#location" note="Benin City, Edo State, Nigeria" />
        </div>
        <div className="contact__bottom-line"><span>Have dates in mind?</span><a className="button button--green" href="#booking">Make an enquiry <ArrowUpRight size={16} /></a></div>
      </div>
    </section>
  );
}

function Footer() {
  const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, '');
  return (
    <footer className="site-footer">
      <div className="page-container">
        <div className="site-footer__main">
          <div className="site-footer__brand-col">
            <Wordmark light />
            <p>Comfortable accommodation in BDPA, near the University of Benin, Benin City.</p>
            <span className="site-footer__address">BDPA, Benin City<br />Edo State, Nigeria</span>
          </div>
          <div>
            <span className="footer-heading">EXPLORE</span>
            <div className="footer-links"><a href="#home">Home</a><a href="#about">About</a><a href="#rooms">Rooms & Suites</a><a href="#location">Location</a><a href="#contact">Contact</a></div>
          </div>
          <div>
            <span className="footer-heading">CONTACT</span>
            <div className="footer-links">
              {siteConfig.phone ? <a href={`tel:${phoneDigits}`}>{siteConfig.phone}</a> : <span>Phone · to be confirmed</span>}
              {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> : <span>Email · to be confirmed</span>}
              <a href="#booking">Make an enquiry <ArrowUpRight size={13} /></a>
            </div>
          </div>
          <div>
            <span className="footer-heading">SOCIAL</span>
            <div className="footer-links">
              {siteConfig.instagram ? <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a> : null}
              {siteConfig.facebook ? <a href={siteConfig.facebook} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a> : null}
              {!siteConfig.instagram && !siteConfig.facebook && <span>Social links to be confirmed</span>}
            </div>
          </div>
        </div>
        <div className="site-footer__bottom"><span>© {new Date().getFullYear()} Topmax Executive Hotel & Suites</span><span>Room and contact details shown when verified.</span><a href="#home">Back to top <ArrowUpRight size={14} /></a></div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Rooms />
        <WhyStay />
        <Booking />
        <Location />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
