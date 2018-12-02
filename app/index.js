import document from "document";
import * as messaging from "messaging";

import { getHumanReadableTime } from '../common/utils.js'
import { bindPhysicalButtons, bindSelectWayButtons, refreshWithConnection, displayButtons, bindRefreshDataAfterSleep } from './UI.js';
import * as ACTIONS from '../common/actions.js'

messaging.peerSocket.onopen = () => {
  console.log('App socket open');
  messaging.peerSocket.send('hi');
}

messaging.peerSocket.onmessage = evt => {
  if (evt.data.action && evt.data.action === ACTIONS.ENABLE_SELECT_WAY_BUTTONS) {
    displayButtons();
  }
  else if (evt.data.action && evt.data.action === ACTIONS.DISPLAY_CONNECTION) {
    refreshWithConnection(evt.data.payload);  
  }
}

messaging.peerSocket.onerror = err => {
  console.log('socket error');
}

const fetchAndShowConnection = workToHome => {
  messaging.peerSocket.send({ 
    action: ACTIONS.START_DATA_FETCHING, 
    time: getHumanReadableTime(new Date().toISOString()), 
    workToHome: workToHome 
  });
}

const fetchAndShowGoHomeConnections = _ => fetchAndShowConnection(true);
const fetchAndShowGoWorkConnections = _ => fetchAndShowConnection(false);

const refreshDataAfterSleep = _ => {
  if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
    // refresh data
  }
  else {
    console.log('socket not available');
  }
}

bindPhysicalButtons();
bindSelectWayButtons(fetchAndShowGoHomeConnections, fetchAndShowGoWorkConnections);
bindRefreshDataAfterSleep(refreshDataAfterSleep);