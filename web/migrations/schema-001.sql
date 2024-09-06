CREATE TABLE IF NOT EXISTS users (
    id TEXT NOT NULL PRIMARY KEY,
    oauth_id TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    provider TEXT NOT NULL,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    UNIQUE (oauth_id, provider)
);

CREATE TABLE IF NOT EXISTS coins (
    id TEXT NOT NULL PRIMARY KEY,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS portfolio (
    id TEXT NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    priority INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    coin_id TEXT NOT NULL,
    symbol TEXT NOT NULL,
    amount REAL NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (coin_id) REFERENCES coins(id)
)

