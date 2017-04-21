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

        this.state = {
            previewImage: null
        };
    }

    componentDidMount() {
        if (this.props.image) {
            this.setImagePreview(this.props.image);
        }
    }

    handleFileChange(ev) {
        const file = ev.target.files[0];

        this.props.updateCreationStep({
            imageFile: file
        });

        this.setImagePreview(file);
    }

    setImagePreview(file) {
        var reader = new FileReader();

        reader.onload = e => {
            this.setState({
                previewImage: e.target.result
            });
        }

        reader.readAsDataURL(file);
    }

    render() {
        return (
            <div>
                <Subheader>Upload an image</Subheader>

                <ResonatorImage
                    resonator={this.props.resonator}
                    preview={this.state.previewImage}
                />

                <br/>

                <input type="file"
                       onChange={this.handleFileChange}
                       accept="image/*" />

                <br/>

                {!this.props.editMode &&
                    <NavButtons
                        onNext={this.props.onNext}
                        onBack={this.props.onBack}
                    />
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
        resonator: state.resonatorCreation.resonator,
        image: state.resonatorCreation.formData.imageFile
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonatorMedia);
