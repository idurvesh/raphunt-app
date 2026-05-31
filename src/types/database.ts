export type Role = "fan" | "artist" | "writer" | "admin";
export type Genre =
  | "trap" | "drill" | "boom_bap" | "conscious"
  | "gully" | "desi_hiphop" | "lofi_hiphop" | "old_school"
  | "battle_rap" | "freestyle" | "spoken_word" | "other";
export type Language =
  | "hindi" | "english" | "marathi" | "punjabi"
  | "tamil" | "telugu" | "bengali" | "kannada"
  | "malayalam" | "bhojpuri" | "haryanvi" | "gujarati"
  | "odia" | "urdu" | "other";
export type VerificationStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  username: string;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: Role;
  is_verified: boolean;
  instagram_handle: string | null;
  city: string | null;
  created_at: string;
}

export interface Launch {
  id: string;
  artist_id: string;
  title: string;
  description: string | null;
  media_url: string;
  youtube_url: string | null;
  spotify_url: string | null;
  thumbnail_url: string | null;
  genre: Genre | null;
  language: Language | null;
  city: string | null;
  is_sponsored: boolean;
  is_featured: boolean;
  upvotes_count: number;
  created_at: string;
  profiles?: Profile;
}

export interface News {
  id: string;
  author_id: string;
  title: string;
  content: string;
  cover_image_url: string | null;
  is_sponsored: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface Review {
  id: string;
  author_id: string;
  launch_id: string;
  title: string;
  content: string;
  rating: number;
  created_at: string;
  profiles?: Profile;
  launches?: Launch;
}

export interface Upvote {
  id: string;
  user_id: string;
  launch_id: string;
  created_at: string;
}

export interface Comment {
  id: string;
  user_id: string;
  launch_id: string;
  parent_id: string | null;
  content: string;
  created_at: string;
  profiles?: Profile;
  replies?: Comment[];
}

export interface VerificationRequest {
  id: string;
  user_id: string;
  instagram_handle: string;
  status: VerificationStatus;
  created_at: string;
  profiles?: Profile;
}

export interface Follow {
  follower_id: string;
  following_id: string;
  created_at: string;
}

export type EventListingTier = "basic" | "premium" | "featured";
export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export const EVENT_TIER_PRICES: Record<EventListingTier, number> = {
  basic: 499,
  premium: 999,
  featured: 2499,
};

export interface RaphuntEvent {
  id: string;
  organizer_id: string;
  title: string;
  description: string | null;
  venue: string;
  city: string;
  event_date: string;
  ticket_url: string | null;
  poster_url: string | null;
  genre: Genre | null;
  lineup: string[] | null;
  ticket_price_from: number | null;
  is_free: boolean;
  is_published: boolean;
  is_featured: boolean;
  listing_tier: EventListingTier;
  listing_paid: boolean;
  status: EventStatus;
  created_at: string;
  profiles?: Profile;
  interest_count?: number;
}

export interface EventInterest {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
}

export interface EventListingPayment {
  id: string;
  event_id: string;
  organizer_id: string;
  tier: EventListingTier;
  amount: number;
  payment_status: "pending" | "paid" | "failed";
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  created_at: string;
}

export interface Sponsorship {
  id: string;
  launch_id: string;
  sponsor_name: string | null;
  amount: number | null;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
}

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Partial<Omit<Profile, "id">> & { id: string; username: string };
        Update: Partial<Profile>;
      };
      launches: {
        Row: Launch;
        Insert: Omit<Launch, "id" | "created_at" | "upvotes_count" | "is_sponsored" | "is_featured" | "profiles"> & {
          id?: string;
          upvotes_count?: number;
          is_sponsored?: boolean;
          is_featured?: boolean;
        };
        Update: Partial<Omit<Launch, "profiles">>;
      };
      news: {
        Row: News;
        Insert: Omit<News, "id" | "created_at" | "is_sponsored" | "profiles"> & {
          id?: string;
          is_sponsored?: boolean;
        };
        Update: Partial<Omit<News, "profiles">>;
      };
      reviews: {
        Row: Review;
        Insert: Omit<Review, "id" | "created_at" | "profiles" | "launches"> & { id?: string };
        Update: Partial<Omit<Review, "profiles" | "launches">>;
      };
      upvotes: {
        Row: Upvote;
        Insert: Omit<Upvote, "id" | "created_at"> & { id?: string };
        Update: Partial<Upvote>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, "id" | "created_at" | "profiles" | "replies"> & { id?: string };
        Update: Partial<Omit<Comment, "profiles" | "replies">>;
      };
      verification_requests: {
        Row: VerificationRequest;
        Insert: Omit<VerificationRequest, "id" | "created_at" | "status" | "profiles"> & { id?: string; status?: VerificationStatus };
        Update: Partial<Omit<VerificationRequest, "profiles">>;
      };
      follows: {
        Row: Follow;
        Insert: Follow;
        Update: Partial<Follow>;
      };
      sponsorships: {
        Row: Sponsorship;
        Insert: Omit<Sponsorship, "id" | "created_at"> & { id?: string };
        Update: Partial<Sponsorship>;
      };
      events: {
        Row: RaphuntEvent;
        Insert: Omit<RaphuntEvent, "id" | "created_at" | "profiles" | "interest_count" | "is_featured" | "is_published" | "listing_paid" | "listing_tier" | "status" | "is_free"> & {
          id?: string;
          is_featured?: boolean;
          is_published?: boolean;
          listing_paid?: boolean;
          listing_tier?: EventListingTier;
          status?: EventStatus;
          is_free?: boolean;
        };
        Update: Partial<Omit<RaphuntEvent, "profiles" | "interest_count">>;
      };
      event_interests: {
        Row: EventInterest;
        Insert: Omit<EventInterest, "id" | "created_at"> & { id?: string };
        Update: Partial<EventInterest>;
      };
      event_listing_payments: {
        Row: EventListingPayment;
        Insert: Omit<EventListingPayment, "id" | "created_at" | "payment_status" | "razorpay_order_id" | "razorpay_payment_id"> & {
          id?: string;
          payment_status?: "pending" | "paid" | "failed";
          razorpay_order_id?: string;
          razorpay_payment_id?: string;
        };
        Update: Partial<EventListingPayment>;
      };
    };
  };
};
