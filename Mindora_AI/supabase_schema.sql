-- ==========================================
-- Mindora AI - Database Schema & Security
-- ==========================================

-- 1. Create Profiles Table (extends Supabase auth.users)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    display_name text,
    avatar_url text,
    updated_at timestamp with time zone default now()
);

-- Enable RLS for Profiles
alter table public.profiles enable row level security;

-- 2. Create Journals Table
create table public.journals (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    date date not null default current_date,
    mood text not null,
    text text not null,
    tags text[] default '{}'::text[],
    created_at timestamp with time zone default now() not null,
    updated_at timestamp with time zone default now()
);

-- Enable RLS for Journals
alter table public.journals enable row level security;

-- Create indexes for performance
create index idx_journals_user_date on public.journals(user_id, date desc);

-- 3. Create Chat Messages Table
create table public.chat_messages (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade not null,
    role text check (role in ('user', 'ai')) not null,
    text text not null,
    created_at timestamp with time zone default now() not null
);

-- Enable RLS for Chat Messages
alter table public.chat_messages enable row level security;

-- Create index for chat history performance
create index idx_chat_messages_user_time on public.chat_messages(user_id, created_at asc);


-- ==========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================

-- Policies for PROFILES
create policy "Users can view their own profile"
    on public.profiles for select
    using (auth.uid() = id);

create policy "Users can update their own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Users can insert their own profile"
    on public.profiles for insert
    with check (auth.uid() = id);

-- Policies for JOURNALS
create policy "Users can view their own journals"
    on public.journals for select
    using (auth.uid() = user_id);

create policy "Users can create their own journals"
    on public.journals for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own journals"
    on public.journals for update
    using (auth.uid() = user_id);

create policy "Users can delete their own journals"
    on public.journals for delete
    using (auth.uid() = user_id);

-- Policies for CHAT MESSAGES
create policy "Users can view their own chat history"
    on public.chat_messages for select
    using (auth.uid() = user_id);

create policy "Users can save their own chat messages"
    on public.chat_messages for insert
    with check (auth.uid() = user_id);


-- ==========================================
-- AUTOMATION TRIGGER FOR USER SIGN UP
-- ==========================================

-- Automatically create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, display_name, avatar_url)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();


-- ==========================================
-- AUTOMATION TRIGGER FOR UPDATED_AT
-- ==========================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create or replace trigger on_profile_updated
    before update on public.profiles
    for each row execute procedure public.handle_updated_at();

create or replace trigger on_journal_updated
    before update on public.journals
    for each row execute procedure public.handle_updated_at();
