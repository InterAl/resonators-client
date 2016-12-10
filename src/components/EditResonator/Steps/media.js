import React, {Component} from 'react';
import {connect} from 'react-redux';
import {reduxForm} from 'redux-form';
import NavButtons from './navButtons';

class EditResonatorMedia extends Component {
    render() {
        return (
            <form onSubmit={this.props.handleSubmit(this.props.onNext)}>
                <input type="file"
                       onChange={ev => console.log('zzzz', ev.target.files)}
                       accept="image/*" />

                <NavButtons onBack={this.props.onBack}/>
            </form>
        );
    }
}

function mapStateToProps() {
    return {
        initialValues: {}
    };
}

export default connect(mapStateToProps)(reduxForm({
    form: 'EditResonatorMedia'
})(EditResonatorMedia));
