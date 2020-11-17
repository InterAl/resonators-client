import React, { Component } from 'react';
import './index.scss';
import logoImg from './assets/logo.svg';
import illustrationImg from './assets/group-33.png';
import illustrationImg2 from './assets/group-33@2x.png';
import illustrationImg3 from './assets/group-33@3x.png';
import hIWIllustrationImg from './assets/group-272.png';
import hIWIllustrationImg2 from './assets/group-272@2x.png';
import hIWIllustrationImg3 from './assets/group-272@3x.png';
import hIWIllustrationImgWhite from './assets/group-272-white@3x.jpg';
import feature1 from './assets/feature-1.svg';
import feature2 from './assets/feature-2.svg';
import feature3 from './assets/feature-3.svg';
import feature4 from './assets/feature-4.svg';
import feature5 from './assets/feature-5.svg';
import feature6 from './assets/feature-6.svg';
import feature7 from './assets/feature-7.svg';
import feature8 from './assets/feature-8.svg';
import graph from './assets/graph.svg';
import sessionIllustration from './assets/sessionIllustration.jpg';
import { sendContactForm } from '../../api/sendContactForm';
import ReCAPTCHA from "react-google-recaptcha";

export default class HomePage extends Component {

  constructor(props) {
    super(props);
  }
  recaptchaRef = React.createRef();

  handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const serializedData = [ ...formData ].reduce((acc, [ key, val ]) => {
      acc[key] = val;
      return acc;
    }, {});
    sendContactForm({ formData: serializedData })
  }

  render() {
    return (
      <div className="home-page">
        <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700&display=swap" rel="stylesheet"/>
        <section id="home" className="fold">
          <header className='header'>
            <img src={logoImg} alt="" className="logo"/>
            <nav>
              <div className="menu-icon">
                <div className="menu-icon-bar"></div>
                <div className="menu-icon-bar"></div>
                <div className="menu-icon-bar"></div>
              </div>
              <ul className="menu-links">
                <li><a href="#home">Home</a></li>
                <li><a href="#what-is-psysession">What is Psysession</a></li>
                <li><a href="#how-it-works">How it works</a></li>
                <li><a href="#system-features">Features</a></li>
                <li><a href="#effective">Why is it so effective</a></li>
                <li><a href="#contacts">Contacts</a></li>
              </ul>
            </nav>
          </header>
          
          <article className="side-padding">
            <h1 className="fold-title margin-bottom-small">
              A secure cloud-based platform for enhancing therapy
            </h1>
            <p className="fold-subtext margin-bottom">Created by therapists and developers for therapists and patients</p>
            <a href="/login" className="btn-primary margin-bottom-medium">Try it now</a>
          </article>
        </section>

        <section id="what-is-psysession" className="what-is-psysession">
          <article className="side-padding what-is-psysession-container">
            <img className="what-is-psysession-image"
                 src={illustrationImg}
                 srcSet={`${illustrationImg2} 2x, ${illustrationImg3} 3x`}
                 alt="psysession platform illustration"/>
            <div>
              <h2 className="what-is-psysession-title margin-bottom">What is PsySession?</h2>
              <p className="margin-bottom-medium">
                Breakthrough therapeutic sessions are exciting, but preserving their impact is difficult without continuous daily work. In most cases, the patient is likely to put aside important
                session content and forget about it until the next session. This impedes therapeutic progress.
              </p>
              <p><strong>This is where PsySession - a mobile and desktop cloud-based system - comes in.</strong></p>
            </div>
          </article>
        </section>

        <section id="how-it-works" className="how-it-works">
          <article className="side-padding padding-top-large padding-bottom-large">
            <h2 className="margin-bottom-medium text-primary text-center">How it works</h2>
            <img className="how-it-works-illustration"
                 src={hIWIllustrationImg}
                 srcSet={`${hIWIllustrationImg2} 2x, ${hIWIllustrationImg3} 3x`}
                 alt="How psysession platform works illustration"/>
            <a href={hIWIllustrationImgWhite} className="how-it-works-btn btn-primary btn-plus"></a>
          </article>
        </section>

        <section id="system-features" className="system-features text-center">
          <article className="padding-top-large padding-bottom-large side-padding">
            <h1 className="text-primary padding-bottom-large side-padding">System features include</h1>
            <ul className="system-features-grid">
              <li>
                <img className="padding-bottom-medium" src={feature1} alt=""/>
                <p>Mobile communication in between sessions</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature2}/>
                <p>Therapy progress measurement tools</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature3}/>
                <p>Daily therapeutic reminders (Resonators)</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature4}/>
                <p>Therapist-Patient communication automation tools</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature5}/>
                <p>Patient status and followup control panel</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature6}/>
                <p>Tools for personalizing the above for every specific patient</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature7}/>
                <p>Psychology questionnaires</p>
              </li>
              <li>
                <img className="padding-bottom-medium" src={feature8}/>
                <p>CBT-like homework forms</p>
              </li>
            </ul>
            <a href="/login" className="btn-primary margin-bottom-medium">Try it now</a>
          </article>
        </section>

        <section id="effective" className="effectiveness text-accent-secondary">
          <article className="effectiveness-container padding-top-large padding-bottom-large side-padding">
            <img className="effectiveness-img margin-bottom-large"
                 width="200px"
                 src={sessionIllustration}
            />
            <div>
              <h2 className="text-primary padding-bottom">Why is it so effective?</h2>
              <p>
                The daily interaction with PsySession creates a stronger emotional bond between the patient and the therapeutic content enhancing therapy effectiveness. The data accumulated also
                helps the therapist identify what’s working and what needs to be improved with each patient, creating an optimal platform for progress.
              </p>

              <h3>Quantifying and measuring</h3>
              <img className="effectiveness-graph" src={graph} alt="graph illustration"/>
            </div>
          </article>
        </section>

        <section id="contacts" className="contact-section">
          <article className="contact-section-container padding-top-large padding-bottom-large side-padding">
            <div className="contact-section-text">
              <h2 className="padding-bottom-medium text-primary">Contact us</h2>
              <p className="padding-bottom-medium">We’re happy to hear from you! Contact us today and speak with one of our customer service representatives — and make your experience with us that much
                more pleasant!</p>
              <p className="margin-bottom-large"><b>support@PsySession.com? <a className="tel" href="tel:+972-556600420">(+972)-55-660-0420</a></b></p>
            </div>
            <form className="contact-form" onSubmit={this.handleSubmit}>
              <input type="text" id="contact-form-name" name="name" placeholder="Name" className="contact-section-input margin-bottom-medium" required/>
              <input type="text" id="contact-form-country" name="country" placeholder="Country" className="contact-section-input margin-bottom-medium"/>
              <input type="text" id="contact-form-phone" name="phone" placeholder="Phone" className="contact-section-input margin-bottom-medium"/>
              <input type="email" id="contact-form-email" name="email" placeholder="Email" className="contact-section-input margin-bottom-medium" required/>
              <textarea rows="40" id="contact-form-message" name="message" placeholder="Message" className="contact-section-input margin-bottom-medium"></textarea>
              <ReCAPTCHA
                ref={this.recaptchaRef}
                sitekey="6LdyBuQZAAAAAHZRoMHSxkXl9YSW8lNBUlOQCKVS"
                onChange={this.onChange}
              />
              <button className="contact-form-btn btn-primary" >Send</button>
            </form>
          </article>
        </section>

        <footer className="footer">
          Copyright © 2019 PsySession. All rights reserved.
        </footer>
      </div>
    );
  }
}
