import React, { Component } from 'react';
import './index.scss';
import logoImg from "./assets/logo.svg";
import illustrationImg from "./assets/group-33.png";
import illustrationImg2 from "./assets/group-33@2x.png";
import illustrationImg3 from "./assets/group-33@3x.png";
import hIWIllustrationImg from "./assets/group-272.png";
import hIWIllustrationImg2 from "./assets/group-272@2x.png";
import hIWIllustrationImg3 from "./assets/group-272@3x.png";
import feature2 from "./assets/feature-2.svg";
import feature3 from "./assets/feature-3.svg";
import feature4 from "./assets/feature-4.svg";
import feature5 from "./assets/feature-5.svg";
import feature6 from "./assets/feature-6.svg";
import feature7 from "./assets/feature-7.svg";
import feature8 from "./assets/feature-8.svg";
import graph from "./assets/graph.svg";

export default class HomePage extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="home-page">
                <link href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700&display=swap" rel="stylesheet" />
                <section className="fold">
                  <header className='header side-padding'>
                    <img src={logoImg} alt="" className="logo" />
                    <nav>
                      <div className="menu-icon">
                        <div className="menu-icon-bar"></div>
                        <div className="menu-icon-bar"></div>
                        <div className="menu-icon-bar"></div>
                      </div>
                      <ul className="menu-links">
                        <li><a href="">Home</a></li>
                        <li><a href="">What is Psysession</a></li>
                        <li><a href="">How it works</a></li>
                        <li><a href="">Features</a></li>
                        <li><a href="">Why is it so effective</a></li>
                        <li><a href="">Contacts</a></li>
                      </ul>
                    </nav>
                  </header>

                  <article className="side-padding">
                    <h1 className="margin-bottom-small">
                      A secure cloud-based platform for enhancing therapy
                    </h1>
                    <p className="margin-bottom">Created by therapists and developers for therapists and patients</p>
                    <a href="/login" className="btn-primary margin-bottom-medium">Try it now</a>
                  </article>
                </section>

                <section className="what-is-psysession">
                  <article className="side-padding">
                    <img className="what-is-psysession-image"
                         src={illustrationImg}
                         srcSet={`${illustrationImg2} 2x, ${illustrationImg3} 3x`}
                         alt="psysession platform illustration"/>
                    <h2 className="margin-bottom">What is <br/> PsySession?</h2>
                    <p className="margin-bottom-medium">
                      Breakthrough therapeutic sessions are exciting, but preserving their impact is difficult without continuous daily work. In most cases, the patient is likely to put aside important session content and forget about it until the next session. This impedes therapeutic progress.
                    </p>
                    <p><strong>This is where PsySession - a mobile and desktop cloud-based system - comes in.</strong></p>
                  </article>
                </section>

                <section className="how-it-works">
                  <article className="side-padding padding-top-large padding-bottom-large">
                    <h2 className="margin-bottom-medium text-primary text-center">How it works</h2>
                    <img className="how-it-works-illustration"
                         src={hIWIllustrationImg}
                         srcSet={`${hIWIllustrationImg2} 2x, ${hIWIllustrationImg3} 3x`}
                         alt="How psysession platform works illustration"/>
                    <a href={hIWIllustrationImg3} className="btn-primary btn-plus"></a>
                  </article>
                </section>

                <section className="system-features text-center padding-top-large padding-bottom-large side-padding">
                  <h2 className="text-primary padding-bottom-large side-padding">System features include</h2>
                  <ul className="system-features-grid">
                    <li>
                      <img className="padding-bottom-medium" src={feature2} alt=""/>
                      <p>Mobile communication in between sessions</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature2} />
                      <p>Therapy progress measurement tools</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature3} />
                      <p>Daily therapeutic reminders (Resonators)</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature4} />
                      <p>Therapist-Patient communication automation tools</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature5} />
                      <p>Patient status and followup control panel</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature6} />
                      <p>Tools for personalizing the above for every specific patient</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature7} />
                      <p>Psychology questionnaires</p>
                    </li>
                    <li>
                      <img className="padding-bottom-medium" src={feature8} />
                      <p>CBT-like homework forms</p>
                    </li>
                  </ul>
                  <a href="/login" className="btn-primary margin-bottom-medium">Try it now</a>
                </section>

                <section className="effectiveness padding-top-large padding-bottom-large side-padding text-accent-secondary">
                  <img className="effectiveness-img margin-bottom-large"
                       width="200px"
                       src={illustrationImg}
                       srcSet={`${illustrationImg2} 2x, ${illustrationImg3} 3x`}
                  />
                  <h2 className="text-primary padding-bottom">Why is it so effective?</h2>
                  <p>
                    The daily interaction with PsySession creates a stronger emotional bond between the patient and the therapeutic content enhancing therapy effectiveness. The data accumulated also
                    helps the therapist identify what’s working and what needs to be improved with each patient, creating an optimal platform for progress.
                  </p>

                  <h3>Quantifying and measuring</h3>
                  <img className="effectiveness-graph" src={graph} alt="graph illustration"/>
                </section>
            </div>
        );
    }
}
