import type { StudyItem } from './types'

// char | readings (romaji) | meaning
const RAW = `
日|nichi, hi|sun, day
月|getsu, tsuki|moon, month
火|ka, hi|fire
水|sui, mizu|water
木|moku, ki|tree, wood
金|kin, kane|gold, money
土|do, tsuchi|earth, soil
本|hon|book, origin
人|jin, hito|person
大|dai, ookii|big
小|shou, chiisai|small
中|chuu, naka|middle, inside
上|jou, ue|up, above
下|ka, shita|down, below
左|sa, hidari|left
右|yuu, migi|right
前|zen, mae|before, front
後|go, ushiro|after, behind
外|gai, soto|outside
山|san, yama|mountain
川|sen, kawa|river
田|den, ta|rice field
花|ka, hana|flower
天|ten|heaven, sky
気|ki|spirit, air
雨|u, ame|rain
電|den|electricity
車|sha, kuruma|car, vehicle
駅|eki|station
口|kou, kuchi|mouth
目|moku, me|eye
耳|ji, mimi|ear
手|shu, te|hand
足|soku, ashi|foot, leg
男|dan, otoko|man, male
女|jo, onna|woman, female
子|shi, ko|child
父|fu, chichi|father
母|bo, haha|mother
友|yuu, tomo|friend
名|mei, na|name
白|haku, shiro|white
学|gaku|study, learning
校|kou|school
生|sei, i(kiru)|life, birth
先|sen, saki|previous, ahead
語|go|language, word
話|wa, hanashi|talk, story
言|gen, i(u)|say
読|doku, yo(mu)|read
書|sho, ka(ku)|write
見|ken, mi(ru)|see
聞|bun, ki(ku)|hear, ask
食|shoku, ta(beru)|eat, food
飲|in, no(mu)|drink
行|kou, i(ku)|go
来|rai, ku(ru)|come
出|shutsu, de(ru)|exit, go out
入|nyuu, hai(ru)|enter
休|kyuu, yasu(mu)|rest
買|bai, ka(u)|buy
国|koku, kuni|country
魚|gyo, sakana|fish
安|an, yasu(i)|cheap, peaceful
高|kou, taka(i)|tall, expensive
長|chou, naga(i)|long
新|shin, atara(shii)|new
古|ko, furu(i)|old
今|kon, ima|now
毎|mai|every
週|shuu|week
何|nan, nani|what
時|ji, toki|time, hour
分|fun, bun, wa(karu)|minute, part
半|han|half
午|go|noon
東|tou, higashi|east
西|sai, nishi|west
南|nan, minami|south
北|hoku, kita|north
一|ichi|one
二|ni|two
三|san|three
四|shi, yon|four
五|go|five
六|roku|six
七|shichi, nana|seven
八|hachi|eight
九|kyuu, ku|nine
十|juu|ten
百|hyaku|hundred
千|sen|thousand
万|man|ten thousand
円|en|yen, circle
年|nen, toshi|year
`

/** Same kanji can appear once only; the first entry wins for ids. */
export const KANJI: StudyItem[] = (() => {
  const seen = new Set<string>()
  const out: StudyItem[] = []
  for (const line of RAW.trim().split('\n')) {
    const [jp, romaji, en] = line.split('|')
    if (seen.has(jp)) continue
    seen.add(jp)
    out.push({ id: `kanji:${jp}`, type: 'kanji', jp, romaji, en })
  }
  return out
})()
