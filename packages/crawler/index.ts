import { URL } from "url"

import axios from "axios"
import cheerio, { CheerioAPI } from "cheerio"

// eslint-disable-next-line @typescript-eslint/no-floating-promises
main(["https://www.hltv.org/results?event=5608"])

export async function main(args: string[]) {
  await fetchDemos(args[0] || "")
}

export async function fetchDemos(url: string) {
  const matches = (await fetchLinks(url)).filter(
    (e) => ~e.indexOf("https://www.hltv.org/matches/"),
  )
  const downloads = normalize(
    (await Promise.all(matches.flatMap(fetchLinks))).flat(),
  ).filter((e) => ~e.indexOf("https://www.hltv.org/download/demo"))
  downloads.forEach(console.info)
}

export async function fetchLinks(url: string): Promise<string[]> {
  const $ = await fetchPage(url)
  return normalize(
    $("a").map((_, e) => new URL($(e).attr("href") || "", url).toString()),
  )
}

export async function fetchPage(url: string): Promise<CheerioAPI> {
  return await axios
    .get(url)
    .then((e) => e.data)
    .then(cheerio.load)
}

export function normalize(arr: string[] | Iterable<string>): string[] {
  return [...new Set(arr)].sort((a, b) => (a > b ? 1 : -1))
}
