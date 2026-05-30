-- Profiles (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique not null,
  display_name text,
  bio text,
  avatar_url text,
  role text default 'fan', -- fan | artist | writer | admin
  is_verified boolean default false,
  instagram_handle text,
  city text,
  created_at timestamptz default now()
);

-- Launches
create table launches (
  id uuid primary key default gen_random_uuid(),
  artist_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  media_url text not null,
  thumbnail_url text,
  genre text,
  language text,
  city text,
  is_sponsored boolean default false,
  is_featured boolean default false,
  upvotes_count int default 0,
  created_at timestamptz default now()
);

-- News
create table news (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  title text not null,
  content text not null,
  cover_image_url text,
  is_sponsored boolean default false,
  created_at timestamptz default now()
);

-- Reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references profiles(id) on delete cascade,
  launch_id uuid references launches(id) on delete cascade,
  title text not null,
  content text not null,
  rating int check (rating between 1 and 5),
  created_at timestamptz default now()
);

-- Upvotes
create table upvotes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  launch_id uuid references launches(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, launch_id)
);

-- Comments
create table comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  launch_id uuid references launches(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  created_at timestamptz default now()
);

-- Follows
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (follower_id, following_id)
);

-- Artist Verification Requests
create table verification_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  instagram_handle text not null,
  status text default 'pending',
  created_at timestamptz default now()
);

-- Sponsorships
create table sponsorships (
  id uuid primary key default gen_random_uuid(),
  launch_id uuid references launches(id) on delete cascade,
  sponsor_name text,
  amount int,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz default now()
);

-- RLS Policies
alter table profiles enable row level security;
alter table launches enable row level security;
alter table news enable row level security;
alter table reviews enable row level security;
alter table upvotes enable row level security;
alter table comments enable row level security;
alter table follows enable row level security;
alter table verification_requests enable row level security;
alter table sponsorships enable row level security;

-- Profiles: public read, own write
create policy "Public profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update their own profile" on profiles for update using (auth.uid() = id);

-- Launches: public read, artists write own
create policy "Launches are public" on launches for select using (true);
create policy "Artists can insert launches" on launches for insert
  with check (auth.uid() = artist_id and exists (select 1 from profiles where id = auth.uid() and role in ('artist', 'admin')));
create policy "Artists can update own launches" on launches for update using (auth.uid() = artist_id);

-- News: public read
create policy "News is public" on news for select using (true);
create policy "Writers can post news" on news for insert
  with check (auth.uid() = author_id and exists (select 1 from profiles where id = auth.uid() and role in ('writer', 'artist', 'admin')));

-- Reviews: public read
create policy "Reviews are public" on reviews for select using (true);
create policy "Authenticated users can post reviews" on reviews for insert with check (auth.uid() = author_id);

-- Upvotes
create policy "Upvotes are public" on upvotes for select using (true);
create policy "Users can upvote" on upvotes for insert with check (auth.uid() = user_id);
create policy "Users can remove own upvote" on upvotes for delete using (auth.uid() = user_id);

-- Comments
create policy "Comments are public" on comments for select using (true);
create policy "Authenticated users can comment" on comments for insert with check (auth.uid() = user_id);
create policy "Users can delete own comments" on comments for delete using (auth.uid() = user_id);

-- Follows
create policy "Follows are public" on follows for select using (true);
create policy "Users can follow" on follows for insert with check (auth.uid() = follower_id);
create policy "Users can unfollow" on follows for delete using (auth.uid() = follower_id);

-- Verification requests
create policy "Users can view own requests" on verification_requests for select using (auth.uid() = user_id);
create policy "Users can submit verification" on verification_requests for insert with check (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Function to update upvotes count
create or replace function update_upvotes_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update launches set upvotes_count = upvotes_count + 1 where id = NEW.launch_id;
  elsif TG_OP = 'DELETE' then
    update launches set upvotes_count = upvotes_count - 1 where id = OLD.launch_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_upvote_change
  after insert or delete on upvotes
  for each row execute procedure update_upvotes_count();
