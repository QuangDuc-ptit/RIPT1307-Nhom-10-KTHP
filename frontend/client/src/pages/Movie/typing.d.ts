export interface CastMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Showtime {
  time: string;
  status: 'available' | 'booked';
}

export interface RoomInfo {
  type: string;
  roomName: string;
  times: Showtime[];
}

export interface Cinema {
  id: string;
  name: string;
  address: string;
  distance: string;
  rooms: RoomInfo[];
}

export interface ReviewStats {
  average: number;
  totalVotes: string;
  breakdown: { star: number; percentage: number }[];
}

export interface RelatedContent {
  id: string;
  title: string;
  meta: string;
  thumbnail: string;
}

export interface MovieDetailData {
  id: string;
  title: string;
  tagline: string;
  metaInfo: string;
  description: string;
  rating: number;
  coverImage: string;
  cast: CastMember[];
  cinemas: Cinema[];
  reviews: ReviewStats;
  related: RelatedContent[];
}