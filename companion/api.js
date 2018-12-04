const getRequestURL = (stations, humanReadableTime) => {
    const LIMIT = 6;
    const encodedFrom = encodeURIComponent(stations.from);
    const encodedTo = encodeURIComponent(stations.to);
    return `https://transport.opendata.ch/v1/connections?from=${encodedFrom}&to=${encodedTo}&time=${humanReadableTime}&limit=${LIMIT}&fields[]=connections/from/departure&fields[]=connections/to/arrival&fields[]=connections/products`;
}

const fetchConnections = async (time, stations) => {
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
      
      return firstPossibleConnection;
    }
    catch (error) {
      console.log('error while fetching connections');
      throw error;
    }
};

export { fetchConnections }