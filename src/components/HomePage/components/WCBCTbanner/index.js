import React, { Component } from 'react'
import './index.scss'
import img from './WCBCT.jpg'


export class WCBCT extends Component {

  render() {
    return (
      <div className="wcbct-banner">
        <div className="wcbct-container">
          <img className="wcbct-image" src={img} alt="WCBCT logo"/>
          <article className="wcbct-text">
            <p>Come see us in the WCBCT 2019 congress in Berlin</p>
            <p><strong>Friday July 19nth 13:00 - 14:00 on Room M5 (Level 3)</strong></p>
            <p>For a technical presentation</p>
          </article>
        </div>
      </div>
    )
  }
}
