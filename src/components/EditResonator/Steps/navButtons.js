import React from 'react';
import NextButton from './nextButton';
import BackButton from './backButton';
import './navButtons.scss';

export default ({onNext, onBack, noBack, noNext}) => {
    return (
        <div className='navButtons'>
            {!noBack && <BackButton
                className='backBtn'
                onClick={onBack}
                style={{marginRight: 6}}/>}
            {!noNext && <NextButton className='nextBtn ' onClick={onNext}/>}
        </div>
    );
}
