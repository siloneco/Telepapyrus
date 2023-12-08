import { PoolConnection, QueryError } from 'mysql2'

async function execAll(connection: PoolConnection, queries: string[]) {
  await new Promise((resolve, reject) => {
    connection.beginTransaction((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })

    for (const query of queries) {
      connection.query(query, (error: QueryError | null, results: any) => {
        if (error) {
          reject(error)
        }
        resolve(results)
      })
    }

    connection.commit((error: QueryError | null) => {
      if (error) {
        reject(error)
      }
    })
  })
}

async function initializeTables(userId: string, connection: PoolConnection) {
  const allowed_tags = `
    CREATE TABLE IF NOT EXISTS ${userId}_allowed_tags (
        tag varchar(32) NOT NULL,
        PRIMARY KEY (tag)
      );
    `

  const articles = `
    CREATE TABLE ${userId}_articles (
        id varchar(64) NOT NULL,
        title text NOT NULL,
        content text NOT NULL,
        date datetime(3) NOT NULL,
        last_updated datetime(3) DEFAULT NULL,
        PRIMARY KEY (id)
      );
    `

  const tags = `
    CREATE TABLE ${userId}_tags (
        id varchar(64) NOT NULL,
        tag varchar(32) NOT NULL,
        PRIMARY KEY (id,tag),
        KEY tag_idx (tag),
        CONSTRAINT id FOREIGN KEY (id) REFERENCES ${userId}_articles (id) ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT tag FOREIGN KEY (tag) REFERENCES ${userId}_allowed_tags (tag) ON DELETE CASCADE ON UPDATE CASCADE
      );
    `

  const drafts = `
    CREATE TABLE ${userId}_drafts (
        id varchar(128) NOT NULL,
        title varchar(128) DEFAULT NULL,
        content text DEFAULT NULL,
        PRIMARY KEY (id)
      );
    `

  const view = `
    CREATE VIEW ${userId}_pages AS
    select
      t.row_num DIV 10 + 1 AS page,
      t.date AS date
    from
      (
        select
          ${userId}_articles.date AS date,
          row_number() over (
            order by
              ${userId}_articles.date desc
          ) AS row_num
        from
          ${userId}_articles
      ) t
    where
      t.row_num MOD 10 = 1
      or t.date = (
        select
          max(
            ${userId}_articles.date
          )
        from
          ${userId}_articles
      );
    `

  const queries = [allowed_tags, articles, tags, drafts, view]

  await execAll(connection, queries)
}

export { initializeTables }
