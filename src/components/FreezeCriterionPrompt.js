import _ from 'lodash';
import React, {Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {actions} from '../actions/criteriaActions';
import navigationInfoSelector from '../selectors/navigationSelector';
import SimplePrompt from './SimplePrompt';
import { Typography } from '@material-ui/core';

class FreezeCriterionPrompt extends Component {
    constructor() {
        super();
               
        this.handleFreezeClick = this.handleFreezeClick.bind(this);
    }
    
    handleFreezeClick() {
       this.props.freezeCriterion(this.props.criteria.id);   
      }

    render() {
        if (!this.props.criteria) return null;      

        const { criteria } = this.props;

        return (
            <SimplePrompt
                title='Deactivate Criteria'
                acceptText='Confirm'
                text={
                    <Typography>
                        {`Selected criteria will no longer be available in resonators. Continue?`}
                        <br />
                        <br />
                        (Note: inactive criterias can be filtered in/out at the top of this page)
                    </Typography>
                }
                onAccept={this.handleFreezeClick}
                onClose={this.props.onClose}
                open={this.props.open}
            />
        );
    }
}

function mapStateToProps(state) {
    let { modalProps: { criterionId } } = navigationInfoSelector(state);
    let criteria = _.find(state.criteria.criteria, f => f.id === criterionId);
 
    return {
        criteria       
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        freezeCriterion: actions.freeze
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FreezeCriterionPrompt);
