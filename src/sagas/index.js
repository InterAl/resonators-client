const createRootSaga = (sagas, sagaParams) => function*() {
    yield sagas.map(saga => saga(sagaParams));
};

export default createRootSaga([
    require('./initSaga').default.saga
], {});
