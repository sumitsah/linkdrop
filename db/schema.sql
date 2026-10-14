CREATE TABLE IF NOT EXISTS links (
  id         bigserial PRIMARY KEY,
  url        text        NOT NULL,
  note       text        NOT NULL DEFAULT '',
  category   text        NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
