import { Anime } from "./anime";

export interface UserProfile {
  name: string;
  email: string;
  profileImageUrl: string;
  totalAnimes: number;
  watching: number;
  completed: number;
  dropped: number;
  onHold: number;
  planToWatch: number;
  totalEpisodesWatched: number;
  favoriteAnimes: Anime[];
}
