import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

class EditResonator extends Component {
    render() {
        return (
            <div className='row'>
                <div className='col-sm-8'>
                    aaaaaaaa
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        state
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonator);
