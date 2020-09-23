import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../../../actions/resonatorCreationActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NavButtons from "./navButtons";
import ResonatorImage from "../../ResonatorImage";
import { Button } from "@material-ui/core";
import getResonatorImage from "../../../selectors/getResonatorImage"

class EditResonatorMedia extends Component {
    constructor() {
        super();

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);

        this.state = {
            previewImage: null,
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
            imageFile: file,
        });

        let lastPicture = _(this.props.resonator.items)
            .filter((i) => i.media_kind === "picture")
            .sortBy((i) => new Date(i.createdAt))
            .last();
        if (lastPicture) lastPicture.visible = 1;

        this.setImagePreview(file);
    }

    setImagePreview(file) {
        var reader = new FileReader();

        reader.onload = (e) => {
            this.setState({
                previewImage: e.target.result,
            });
        };

        reader.readAsDataURL(file);
    }

    handleRemoveImage(ev) {
        ev.reset;

        let lastPicture = _(this.props.resonator.items)
            .filter((i) => i.media_kind === "picture")
            .sortBy((i) => new Date(i.createdAt))
            .last();
        if (lastPicture) lastPicture.visible = 0;

        this.props.updateCreationStep({
            imageFile: null,
            removeOldFile: true,
        });
        this.setState({
            previewImage: null,
        });
    }

    render() {
        return (
            <div>
                <ResonatorImage resonator={this.props.resonator} preview={this.state.previewImage} />
                <div>
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-input"
                        type="file"
                        onChange={this.handleFileChange}
                    />
                    <label htmlFor="image-input">
                        <Button variant="contained" color="primary" component="span">
                            Upload Image
                        </Button>
                    </label>
                    {(this.state.previewImage || getResonatorImage(this.props.resonator)) ? (
                        <Button onClick={this.handleRemoveImage} style={{ color: "#ff4444", marginLeft: 8 }}>
                            Remove Image
                        </Button>
                    ) : null}
                </div>
                {!this.props.editMode && <NavButtons onNext={this.props.onNext} onBack={this.props.onBack} />}
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(
        {
            updateCreationStep: actions.updateCreationStep,
        },
        dispatch
    );
}

function mapStateToProps(state) {
    return {
        resonator: state.resonatorCreation.resonator,
        image: state.resonatorCreation.formData.imageFile,
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonatorMedia);
