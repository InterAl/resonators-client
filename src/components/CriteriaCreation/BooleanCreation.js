import React, {Component} from 'react';
import Subheader from 'material-ui/Subheader';
import TextBox from '../FormComponents/TextBox';

export default class BooleanCreation extends Component {
    render() {
        return (
            <div className='boolean-creation'>
                <Subheader>
                    True / False Creation
                </Subheader>
                <div>
                    <TextBox name='answers.true' placeholder='True answer'/>
                    <TextBox name='answers.false' placeholder='False answer'/>
                </div>
            </div>
        );
    }
}
