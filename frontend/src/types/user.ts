import { Anime } from "./anime";

export interface UserProfile {
  id: number;
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
