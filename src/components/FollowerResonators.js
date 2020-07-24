import _ from 'lodash';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import EntityTable from './EntityTable';
import { actions } from '../actions/followersActions';
import { actions as navigationActions } from '../actions/navigationActions';
import { actions as resonatorActions } from '../actions/resonatorActions';
import ResonatorImage from './ResonatorImage';
import { push } from 'connected-react-router';
import * as utils from './utils';
// import moment from 'moment';
//import ShowIcon from 'material-ui/svg-icons/image/remove-red-eye';
//import IconButton from 'material-ui/IconButton';
import MoreOptionsMenu from './MoreOptionsMenu';
import MenuItem from 'material-ui/MenuItem';

class FollowerResonators extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showDisabled: true
        }

        this.handleRemoveResonator = this.handleRemoveResonator.bind(this);
    }

    componentDidMount() {
        if (this.props.follower)
            this.props.fetchFollowerResonators(this.props.follower.id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.follower)
            nextProps.fetchFollowerResonators(nextProps.follower.id);
    }

    getHeader() {
        return [
            'Resonator'
        ];
    }

    handleRemoveResonator(id) {
        this.props.showDeleteResonatorPrompt(id);
    }

    renderColumn(resonator) {
        const dir = utils.getResonatorDirection(resonator);

        return (
            <div className='row'>
                <div className='image col-lg-2 col-sm-3 col-xs-6'>
                    <ResonatorImage width={80} height={80} resonator={resonator} />
                </div>
                <div className='name col-lg-10 col-sm-9 col-xs-6'
                    style={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        direction: dir,
                        textAlign: dir === 'rtl' ? 'right' : 'left',
                        color: (resonator.pop_email === false) ? 'rgb(157, 155, 155)' : ''
                    }}>
                    <b>{resonator.title}</b><br />
                    {resonator.content}
                </div>
            </div>
        );
    }

    renderSeperator() {
        return (
            <div className='row'>
                <div className='name col-lg-10 col-sm-9 col-xs-6' style={{
                    display: 'flex',
                    width: '100%',
                    background: 'rgb(187, 187, 187)'
                }}>
                    <b><p>Disabled Resonators</p></b>
                </div>
            </div>
        );
    }

    getRows() {
        const orderedResonators = _.orderBy(this.props.resonators, r => (!r.pop_email));
        //var gotDisabledOne = false;
        return _.reduce(orderedResonators, (acc, r) => {
            // let updatedAt = moment(r.updated_at).format('DD/MM/YYYY hh:mm');
            // if (r.pop_email === false && !gotDisabledOne) {
            //     acc["seperator"] = [this.renderSeperator()];
            //     gotDisabledOne = true;
            // }

            if ((this.state.showDisabled && (!r.pop_email)) || (r.pop_email))
                acc[r.id] = [this.renderColumn(r)];

            return acc;
        }, {});
    }

    toggleShowInactive() {
        this.setState({ showDisabled: !this.state.showDisabled });
    }
    getToolbox() {
        const moreOptions = [];
        var text = 'Show Inactive Resonators';
        if (this.state.showDisabled) {
            moreOptions.push('showFrozen');
            text = 'Hide Inactive Resonators';
        }

        return {
            left: [
            ],
            right: [
                <MoreOptionsMenu
                    multiple
                    value={moreOptions}
                >
                    <MenuItem onTouchTap={() => this.toggleShowInactive()} primaryText={text} value='showFrozen' />
                </MoreOptionsMenu>
            ]
        };
    }

    handleActivateResonator(id) {
        const resonator = _.find(this.props.resonators, r => r.id === id);
        resonator.pop_email = true;
        const followerId = resonator.follower_id
        this.props.activateResonator({ followerId, resonator });
    }

    handleDeactivateResonator(id) {
        const resonator = _.find(this.props.resonators, r => r.id === id);
        resonator.pop_email = false;
        const followerId = resonator.follower_id
        this.props.activateResonator({ followerId, resonator });
    }

    renderMoreOptionsMenu() {
        return resonatorId => {
            let resonator = _.find(this.props.resonators, r => r.id === resonatorId);
            if (!resonator)
                return

            const freezeUnfreezeMenuItem = resonator.pop_email ? (
                <MenuItem
                    primaryText='Deactivate'
                    onTouchTap={() => this.handleDeactivateResonator(resonatorId)}
                />
            ) : (
                    <MenuItem
                        primaryText='Activate'
                        onTouchTap={() => this.handleActivateResonator(resonatorId)}
                    />
                );

            return (
                <MoreOptionsMenu
                    className='more-options-btn'
                >
                    {freezeUnfreezeMenuItem}
                </MoreOptionsMenu>
            );
        }
    }


    render() {
        let rows = this.getRows();
        let header = this.getHeader();
        let addRoute = `/followers/${this.props.match.params.followerId}/resonators/new`;
        let getEditRoute = id => `/followers/${this.props.match.params.followerId}/resonators/${id}/edit`;
        let showRoute = id => `/followers/${this.props.match.params.followerId}/resonators/${id}/show`;
        let toolbox = this.getToolbox();
        let moreOptionsMenu = this.renderMoreOptionsMenu();

        return (
            <EntityTable
                selectable={false}
                onAdd={() => this.props.push(addRoute)}
                onEdit={id => this.props.push(getEditRoute(id))}
                onRemove={this.handleRemoveResonator}
                onShow={id => this.props.push(showRoute(id))}
                addButton={true}
                rowActions={['show', 'edit', 'remove', moreOptionsMenu]}
                header={header}
                toolbox={toolbox}
                rows={rows}
            />
        );
    }
}

function mapStateToProps(state, { match: { params: { followerId } } }) {
    if (!followerId) return {};

    let follower = _.find(state.followers.followers, f => f.id === followerId);

    return {
        resonators: _.get(follower, 'resonators'),
        follower
    };
}

function mapDispatchToProps(dispatch, /* {params: {followerId}} */) {
    return bindActionCreators({
        fetchFollowerResonators: actions.fetchFollowerResonators,
        activateResonator: resonatorActions.activate,
        showDeleteResonatorPrompt: resonatorId => navigationActions.showModal({
            name: 'deleteResonator',
            props: {
                resonatorId
            }
        }),

        push
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(FollowerResonators);
