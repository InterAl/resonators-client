import React, { Component } from 'react';
import './index.scss';
import logoImg from "./assets/logo.svg";
import bgImg from "./assets/bg.jpg";
import bgImg2 from "./assets/bg@2x.jpg";
import bgImg3 from "./assets/bg@3x.jpg";

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
                    <h1 className="vertical-space-small">
                      A secure cloud-based platform for enhancing therapy
                    </h1>
                    <p className="vertical-space">Created by therapists and developers for therapists and patients</p>
                    <button className="btn-primary vertical-space-medium">Try it now</button>
                  </article>
                </section>
            </div>
        );
    }
}
