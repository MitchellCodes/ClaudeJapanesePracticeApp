import type { StudyItem } from './types'

// word | kana reading (blank if the word is already kana) | romaji | meaning
const RAW = `
一|いち|ichi|one
二|に|ni|two
三|さん|san|three
四|よん|yon|four
五|ご|go|five
六|ろく|roku|six
七|なな|nana|seven
八|はち|hachi|eight
九|きゅう|kyuu|nine
十|じゅう|juu|ten
百|ひゃく|hyaku|hundred
千|せん|sen|thousand
万|まん|man|ten thousand
零|れい|rei|zero
今日|きょう|kyou|today
明日|あした|ashita|tomorrow
昨日|きのう|kinou|yesterday
今|いま|ima|now
朝|あさ|asa|morning
昼|ひる|hiru|noon, daytime
夜|よる|yoru|night
今朝|けさ|kesa|this morning
毎日|まいにち|mainichi|every day
毎週|まいしゅう|maishuu|every week
毎年|まいとし|maitoshi|every year
今週|こんしゅう|konshuu|this week
来週|らいしゅう|raishuu|next week
先週|せんしゅう|senshuu|last week
今月|こんげつ|kongetsu|this month
来月|らいげつ|raigetsu|next month
先月|せんげつ|sengetsu|last month
今年|ことし|kotoshi|this year
来年|らいねん|rainen|next year
去年|きょねん|kyonen|last year
時間|じかん|jikan|time, hour
何時|なんじ|nanji|what time
午前|ごぜん|gozen|morning, a.m.
午後|ごご|gogo|afternoon, p.m.
月曜日|げつようび|getsuyoubi|Monday
火曜日|かようび|kayoubi|Tuesday
水曜日|すいようび|suiyoubi|Wednesday
木曜日|もくようび|mokuyoubi|Thursday
金曜日|きんようび|kinyoubi|Friday
土曜日|どようび|doyoubi|Saturday
日曜日|にちようび|nichiyoubi|Sunday
私|わたし|watashi|I, me
あなた||anata|you
人|ひと|hito|person
男の人|おとこのひと|otoko no hito|man
女の人|おんなのひと|onna no hito|woman
男の子|おとこのこ|otoko no ko|boy
女の子|おんなのこ|onna no ko|girl
子供|こども|kodomo|child
友達|ともだち|tomodachi|friend
先生|せんせい|sensei|teacher
学生|がくせい|gakusei|student
外国人|がいこくじん|gaikokujin|foreigner
家族|かぞく|kazoku|family
父|ちち|chichi|father (my own)
母|はは|haha|mother (my own)
お父さん|おとうさん|otousan|father (someone else's)
お母さん|おかあさん|okaasan|mother (someone else's)
兄|あに|ani|older brother (my own)
姉|あね|ane|older sister (my own)
弟|おとうと|otouto|younger brother
妹|いもうと|imouto|younger sister
お兄さん|おにいさん|oniisan|older brother (polite)
お姉さん|おねえさん|oneesan|older sister (polite)
目|め|me|eye
耳|みみ|mimi|ear
口|くち|kuchi|mouth
手|て|te|hand
足|あし|ashi|foot, leg
顔|かお|kao|face
頭|あたま|atama|head
体|からだ|karada|body
学校|がっこう|gakkou|school
大学|だいがく|daigaku|university
会社|かいしゃ|kaisha|company
家|いえ|ie|house, home
部屋|へや|heya|room
駅|えき|eki|station
店|みせ|mise|shop
銀行|ぎんこう|ginkou|bank
病院|びょういん|byouin|hospital
図書館|としょかん|toshokan|library
郵便局|ゆうびんきょく|yuubinkyoku|post office
公園|こうえん|kouen|park
トイレ||toire|toilet
国|くに|kuni|country
町|まち|machi|town
道|みち|michi|road, way
山|やま|yama|mountain
川|かわ|kawa|river
海|うみ|umi|sea
本|ほん|hon|book
新聞|しんぶん|shinbun|newspaper
雑誌|ざっし|zasshi|magazine
辞書|じしょ|jisho|dictionary
鉛筆|えんぴつ|enpitsu|pencil
手紙|てがみ|tegami|letter
写真|しゃしん|shashin|photograph
電話|でんわ|denwa|telephone
電車|でんしゃ|densha|train
車|くるま|kuruma|car
自転車|じてんしゃ|jitensha|bicycle
飛行機|ひこうき|hikouki|airplane
お金|おかね|okane|money
切符|きっぷ|kippu|ticket
傘|かさ|kasa|umbrella
鞄|かばん|kaban|bag
靴|くつ|kutsu|shoes
服|ふく|fuku|clothes
帽子|ぼうし|boushi|hat
時計|とけい|tokei|clock, watch
机|つくえ|tsukue|desk
椅子|いす|isu|chair
窓|まど|mado|window
ドア||doa|door
テレビ||terebi|television
カメラ||kamera|camera
パソコン||pasokon|personal computer
名前|なまえ|namae|name
言葉|ことば|kotoba|word, language
勉強|べんきょう|benkyou|study
宿題|しゅくだい|shukudai|homework
仕事|しごと|shigoto|work, job
旅行|りょこう|ryokou|travel
映画|えいが|eiga|movie
音楽|おんがく|ongaku|music
歌|うた|uta|song
料理|りょうり|ryouri|cooking, cuisine
天気|てんき|tenki|weather
雨|あめ|ame|rain
雪|ゆき|yuki|snow
花|はな|hana|flower
犬|いぬ|inu|dog
猫|ねこ|neko|cat
鳥|とり|tori|bird
魚|さかな|sakana|fish
食べ物|たべもの|tabemono|food
飲み物|のみもの|nomimono|drink
ご飯|ごはん|gohan|rice, meal
パン||pan|bread
肉|にく|niku|meat
野菜|やさい|yasai|vegetables
果物|くだもの|kudamono|fruit
卵|たまご|tamago|egg
牛乳|ぎゅうにゅう|gyuunyuu|milk
水|みず|mizu|water
お茶|おちゃ|ocha|tea
コーヒー||koohii|coffee
お酒|おさけ|osake|alcohol, sake
朝ご飯|あさごはん|asagohan|breakfast
昼ご飯|ひるごはん|hirugohan|lunch
晩ご飯|ばんごはん|bangohan|dinner
食べる|たべる|taberu|to eat
飲む|のむ|nomu|to drink
見る|みる|miru|to see, watch
聞く|きく|kiku|to listen, ask
読む|よむ|yomu|to read
書く|かく|kaku|to write
話す|はなす|hanasu|to speak
言う|いう|iu|to say
行く|いく|iku|to go
来る|くる|kuru|to come
帰る|かえる|kaeru|to return home
出る|でる|deru|to go out, leave
入る|はいる|hairu|to enter
起きる|おきる|okiru|to wake up
寝る|ねる|neru|to sleep
働く|はたらく|hataraku|to work
休む|やすむ|yasumu|to rest
買う|かう|kau|to buy
売る|うる|uru|to sell
会う|あう|au|to meet
待つ|まつ|matsu|to wait
持つ|もつ|motsu|to hold, carry
使う|つかう|tsukau|to use
作る|つくる|tsukuru|to make
知る|しる|shiru|to know
分かる|わかる|wakaru|to understand
教える|おしえる|oshieru|to teach, tell
習う|ならう|narau|to learn
遊ぶ|あそぶ|asobu|to play
泳ぐ|およぐ|oyogu|to swim
歩く|あるく|aruku|to walk
走る|はしる|hashiru|to run
乗る|のる|noru|to ride
降りる|おりる|oriru|to get off
着る|きる|kiru|to wear
脱ぐ|ぬぐ|nugu|to take off (clothes)
開ける|あける|akeru|to open
閉める|しめる|shimeru|to close
つける||tsukeru|to turn on
消す|けす|kesu|to turn off, erase
立つ|たつ|tatsu|to stand
座る|すわる|suwaru|to sit
いる||iru|to be (living things)
ある||aru|to be (objects)
する||suru|to do
死ぬ|しぬ|shinu|to die
歌う|うたう|utau|to sing
洗う|あらう|arau|to wash
貸す|かす|kasu|to lend
借りる|かりる|kariru|to borrow
大きい|おおきい|ookii|big
小さい|ちいさい|chiisai|small
高い|たかい|takai|high, expensive
安い|やすい|yasui|cheap
低い|ひくい|hikui|low
長い|ながい|nagai|long
短い|みじかい|mijikai|short
新しい|あたらしい|atarashii|new
古い|ふるい|furui|old (things)
良い|よい|yoi|good
悪い|わるい|warui|bad
暑い|あつい|atsui|hot (weather)
熱い|あつい|atsui|hot (to the touch)
寒い|さむい|samui|cold (weather)
冷たい|つめたい|tsumetai|cold (to the touch)
忙しい|いそがしい|isogashii|busy
楽しい|たのしい|tanoshii|fun
面白い|おもしろい|omoshiroi|interesting
美味しい|おいしい|oishii|delicious
難しい|むずかしい|muzukashii|difficult
易しい|やさしい|yasashii|easy
広い|ひろい|hiroi|spacious
狭い|せまい|semai|narrow
明るい|あかるい|akarui|bright
暗い|くらい|kurai|dark
重い|おもい|omoi|heavy
軽い|かるい|karui|light (weight)
早い|はやい|hayai|early
速い|はやい|hayai|fast
遅い|おそい|osoi|slow, late
強い|つよい|tsuyoi|strong
弱い|よわい|yowai|weak
多い|おおい|ooi|many
少ない|すくない|sukunai|few
元気|げんき|genki|healthy, energetic
好き|すき|suki|like
嫌い|きらい|kirai|dislike
きれい||kirei|pretty, clean
静か|しずか|shizuka|quiet
賑やか|にぎやか|nigiyaka|lively
有名|ゆうめい|yuumei|famous
親切|しんせつ|shinsetsu|kind
上手|じょうず|jouzu|skilled
下手|へた|heta|unskilled
赤い|あかい|akai|red
青い|あおい|aoi|blue
白い|しろい|shiroi|white
黒い|くろい|kuroi|black
黄色|きいろ|kiiro|yellow
茶色|ちゃいろ|chairo|brown
上|うえ|ue|above
下|した|shita|below
左|ひだり|hidari|left
右|みぎ|migi|right
前|まえ|mae|front, before
後ろ|うしろ|ushiro|behind
中|なか|naka|inside
外|そと|soto|outside
隣|となり|tonari|next to
東|ひがし|higashi|east
西|にし|nishi|west
南|みなみ|minami|south
北|きた|kita|north
何|なに|nani|what
誰|だれ|dare|who
どこ||doko|where
いつ||itsu|when
どれ||dore|which (of three or more)
いくら||ikura|how much
いくつ||ikutsu|how many
これ||kore|this
それ||sore|that
あれ||are|that over there
ここ||koko|here
そこ||soko|there
あそこ||asoko|over there
とても||totemo|very
少し|すこし|sukoshi|a little
たくさん||takusan|a lot
全部|ぜんぶ|zenbu|all
一緒|いっしょ|issho|together
はい||hai|yes
いいえ||iie|no
おはよう||ohayou|good morning
こんにちは||konnichiwa|hello
こんばんは||konbanwa|good evening
さようなら||sayounara|goodbye
ありがとう||arigatou|thank you
すみません||sumimasen|excuse me, sorry
お願いします|おねがいします|onegaishimasu|please
ごめんなさい||gomennasai|I'm sorry
`

export const VOCAB: StudyItem[] = RAW.trim()
  .split('\n')
  .map((line) => {
    const [jp, reading, romaji, en] = line.split('|')
    return {
      id: `word:${jp}`,
      type: 'word' as const,
      jp,
      reading: reading || undefined,
      romaji,
      en,
    }
  })
