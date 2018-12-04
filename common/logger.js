// Use this as a quick toggle for enabling/disabling logs
const LOG_ENABLED = true;

const log = message => {
    if(LOG_ENABLED) { console.log(message); }
}

export { log }