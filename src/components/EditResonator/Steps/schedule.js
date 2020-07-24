import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {actions} from '../../../actions/resonatorCreationActions';
import {Field} from 'redux-form';
import TimePicker from 'material-ui/TimePicker';
import BackButton from './backButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Toggle from 'material-ui/Toggle';
import Checkbox from 'material-ui/Checkbox';

import StepBase from './stepBase';
import moment from 'moment';
import './schedule.scss';

var selectedDayIndex = -1;

class EditResonatorSchedule extends Component {

    static propTypes = {
        updateIntractionType: React.PropTypes.func
    }

    constructor() {
        super();

        this.handleCreate = this.handleCreate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleSelectTime = this.handleSelectTime.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.resonatorCreated && nextProps.resonatorCreated)
            this.props.onNext();
    }

    handleCreate(formData) {
        this.props.updateCreationStep(formData);
        this.props.createResonator();
    }

    handleUpdate(formData) {
        this.props.updateCreationStep(formData);
        this.props.onNext();
    }

    handleSelectTime(dateTime, changeField) {
        const now = moment();

        //So the server won't immediately send it
        if (dateTime < now)
            dateTime = moment(dateTime).clone().add(1, 'd').toDate();

        changeField(dateTime);
    }

    handleSelectDay(checked, onChange, selectedIndex) {
        selectedDayIndex = selectedIndex;
        onChange(checked);
    }

    renderDays() {
        return [0,1,2,3,4,5,6].map(i => (
            <Field
                key={i}
                className='day'
                name={`day${i}`}
                component={({ input: { onChange, value }, meta, ...custom }) => (
                    <Checkbox
                        checked={!!value}
                        onCheck={(ev, checked) => this.handleSelectDay(checked, onChange, i)}
                        {...custom}
                    />
                )}
                style={{ width: 'initial' }}
                label={moment().startOf('w').add(i, 'd').format('dddd')}
                iconStyle={{marginRight: 1}}
            />
        ));
    }

    renderDivider() {
        return (
            <Divider style={{marginTop: 20, marginBottom: 20}}/>
        );
    }

    handleSelectOneOff(value, onChange) {
        let result = value === 'on' ? 'off' : 'on'
        onChange(result);
    }

    renderOneOff() {
        return (
            <Field name='oneOff'
                component={({ input: { onChange, value }, meta, ...custom }) => (
                    <Toggle
                        toggled={value === 'on'}
                        onToggle={() => this.handleSelectOneOff(value, onChange)}
                        {...custom}
                    />)}
                style={{ top: 8, marginBottom: 16 }}
                label='One Off'
                labelPosition='right'
            />);
    }

    render() {
        return (
            <div className='edit-resonator-schedule row'>
                <div className='col-sm-12'>
                    <div className='days'>
                        {this.renderOneOff()}
                    </div>
                    <div className='subheader'>
                        Days active:
                    </div>
                    <div className='days'>
                        {this.renderDays()}
                    </div>
                    {this.renderDivider()}
                    <Field
                        name='time'
                        label='Sending time'
                        component={
                            ({ input: { value, onChange }, meta: { touched, error } }) =>
                                <TimePicker
                                    autoOk={true}
                                    hintText='Sending Time'
                                    onChange={(e, date) => this.handleSelectTime(date, onChange)}
                                    value={(value ? new Date(value) : new Date())}
                                    errorText={touched && error}
                                />
                        }
                    />
                    {!this.props.editMode &&
                        <div className='navButton'>
                            <BackButton onTouchTap={this.props.onBack}
                                style={{ marginRight: 8 }} />
                            {<RaisedButton
                                primary={true}
                                label='Next'
                                style={{ marginRight: 8 }}
                                onTouchTap={
                                    this.props.handleSubmit(
                                        this.props.resonatorCreated ?
                                            this.handleUpdate :
                                            this.handleCreate
                                    )
                                }
                            />}
                        </div>}
                    </div>
                </div>
        );
    }
}

EditResonatorSchedule = StepBase({
    noNext: true,
    noBack: true,
    validate(formData, /* props */) {
        let errors = {};

        if (!formData.time) {
            formData.time = new Date();
            // errors.time = 'Required';
        }

        if (formData.oneOff === 'on') {
            var selectedOne = false;
            [0, 1, 2, 3, 4, 5, 6].forEach((item, i) => {
                if (formData[`day${item}`] && !selectedOne && (selectedDayIndex >= 0 && selectedDayIndex == i))
                    selectedOne = true;
                else
                    formData[`day${item}`] = false
            });
        }

        // props.updateIntractionType(parseInt(formData.interactionType));

        return errors;
    }
})(EditResonatorSchedule);

EditResonatorSchedule = connect(state => ({
    resonatorCreated: state.resonatorCreation.resonator
}), dispatch => bindActionCreators({
    createResonator: actions.create,
    updateCreationStep: actions.updateCreationStep
}, dispatch))(EditResonatorSchedule);

export default EditResonatorSchedule;
