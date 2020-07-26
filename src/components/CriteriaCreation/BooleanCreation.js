import React, {Component} from 'react';
import { Typography } from '@material-ui/core';
import TextBox from '../FormComponents/TextBox';

export default class BooleanCreation extends Component {
    render() {
        return (
            <div className='boolean-creation'>
                <Typography variant="subtitle1">
                    True / False Creation
                </Typography>
                <div>
                    <TextBox name='answers.true' placeholder='True answer'/>
                    <TextBox name='answers.false' placeholder='False answer'/>
                </div>
            </div>
        );
    }
}
