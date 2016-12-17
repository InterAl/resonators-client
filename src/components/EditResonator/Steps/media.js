import React, {Component} from 'react';
import {actions} from '../../../actions/resonatorCreationActions';
import Subheader from 'material-ui/Subheader';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import NavButtons from './navButtons';
import ResonatorImage from '../../ResonatorImage';

class EditResonatorMedia extends Component {
    constructor() {
        super();

        this.handleFileChange = this.handleFileChange.bind(this);
    }

    handleFileChange(ev) {
        this.props.updateCreationStep({
            imageFile: ev.target.files[0]
        });
    }

    render() {
        return (
            <div>
                <Subheader>Upload an image</Subheader>

                <ResonatorImage resonator={this.props.resonator} />

                <br/>

                <input type="file"
                       onChange={this.handleFileChange}
                       accept="image/*" />

                <br/>

                {!this.props.editMode &&
                    <NavButtons onNext={this.props.onNext}
                           onBack={this.props.onBack}/>
                }
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        updateCreationStep: actions.updateCreationStep
    }, dispatch);
}

function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonatorMedia);
