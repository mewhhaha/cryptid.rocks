import path from "node:path";
import { writeFile } from "node:fs/promises";

// START https://github.com/mysqljs/sqlstring/blob/master/lib/SqlString.js
const CHARS_GLOBAL_REGEXP = /[\0\b\t\n\r\x1a\"\'\\]/g; // eslint-disable-line no-control-regex
const CHARS_ESCAPE_MAP = {
  "\0": "\\0",
  "\b": "\\b",
  "\t": "\\t",
  "\n": "\\n",
  "\r": "\\r",
  "\x1a": "\\Z",
  '"': '""',
  "'": "''",
  "\\": "\\\\",
};

function escapeString(val) {
  CHARS_GLOBAL_REGEXP.lastIndex = 0;
  let chunkIndex = 0;
  let escapedVal = "";
  let match;

  while ((match = CHARS_GLOBAL_REGEXP.exec(val))) {
    escapedVal +=
      val.slice(chunkIndex, match.index) + CHARS_ESCAPE_MAP[match[0]];
    chunkIndex = CHARS_GLOBAL_REGEXP.lastIndex;
  }

  if (chunkIndex === 0) {
    // Nothing was escaped
    return "'" + val + "'";
  }

  if (chunkIndex < val.length) {
    return "'" + escapedVal + val.slice(chunkIndex) + "'";
  }

  return "'" + escapedVal + "'";
}
// END

const output = path.join(import.meta.dirname, "coins.sql");

const response = await fetch("https://api.coingecko.com/api/v3/coins/list", {
  headers: { accept: "application/json" },
});

/**
 * @type {Array<{id: string, symbol: String, name: string}>}
 */
const coins = await response.json();

const sql = (text, ...values) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const value = values[i];
    result += text[i];
    if (value) {
      result += `${escapeString(values[i])}`;
    }
  }
  return result;
};

const date = new Date().toISOString();

const simpleTextRegex = /[\s'"$#a-zA-Z0-9]+/;

const data = coins
  .filter(({ id, symbol, name }) => {
    return (
      id.match(simpleTextRegex) &&
      symbol.match(simpleTextRegex) &&
      name.match(simpleTextRegex)
    );
  })
  .map(({ id, symbol, name }) => {
    return sql`REPLACE INTO coins (id, symbol, name, updated_at) VALUES (${id}, ${symbol}, ${name}, ${date});`;
  });

writeFile(output, data.join("\n"), "utf-8");
