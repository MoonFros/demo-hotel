import { useEffect, useRef, useState } from 'react';
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Send,
  Users,
  X,
} from 'lucide-react';
import { hotelImages, siteConfig } from './config/site.js';

const navItems = [
  ['Home', '#home'],
  ['Rooms & Suites', '#rooms'],
  ['Dining', '#dining'],
  ['Facilities', '#facilities'],
  ['About', '#experience'],
  ['Contact', '#contact'],
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
      { threshold: 0.12, rootMargin: '0px 0px -32px 0px' },
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

function SectionLabel({ children, dark = false }) {
  return <p className={`section-label ${dark ? 'section-label--light' : ''}`}>{children}</p>;
}

function Wordmark({ light = false, compact = false }) {
  return (
    <a className={`wordmark ${light ? 'wordmark--light' : ''} ${compact ? 'wordmark--compact' : ''}`} href="#home" aria-label={`${siteConfig.name}, home`}>
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
    const updateHeader = () => setScrolled(window.scrollY > 30);
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
          {navItems.map(([label, href]) => (
            <a key={label} href={href}>{label}</a>
          ))}
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
              <span className="mobile-nav__index">0{index + 1}</span>
              <span>{label}</span>
              <ArrowUpRight size={19} strokeWidth={1.4} />
            </a>
          ))}
        </nav>
        <a className="mobile-nav__book" href="#booking" onClick={closeMenu} tabIndex={menuOpen ? 0 : -1}>
          Plan your stay <ArrowUpRight size={18} />
        </a>
        <p className="mobile-nav__foot">A considered stay in Benin City.</p>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero__image" style={{ backgroundImage: `url("${hotelImages.hero}")` }} aria-hidden="true" />
      <div className="hero__overlay" aria-hidden="true" />
      <div className="hero__inner page-container">
        <div className="hero__content">
          <p className="hero__location"><MapPin size={14} strokeWidth={1.6} /> {siteConfig.locationLine}</p>
          <h1 id="hero-title">Stay Somewhere<span>Worth Coming Back <em>To.</em></span></h1>
          <p className="hero__intro">Discover comfort, convenience and warm hospitality at Topmax Executive Hotel & Suites.</p>
          <div className="hero__actions">
            <a className="button button--gold" href="#rooms">Explore our rooms <ArrowUpRight size={17} strokeWidth={1.7} /></a>
            <a className="button button--text-light" href="#contact">Make an enquiry <ArrowRight size={17} strokeWidth={1.6} /></a>
          </div>
        </div>
        <div className="hero__bottom">
          <a className="scroll-cue" href="#experience"><span className="scroll-cue__icon"><ArrowDown size={15} strokeWidth={1.5} /></span><span>Scroll to discover</span></a>
          <p className="image-credit">Illustrative hotel photography · not a property image</p>
        </div>
      </div>
      <div className="hero__folio" aria-hidden="true"><span>TOPMAX</span><span>01 — 06</span></div>
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
    setResult({
      text: 'A WhatsApp draft is open. Review it and press send there to complete your enquiry.',
      draft: '',
    });
    return;
  }

  if (siteConfig.email.trim()) {
    window.location.href = `mailto:${siteConfig.email.trim()}?subject=${encodeURIComponent('Enquiry for Topmax Executive Hotel & Suites')}&body=${encodedMessage}`;
    setResult({
      text: 'Your email app has opened with this enquiry. Review and send it there to complete your request.',
      draft: '',
    });
    return;
  }

  setResult({
    text: 'Contact details have not yet been provided for this page. This enquiry has not been sent; copy the prepared message below and keep it ready.',
    draft: message,
  });
}

function EnquiryResult({ result, className = '' }) {
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
    <div className={`enquiry-result ${className}`} role="status" aria-live="polite">
      <p>{result.text}</p>
      {result.draft && (
        <>
          <label className="sr-only" htmlFor={`enquiry-draft-${className || 'booking'}`}>Prepared enquiry</label>
          <textarea id={`enquiry-draft-${className || 'booking'}`} value={result.draft} readOnly rows={4} />
          <button className="copy-button" type="button" onClick={copyDraft}>
            {copied ? <Check size={15} /> : <Copy size={15} />}
            {copied ? 'Copied to clipboard' : 'Copy enquiry'}
          </button>
          {copyFailed && <p className="enquiry-result__hint">Copy was blocked by your browser. Select the text above and copy it manually.</p>}
        </>
      )}
    </div>
  );
}

function BookingForm() {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('');
  const [preference, setPreference] = useState('No specific preference');
  const [result, setResult] = useState(null);
  const today = localDateValue();

  const submitBooking = (event) => {
    event.preventDefault();
    setResult(null);

    if (checkOut <= checkIn) {
      setResult({ text: 'Please choose a check-out date that is after your check-in date.' });
      return;
    }

    const message = [
      `Hello, I would like to enquire about a stay at ${siteConfig.name}.`,
      `Check-in: ${checkIn}`,
      `Check-out: ${checkOut}`,
      `Guests: ${guests}`,
      `Room preference: ${preference}`,
      'Please let me know about availability and current room details.',
    ].join('\n');
    routeEnquiry(message, setResult);
  };

  return (
    <section className="booking-wrap page-container" id="booking" aria-label="Enquire about a stay">
      <div className="booking-card">
        <div className="booking-card__heading">
          <div>
            <SectionLabel>PLAN YOUR STAY</SectionLabel>
            <p>Share your dates and we’ll help you take the next step.</p>
          </div>
          <span className="booking-card__note">ENQUIRY · NOT LIVE AVAILABILITY</span>
        </div>
        <form className="booking-form" onSubmit={submitBooking}>
          <label className="booking-field">
            <span className="booking-field__label">Check-in</span>
            <span className="booking-field__input"><CalendarDays size={17} strokeWidth={1.5} /><input aria-label="Check-in date" type="date" value={checkIn} min={today} onChange={(event) => { setCheckIn(event.target.value); setResult(null); }} required /></span>
          </label>
          <label className="booking-field">
            <span className="booking-field__label">Check-out</span>
            <span className="booking-field__input"><CalendarDays size={17} strokeWidth={1.5} /><input aria-label="Check-out date" type="date" value={checkOut} min={checkIn || today} onChange={(event) => { setCheckOut(event.target.value); setResult(null); }} required /></span>
          </label>
          <label className="booking-field booking-field--guests">
            <span className="booking-field__label">Guests</span>
            <span className="booking-field__input"><Users size={17} strokeWidth={1.5} /><input aria-label="Number of guests" type="number" min="1" step="1" placeholder="Select" value={guests} onChange={(event) => { setGuests(event.target.value); setResult(null); }} required /></span>
          </label>
          <label className="booking-field booking-field--preference">
            <span className="booking-field__label">Room preference</span>
            <span className="booking-field__input"><select aria-label="Room preference" value={preference} onChange={(event) => setPreference(event.target.value)}><option>No specific preference</option><option>I’ll share a preference in my enquiry</option></select></span>
          </label>
          <button className="booking-submit" type="submit">Check availability <ArrowUpRight size={17} strokeWidth={1.6} /></button>
        </form>
        <EnquiryResult result={result} className="booking" />
      </div>
    </section>
  );
}

function Introduction() {
  return (
    <section className="intro section-space" id="experience">
      <div className="page-container intro__grid">
        <Reveal className="intro__copy">
          <SectionLabel>THE TOPMAX EXPERIENCE</SectionLabel>
          <h2>More Than Just a <em>Place to Stay.</em></h2>
          <p className="intro__lead">A welcoming address in BDPA, close to the University of Benin and the rhythm of Benin City.</p>
          <p className="intro__body">Topmax Executive Hotel & Suites offers a convenient base for your time in the city. Whether you’re visiting for study, work or a personal trip, we’re here to make finding your stay feel straightforward. Room details and services have not yet been supplied for this page; please enquire for current information.</p>
          <a className="underlined-link" href="#rooms">Explore the stay <ArrowUpRight size={16} strokeWidth={1.6} /></a>
        </Reveal>
        <Reveal className="intro__visual" delay={140}>
          <div className="intro__visual-image">
            <img src={hotelImages.interior} alt="Illustrative hotel interior; not a photograph of Topmax Executive Hotel & Suites" loading="lazy" />
            <span className="photo-note">Illustrative imagery · actual property photos to come</span>
          </div>
          <div className="intro__vertical-note"><span>BDPA</span><span>BENIN CITY · NIGERIA</span></div>
          <div className="intro__gold-mark" aria-hidden="true" />
        </Reveal>
      </div>
    </section>
  );
}

function Rooms() {
  return (
    <section className="rooms section-space" id="rooms">
      <div className="page-container">
        <Reveal className="section-heading rooms__heading">
          <div>
            <SectionLabel>ROOMS & SUITES</SectionLabel>
            <h2>Find Your Perfect <em>Stay.</em></h2>
          </div>
          <p>Comfortable spaces designed to make every stay worthwhile.</p>
        </Reveal>

        <div className="rooms-editorial">
          <Reveal className="room-photo room-photo--main">
            <img src={hotelImages.roomOne} alt="Illustrative guest room photograph; room category and features at Topmax are to be confirmed" loading="lazy" />
            <span className="photo-note">Illustrative photography · not a Topmax room</span>
            <span className="room-photo__index">01 <i>/ ACCOMMODATION</i></span>
          </Reveal>
          <Reveal className="room-copy" delay={90}>
            <SectionLabel>YOUR STAY, YOUR WAY</SectionLabel>
            <h3>Room details, <em>coming into focus.</em></h3>
            <p>Room categories, inclusions and rates have not yet been supplied for this page. These images are illustrative placeholders—not a representation of a specific Topmax room.</p>
            <a className="underlined-link" href="#contact">Ask about rooms <ArrowUpRight size={16} strokeWidth={1.6} /></a>
            <div className="room-copy__foot"><span>ROOM CATEGORIES</span><span>TO BE CONFIRMED</span></div>
          </Reveal>
          <Reveal className="room-photo room-photo--secondary" delay={160}>
            <img src={hotelImages.roomTwo} alt="Illustrative hotel bedroom; actual room photography and details are not yet supplied" loading="lazy" />
            <span className="photo-note">Illustrative photography · details to be confirmed</span>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Facilities() {
  return (
    <section className="facilities section-space" id="facilities">
      <div className="page-container facilities__grid">
        <Reveal className="facilities__copy">
          <SectionLabel dark>FACILITIES & EXPERIENCES</SectionLabel>
          <h2>Good to know. <em>Worth getting right.</em></h2>
          <p>Facility and service details have not yet been supplied for this page. To keep it accurate, we won’t list amenities until they’re verified. Please ask the hotel for the latest details before you plan your stay.</p>
          <div className="facilities__dining-note" id="dining"><span>DINING</span><p>Dining details have not yet been supplied for this page.</p></div>
          <a className="button button--outline-light" href="#contact">Enquire about facilities <ArrowUpRight size={17} strokeWidth={1.6} /></a>
          <span className="facilities__disclaimer">Verified information will be added here.</span>
        </Reveal>
        <Reveal className="facilities__visual" delay={120}>
          <figure className="facilities__image facilities__image--large">
            <img src={hotelImages.lounge} alt="Illustrative contemporary hospitality interior; not a confirmed Topmax facility" loading="lazy" />
            <figcaption>Illustrative hospitality imagery · facility not confirmed</figcaption>
          </figure>
          <figure className="facilities__image facilities__image--small">
            <img src={hotelImages.interior} alt="Illustrative hotel interior used as a visual placeholder" loading="lazy" />
            <figcaption>Placeholder imagery</figcaption>
          </figure>
          <div className="facilities__image-stamp"><span>WHAT’S<br />ON SITE?</span><span>LET’S CONFIRM<br />TOGETHER</span></div>
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
      <div className="page-container location__grid">
        <Reveal className="location__copy">
          <SectionLabel dark>FIND US IN BENIN CITY</SectionLabel>
          <h2>Perfectly Placed for Your <em>Next Stay.</em></h2>
          <p>Set in BDPA, near the University of Benin—an easy point of reference for your time in Benin City.</p>
          <div className="location__facts">
            <div><span className="location__fact-no">01</span><span><b>BDPA</b><small>Benin City, Edo State</small></span></div>
            <div><span className="location__fact-no">02</span><span><b>Near UNIBEN</b><small>University of Benin</small></span></div>
          </div>
          <a className="button button--gold location__directions" href={directionsUrl} target="_blank" rel="noreferrer">Get directions <ArrowUpRight size={17} strokeWidth={1.6} /></a>
          <p className="location__fineprint">Map shows the BDPA area only; the hotel’s exact pin and street address are awaiting confirmation.</p>
        </Reveal>
        <Reveal className="map-frame" delay={120}>
          <iframe
            title="Google Maps search for BDPA, Benin City"
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="map-frame__tag"><MapPin size={15} /> BDPA AREA · BENIN CITY</div>
          <div className="map-frame__note">Approximate area · hotel pin to be confirmed</div>
        </Reveal>
      </div>
    </section>
  );
}

function GuestStories() {
  return (
    <section className="stories section-space" aria-labelledby="stories-heading">
      <div className="page-container stories__layout">
        <Reveal className="stories__intro">
          <SectionLabel>GUEST STORIES</SectionLabel>
          <h2 id="stories-heading">Experiences Worth <em>Remembering.</em></h2>
          <p>We believe the best stories are shared in a guest’s own words.</p>
        </Reveal>
        <Reveal className="stories__empty" delay={120}>
          <span className="stories__line" aria-hidden="true" />
          <div className="stories__message">
            <span className="stories__status">A NOTE ON REVIEWS</span>
            <p>Verified guest feedback will appear here once it has been supplied. No reviews or ratings have been published on this page.</p>
            <a className="underlined-link" href="#contact">Planning a visit? <ArrowUpRight size={16} strokeWidth={1.6} /></a>
          </div>
          <span className="stories__mark" aria-hidden="true">T</span>
        </Reveal>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="closing" aria-labelledby="closing-title">
      <div className="closing__image" style={{ backgroundImage: `url("${hotelImages.closing}")` }} aria-hidden="true" />
      <div className="closing__shade" aria-hidden="true" />
      <div className="page-container closing__content">
        <Reveal>
          <SectionLabel dark>MAKE BENIN CITY YOUR NEXT STOP</SectionLabel>
          <h2 id="closing-title">Your Next Stay <em>Starts Here.</em></h2>
          <p>Make your next visit to Benin City a comfortable one.</p>
          <div className="closing__actions">
            <a className="button button--gold" href="#booking">Book your stay <ArrowUpRight size={17} strokeWidth={1.6} /></a>
            <a className="button button--text-light" href="#contact">Contact us <ArrowRight size={17} strokeWidth={1.6} /></a>
          </div>
        </Reveal>
      </div>
      <p className="closing__image-note">Illustrative hotel exterior · not a photograph of the property</p>
    </section>
  );
}

function ContactDetails() {
  const phoneDigits = siteConfig.phone.replace(/[^\d+]/g, '');

  return (
    <div className="contact-details">
      <p className="contact-details__label">CONTACT DETAILS</p>
      <div className="contact-detail">
        <span className="contact-detail__icon"><MapPin size={17} strokeWidth={1.5} /></span>
        <div><span>LOCATION</span><p>{siteConfig.address}</p></div>
      </div>
      {siteConfig.phone ? (
        <a className="contact-detail" href={`tel:${phoneDigits}`}>
          <span className="contact-detail__icon"><Phone size={17} strokeWidth={1.5} /></span>
          <div><span>TELEPHONE</span><p>{siteConfig.phone}</p></div>
        </a>
      ) : (
        <div className="contact-detail contact-detail--pending">
          <span className="contact-detail__icon"><Phone size={17} strokeWidth={1.5} /></span>
          <div><span>TELEPHONE</span><p>Contact number to be confirmed</p></div>
        </div>
      )}
      {siteConfig.email ? (
        <a className="contact-detail" href={`mailto:${siteConfig.email}`}>
          <span className="contact-detail__icon"><Mail size={17} strokeWidth={1.5} /></span>
          <div><span>EMAIL</span><p>{siteConfig.email}</p></div>
        </a>
      ) : (
        <div className="contact-detail contact-detail--pending">
          <span className="contact-detail__icon"><Mail size={17} strokeWidth={1.5} /></span>
          <div><span>EMAIL</span><p>Email address to be confirmed</p></div>
        </div>
      )}
      {siteConfig.whatsapp ? (
        <a className="contact-whatsapp" href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer"><MessageCircle size={17} /> WhatsApp the hotel <ArrowUpRight size={15} /></a>
      ) : (
        <a className="contact-whatsapp contact-whatsapp--pending" href="#contact-form"><MessageCircle size={17} /> WhatsApp details to be confirmed <ArrowRight size={15} /></a>
      )}
    </div>
  );
}

function ContactForm() {
  const [result, setResult] = useState(null);

  const submitContact = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const message = [
      `Hello, I’m ${values.get('name')}.`,
      `My email: ${values.get('email')}`,
      '',
      values.get('message'),
    ].join('\n');
    routeEnquiry(message, setResult);
  };

  return (
    <form className="contact-form" id="contact-form" onSubmit={submitContact}>
      <div className="contact-form__intro">
        <div><SectionLabel>WE’RE HERE TO HELP</SectionLabel><h3>Send us a note.</h3></div>
        <Send size={20} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <p className="contact-form__note">No hotel email or WhatsApp details have been supplied for this page. Until a channel is configured, your message will be prepared for copying—not sent.</p>
      <div className="contact-form__row">
        <label className="form-field"><span>Your name</span><input type="text" name="name" autoComplete="name" placeholder="How should we address you?" required /></label>
        <label className="form-field"><span>Email address</span><input type="email" name="email" autoComplete="email" placeholder="you@example.com" required /></label>
      </div>
      <label className="form-field"><span>Your message</span><textarea name="message" rows="4" placeholder="Tell us what you’d like to know…" required /></label>
      <div className="contact-form__submit-row">
        <button className="button button--green" type="submit">Prepare enquiry <ArrowUpRight size={17} strokeWidth={1.6} /></button>
        <span>We’ll only use the details you enter to prepare your enquiry.</span>
      </div>
      <EnquiryResult result={result} className="contact" />
    </form>
  );
}

function Contact() {
  return (
    <section className="contact section-space" id="contact">
      <div className="page-container contact__grid">
        <Reveal className="contact__intro">
          <SectionLabel>GET IN TOUCH</SectionLabel>
          <h2>Let’s make your next visit <em>feel simple.</em></h2>
          <p>Ask about room availability, current facilities or anything you’d like to know before arriving. We’ll make it easy to find the right information.</p>
          <ContactDetails />
        </Reveal>
        <Reveal className="contact__form-wrap" delay={100}>
          <ContactForm />
        </Reveal>
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
            <p>A considered stay in BDPA, near the University of Benin, Benin City.</p>
            <a className="footer-whatsapp" href={siteConfig.whatsapp ? `https://wa.me/${siteConfig.whatsapp}` : '#contact-form'} target={siteConfig.whatsapp ? '_blank' : undefined} rel={siteConfig.whatsapp ? 'noreferrer' : undefined}>
              <MessageCircle size={17} /> {siteConfig.whatsapp ? 'WhatsApp enquiries' : 'WhatsApp contact to be confirmed'} <ArrowUpRight size={15} />
            </a>
          </div>
          <div className="site-footer__links-col">
            <span className="footer-heading">EXPLORE</span>
            <div className="footer-links">
              <a href="#home">Home</a><a href="#rooms">Rooms & Suites</a><a href="#facilities">Facilities</a><a href="#experience">About Topmax</a><a href="#location">Location</a>
            </div>
          </div>
          <div className="site-footer__contact-col">
            <span className="footer-heading">SAY HELLO</span>
            <div className="footer-links">
              {siteConfig.phone ? <a href={`tel:${phoneDigits}`}>{siteConfig.phone}</a> : <span>Telephone · to be confirmed</span>}
              {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a> : <span>Email · to be confirmed</span>}
              <span>BDPA, near UNIBEN<br />Benin City, Edo State, Nigeria</span>
            </div>
          </div>
          <div className="site-footer__social-col">
            <span className="footer-heading">FOLLOW ALONG</span>
            <div className="footer-links">
              {siteConfig.instagram ? <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a> : null}
              {siteConfig.facebook ? <a href={siteConfig.facebook} target="_blank" rel="noreferrer">Facebook <ArrowUpRight size={13} /></a> : null}
              {!siteConfig.instagram && !siteConfig.facebook && <span>Social links to be confirmed</span>}
            </div>
          </div>
        </div>
        <div className="site-footer__bottom">
          <span>© {new Date().getFullYear()} Topmax Executive Hotel & Suites</span>
          <span>Hotel details will be updated once verified.</span>
          <a href="#home">Back to top <ArrowUpRight size={14} /></a>
        </div>
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
        <BookingForm />
        <Introduction />
        <Rooms />
        <Facilities />
        <Location />
        <GuestStories />
        <CallToAction />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
