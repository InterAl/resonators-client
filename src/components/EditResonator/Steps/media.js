import _ from "lodash";
import React, { Component } from "react";
import { actions } from "../../../actions/resonatorCreationActions";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import NavButtons from "./navButtons";
import ResonatorImage from "../../ResonatorImage";
import { Button, Paper, Tabs, Tab } from "@material-ui/core";
import getResonatorImage from "../../../selectors/getResonatorImage";
import CloseIcon from '@material-ui/icons/Close';

import "./media.scss";

class EditResonatorMedia extends Component {
    constructor() {
        super();

        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleRemoveImage = this.handleRemoveImage.bind(this);
        this.hideImagePicker = this.hideImagePicker.bind(this);
        this.showImagePicker = this.showImagePicker.bind(this);
        this.renderImagePicker = this.renderImagePicker.bind(this);
        this.showLastPicture = this.showLastPicture.bind(this);

        this.state = {
            previewImage: null,
            imagePicker: false,
            searchPhoto: "",
            activePicker: 0
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

        this.showLastPicture();
        this.setImagePreview(file);
    }

    showLastPicture() {
        let lastPicture = _(this.props.resonator.items)
            .filter((i) => i.media_kind === "picture")
            .sortBy((i) => new Date(i.createdAt))
            .last();
        if (lastPicture) lastPicture.visible = 1;
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

    showImagePicker() {
        this.setState({imagePicker: true});
    }

    hideImagePicker() {
        this.setState({imagePicker: false, searchPhoto: ""});
    }

    async pickImage(imageUrl) {
        this.setState({
            previewImage: imageUrl,
        });
        this.props.updateCreationStep({
            imageUrl: imageUrl,
        });
        this.showLastPicture();
        this.hideImagePicker();
    }

    pickBase64(base64) {
        this.props.updateCreationStep({
            imageBase64: base64,
        });
        this.setState({
            previewImage: base64
        });
        this.showLastPicture();
        this.hideImagePicker();
    }

    renderImagePicker() {
        if (!this.state.imagePicker) return false;
        return (
            <>
                <div className="imagePicker_wrapper" onClick={this.hideImagePicker}/>
                <div className="imagePicker">
                    <div className="imagePicker_searchbar">
                        <input
                            placeholder="Search..."
                            type="text"
                            name="searchPhotos"
                            onChange={(e) => this.setState({searchPhoto: e.target.value})}
                        />
                        <CloseIcon onClick={this.hideImagePicker} />
                    </div>
                    <Paper square>
                        <Tabs
                            value={this.state.activePicker}
                            indicatorColor="primary"
                            textColor="primary"
                            onChange={(e, value) => this.setState({activePicker: value})}
                        >
                            <Tab label="System Drive" />
                            <Tab label="User Drive" />
                        </Tabs>
                    </Paper>
                    <div className="imagePicker_list" role="tabpanel" hidden={this.state.activePicker !== 0}>
                        {this.props.googleSystemPhotos
                            .filter((photo) => photo.description.includes(this.state.searchPhoto))
                            .map((photo) => (
                                <img key={photo.id} src={photo.image} alt="" onClick={() => this.pickBase64(photo.image)}/>
                            ))
                        }
                    </div>
                    <div className="imagePicker_list" role="tabpanel" hidden={this.state.activePicker !== 1}>
                        {this.props.googlePhotos
                            .filter((photo) => photo.description.includes(this.state.searchPhoto))
                            .map((photo) => (
                                <img key={photo.id} src={photo.image} alt="" onClick={() => this.pickImage(photo.image)}/>
                            ))
                        }
                    </div>
                </div>
            </>
        );
    }

    render() {
        return (
            <div>
                <ResonatorImage resonator={this.props.resonator} preview={this.state.previewImage} />
                {(this.state.previewImage || getResonatorImage(this.props.resonator)) ? (
                    <div>
                        <Button onClick={this.handleRemoveImage} style={{ color: "#ff4444", marginLeft: 8 }}>
                            Remove Image
                        </Button>
                    </div>
                ) : null}
                <div className="media_selector">
                    <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="image-input"
                        type="file"
                        onChange={this.handleFileChange}
                    />
                    <div className="select_image_wrapper">
                        <p className="select_image_text">Select image from</p>
                        <div className="select_image_buttonWrapper">
                            <label htmlFor="image-input">
                                <Button variant="contained" color="primary" component="span">Local Storage</Button>
                            </label>
                            {(this.props.googlePhotos.length > 0 || this.props.googleSystemPhotos.length > 0) &&
                                <>
                                    <span className="select_image_buttonSeparator">- OR -</span>
                                    <Button variant="contained" color="primary" onClick={this.showImagePicker}>Google Drive</Button>
                                </>
                            }
                        </div>
                    </div>
                    {this.renderImagePicker()}
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
        googlePhotos: state.googleData.googlePhotos || [],
        googleSystemPhotos: state.googleData.googleSystemPhotos || []
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EditResonatorMedia);
