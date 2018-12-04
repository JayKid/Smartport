import { settingsStorage } from "settings";

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

export {
    getValueFromSettingsFor
}