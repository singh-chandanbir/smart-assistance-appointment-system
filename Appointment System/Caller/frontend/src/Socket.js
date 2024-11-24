import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = 'http://127.0.0.1:3000';

// const URL = 'https://587nq2ql-3000.inc1.devtunnels.ms';
// const URL = 'https://prostate-variables-israel-somewhere.trycloudflare.com/';

export const socket = io(URL, { autoConnect: false });
