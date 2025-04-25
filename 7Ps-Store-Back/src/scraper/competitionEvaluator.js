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
  
      // Check if the content looks like a score (e.g., "2 - 1")
      const scorePattern = /^\d+\s*-\s*\d+$/;
      if (scorePattern.test(timeElement.trim())) {
        return {
          time: null,
          result: timeElement.trim(),
          status: 'finished',
        };
      }
  
      // Otherwise, treat it as an upcoming match with a time
      const fullTime = timeElement.split(' ')[1];
      const originalHours = Number(fullTime.split(':')[0]) + 1; // تعديل لدعم التوقيت الصيفي
      const formattedHours = originalHours > 12 ? (originalHours - 12).toString().padStart(2, '0') : originalHours;
      const minutes = fullTime.split(':')[1].padStart(2, '0');
      const rawTime = `${formattedHours}:${minutes}`;
      return {
        time: rawTime,
        result: null,
        status: 'upcoming',
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
        const channelList = isFree ? freeChannels : paidChannels;
        channelList.push(name);
      });
  
      sortChannelsNames(freeChannels);
      sortChannelsNames(paidChannels);
      return { freeChannels, paidChannels };
    }
  
    function isOnlineChannel(channelName) {
      return channelName.includes('[app]');
    }
  
    function isFreeChannel(channel) {
      return channel.classList.contains('chan_live_free');
    }
  
    function sortChannelsNames(channels) {
      channels.sort((a, b) => a.localeCompare(b));
    }
  };