import * as messaging from "messaging";
import { settingsStorage } from "settings";

import { getHumanReadableTime } from '../common/utils.js';
import * as ACTIONS from '../common/actions.js';

messaging.peerSocket.onopen = function() {
  console.log('Companion socket open');
  messaging.peerSocket.send({action: ACTIONS.ENABLE_SELECT_WAY_BUTTONS});
}

messaging.peerSocket.onmessage = function(evt) {
  console.log('companion received:');
  console.log(JSON.stringify(evt.data));
  if (evt.data.action && evt.data.action === ACTIONS.START_DATA_FETCHING) {
    console.log('fetching connections at');
    console.log(evt.data.time);
    fetchConnections(evt.data.time, evt.data.workToHome)
  }
}

// This function would be better located in commons/utils but that "module" doesn't have access to settings :(
const getValueFromSettingsFor = (settingsKey, defaultValue) => {
  const settingsJSON = settingsStorage.getItem(settingsKey);
  try {
    const setting = JSON.parse(settingsJSON);
    return setting.name ? setting.name : defaultValue;
  }
  catch (error) {
    return defaultValue;
  }
}

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

const getRequestURL = (stations, humanReadableTime) => {
  const LIMIT = 6;
  const encodedFrom = encodeURIComponent(stations.from);
  const encodedTo = encodeURIComponent(stations.to);
  return `https://transport.opendata.ch/v1/connections?from=${encodedFrom}&to=${encodedTo}&time=${humanReadableTime}&limit=${LIMIT}&fields[]=connections/from/departure&fields[]=connections/to/arrival&fields[]=connections/products`;
}

const fetchConnections = async (time, workToHome) => {
  const stations = getStations(workToHome);
  const URL = getRequestURL(stations, time);
  console.log('URL to be fetched');
  console.log(URL);
  try {
    const response = await fetch(URL, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    })
    response = await response.json();
    console.log('companion says sending!');
    console.log(JSON.stringify(response));
    
    const firstPossibleConnection = response.connections.find(connection => {
      return new Date(connection.from.departure).valueOf() > new Date().valueOf()
    });
    
    return messaging.peerSocket.send({
      action: ACTIONS.DISPLAY_CONNECTION,
      payload: {
        tramNumber: firstPossibleConnection.products,
        arrivalTime: getHumanReadableTime(firstPossibleConnection.to.arrival),
        departureTime: getHumanReadableTime(firstPossibleConnection.from.departure)        
      }
    });
  }
  catch (error) {
    console.log('error while fetching connections');
    throw error;
  }
};
