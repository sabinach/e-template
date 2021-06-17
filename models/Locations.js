require('dotenv').config();

const db = require("../db/db_config");

const { Client } = require("@googlemaps/google-maps-services-js");

const client = new Client({});
const API_KEY = process.env.GOOGLE_API_KEY;

/**
 * @class Locations
 */
class Locations {

  /**
   * @param {string} input
   * @returns {list<Prediction>}
   */
  static async getAutocompleteResults(input) {
    return await client.placeAutocomplete({
      params: {
        input,
        types: "geocode",
        key: API_KEY
      }
    })
    .then(r => {
      let predictions = r.data.predictions;
      let data = predictions.map(el => {
        return {
          id: el.place_id,
          name: el.description
        }
      })
      return { data };
    })
    .catch(e => {
      console.log(e.response);
      return { data: [{id: "error", name: "error fetching autocomplete results"}] };
    });
  }

  /**
   * @param {string} id
   * @returns {lat:float, lng: float}
   */
  static async getPlaceCoords(id) {
    return await client.placeDetails({
      params: {
        place_id: id,
        fields: "geometry",
        key: API_KEY
      }
    })
    .then(r => {
      return r.data.result.geometry.location;
    });
  }

  /**
   * @param {string} id
   * @returns {string}
   */
  static async getPlaceName(id) {
    const data = await db.run(`SELECT name FROM locations WHERE id='${id}'`);
    if (data.rows[0]) return data.rows[0].name;
    return undefined;
  }

}

module.exports = Locations;
