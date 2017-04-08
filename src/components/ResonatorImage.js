import React from 'react';
import getResonatorImage from '../selectors/getResonatorImage';

export default ({resonator, preview, width = 120, height = 300}) => {
    let url = preview || getResonatorImage(resonator);

    return (
        <img src={url} style={{
            display: 'block',
            maxWidth: width,
            maxHeight: height,
            width: 'auto',
            height: 'auto'
        }}/>
    );
};
