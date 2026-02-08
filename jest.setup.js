
import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';
import { randomUUID } from 'crypto';

Object.assign(global, { TextEncoder, TextDecoder });

if (!global.crypto) {
    global.crypto = {};
}
if (!global.crypto.randomUUID) {
    global.crypto.randomUUID = randomUUID;
}

// Set up environment variables for tests
process.env.GOOGLE_AI_API_KEY = 'test-api-key';