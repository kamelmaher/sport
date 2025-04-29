const path = require('path');
const yaml = require('js-yaml');
const fs = require('fs');

const getSupportedYallaKoraCompetitions = () => {
  const filePath = path.resolve(__dirname, '../../supported-yallakora-competitions.yaml');
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error('Error reading supported Yalla Kora competitions:', error);
    return [];
  }
};

module.exports = { getSupportedYallaKoraCompetitions };