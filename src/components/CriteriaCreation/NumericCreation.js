import PropTypes from 'prop-types';
import React, {Component} from 'react';
import Subheader from 'material-ui/Subheader';
import TextBox from '../FormComponents/TextBox';
import {List, ListItem} from 'material-ui/List';

export default class NumericCreation extends Component {
    static propTypes = {
        formValues: PropTypes.object
    };

    renderList(min, max) {
        let list = [];

        for (let i = min; i <= max; i++) {
            list.push(<ListItem>
                        <div className='numeric-item'>
                            <div className='numeric-item-label'>
                                {i}
                            </div>
                            <TextBox name={`answers.num${i}`}/>
                        </div>
                      </ListItem>
                )
        }

        return list;
    }

    render() {
        const {formValues} = this.props;

        return (
            <div className='numeric-creation'>
                <Subheader>
                    Numeric Criteria Creation
                </Subheader>

                <div className='minmax'>
                    <div>
                        <span>
                            Min value:
                        </span>
                        <TextBox name='numMin' type='number' className='min' placeholder='Min'/>
                    </div>
                    <div>
                        <span>
                            Max value:
                        </span>
                        <TextBox name='numMax' type='number' className='max' placeholder='Max'/>
                    </div>
                </div>
                <div>
                    <List>
                        {this.renderList(parseInt(formValues.numMin),
                                         parseInt(formValues.numMax))}
                    </List>
                </div>
            </div>
        );
    }
}
