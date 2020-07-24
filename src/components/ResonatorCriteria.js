import _ from 'lodash';
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import DownloadChartIcon from 'material-ui/svg-icons/file/file-download';
import { push } from 'react-router-redux';
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
        let {follower_id, id: resonatorId} = this.props.resonator;
        this.props.push(`/followers/${follower_id}/resonators/${resonatorId}/stats/${criterionId}`);
    }

    handleDownloadChart() {

    }

    renderChartIcon(qid) {
        return <IconButton onTouchTap={() => this.handleShowChart(qid)}
                           style={{width:48, height: 48}} tooltip='Show Chart'>
                   <ChartIcon size='large' style={{width: 128, height: 128}}/>
                </IconButton>
    }

    renderCriterion({question_id: qid, question}, idx) {
        return (
            <ListItem
                disabled={true}
                key={idx}
                primaryText={<div className='listitem-text'>{question.title}</div>}
                rightIcon={
                    <div className='buttons-row'>
                        {this.renderChartIcon(qid)}
                        <IconButton
                            tooltip='Download Chart'
                            onTouchTap={() => this.handleDownloadChart(question.id)}>
                            <DownloadChartIcon />
                        </IconButton>
                    </div>
                }
            />
        );
    }

    render() {
        return (
            <div className='resonator-criteria row'>
                <List className='list col-xs-12 col-sm-6 col-sm-offset-3'>
                    <Subheader>Resonator Criteria - View User Data</Subheader>
                    <ListItem
                        disabled={true}
                        primaryText='All Criteria'
                        rightIcon={this.renderChartIcon('all')}
                    />
                    {_.map(this.props.resonator.questions, this.renderCriterion)}
                </List>
            </div>
        );
    }
}

export default connect(null, dispatch => bindActionCreators({
    push
}, dispatch))(ResonatorCriteria);
