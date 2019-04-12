import baseConfig from './base';

const config = {
    appEnv: 'dev',
    baseUrl: "http://localhost:8080"
};

export default Object.freeze(Object.assign({}, baseConfig, config));
