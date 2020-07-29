import React, {Component} from 'react';
import {actions} from '../actions/sessionActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import LoginForm from './LoginForm';
import './Visitor.scss';

class Visitor extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit({email, password}) {
        this.props.login({email, password});
    }

    render() {
        return (
            <div className='visitorScreen'>
                <LoginForm onSubmit={this.handleSubmit} />
            </div>
        );
    }
}

function mapStateToProps() {
    return { };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        login: actions.login
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Visitor);
