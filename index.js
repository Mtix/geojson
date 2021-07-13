const appArgs = process.argv.slice(2);
const inputFile = appArgs[0];
const outputPath = appArgs[1];

if (inputFile && outputPath) {
    const app = new (require('./classes/app'))(inputFile, outputPath);

    app.downloadGeoJson().then(result => {
        console.log(result);
    });
}

