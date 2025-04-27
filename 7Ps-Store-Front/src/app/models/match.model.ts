export interface Match {
  date: {
    en: {
      day: string;
      month: string;
      year: string;
    }
  };
  competitions: Competition[];
}

export interface Competition {
  name: string;
  matches: CompetitionGroup[];
  showMatches?: boolean; // Add this property
}

export interface CompetitionGroup {
  competition: string;
  matches: MatchDetails[];
}

export interface ChannelFrequency {
  position: string;
  satellite: string;
  frequency: string;
  symbolRate: string;
  encryption: string;
}

export interface Channel {
  name: string;
  frequency: ChannelFrequency | null;
}

export interface MatchDetails {
  competition: string;
  time: string;
  teams: string;
  freeChannels: Channel[];
  paidChannels: Channel[];
  status: string;
  result: string | null;
  showChannels?: boolean; // Add this property
}


export interface FinishedMatch {
  championship: string;
  team_a: string;
  team_b: string;
  match_time: string;
  score: string;
  channel: string;
  status: string;
  date: string;
}

export interface FinishedMatchesResponse {
  date: string;
  matches: FinishedMatch[];
  competitions?: FinishedCompetition[];
}

export interface FinishedCompetition {
  name: string;
  matches: FinishedMatch[];
  showMatches?: boolean;
}
  