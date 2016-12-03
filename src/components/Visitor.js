import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Button from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import './Visitor.scss';

export default class Visitor extends Component {
    render() {
        return (
            <div className='visitorScreen row'>
                <Card className='loginCard col-sm-3'>
                    <CardHeader title="Login" />
                    <CardText className='cardText'>
                        <TextField fullWidth={true} placeholder='Email'/><br/>
                        <TextField fullWidth={true} placeholder='Password' type='password'/>
                        <div className='submitBtnWrapper'>
                            <Button className='submitBtn' label='submit' primary={true} />
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
