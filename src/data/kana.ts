import type { StudyItem } from './types'

// [group, "kana romaji kana romaji ..."]
const HIRAGANA_ROWS: [string, string][] = [
  ['Basic', 'あ a い i う u え e お o'],
  ['Basic', 'か ka き ki く ku け ke こ ko'],
  ['Basic', 'さ sa し shi す su せ se そ so'],
  ['Basic', 'た ta ち chi つ tsu て te と to'],
  ['Basic', 'な na に ni ぬ nu ね ne の no'],
  ['Basic', 'は ha ひ hi ふ fu へ he ほ ho'],
  ['Basic', 'ま ma み mi む mu め me も mo'],
  ['Basic', 'や ya ゆ yu よ yo'],
  ['Basic', 'ら ra り ri る ru れ re ろ ro'],
  ['Basic', 'わ wa を wo ん n'],
  ['Dakuten', 'が ga ぎ gi ぐ gu げ ge ご go'],
  ['Dakuten', 'ざ za じ ji ず zu ぜ ze ぞ zo'],
  ['Dakuten', 'だ da ぢ ji(di) づ zu(du) で de ど do'],
  ['Dakuten', 'ば ba び bi ぶ bu べ be ぼ bo'],
  ['Dakuten', 'ぱ pa ぴ pi ぷ pu ぺ pe ぽ po'],
  ['Combos', 'きゃ kya きゅ kyu きょ kyo'],
  ['Combos', 'しゃ sha しゅ shu しょ sho'],
  ['Combos', 'ちゃ cha ちゅ chu ちょ cho'],
  ['Combos', 'にゃ nya にゅ nyu にょ nyo'],
  ['Combos', 'ひゃ hya ひゅ hyu ひょ hyo'],
  ['Combos', 'みゃ mya みゅ myu みょ myo'],
  ['Combos', 'りゃ rya りゅ ryu りょ ryo'],
  ['Combos', 'ぎゃ gya ぎゅ gyu ぎょ gyo'],
  ['Combos', 'じゃ ja じゅ ju じょ jo'],
  ['Combos', 'びゃ bya びゅ byu びょ byo'],
  ['Combos', 'ぴゃ pya ぴゅ pyu ぴょ pyo'],
]

/** Katakana sits exactly 0x60 code points above hiragana. */
const toKatakana = (s: string) =>
  [...s].map((c) => String.fromCharCode(c.charCodeAt(0) + 0x60)).join('')

function build(type: 'hiragana' | 'katakana'): StudyItem[] {
  const out: StudyItem[] = []
  for (const [group, row] of HIRAGANA_ROWS) {
    const parts = row.split(' ')
    for (let i = 0; i < parts.length; i += 2) {
      const hira = parts[i]
      out.push({
        id: `${type === 'hiragana' ? 'hira' : 'kata'}:${hira}`,
        type,
        jp: type === 'hiragana' ? hira : toKatakana(hira),
        romaji: parts[i + 1],
        en: '',
        group,
      })
    }
  }
  return out
}

export const HIRAGANA = build('hiragana')
export const KATAKANA = build('katakana')
