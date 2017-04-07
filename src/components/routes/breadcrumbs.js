import React from 'react';
import _ from 'lodash';
import { matchPath } from 'react-router'
import {Link} from 'react-router-dom';
import followerSelector from '../../selectors/followerSelector';
import resonatorSelector from '../../selectors/resonatorSelector';
import criterionSelector from '../../selectors/criterionSelector';
import './breadcrumbs.scss';

export default function renderBreadcrumbs(state) {
    let routeStack = getRouteStack(state);

    routeStack = routeStack.length > 1 ? routeStack.slice(1) : routeStack;

    const parts = _.flatMap(routeStack, (route, idx) => {
        return [
            <Link className='breadcrumb-part' key={idx} to={route.route}>
                {_.truncate(route.title)}
            </Link>,
            <span className='breadcrumb-part-arrow'>
                &gt;
            </span>
        ];
    });

    return (
        <div className='breadcrumbs'>
            {parts}
        </div>
    );
}

function getRouteStack(state) {
    const {pathname} = location;

    const routeStack = resolveRouteStack(pathname, '', tree);

    return routeStack.map(r => ({
        route: r.match.url,
        title: r.title(state)
    }));
}

function resolveRouteStack(fullPathname, pathname, tree) {
    if (!tree)
        return [];

    let childRoute, childKey, childMatch, childTitle;

    for (let route of _.keys(tree.routes)) {
        const r = pathname + route;

        let match = matchPath(fullPathname, {
            path: r,
            exact: false,
            strict: false
        });

        if (match) {
            childRoute = r;
            childKey = route;
            childMatch = match;
            childTitle = resolveChildTitle(tree.routes[childKey].title, match);
            break;
        }
    }

    if (childMatch) {
        const downStack = resolveRouteStack(fullPathname, childRoute, tree.routes[childKey]);
        return [{match: childMatch, title: childTitle}].concat(downStack);
    }

    return [];
}

const resolveChildTitle = (title, match) => state => {
    if (typeof title === 'string')
        return title;

    if (typeof title === 'function')
        return title(state, match.params);

    throw new Error('unexpected title type', title);
};

const tree = {
    routes: {
        "/": {
            title: "Resonators",
            routes: {
                "followers": {
                    title: "Followers",
                    routes: {
                        "/:followerId": {
                            title: (state, routeParams) => {
                                const follower = followerSelector(state, routeParams.followerId);
                                return _.get(follower, 'user.name');
                            },
                            routes: {
                                "/resonators": {
                                    title: 'Resonators',
                                    routes: {
                                        "/new": {
                                            title: 'Create'
                                        },
                                        "/:resonatorId": {
                                            title: (state, routeParams) => {
                                                const resonator = resonatorSelector(state, routeParams.resonatorId);
                                                return _.get(resonator, 'title', 'Resonator');
                                            },
                                            routes: {
                                                "/stats/:qid": {
                                                    title: 'Criterion stats'
                                                },
                                                "/edit": {
                                                    title: 'Edit'
                                                },
                                                "/show": {
                                                    title: 'Preview'
                                                },
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                },
                "resetPassword": {
                    title: 'Reset Password'
                },
                "criteria/submit": {
                    title: 'Submit Feedback'
                },
                "clinics": {
                    title: 'Clinics',

                    routes: {
                        "/criteria": {
                            title: 'Criteria',

                            routes: {
                                "/new": {
                                    title: 'Create'
                                },
                                "/:criterionId": {
                                    title: (state, routeParams) => {
                                        const criterion = criterionSelector(state, routeParams.criterionId);
                                        return criterion.title;
                                    },

                                    routes: {
                                        "/edit": {
                                            title: 'Edit'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                "login": {
                    title: 'Login'
                }
            }
        }
    }
};
