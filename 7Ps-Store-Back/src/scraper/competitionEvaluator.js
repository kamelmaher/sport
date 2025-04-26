const { parseFrequencyInfo } = require('../helpers/channelFrequency');
const { convertToMeccaTime } = require('../helpers/timeConverter');

module.exports.competitionEvaluator = (CompetitionNodes) => {
    return CompetitionNodes.map(getCompetitionMatches);
  
    function getCompetitionMatches(competitionNode) {
      const competition = formatCompetitionName(
        competitionNode.querySelector('.comp_head').textContent
      );
      const matchNode = competitionNode.nextElementSibling;
  
      const teams = getMatchName(matchNode);
      if (!teams) return null;
  
      const { time, result, status } = getMatchStatus(matchNode);
  
      const { freeChannels, paidChannels } = getChannels(matchNode);
  
      return {
        competition: `${competition.name} - ${competition.stage}`,
        time: time ? `ST: ${time}` : null,
        teams: `${teams.homeTeam} vs ${teams.awayTeam}`,
        freeChannels,
        paidChannels,
        status, // "upcoming" or "finished"
        result: result || null, // e.g., "2 - 1" for finished matches
      };
    }
  
    function formatCompetitionName(competitionName) {
      const [name, stage] = competitionName.split(' - ');
      return { name, stage };
    }
  
    function getMatchName(matchNode) {
      const fullText = matchNode.querySelector('.fLeft').textContent;
      if (!fullText.includes(' v ') || fullText.includes('Israel')) return null;
  
      const [homeTeam, awayTeam] = fullText.split(' v ');
      return { fullText, homeTeam, awayTeam };
    }
  
    function getMatchStatus(matchNode) {
      const timeElement = matchNode.querySelector('.fLeft_time_live').innerText;
  
      // Check if it's a score
      const scorePattern = /^\d+\s*-\s*\d+$/;
      if (scorePattern.test(timeElement.trim())) {
        return {
          time: null,
          result: timeElement.trim(),
          status: 'finished',
        };
      }
  
      // Just return the raw time data
      const timeData = timeElement.split(' ');
      return {
        time: `${timeData[1]} ${timeData[2] || ''}`.trim(), // Include AM/PM if exists
        result: null,
        // status: 'upcoming',
      };
    }
  
    function getChannels(matchNode) {
      const allChannels = matchNode
        .querySelector('.fLeft_live')
        .querySelectorAll('.chan_live_free, .chan_live_not_free');
  
      const freeChannels = [];
      const paidChannels = [];
  
      allChannels.forEach((item) => {
        let name = item.textContent.trim().replace(' 📺', '');
        if (isOnlineChannel(name)) return;
  
        const isFree = isFreeChannel(item);
        const frequencyData = item.getAttribute('onmouseover');
        let frequency = null;
  
        if (frequencyData) {
          // Extract HTML content from onmouseover attribute
          const frequencyHtml = frequencyData
            .replace('return overlib(\'', '')
            .replace('\', STICKY, MOUSEOFF);', '');
  
          // Parse the frequency table data
          const tableMatch = frequencyHtml.match(/<tr.*?>(.*?)<\/tr>/gs);
          if (tableMatch && tableMatch.length > 1) {
            const cells = tableMatch[1].match(/<td.*?>(.*?)<\/td>/g);
            if (cells && cells.length >= 5) {
              frequency = {
                position: cells[0].replace(/<[^>]*>/g, '').trim(),
                satellite: cells[1].replace(/<[^>]*>/g, '').trim(),
                frequency: cells[2].replace(/<[^>]*>/g, '').trim(),
                symbolRate: cells[3].replace(/<[^>]*>/g, '').trim(),
                encryption: cells[4].replace(/<[^>]*>/g, '').trim()
              };
            }
          }
        }
  
        const channelInfo = {
          name,
          frequency
        };
  
        const channelList = isFree ? freeChannels : paidChannels;
        channelList.push(channelInfo);
      });
  
      sortChannelsNames(freeChannels);
      sortChannelsNames(paidChannels);
      return { freeChannels, paidChannels };
    }
  
    function sortChannelsNames(channels) {
      channels.sort((a, b) => a.name.localeCompare(b.name));
    }
  
    function isOnlineChannel(channelName) {
      return channelName.includes('[app]');
    }
  
    function isFreeChannel(channel) {
      return channel.classList.contains('chan_live_free');
    }
  };