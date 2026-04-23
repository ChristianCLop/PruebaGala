-- =============================================================
--  MediaHub  –  PostgreSQL Schema
--  Run this in DBeaver to create the database and tables
-- =============================================================

-- 1. Create the database (run this separately if it does not exist yet)
-- CREATE DATABASE mediahub_db;

-- 2. Connect to the database and then run the rest of this script
-- \c mediahub_db;

-- =============================================================
--  Table: posts
-- =============================================================
CREATE TABLE IF NOT EXISTS posts (
    id         SERIAL          PRIMARY KEY,
    title      VARCHAR(255)    NOT NULL,
    content    TEXT            NOT NULL,
    image_url  VARCHAR(500),
    slug       VARCHAR(300)    NOT NULL UNIQUE,
    created_at TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON posts;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Index on slug for fast lookups by the frontend template page
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts (slug);

-- Index on created_at for ordered listing
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts (created_at DESC);

-- =============================================================
--  Sample data (optional – comment out if not needed)
-- =============================================================
INSERT INTO posts (title, content, image_url, slug) VALUES
(
    'Welcome to MediaHub',
    'This is the first post on MediaHub. Here you will find the latest news and articles.',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800',
    'welcome-to-mediahub-1700000000000'
),
(
    'Getting Started with Next.js',
    'Next.js is a powerful React framework that enables server-side rendering and static site generation out of the box.',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
    'getting-started-with-nextjs-1700000000001'
)
ON CONFLICT (slug) DO NOTHING;
