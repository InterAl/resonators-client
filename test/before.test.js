import createServer from './createServer';
import { initNightmare } from './nightmare';

before(async function() {
    this.timeout(500 * 1000);
    const endpoint = await createServer();
    initNightmare(endpoint);
});
