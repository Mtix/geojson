require('dotenv').config()
const axios = require('axios');

class GeoJson {

    osmIdUri;
    polygonsUri;

    constructor() {
        if (process.env.OSM_ID_URI && process.env.GET_POLYGONS_URI) {
            this.osmIdUri = process.env.OSM_ID_URI;
            this.polygonsUri = process.env.GET_POLYGONS_URI;
        } else {
            throw Error('Empty .env config');
        }
    }

    static createUri(template, alias, value) {
        return encodeURI(template.replace(alias, value));
    }

    async getGeometryCollection(cityName) {
        try {
            const osmId = await this.getOsmId(cityName);

            if (!osmId) return null;

            return this.getPolygons(osmId);
        } catch (error) {
            console.log(error);
        }

    }

    async getOsmId(cityName) {
        try {
            const response = await axios.get(GeoJson.createUri(this.osmIdUri, '${cityName}', cityName));

            if (response && response.data && response.data.length) {
                return response.data[0].osm_id ?? null;
            }

            return null;
        } catch (error) {
            console.log(error);
        }
    }

    async getPolygons(osmId) {
        try {
            const response = await axios.get(GeoJson.createUri(this.polygonsUri, '${osmId}', osmId));

            if (response && response.data) {
                return response.data;
            }

            return null;
        } catch (error) {
            console.log(error);
        }
    }

}

module.exports = GeoJson;
