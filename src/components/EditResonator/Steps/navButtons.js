import React from 'react';
import NextButton from './nextButton';
import BackButton from './backButton';
import './navButtons.scss';

export default ({onNext, onBack, noBack, noNext}) => {
    return (
        <div className='navButtons'>
            {!noBack && <BackButton
                className='backBtn'
                onTouchTap={onBack}
                style={{marginRight: 6}}/>}
            {!noNext && <NextButton className='nextBtn ' onTouchTap={onNext}/>}
        </div>
    );
}
