import axios from "axios";

/**
 * Places autocomplete
 * @name GET/api/location/autocomplete
 * @body {string} input
 * @returns { data:list<{id: string, name: string}> }
 */
const autocomplete = (data) => axios.get("/api/location/autocomplete/" + data);

const requestLocationFunctions = {
  autocomplete
};

export default requestLocationFunctions;
