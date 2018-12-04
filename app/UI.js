import document from "document";
import { display } from "display";
import { me } from "appbit";

import { getHumanReadableTime } from '../common/utils.js'
import { log } from '../common/logger.js'

const SCREENS = {
  "SELECT_WAY": {
    id: "SELECT_WAY",
    selector: "select_way",
    elementSelectors: {
      GO_HOME_BUTTON: 'button_go_home',
      GO_WORK_BUTTON: 'button_go_work'
    }
  },
  "RESULT_SCREEN": {
    id: "RESULT_SCREEN",
    selector: "result_screen",
    elementSelectors: {
      TRAM_NUMBER: "tram_number",
      DEPARTURE: "departure",
      DEPARTURE_TIME_LEFT: "departure-time-left",
      ARRIVAL: "arrival"
    }
  }
};


// initialize state
let state = {
  currentScreen: SCREENS.SELECT_WAY.id
};

const navigateBack = () => {
  if (state.currentScreen === SCREENS.RESULT_SCREEN.id) {
    hideElement(SCREENS.RESULT_SCREEN.selector);
    displayElement(SCREENS.SELECT_WAY.selector);
    
    state.currentScreen = SCREENS.SELECT_WAY.id;
  } else {
    log('exiting..')
    me.exit();    
  }
};

const navigateToConnectionDetail = () => {
  displayElement(SCREENS.RESULT_SCREEN.selector);
  hideElement(SCREENS.SELECT_WAY.selector);

  state.currentScreen = SCREENS.RESULT_SCREEN.id;
};

const setText = (selector, text) => {
  document.getElementById(selector).text = text || "error";
}

const getTimeLeft = humanReadableTime => {
  const [ hours, minutes ] = humanReadableTime.split(':');
  const [ nowHours, nowMinutes ] = getHumanReadableTime(new Date().toISOString()).split(':');
  const secondsLeft = 60 - new Date().getSeconds();
  let minutesLeft;
  if (hours === nowHours) {
    minutesLeft = minutes-nowMinutes-1;
  } else { 
    minutesLeft = +(60 - nowMinutes) + +minutes -1;
  }
  const result = `(-${minutesLeft}m ${secondsLeft}s)`;
  return result;
}

const refreshWithConnection = connection => {

  setText(SCREENS.RESULT_SCREEN.elementSelectors.TRAM_NUMBER, `Tram ${connection.tramNumber}`);
  setText(SCREENS.RESULT_SCREEN.elementSelectors.DEPARTURE, connection.departureTime);
  setText(SCREENS.RESULT_SCREEN.elementSelectors.DEPARTURE_TIME_LEFT, getTimeLeft(connection.departureTime));
  setText(SCREENS.RESULT_SCREEN.elementSelectors.ARRIVAL, connection.arrivalTime);
  
  navigateToConnectionDetail();
}

const bindPhysicalButtons = () => {
  document.onkeypress = event => {
    event.preventDefault();
    if( event.key === 'up' ) {
      // Fetch previous connection if in details
    }
    if( event.key === 'down' ){
      // Fetch next connection if in details
    }
    if( event.key === 'back') {
      log('back pressed');
      navigateBack();
    } 
  }
};

const bindSelectWayButtons = (goHomeCallback, goWorkCallback) => {
  const goHomeButton = document.getElementById(SCREENS.SELECT_WAY.elementSelectors.GO_HOME_BUTTON);
  const goWorkButton = document.getElementById(SCREENS.SELECT_WAY.elementSelectors.GO_WORK_BUTTON);
  goHomeButton.addEventListener('click', () => {
    goHomeCallback();
  });
  goWorkButton.addEventListener('click', () => {
    goWorkCallback();
  });
};

const displayElement = selector => document.getElementById(selector).style.display = 'inline';
const hideElement = selector => document.getElementById(selector).style.display = 'none';

const displayButtons = _ => {
  displayElement(SCREENS.SELECT_WAY.elementSelectors.GO_HOME_BUTTON);
  displayElement(SCREENS.SELECT_WAY.elementSelectors.GO_WORK_BUTTON);
}

const bindRefreshDataAfterSleep = callback => {
  display.addEventListener('change', event => {
    if (display.on) {
      log('refreshing after sleep');
      callback();
    }
  });
}

export { 
  refreshWithConnection, 
  bindPhysicalButtons, 
  bindSelectWayButtons, 
  displayButtons,
  bindRefreshDataAfterSleep
};