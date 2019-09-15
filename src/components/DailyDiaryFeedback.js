import _ from 'lodash';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../actions/dailyDiaryFeedbackActions';
import { Card, CardHeader, CardText, CardTitle } from 'material-ui/Card';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton'
import TextField from 'material-ui/TextField';
import { GridList, GridTile } from 'material-ui/GridList'

import Divider from 'material-ui/Divider';
import FlatButton from 'material-ui/FlatButton';
import NavigationExpandLess from 'material-ui/svg-icons/navigation/expand-less';
import NavigationExpandMore from 'material-ui/svg-icons/navigation/expand-more';
import NavigationChevronLeft from 'material-ui/svg-icons/navigation/chevron-left';
import NavigationChevronRight from 'material-ui/svg-icons/navigation/chevron-right';
import ContentSave from 'material-ui/svg-icons/content/save';

import styles from './DailyDiaryFeedback.cssmodule.scss';
import React, { Component } from 'react';
import classNames from 'classnames';
import { constants } from 'os';
import { DatePicker, Paper } from 'material-ui';

class DailyDiaryFeedback extends Component {
    constructor(props) {
        super(props);
        this.renderQuestion = this.renderQuestion.bind(this);
        this.onSaveContentClicked = this.onSaveContentClicked.bind(this);

        this.state = {
            showSave: false,
            value: '',
        }
    }

    handleAnswerClick(answerId) {
        this.props.sendDiaryAnswer({
            answerId
        });
    }

    onSaveContentClicked() {
        this.handleAnswerClick(this.state.value);
        this.setState({ showSave: false });
    }

    toFormattedDate(val) {
        var month = (val.getMonth() + 1);
        var day = (val.getDate());
        var year = (val.getFullYear());
        return year + "-" + month + "-" + day;
    }


    handleTextChange(val) {
        this.setState({
            showSave: true,
            value: val
        });
    }

    renderQuestionDescription(description) {
        return (
            <div>
                {description}
            </div>
        );
    }

    renderButtons() {
        const { currentRowIdx, entryCount, currentColumnIdx, header, rtl } = this.props;
        const colCount = header[8].length - 1;

        return (
            <CardText className={
                classNames(styles.diaryText, {
                    [styles.questionDescriptionRtl]: rtl,
                    [styles.questionDescriptionLtr]: !rtl
                })
            }>
                <GridList cellHeight="auto" cols={3} padding={2} >

                    <GridTile />
                    <GridTile>
                        <FlatButton
                            disabled={(currentRowIdx <= 0)}
                            style={{ marginTop: 1 }}
                            backgroundColor='#ccccfb'
                            icon={<NavigationExpandLess />}
                            onTouchTap={this.props.showPreviousEntry}
                            fullWidth={true}
                        />
                    </GridTile>
                    <GridTile />

                    <GridTile>
                        <FlatButton
                            disabled={(currentColumnIdx <= 0)}
                            style={{ marginTop: 1 }}
                            backgroundColor='#ccfccc'
                            icon={<NavigationChevronLeft />}
                            onTouchTap={this.props.showPreviousColumn}
                            fullWidth={true}
                        />
                    </GridTile>

                    <GridTile>
                        <FlatButton
                            disabled={!(this.state.showSave)}
                            style={{ marginTop: 1 }}
                            backgroundColor='#Faeeee'
                            icon={<ContentSave />}
                            onTouchTap={this.onSaveContentClicked}
                            fullWidth={true}
                        />
                    </GridTile>


                    <GridTile>
                        <FlatButton
                            disabled={(currentColumnIdx >= colCount)}
                            style={{ marginTop: 1 }}
                            backgroundColor='#ccfccc'
                            icon={<NavigationChevronRight />}
                            onTouchTap={this.props.showNextColumn}
                            fullWidth={true}
                        />
                    </GridTile>

                    <GridTile />

                    <GridTile>
                        <FlatButton
                            disabled={(currentRowIdx >= entryCount)}
                            style={{ marginTop: 1 }}
                            backgroundColor='#ccccfb'
                            icon={<NavigationExpandMore />}
                            onTouchTap={this.props.showNextEntry}
                            fullWidth={true}
                        />
                    </GridTile>
                    <GridTile />

                </GridList>
            </CardText >

        );
    }

    renderAnswer(answer, answerType) {
        const { options } = this.props;
        const key = answerType.substring(0, 1);
        const keyType = parseInt(key);
        if (keyType == 0) {
            return (
                <div>
                    <Paper zDepth={1} width={500}>
                        <RadioButtonGroup
                            valueSelected={answer}
                        //onChange={(event, value) => this.handleAnswerClick(value)}
                        >
                            {_.map(options, op => (
                                <RadioButton value={op[2]} label={op[1]} valueSelected={answer == op[2]} />
                            ))}
                        </RadioButtonGroup>
                    </Paper>
                </div>);
        }
        else if (keyType == 1) {

            if (!this.state.showSave)
                this.state.value = answer;
            return (
                <div>
                    <Paper zDepth={1} width={500}>
                        <TextField
                            hintText="Type here"
                            multiLine={true}
                            rows={2}
                            rowsMax={4}
                            value={this.state.value}
                            fullWidth={true}
                            onChange={(event, value) => this.handleTextChange(value)}
                            ref={el => this.textField = el}
                        />
                    </Paper>
                </div>);
        } else if (keyType == 2) {
            return (
                <div>
                    <Paper zDepth={1} width={500}>
                        <RadioButtonGroup
                            valueSelected={answer}
                            onChange={(event, value) => this.handleAnswerClick(value)}
                        >
                            {_.map(options, op => (
                                <RadioButton value={op[2]} label={op[1]} valueSelected={answer == op[2]} />
                            ))}
                        </RadioButtonGroup>
                    </Paper>
                </div>);
        } else if (keyType == 3) {
            return (
                <div>
                    <Paper zDepth={1} width={500}>
                        <DatePicker
                            autoOk={true}
                            value={(answer != undefined && answer != '' && answer != null) ? new Date(answer) : null}
                            hintText='Date on'
                            onChange={(event, value) => this.handleAnswerClick(this.toFormattedDate(value))}
                        >
                        </DatePicker>
                    </Paper>

                </div>);
        }
    }

    renderQuestion(q) {
        const { rtl } = this.props;
        const { header } = this.props;
        const { currentRowIdx, currentColumnIdx, entryCount } = this.props;

        const ans = q[currentColumnIdx + 1];
        const ansType = header[9][currentColumnIdx];

        return (
            <Card key={q[0][0]}>
                <CardHeader
                    className={
                        classNames(styles.diaryHeader, {
                            [styles.questionDescriptionRtl]: rtl,
                            [styles.questionDescriptionLtr]: !rtl
                        })
                    }
                    title={this.renderQuestionDescription(header[2][1])}
                />
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#05c514' }} />

                <CardText className={
                    classNames(styles.diaryText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    {<div className='listitem-text'>{`MainDiary - Line ${q[0]}`}</div>}
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#770077' }} />

                <CardText className={
                    classNames(styles.diaryText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <div>
                        {`${header[6][currentColumnIdx]}`}
                    </div>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#770077' }} />

                <CardText className={
                    classNames(styles.diaryText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <div>
                        {`${header[7][currentColumnIdx]} Col(${currentColumnIdx})`}
                    </div>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#770077' }} />

                <CardText className={
                    classNames(styles.hintText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    <div>
                        {`Tip: ${header[8][currentColumnIdx]}`}
                    </div>
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#05c514' }} />

                <CardText className={
                    classNames(styles.diaryText, {
                        [styles.questionDescriptionRtl]: rtl,
                        [styles.questionDescriptionLtr]: !rtl
                    })
                }>
                    {this.renderAnswer(ans, ansType)}
                </CardText>
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#05c514' }} />

                {this.renderButtons()}
                <Divider style={{ marginTop: 1, marginBottom: 0, height: 2, backgroundColor: '#05c514' }} />

            </Card >
        );
    }

    renderDone() {
        return (
            <Card key='done'>
                <CardText className={styles.done}>
                    Your feedback was successfully recorded.
                    <br />
                </CardText>
            </Card>
        );
    }

    render() {
        const { diaryEntry } = this.props;

        return (
            <div className='row' style={{
                display: 'flex',
                width: '100%',
                marginTop: 30,
                direction: this.props.rtl ? 'rtl' : 'ltr'
            }}>
                <div className='center-block'>
                    {diaryEntry ? this.renderQuestion(diaryEntry) :
                        this.renderDone()}
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const { resonator, diaryData, currentRowIdx, currentColumnIdx } = state.dailyDiaryFeedback;
    if (resonator) {
        const header = diaryData.header;
        const diaryEntry = diaryData.row_values[currentRowIdx];
        const options = diaryData.options;

        return {
            resonator,
            header,
            diaryEntry,
            currentRowIdx,
            currentColumnIdx,
            options: options,
            entryCount: diaryData.row_values.length - 1,
            rtl: diaryEntry && shouldDisplayRtl(diaryEntry, currentColumnIdx)
        };
    }
    else {
        return {};
    }
}

function shouldDisplayRtl(diaryEntry, colIdx) {
    function isHebrewLetter(letter) {
        const code = letter.charCodeAt(0);
        return code === 32 || code >= 1488 && code <= 1514;
    }

    const text = diaryEntry[colIdx] || '';
    const textArr = text.toString().split('');

    const hebrewLettersCount = _.reduce(textArr, (acc, letter) => {
        return acc + (isHebrewLetter(letter) ? 1 : 0);
    }, 0);

    const isHebrew = hebrewLettersCount / textArr.length > 0.5;
    return isHebrew;
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        sendDiaryAnswer: actions.sendAnswer,
        showPreviousEntry: actions.showPreviousEntry,
        showNextEntry: actions.showNextEntry,
        showPreviousColumn: actions.showPreviousColumn,
        showNextColumn: actions.showNextColumn
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DailyDiaryFeedback);
