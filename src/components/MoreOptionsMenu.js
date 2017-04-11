import _ from 'lodash';
import React, {Component} from 'react';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

class MoreOptionsMenu extends Component {
    static propTypes = {
        onBlur: React.PropTypes.func,
        className: React.PropTypes.string
    }

    static defaultProps = {
        onBlur: _.noop
    }

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <IconMenu
                iconButtonElement={<IconButton><MoreVertIcon/></IconButton>}
                {..._.omit(this.props, 'children')}
            >
                {this.props.children}
            </IconMenu>
        );
    }
}

export default MoreOptionsMenu;
