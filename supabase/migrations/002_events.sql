-- Events
create table events (
  id uuid primary key default gen_random_uuid(),
  organizer_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  venue text not null,
  city text not null,
  event_date timestamptz not null,
  ticket_url text,            -- external ticket link (BookMyShow, Paytm etc.)
  poster_url text,            -- event poster image
  genre text,                 -- trap | drill | boom_bap | conscious | other
  lineup text[],              -- array of artist names
  ticket_price_from int,      -- in INR, lowest tier
  is_free boolean default false,
  is_published boolean default true,
  is_featured boolean default false,  -- admin can feature events (paid upgrade)
  listing_tier text default 'basic',  -- basic | premium | featured
  listing_paid boolean default false, -- has organizer paid the listing fee?
  status text default 'upcoming',     -- upcoming | ongoing | completed | cancelled
  created_at timestamptz default now()
);

-- Event Interest (RSVP-style "Interested" button)
create table event_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  event_id uuid references events(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, event_id)
);

-- Event listing payments (simple ledger; integrate Razorpay later)
create table event_listing_payments (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references events(id) on delete cascade,
  organizer_id uuid references profiles(id),
  tier text not null,         -- basic | premium | featured
  amount int not null,        -- INR
  payment_status text default 'pending',  -- pending | paid | failed
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz default now()
);

-- RLS
alter table events enable row level security;
alter table event_interests enable row level security;
alter table event_listing_payments enable row level security;

-- Events: public read, auth write own
create policy "Events are public" on events for select using (true);
create policy "Authenticated users can create events" on events for insert
  with check (auth.uid() = organizer_id);
create policy "Organizers can update own events" on events for update
  using (auth.uid() = organizer_id);
create policy "Organizers can delete own events" on events for delete
  using (auth.uid() = organizer_id);

-- Interests
create policy "Interests are public" on event_interests for select using (true);
create policy "Users can express interest" on event_interests for insert
  with check (auth.uid() = user_id);
create policy "Users can remove own interest" on event_interests for delete
  using (auth.uid() = user_id);

-- Payments: own read
create policy "Organizers see own payments" on event_listing_payments for select
  using (auth.uid() = organizer_id);
create policy "Organizers can create payments" on event_listing_payments for insert
  with check (auth.uid() = organizer_id);

-- Listing tier pricing reference (INR)
-- basic:    ₹499  — shows in feed, no badge
-- premium:  ₹999  — "Premium" badge, top of city filter
-- featured: ₹2499 — pinned at top of all events, highlighted border
comment on table event_listing_payments is
  'Tier prices: basic=499, premium=999, featured=2499 INR';
