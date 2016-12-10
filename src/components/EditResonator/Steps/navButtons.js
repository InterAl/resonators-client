import React from 'react';
import NextButton from './nextButton';
import BackButton from './backButton';
import './navButtons.scss';

export default ({onBack, noBack, noNext}) => {
    return (
        <div className='navButtons'>
            {!noBack && <BackButton
                className='backBtn'
                onClick={onBack}
                style={{marginRight: 6}}/>}
            {!noNext && <NextButton className='nextBtn '/>}
        </div>
    );
}
