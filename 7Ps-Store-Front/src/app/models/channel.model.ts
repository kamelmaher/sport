export interface ChannelLogo {
  url: string;
}

export interface SatelliteInfo {
  position: string;
  position_value: number;
  position_direction: string;
  satellite_name: string | null;
}

export interface FrequencyInfo {
  text: string;
  value: number;
}

export interface EirpInfo {
  text: string;
  value: number | null;
}

export interface TechnicalInfo {
  beam: string;
  eirp: EirpInfo | null;
  frequency: FrequencyInfo | null;
}

export interface Metadata {
  source: string | null;
  scraped_at: string | null;
  country: string | null;
}

export interface Channel {
  channel_name: string;
  logo?: ChannelLogo;
  satellite_info?: SatelliteInfo[];
  technical_info?: TechnicalInfo[];
  metadata?: Metadata;
}

export interface ChannelResponse {
  channels: Channel[];
  count: number;
  country: string;
  searchTerm: string;
}
