import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List, ListItem, ListSubheader, ListItemText, ListItemSecondaryAction, IconButton, Tooltip } from '@material-ui/core';
import { GetApp, InsertChart } from '@material-ui/icons';
import { push } from 'connected-react-router';
import './ResonatorCriteria.scss';

class ResonatorCriteria extends Component {
    static propTypes = {
        resonator: PropTypes.object
    }

    constructor(props) {
        super(props);

        this.renderCriterion = this.renderCriterion.bind(this);
    }

    handleShowChart(criterionId) {
        let { follower_id, id: resonatorId } = this.props.resonator;
        this.props.push(`/followers/${follower_id}/resonators/${resonatorId}/stats/${criterionId}`);
    }

    handleDownloadChart() {

    }

    renderChartIcon(qid) {
        return (
            <Tooltip title='Show Chart'>
                <IconButton
                    onClick={() => this.handleShowChart(qid)}
                    style={{ width: 48, height: 48 }}>
                    <InsertChart size='large' style={{ width: 128, height: 128 }} />
                </IconButton>
            </Tooltip>
        )
    }

    renderCriterion({ question_id: qid, question }, idx) {
        return (
            <ListItem
                disabled={true}
                key={idx}>
                <ListItemText primary={question.title} className='listitem-text' />
                <ListItemSecondaryAction>
                    <div className='buttons-row'>
                        {this.renderChartIcon(qid)}
                        <Tooltip title='Download Chart'>
                            <IconButton onClick={() => this.handleDownloadChart(question.id)}>
                                <GetApp />
                            </IconButton>
                        </Tooltip>
                    </div>
                </ListItemSecondaryAction>
            </ListItem>
        );
    }

    render() {
        return (
            <div className='resonator-criteria row'>
                <List
                    className='list'
                    subheader={
                        <ListSubheader>Resonator Criteria - View User Data</ListSubheader>
                    }>
                    <ListItem disabled={true}>
                        <ListItemText primary='All Criteria' />
                        <ListItemSecondaryAction>
                            {this.renderChartIcon('all')}
                        </ListItemSecondaryAction>
                    </ListItem>
                    {_.map(this.props.resonator.questions, this.renderCriterion)}
                </List>
            </div>
        );
    }
}

export default connect(null, dispatch => bindActionCreators({
    push
}, dispatch))(ResonatorCriteria);
