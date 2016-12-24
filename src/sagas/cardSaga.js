import _ from 'lodash';
import SagaReducerFactory from 'SagaReducerFactory';
import { put, select } from 'redux-saga/effects';
import { actions, types } from '../actions/cardActions';

let {handleOnce, handle, updateState, saga, reducer} = SagaReducerFactory({
    actionTypes: types,
    actionCreators: actions,
    initState: {
        cards: {}
    }
});

const LocalStorageSaveKey = 'cards';

handleOnce('*', function*() {
    try {
        yield load();
    } catch (err) {
        console.error('CardSaga - failed loading cards state');
    }
});

handle(types.EXPAND, function*(sagaParams, {payload}) {
    yield updateCard(payload, { expanded: true });
});

handle(types.CONTRACT, function*(sagaParams, {payload}) {
    yield updateCard(payload, { expanded: false });
});

function* updateCard(cardId, data) {
    let cards = yield select(state => state.cards.cards);
    let card = _.find(cards, c => c.id === cardId);
    let updatedCard = {id: cardId, ...card, ...data};
    let nextCards = _(cards).reject(c => c.id === cardId).concat(updatedCard).value();
    yield save(nextCards);
}

function* load() {
    yield put(updateState({ cards: loadFromLS() }));
}

function* save(cards) {
    saveToLS(cards);
    yield put(updateState({ cards }));
}

function loadFromLS() {
    let cardStateRaw = localStorage.getItem(LocalStorageSaveKey);
    return JSON.parse(cardStateRaw);
}

function saveToLS(cards) {
    localStorage.setItem(LocalStorageSaveKey, JSON.stringify(cards));
}

export default {saga, reducer};
