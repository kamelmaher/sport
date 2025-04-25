const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const getSupportedCompetitions = () => {
    const filePath = path.resolve(__dirname, '../../supported-competitions.yaml');
    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        return yaml.load(fileContents);
    } catch (error) {
        console.error('Error reading supported competitions:', error);
        return [];
    }
};

module.exports = { getSupportedCompetitions };