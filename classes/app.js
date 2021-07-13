const fs = require('fs');
const geoJson = new (require('./geo-json'));

class App {
    inputFile;
    outputPath;

    constructor(inputFile, outputPath) {
        this.inputFile = inputFile;
        this.outputPath = outputPath;
    }

    readCitiesFromFile(filePath, options = 'utf8') {
        try {
            const citiesFile = fs.readFileSync(filePath, options);

            if (!citiesFile) {
                return null;
            }

            return citiesFile.toString().split('\n').filter(value => !!value);
        } catch (error) {
            console.error('File not found')
        }

    }

    writeCityGeoFile(filename, jsonValues) {
        try {
            if (!fs.existsSync(this.outputPath)){
                fs.mkdirSync(this.outputPath);
            }

            fs.writeFile(this.outputPath + '/' + filename, JSON.stringify(jsonValues), (err) => {
                if (err) {
                    console.log(err);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async downloadGeoJson() {
        const cities = this.readCitiesFromFile(this.inputFile);

        for (let i = 0; i < cities.length; i++) {
            const cityName = cities[i];

            try {
                const geometryCollection = await geoJson.getGeometryCollection(cityName);

                if (geometryCollection) {
                    this.writeCityGeoFile(`${cityName}.txt`, geometryCollection);
                    console.log(`Downloaded ${i + 1} of ${cities.length} ${cityName}`);
                } else {
                    console.log('Error ' + cityName);
                }

            } catch (e) {
                console.log('Error ' + cityName);
            }

            if (i === cities.length - 1) {
                return 'Task completed';
            }
        }

        return 'Task error';
    }
}

module.exports = App;
