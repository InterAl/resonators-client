import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import ChartIcon from 'material-ui/svg-icons/editor/insert-chart';
import DownloadChartIcon from 'material-ui/svg-icons/file/file-download';
import './ResonatorCriteria.scss';

export default class ResonatorCriteria extends Component {
    static propTypes = {
        resonator: React.PropTypes.object
    }

    constructor(props) {
        super(props);

        this.renderCriterion = this.renderCriterion.bind(this);
    }

    handleShowChart(criterionId) {

    }

    handleDownloadChart(criterionId) {

    }

    renderChartIcon(criterionId) {
        return <IconButton onClick={() => this.handleShowChart(criterionId)}
                           style={{width:48, height: 48}} tooltip='Show Chart'>
                   <ChartIcon size='large' style={{width: 128, height: 128}}/>
                </IconButton>
    }

    renderCriterion({question}, idx) {
        return (
            <ListItem
                disabled={true}
                key={idx}
                primaryText={<div className='listitem-text'>{question.title}</div>}
                rightIcon={
                    <div className='buttons-row'>
                        {this.renderChartIcon()}
                        <IconButton
                            tooltip='Download Chart'
                            onClick={() => this.handleDownloadChart(question.id)}>
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
                        rightIcon={this.renderChartIcon()}
                    />
                    {_.map(this.props.resonator.questions, this.renderCriterion)}
                </List>
            </div>
        );
    }
}
