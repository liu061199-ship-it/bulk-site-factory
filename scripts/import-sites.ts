import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteConfig } from "../lib/site-types";

const root = process.cwd();
const inputPath = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, "data", "sites.csv");
const outputPath = path.join(root, "sites", "sites.json");

const requiredHeaders = [
  "slug",
  "template",
  "contentFramework",
  "siteName",
  "domain",
  "logo",
  "themeColor",
  "title",
  "description",
  "keywords",
  "contactEmail",
  "heroTitle",
  "heroSubtitle",
  "appVersion",
  "appSize",
  "downloadUrl",
  "offerText",
  "paymentMethods",
  "featureBullets",
  "articles"
];

function parseCsv(input: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (char === "\"" && quoted && next === "\"") {
      value += "\"";
      index += 1;
      continue;
    }

    if (char === "\"") {
      quoted = !quoted;
      continue;
    }

    if (char === "," && !quoted) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  row.push(value.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function splitList(value: string) {
  return value
    .split(";")
    .map((item) => item.trim())
    .filter(Boolean);
}

function assertHeaders(headers: string[]) {
  const missing = requiredHeaders.filter((header) => !headers.includes(header));
  if (missing.length > 0) {
    throw new Error(`Missing CSV headers: ${missing.join(", ")}`);
  }
}

function rowToSite(headers: string[], row: string[], rowNumber: number): SiteConfig {
  const record = Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
  const missing = requiredHeaders.filter((header) => !record[header]);

  if (missing.length > 0) {
    throw new Error(`Row ${rowNumber} is missing values: ${missing.join(", ")}`);
  }

  return {
    slug: record.slug,
    template: record.template as SiteConfig["template"],
    contentFramework: record.contentFramework,
    siteName: record.siteName,
    domain: record.domain,
    logo: record.logo,
    themeColor: record.themeColor,
    title: record.title,
    description: record.description,
    keywords: splitList(record.keywords),
    contactEmail: record.contactEmail,
    heroTitle: record.heroTitle,
    heroSubtitle: record.heroSubtitle,
    appVersion: record.appVersion,
    appSize: record.appSize,
    downloadUrl: record.downloadUrl,
    offerText: record.offerText,
    paymentMethods: splitList(record.paymentMethods),
    featureBullets: splitList(record.featureBullets),
    articles: splitList(record.articles)
  };
}

async function main() {
  const csv = await readFile(inputPath, "utf8");
  const [headers, ...rows] = parseCsv(csv);

  if (!headers) {
    throw new Error("CSV file is empty.");
  }

  assertHeaders(headers);

  const sites = rows.map((row, index) => rowToSite(headers, row, index + 2));
  const duplicateSlugs = sites
    .map((site) => site.slug)
    .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

  if (duplicateSlugs.length > 0) {
    throw new Error(`Duplicate site slugs: ${Array.from(new Set(duplicateSlugs)).join(", ")}`);
  }

  await writeFile(outputPath, `${JSON.stringify(sites, null, 2)}\n`, "utf8");
  console.log(`Imported ${sites.length} sites from ${path.relative(root, inputPath)} to sites/sites.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
