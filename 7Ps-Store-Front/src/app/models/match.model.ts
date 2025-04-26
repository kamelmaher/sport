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
  