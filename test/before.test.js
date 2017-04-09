import createServer from './createServer';
import { initNightmare } from './nightmare';

before(() => {
    const endpoint = 'localhost:45033';
    initNightmare(endpoint);
});
