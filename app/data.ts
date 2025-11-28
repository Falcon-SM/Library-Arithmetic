import {
    MathematicianCard,
    MathematicianRarity,
    MissionCard,
    EventCard,
    BoardCard,
    Direction,
    TileType
} from './types';

export const MATHEMATICIAN_CARDS: MathematicianCard[] = [
    // Common (★☆☆)
    { id: 'm-pythagoras', name: 'ピタゴラス', rarity: MathematicianRarity.COMMON, category: 'MOVEMENT', description: '今いるロード（タイル）内の好きなマスにワープする。', flavorText: '三平方の定理' },
    { id: 'm-fibonacci', name: 'フィボナッチ', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: '手札のMissionカードを2枚捨てて、山札から3枚引く。', flavorText: '数列' },
    { id: 'm-thales', name: 'タレス', rarity: MathematicianRarity.COMMON, category: 'DEFENSE', description: '次に止まった「イベントマス」の効果を無効にする。', flavorText: '万物の根源' },
    { id: 'm-euclid', name: 'ユークリッド', rarity: MathematicianRarity.COMMON, category: 'MOVEMENT', description: '次の移動で、道が交差しているマスを通過する場合、好きな方向に曲がれる。', flavorText: '幾何学原論' },
    { id: 'm-pascal', name: 'パスカル', rarity: MathematicianRarity.COMMON, category: 'MP', description: 'MPを3回復する。', flavorText: '確率論' },
    { id: 'm-khwarizmi', name: 'アル＝フワーリズミー', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: '手札の数学者カード1枚を山札の底に戻し、1枚引く。', flavorText: '代数学の父' },
    { id: 'm-brahmagupta', name: 'ブラフマグプタ', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: 'MPを1払い、サイコロを振り直す。2回目は必ずその目に従う。', flavorText: '0の発見' },
    { id: 'm-sophie', name: 'ソフィ・ジェルマン', rarity: MathematicianRarity.COMMON, category: 'DEFENSE', description: 'このターン、他のプレイヤーと同じマスに止まっても妨害効果を受けない。', flavorText: '困難への耐性' },
    { id: 'm-abel', name: 'アーベル', rarity: MathematicianRarity.COMMON, category: 'MP', description: 'このターン、Missionを達成できなかった場合、MPを1回復する。', flavorText: '五次方程式の解の公式の不存在証明' },
    { id: 'm-ada', name: 'アダ・ラブレス', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: '次に引くイベントカードを、引く前に見て、引くかどうか選べる。', flavorText: '最初のプログラマ' },
    { id: 'm-eratosthenes', name: 'エラトステネス', rarity: MathematicianRarity.COMMON, category: 'MOVEMENT', description: 'サイコロを振る代わりに、ちょうど2マス進む。', flavorText: '素数のふるい' },
    { id: 'm-hippasus', name: 'ヒッパソス', rarity: MathematicianRarity.COMMON, category: 'OBSTRUCTION', description: '他のプレイヤー1人を選び、その手札のMissionカード1枚をランダムに捨てさせ、1枚引かせる。', flavorText: '無理数の発見' },
    { id: 'm-diophantus', name: 'ディオファントス', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: '山札から数学者カードを1枚引く。それが★☆☆なら手札に加え、そうでなければ捨てる。', flavorText: '不定方程式' },
    { id: 'm-khayyam', name: 'オマル・ハイヤーム', rarity: MathematicianRarity.COMMON, category: 'SPECIAL', description: '自分の手札のMissionカード1枚と、山札の一番上のMissionカードを交換する。', flavorText: '三次方程式の解法' },
    { id: 'm-bohr', name: 'ボーア', rarity: MathematicianRarity.COMMON, category: 'DEFENSE', description: 'MPを2払い、次のターン開始時まで、自分は妨害系カードの対象にならない。', flavorText: '相補性原理' },

    // Uncommon (★★☆)
    { id: 'm-euler', name: 'オイラー', rarity: MathematicianRarity.UNCOMMON, category: 'MOVEMENT', description: 'サイコロの目に+1〜+3できる（道がある限り）。', flavorText: '多作な数学者' },
    { id: 'm-archimedes', name: 'アルキメデス', rarity: MathematicianRarity.UNCOMMON, category: 'OBSTRUCTION', description: '他のプレイヤー1人を1マス押し戻す。', flavorText: 'テコの原理' },
    { id: 'm-descartes', name: 'デカルト', rarity: MathematicianRarity.UNCOMMON, category: 'MOVEMENT', description: 'このターン、サイコロの目を好きな目（1～3）に変える。', flavorText: '座標' },
    { id: 'm-fermat', name: 'フェルマー', rarity: MathematicianRarity.UNCOMMON, category: 'DEFENSE', description: '（MP1消費）このターン、他プレイヤーからの妨害系カードの効果を1度だけ無効にする。', flavorText: '証明できない' },
    { id: 'm-newton', name: 'ニュートン', rarity: MathematicianRarity.UNCOMMON, category: 'OBSTRUCTION', description: '他のプレイヤー1人を選び、次のターン、そのプレイヤーはサイコロの目-1マスしか進めない（最小1）。', flavorText: '万有引力' },
    { id: 'm-leibniz', name: 'ライプニッツ', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: '山札から数学者カードを2枚引き、1枚を手札に加え、もう1枚を山札の一番上に戻す。', flavorText: '微積分' },
    { id: 'm-laplace', name: 'ラプラス', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: 'イベントカードを引いた時、それを無効にしてもう1枚引き直せる。', flavorText: 'ラプラスの魔' },
    { id: 'm-lagrange', name: 'ラグランジュ', rarity: MathematicianRarity.UNCOMMON, category: 'MOVEMENT', description: 'このターン、他のプレイヤーのコマを1回だけすり抜けて進める。', flavorText: '解析力学' },
    { id: 'm-cauchy', name: 'コーシー', rarity: MathematicianRarity.UNCOMMON, category: 'DEFENSE', description: '手札の数学者カード1枚を捨て、今受けたイベントカードの効果を無効にする。', flavorText: 'コーシー列' },
    { id: 'm-galois', name: 'ガロア', rarity: MathematicianRarity.UNCOMMON, category: 'MP', description: '自分のMPが1以下の時、MPを5回復する。', flavorText: '夭逝の天才' },
    { id: 'm-weierstrass', name: 'ワイエルシュトラス', rarity: MathematicianRarity.UNCOMMON, category: 'OBSTRUCTION', description: '他のプレイヤー1人が配置した盤面タイルの上に「通行止め」コマを置く。', flavorText: '厳密性の父' },
    { id: 'm-riemann', name: 'リーマン', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: 'Missionカードの山札の上から3枚を見て、好きな順番で山札に戻す。', flavorText: 'リーマン予想' },
    { id: 'm-poincare', name: 'ポアンカレ', rarity: MathematicianRarity.UNCOMMON, category: 'MOVEMENT', description: '自分のコマと、自分から3マス以内にいる他のプレイヤー1人のコマの位置を入れ替える。', flavorText: 'トポロジー' },
    { id: 'm-hilbert', name: 'ヒルベルト', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: '自分の「収集系」Missionカードの達成条件を、任意の数学者カード1枚に変更する。', flavorText: 'ヒルベルトの23の問題' },
    { id: 'm-noether', name: 'エミー・ネーター', rarity: MathematicianRarity.UNCOMMON, category: 'MP', description: 'このターン、数学者カードを使うたびにMPを1回復する（最大3回まで）。', flavorText: 'ネーターの定理' },
    { id: 'm-ramanujan', name: 'ラマヌジャン', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: '山札から数学者カードを1枚引く。それが★★★ならMPを3回復する。そうでなければMPを1失う。', flavorText: '直感の天才' },
    { id: 'm-turing', name: 'チューリング', rarity: MathematicianRarity.UNCOMMON, category: 'OBSTRUCTION', description: '他プレイヤー1人の手札の数学者カード1枚を指定し、妨害系なら捨てさせる。', flavorText: 'エニグマ解読' },
    { id: 'm-godel', name: 'ゲーデル', rarity: MathematicianRarity.UNCOMMON, category: 'OBSTRUCTION', description: '他プレイヤー1人が達成したMissionカード1枚を選び、そのポイントを1点減らす。', flavorText: '不完全性定理' },
    { id: 'm-nash', name: 'ジョン・ナッシュ', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: '他のプレイヤー1人と交渉し、お互いが合意すれば手札の数学者カードを1枚ずつ交換できる。', flavorText: 'ナッシュ均衡' },
    { id: 'm-fleming', name: 'フレミング', rarity: MathematicianRarity.UNCOMMON, category: 'SPECIAL', description: 'イベントカード『本の雪崩』を引いた時、それを無効化する。', flavorText: 'ペニシリン' },

    // Rare (★★★)
    { id: 'm-gauss', name: 'ガウス', rarity: MathematicianRarity.RARE, category: 'OBSTRUCTION', description: '他のプレイヤー1人の次のサイコロの目を「1」に固定する。', flavorText: '最小二乗法' },
    { id: 'm-neumann', name: 'ノイマン', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '他のプレイヤー1人と、手札の数学者カードを1枚ランダムで交換する。', flavorText: 'ゲーム理論' },
    { id: 'm-cantor', name: 'カントール', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '自分の司書コマと、まだ誰もいない盤面タイル1枚の位置を入れ替える。', flavorText: '集合論' },
    { id: 'm-kepler', name: 'ケプラー', rarity: MathematicianRarity.RARE, category: 'MOVEMENT', description: 'サイコロを振る代わりに、1マス、2マス、3マスのいずれかを選んで進む。これを2回繰り返す。', flavorText: '惑星の法則' },
    { id: 'm-seki', name: '関孝和', rarity: MathematicianRarity.RARE, category: 'OBSTRUCTION', description: '他のプレイヤー全員の手札の数学者カードを見て、その中から1枚ずつ選び、山札の一番下に送る。', flavorText: '筆算' },
    { id: 'm-einstein', name: 'アインシュタイン', rarity: MathematicianRarity.RARE, category: 'MOVEMENT', description: 'このターン、自分のコマをマップ上の好きな「イベントマス」にワープさせる。', flavorText: '一般相対性理論' },
    { id: 'm-escher', name: 'エッシャー', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '自分のいるタイルと、隣接するタイル1枚の位置を入れ替える。', flavorText: 'だまし絵' },
    { id: 'm-mandelbrot', name: 'マンデルブロ', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: 'このターン、自分が置いた盤面タイルの上に、さらにもう1枚タイルを重ねて置ける。', flavorText: 'フラクタル' },
    { id: 'm-wiles', name: 'ワイルズ', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '手札の「フェルマー」とこのカードを同時に捨てることで、高ポイント（5点）のMissionを即座に達成する。', flavorText: 'フェルマーの最終定理証明' },
    { id: 'm-perelman', name: 'ペレルマン', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '次の自分のターン開始時まで、誰かがMissionを達成するたびに、自分もMPを1回復する。', flavorText: 'ポアンカレ予想解決' },
    { id: 'm-tao', name: 'テレンス・タオ', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: '自分の手札の数学者カード2枚を捨て、山札から数学者カードを3枚引く。', flavorText: '若き天才' },
    { id: 'm-mirzakhani', name: 'ミルザハニ', rarity: MathematicianRarity.RARE, category: 'MOVEMENT', description: 'このターン、一度通ったタイルをもう一度通ることができる。', flavorText: 'リーマン面の幾何学' },
    { id: 'm-davinci', name: 'ダ・ヴィンチ', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: 'このカードを、任意の「収集系」Missionに必要な数学者カード1枚の代わりとして使える。', flavorText: '万能人' },
    { id: 'm-laplace-demon', name: 'ラプラスの魔', rarity: MathematicianRarity.RARE, category: 'SPECIAL', description: 'イベントカードの山札の上から3枚を見て、1枚を選んで即座に発動させ、残りを山札の下に戻す。', flavorText: '決定論的な未来予知' },
    { id: 'm-maxwell', name: 'マクスウェル', rarity: MathematicianRarity.RARE, category: 'OBSTRUCTION', description: '自分以外の全プレイヤーは、次のターン、数学者カード（魔法）を使用できない。', flavorText: '電磁場' },
];

export const MISSION_CARDS: MissionCard[] = [
    // Low Points (1-2)
    { id: 'mi-newbie', title: '新米司書のおつかい', points: 1, description: '任意の数学者カードを1枚獲得し、手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-pythagoras', title: 'ピタゴラス学派の入門書', points: 2, description: '数学者カード「ピタゴラス」を手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-fibonacci', title: 'フィボナッチの数列研究', points: 2, description: '数学者カード「フィボナッチ」を手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-move-basic', title: '移動術の基礎', points: 2, description: '「移動系」の数学者カードを1枚手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-archive', title: '書庫の巡回', points: 1, description: '任意の「書庫マス」に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-event', title: 'イベント確認', points: 1, description: '任意の「イベントマス」に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-new-book', title: '新刊の配架', points: 2, description: 'そのターンに新しく配置した「盤面タイル」上のマスに止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-start', title: 'スタート地点の再確認', points: 2, description: '「スタートマス」に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-hoard', title: '知識の溜め込み', points: 1, description: 'ターン終了時、手札の数学者カードを3枚以上持っている。', category: 'CHAOS', completed: false },
    { id: 'mi-mp-save', title: '魔力温存', points: 1, description: 'ターン終了時、MPが6以上ある。', category: 'CHAOS', completed: false },
    { id: 'mi-mp-rich', title: 'MP節約家', points: 2, description: 'ターン終了時、MPが8以上ある。', category: 'CHAOS', completed: false },
    { id: 'mi-rest', title: '一休み', points: 2, description: 'イベントカード『本の雪崩』の効果を受ける。', category: 'CHAOS', completed: false },

    // Mid Points (3)
    { id: 'mi-modern', title: '近代数学の扉', points: 3, description: '「デカルト」と「フェルマー」を両方手札に揃える。', category: 'COLLECTION', completed: false },
    { id: 'mi-obstruct', title: '妨害工作の研究？', points: 3, description: '「妨害系」の数学者カードを2枚手札に揃える。', category: 'COLLECTION', completed: false },
    { id: 'mi-genius', title: '天才たちの系譜', points: 3, description: '「ガウス」または「オイラー」を手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-game-theory', title: 'ゲーム理論学会', points: 3, description: '「ノイマン」を手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-geo-area', title: '幾何学エリアの蔵書点検', points: 3, description: '「特殊マス（幾何学）」に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-alg-area', title: '代数学エリアの蔵書点検', points: 3, description: '「特殊マス（代数学）」に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-edge', title: '図書館の最果て', points: 3, description: 'マップの端にあるマスに止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-shortcut', title: '秘密の近道発見', points: 3, description: 'イベント『秘密の近道』の効果を受ける。', category: 'ARRIVAL', completed: false },
    { id: 'mi-cat', title: '迷子の猫を保護せよ！', points: 3, description: 'マップ上の「猫コマ」がいるタイルにぴったり止まる。', category: 'EVENT', completed: false },
    { id: 'mi-expand', title: '図書館の拡張工事', points: 3, description: '1ターンの間に「盤面タイル」を2枚配置する。', category: 'EVENT', completed: false },
    { id: 'mi-magic-user', title: '魔法の使い手', points: 3, description: '3ターン連続で数学者カードを使用する。', category: 'EVENT', completed: false },
    { id: 'mi-trouble', title: '同時多発トラブル！', points: 3, description: 'ターン終了時、手札にMissionカードを3枚以上持っている。', category: 'CHAOS', completed: false },
    { id: 'mi-mp-empty', title: 'MP枯渇', points: 3, description: 'ターン終了時、MPが0である。', category: 'CHAOS', completed: false },
    { id: 'mi-lonely', title: '孤独な研究', points: 3, description: 'ターン終了時、周囲4タイルに他プレイヤーがいない。', category: 'CHAOS', completed: false },

    // High Points (4-5)
    { id: 'mi-infinity', title: '無窮への挑戦', points: 4, description: '「カントール」を手札に加える。', category: 'COLLECTION', completed: false },
    { id: 'mi-specialist', title: '専門分野の制覇', points: 4, description: '「移動系」「妨害系」「特殊系」を各1枚手札に揃える。', category: 'COLLECTION', completed: false },
    { id: 'mi-allstar', title: '数学者オールスター', points: 5, description: '★1、★2、★3のカードを各1枚手札に揃える。', category: 'COLLECTION', completed: false },
    { id: 'mi-wisemen', title: '三賢者の集い', points: 5, description: '★3のカードを2枚手札に揃える。', category: 'COLLECTION', completed: false },
    { id: 'mi-traverse', title: '図書館横断', points: 4, description: 'スタートマスから10マス以上離れたタイルに止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-area-master', title: '専門書エリア制覇', points: 4, description: '「特殊マス（幾何学）」と「特殊マス（代数学）」の両方に止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-archive-raid', title: '書庫荒らし', points: 5, description: '1ターンの間に「書庫マス」に2回止まる。', category: 'ARRIVAL', completed: false },
    { id: 'mi-interfere', title: '華麗なる妨害', points: 4, description: '「妨害系」カードを使う。', category: 'EVENT', completed: false },
    { id: 'mi-warp', title: 'ワープ・マスター', points: 4, description: '「カントール」または「ピタゴラス」のワープ能力を使用する。', category: 'EVENT', completed: false },
    { id: 'mi-overload', title: '知識のオーバーロード', points: 4, description: 'ターン終了時、手札の数学者カードを5枚以上持っている。', category: 'CHAOS', completed: false },
    { id: 'mi-junkie', title: 'ミッション・ジャンキー', points: 5, description: 'ターン終了時、同時に2枚のMissionカードを達成する。', category: 'CHAOS', completed: false },
    { id: 'mi-troublemaker', title: 'トラブルメーカー', points: 5, description: '1ターンに「イベントマス」に止まり、かつ「妨害系」カードを使用する。', category: 'CHAOS', completed: false },
];

export const EVENT_CARDS: EventCard[] = [
    { id: 'ev-inspection', title: '蔵書点検', description: '全員、手札の数学者カードを1枚、左隣の人に渡す。', effectType: 'DISCARD' },
    { id: 'ev-silence', title: '静粛に！', description: '次のあなたのターン、魔法（数学者カード）は使用できない。', effectType: 'SILENCE' },
    { id: 'ev-inspiration', title: 'インスピレーション', description: 'MPを3回復し、数学者カードを1枚引く。', effectType: 'HEAL' },
    { id: 'ev-avalanche', title: '本の雪崩', description: '次のターン、1回休み。', effectType: 'SKIP' },
    { id: 'ev-shortcut', title: '秘密の近道', description: 'スタートマスに戻る', effectType: 'WARP' },
    { id: 'ev-cat', title: '迷子の猫の保護', description: '猫コマを配置する。捕獲するとMission達成。', effectType: 'CAT' },
];

export const BOARD_CARDS: BoardCard[] = [
    // Basic Paths
    { id: 'b-cross', name: 'Crossroads', connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT], description: 'A 4-way intersection.' },
    { id: 'b-t', name: 'T-Junction', connections: [Direction.TOP, Direction.RIGHT, Direction.LEFT], description: 'A 3-way path.' },
    { id: 'b-straight', name: 'Corridor', connections: [Direction.TOP, Direction.BOTTOM], description: 'A straight hallway.' },
    { id: 'b-corner', name: 'Corner', connections: [Direction.TOP, Direction.RIGHT], description: 'A turn in the path.' },

    // Special Rooms
    { id: 'b-archive', name: 'Archive', connections: [Direction.TOP, Direction.BOTTOM], specialType: TileType.ARCHIVE, description: 'Draw a Mathematician Card.' },
    { id: 'b-event', name: 'Event Hall', connections: [Direction.TOP, Direction.RIGHT, Direction.LEFT], specialType: TileType.EVENT, description: 'Trigger a random event.' },
    { id: 'b-geo', name: 'Geometry Lab', connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT], specialType: TileType.SPECIAL_GEOMETRY, description: 'Special Geometry effects.' },
    { id: 'b-alg', name: 'Algebra Room', connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT], specialType: TileType.SPECIAL_ALGEBRA, description: 'Special Algebra effects.' },

    // New Rooms
    { id: 'b-library', name: 'Reading Room', connections: [Direction.TOP, Direction.BOTTOM], specialType: TileType.LIBRARY, description: 'A quiet place to study.' },
    { id: 'b-study', name: 'Study Room', connections: [Direction.RIGHT, Direction.LEFT], specialType: TileType.STUDY_ROOM, description: 'Focus and recover MP.' },
    { id: 'b-garden', name: 'Courtyard', connections: [Direction.TOP, Direction.RIGHT, Direction.BOTTOM, Direction.LEFT], specialType: TileType.GARDEN, description: 'A peaceful garden.' },
    { id: 'b-cafeteria', name: 'Cafeteria', connections: [Direction.TOP, Direction.RIGHT], specialType: TileType.CAFETERIA, description: 'Grab a coffee.' },
];
