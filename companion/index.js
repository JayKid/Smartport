import * as messaging from "messaging";
import { getValueFromSettingsFor } from "./settingsHelper.js";
import { fetchConnections } from "./api.js";

import { getHumanReadableTime } from '../common/utils.js';
import * as ACTIONS from '../common/actions.js';

const getStations = workToHome => {
  const homeStation = getValueFromSettingsFor('home','Albisrieden');
  const workStation = getValueFromSettingsFor('work','Stauffacher');
  return workToHome ? {
    from: workStation,
    to: homeStation
  } :
  {
    from: homeStation,
    to: workStation
  };
}

messaging.peerSocket.onopen = function() {
  console.log('Companion socket open');
  messaging.peerSocket.send({action: ACTIONS.ENABLE_SELECT_WAY_BUTTONS});
}

messaging.peerSocket.onmessage = async function(evt) {
  console.log('companion received:');
  console.log(JSON.stringify(evt.data));
  if (evt.data.action && evt.data.action === ACTIONS.START_DATA_FETCHING) {
    console.log('fetching connections at');
    console.log(evt.data.time);
    const stations = getStations(evt.data.workToHome);
    const firstPossibleConnection = await fetchConnections(evt.data.time, stations);
    messaging.peerSocket.send({
      action: ACTIONS.DISPLAY_CONNECTION,
      payload: {
        tramNumber: firstPossibleConnection.products,
        arrivalTime: getHumanReadableTime(firstPossibleConnection.to.arrival),
        departureTime: getHumanReadableTime(firstPossibleConnection.from.departure)        
      }
    });
  }
}
