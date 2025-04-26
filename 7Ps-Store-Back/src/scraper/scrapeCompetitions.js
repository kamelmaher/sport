const { competitionEvaluator } = require('./competitionEvaluator');
const { convertToMeccaTime } = require('../helpers/timeConverter');

module.exports.scrapeCompetitions = async (page, competitionsNames) => {
  // Wait for the content to be loaded
  await page.waitForLoadState('networkidle');
  await page.waitForSelector('.comp_head');

  const allCompetitions = await Promise.all(
    competitionsNames.map(async (competitionName) => {
      const competitionSelector = `div:has(> span.comp_head:has-text("${competitionName}"))`;
      const competitionNodes = page.locator(competitionSelector);
      
      // Wait for the specific competition element to be visible
      await competitionNodes.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => null);
      
      const competitionMatches = await competitionNodes.evaluateAll(competitionEvaluator);

      const matches = competitionMatches.filter((match) => match !== null);
      return matches.length
        ? {
            name: competitionName,
            matches: [{ competition: competitionName, matches }],
          }
        : null;
    })
  );

  return allCompetitions.map(competition => {
    if (competition) {
      competition.matches = competition.matches.map(matchGroup => {
        matchGroup.matches = matchGroup.matches.map(match => {
          if (match && match.time) {
            match.time =  `${convertToMeccaTime(match.time)}`;
          }
          return match;
        });
        return matchGroup;
      });
    }
    return competition;
  }).filter(competition => competition !== null);

  const matches = await page.evaluate(competitionEvaluator);

  // Convert times to Mecca time after scraping
  return matches.map(match => {
    if (match && match.time) {
      match.time = ` ${convertToMeccaTime(match.time)}`;
    }
    return match;
  });
};