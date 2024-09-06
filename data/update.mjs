import path from "node:path";
import { writeFile } from "node:fs/promises";

const escapeString = (value) => {
  if (typeof value === "string") {
    return value.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0":
          return "\\0";
        case "\x08":
          return "\\b";
        case "\x09":
          return "\\t";
        case "\x1a":
          return "\\z";
        case "\n":
          return "\\n";
        case "\r":
          return "\\r";
        case '"':
        case "'":
        case "\\":
          return "\\" + char;
        case "%":
          return "\\%"; // For LIKE statements
      }
    });
  }
  return value;
};

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
      result += `'${escapeString(values[i])}'`;
    }
  }
  return result;
};

const data = coins.map(({ id, symbol, name }) => {
  return sql`INSERT INTO coins (id, symbol, name) VALUES (${id}, ${symbol}, ${name});`;
});

writeFile(output, data.join("\n"), "utf-8");
