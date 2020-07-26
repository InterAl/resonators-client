import _ from 'lodash';
import React, { Component } from 'react';
import { actions } from '../../../actions/resonatorCreationActions';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import NavButtons from './navButtons';
import ResonatorImage from '../../ResonatorImage';
import { Button, Typography } from '@material-ui/core';

class EditResonatorMedia extends Component {
    constructor() {
        super();

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);

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

        let lastPicture = _(this.props.resonator.items)
            .filter(i => i.media_kind === 'picture')
            .sortBy(i => new Date(i.created_at))
            .last();
        if (lastPicture)
            lastPicture.visible = 1;

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

    handleRemoveImage(ev) {
        ev.reset;

        let lastPicture = _(this.props.resonator.items)
            .filter(i => i.media_kind === 'picture')
            .sortBy(i => new Date(i.created_at))
            .last();
        if (lastPicture)
            lastPicture.visible = 0;

        this.props.updateCreationStep({
            imageFile: null,
            removeOldFile: true
        });
        this.setState({
            previewImage: null
        });
        this.imageFileInput.value = '';
    }

    render() {
        return (
            <div>
                <Typography variant="subtitle1">Upload an image</Typography>

                <ResonatorImage
                    resonator={this.props.resonator}
                    preview={this.state.previewImage}
                />

                <br />

                <input type="file"
                    onChange={this.handleFileChange}
                    accept="image/*"
                    ref={el => this.imageFileInput = el} />

                <br />

                <Button
                    variant="contained"
                    onClick={this.handleRemoveImage}
                    style={{ marginTop: 30, marginBottom: 30 }}>
                    Remove Image
                </Button>

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
