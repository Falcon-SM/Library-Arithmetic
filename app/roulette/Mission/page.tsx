'use client'; // Next.js 13+ (App Router) を使用する場合、ファイルの先頭にこれが必要です

import React, { useState, useEffect } from 'react';

// --- 型定義 ---
// ミッションオブジェクトの型を定義します
interface Mission {
  title: string;
  points: number;
  type: string;
  condition: string;
}

// --- ミッションデータ ---
// ユーザーから提供されたミッションリスト
// Mission[] 型（Missionオブジェクトの配列）であることを明記します
const missions: Mission[] = [
  // 低ポイント（1-2点）
  { title: '新米司書のおつかい', points: 1, type: '収集系', condition: '任意の数学者カードを1枚獲得し、手札に加える。（達成時、そのカードは見せるだけで捨てなくて良い）' },
  { title: 'ピタゴラス学派の入門書', points: 2, type: '収集系', condition: '数学者カード「ピタゴラス」を手札に加える。' },
  { title: 'フィボナッチの数列研究', points: 2, type: '収集系', condition: '数学者カード「フィボナッチ」を手札に加える。' },
  { title: '移動術の基礎', points: 2, type: '収集系', condition: '「移動系」の数学者カードを1枚手札に加える。' },
  { title: '書庫の巡回', points: 1, type: '到達系', condition: '任意の「書庫マス」に止まる。' },
  { title: 'イベント確認', points: 1, type: '到達系', condition: '任意の「イベントマス」に止まる。' },
  { title: '新刊の配架', points: 2, type: '到達系', condition: 'そのターンに（誰かが）新しく配置した「盤面タイル」上のマスに止まる。' },
  { title: 'スタート地点の再確認', points: 2, type: '到達系', condition: '「スタートマス」に（戻って）止まる。' },
  { title: '知識の溜め込み', points: 1, type: 'ハチャメチャ系', condition: '自分のターン終了時、手札の数学者カードを3枚以上持っている。' },
  { title: '魔力温存', points: 1, type: 'ハチャメチャ系', condition: '自分のターン終了時、MPが（初期値の5点を上回る）6以上ある。' },
  { title: 'MP節約家', points: 2, type: 'ハチャメチャ系', condition: '自分のターン終了時、MPが8以上ある。' },
  { title: '一休み', points: 2, type: 'ハチャメチャ系', condition: 'イベントカード『本の雪崩』（1回休み）の効果を受ける。' },
  // 中ポイント（3点）
  { title: '近代数学の扉', points: 3, type: '収集系', condition: '「デカルト」と「フェルマー」のカードを両方手札に揃える。' },
  { title: '妨害工作の研究？', points: 3, type: '収集系', condition: '「妨害系」の数学者カードを2枚手札に揃える。' },
  { title: '天才たちの系譜', points: 3, type: '収集系', condition: '「ガウス」または「オイラー」のカードを手札に加える。' },
  { title: 'ゲーム理論学会', points: 3, type: '収集系', condition: '数学者カード「ノイマン」を手札に加える。' },
  { title: '幾何学エリアの蔵書点検', points: 3, type: '到達系', condition: '「特殊マス（幾何学シンボル）」に止まる。' },
  { title: '代数学エリアの蔵書点検', points: 3, type: '到達系', condition: '「特殊マス（代数学シンボル）」に止まる。' },
  { title: '図書館の最果て', points: 3, type: '到達系', condition: 'マップの端（他のタイルをもう置けない場所）にあるマスに止まる。' },
  { title: '秘密の近道発見', points: 3, type: '到達系', condition: 'イベントカード『秘密の近道』（スタートマスに戻る）の効果を受ける。' },
  { title: '迷子の猫を保護せよ！', points: 3, type: 'イベント系', condition: '（引いたら即公開）マップ上の「猫コマ」がいるタイルにぴったり止まる。（達成は早い者勝ち）' },
  { title: '図書館の拡張工事', points: 3, type: 'イベント系', condition: '1ターンの間に「盤面タイル」を2枚配置する。（サイコロの目と道の状況で達成可能）' },
  { title: '魔法の使い手', points: 3, type: 'イベント系', condition: '3ターン連続で数学者カード（魔法）を使用する。' },
  { title: '同時多発トラブル！', points: 3, type: 'ハチャメチャ系', condition: '自分のターン終了時、手札に（未達成の）Missionカードを3枚以上持っている。（フィボナッチの効果などで増やす必要あり）' },
  { title: 'MP枯渇', points: 3, type: 'ハチャメチャ系', condition: '自分のターン終了時、MPが0である。' },
  { title: '孤独な研究', points: 3, type: 'ハチャメチャ系', condition: '自分のターン終了時、自分のコマがいるタイルの上下左右4タイルに、他のプレイヤーが誰もいない。' },
  // 高ポイント（4-5点）
  { title: '無窮への挑戦', points: 4, type: '収集系', condition: '数学者カード「カントール」を手札に加える。' },
  { title: '専門分野の制覇', points: 4, type: '収集系', condition: '「移動系」「妨害系」「特殊系」の数学者カードをそれぞれ1枚ずつ手札に揃える。' },
  { title: '数学者オールスター', points: 5, type: '収集系', condition: 'レア度★☆☆、★★☆、★★★の数学者カードをそれぞれ1枚ずつ手札に揃える。' },
  { title: '三賢者の集い', points: 5, type: '収集系', condition: 'レア度★★★の数学者カードを2枚手札に揃える。' },
  { title: '図書館横断', points: 4, type: '到達系', condition: 'スタートマスから数えて、道なりに10マス以上離れたタイル上のマスに止まる。' },
  { title: '専門書エリア制覇', points: 4, type: '到達系', condition: '「特殊マス（幾何学）」と「特殊マス（代数学）」の両方に、それぞれ1回ずつ（別々のターンでOK）止まったことがある。' },
  { title: '書庫荒らし', points: 5, type: '到達系', condition: '1ターンの間に（オイラーの能力などを使い）「書庫マス」に2回止まる。' },
  { title: '華麗なる妨害', points: 4, type: 'イベント系', condition: '「妨害系」の数学者カードを使い、他のプレイヤーのMission達成を阻止する（または妨害する）。（※達成の判定が難しい場合、「妨害系カードを使う」だけで3点にするのもアリです）' },
  { title: 'ワープ・マスター', points: 4, type: 'イベント系', condition: '「カントール」または「ピタゴラス」のワープ能力を使用する。' },
  { title: '知識のオーバーロード', points: 4, type: 'ハチャメチャ系', condition: '自分のターン終了時、手札の数学者カードを5枚以上持っている。' },
  { title: 'ミッション・ジャンキー', points: 5, type: 'ハチャメチャ系', condition: '自分のターン終了時、同時に2枚のMissionカードを達成（公開）する。' },
  { title: 'トラブルメーカー', points: 5, type: 'ハチャメチャ系', condition: '1ターンの間に「イベントマス」に止まり、さらに「妨害系」の数学者カードを使用する。' },
];

// --- 定数 ---
const MISSION_ITEM_HEIGHT = 80; // 各ミッション項目の高さ (h-20 in Tailwind = 5rem = 80px)
const ROULETTE_WINDOW_HEIGHT = 320; // ルーレット表示ウィンドウの高さ (h-80 = 20rem = 320px)
const SPIN_DURATION_MS = 7000; // スピンのアニメーション時間（ミリ秒）
const REEL_REPETITIONS = 5; // リストを何回繰り返してリールを作成するか

// --- ヘルパー関数 ---
// 配列をシャッフルする（Fisher-Yatesアルゴリズム）
// (TS) パラメータ 'array' に Mission[] 型を指定します
const shuffle = (array: Mission[]) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};


// --- メインコンポーネント ---
export default function App() {
  const [spinning, setSpinning] = useState(false);
  // (TS) result の型を <Mission | null> （Mission または null） に指定します
  const [result, setResult] = useState<Mission | null>(null);
  const [spinnerStyle, setSpinnerStyle] = useState({
    transform: 'translateY(0px)',
    transition: 'none',
  });
  // (TS) shuffledReel の型を <Mission[]> （Mission の配列）に指定します
  const [shuffledReel, setShuffledReel] = useState<Mission[]>([]);

  // コンポーネントのマウント時に、シャッフルされた長いリールを作成
  useEffect(() => {
    const shuffled = shuffle([...missions]);
    const reel: Mission[] = []; // (TS) reel にも Mission[] 型を指定します
    for (let i = 0; i < REEL_REPETITIONS; i++) {
      reel.push(...shuffled);
    }
    setShuffledReel(reel);
  }, []);

  // スピンボタンが押された時の処理
  const handleSpin = () => {
    if (spinning || shuffledReel.length === 0) return;

    setSpinning(true);
    setResult(null);

    // 1. 停止するミッションをランダムに決定
    const targetMissionIndex = Math.floor(Math.random() * missions.length);
    const targetMission = missions[targetMissionIndex];

    // 2. リール（繰り返し配列）の「中央」セクションでそのミッションが停止するようにインデックスを計算
    //    こうすることで、常に前後に十分なスクロール要素が確保される
    const reelOffset = missions.length * Math.floor(REEL_REPETITIONS / 2);
    const targetReelIndex = reelOffset + targetMissionIndex;

    // 3. 停止位置のY座標を計算
    //    ウィンドウの中央に停止するように調整
    const centerOffset = (ROULETTE_WINDOW_HEIGHT / 2) - (MISSION_ITEM_HEIGHT / 2);
    const targetY = -(targetReelIndex * MISSION_ITEM_HEIGHT) + centerOffset;

    // 4. 最終停止位置に少しランダムな「ブレ」を追加して、毎回同じ場所に見えないようにする
    const wobble = (Math.random() - 0.5) * (MISSION_ITEM_HEIGHT * 0.8);
    const finalY = targetY + wobble;

    // 5. アニメーションの「巻き戻り」を防ぐため、一度トランジションを切り、
    //    リールの現在位置に近い（ように見える）開始位置にリセットする
    const startReelIndex = missions.length * (Math.floor(REEL_REPETITIONS / 2) - 1);
    const startY = -(startReelIndex * MISSION_ITEM_HEIGHT) + centerOffset;
    
    setSpinnerStyle({
      transform: `translateY(${startY}px)`,
      transition: 'none',
    });

    // 6. ブラウザが上記のリセットを確実に描画した後、
    //    スピンアニメーション（最終位置へのトランジション）を開始する
    //    setTimeout(10) は、このための小さな遅延
    setTimeout(() => {
      setSpinnerStyle({
        transform: `translateY(${finalY}px)`,
        transition: `transform ${SPIN_DURATION_MS}ms cubic-bezier(0.25, 0.1, 0.25, 1)`,
      });
    }, 10); // 10msの遅延

    // 7. アニメーションが終了するタイミングで、結果をセットし、スピニング状態を解除
    //    onTransitionEndは不安定な場合があるため、setTimeoutで時間を管理する
    setTimeout(() => {
      setSpinning(false);
      setResult(targetMission);
    }, SPIN_DURATION_MS + 100); // アニメーション時間 + バッファ
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-cyan-400">ミッションルーレット</h1>
      
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6">
        
        {/* --- ルーレット表示ウィンドウ --- */}
        <div 
          className="h-80 w-full bg-gray-900 rounded-lg overflow-hidden relative border-2 border-gray-700"
          style={{ height: `${ROULETTE_WINDOW_HEIGHT}px` }}
        >
          
          {/* --- 左右のポインター（矢印） --- */}
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-0 z-10
                          border-t-8 border-t-transparent
                          border-b-8 border-b-transparent
                          border-l-8 border-l-cyan-400"
               style={{ borderTopWidth: '8px', borderBottomWidth: '8px', borderLeftWidth: '8px' }}></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0 z-10
                          border-t-8 border-t-transparent
                          border-b-8 border-b-transparent
                          border-r-8 border-r-cyan-400"
                style={{ borderTopWidth: '8px', borderBottomWidth: '8px', borderRightWidth: '8px' }}></div>
          
          {/* --- 中央の選択ライン --- */}
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-full bg-cyan-400 bg-opacity-10 border-y-2 border-cyan-400 z-0"
            style={{ height: `${MISSION_ITEM_HEIGHT}px` }}
          ></div>

          {/* --- スピナー本体（動く部分）--- */}
          <div 
            className="w-full"
            style={spinnerStyle}
          >
            {/* (TS) 'mission' はここで Mission 型だと正しく推論されます */}
            {shuffledReel.map((mission, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-4 border-b border-gray-700"
                style={{ height: `${MISSION_ITEM_HEIGHT}px` }}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold truncate max-w-xs">{mission.title}</div>
                  <div className="text-sm text-gray-400">({mission.points}点 - {mission.type})</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* --- コントロール（ボタン） --- */}
        <div className="mt-6">
          <button
            onClick={handleSpin}
            disabled={spinning || shuffledReel.length === 0}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold py-4 px-6 rounded-lg text-xl shadow-lg
                       transition-all duration-300 transform active:scale-95
                       disabled:bg-gray-600 disabled:cursor-not-allowed disabled:scale-100"
          >
            {spinning ? 'スピン中...' : (shuffledReel.length === 0 ? '読み込み中...' : 'スピン！')}
          </button>
        </div>

        {/* --- 結果表示 --- */}
        {/* (TS) 'result' はここで Mission 型だと正しく推論されます */}
        {result && !spinning && (
          <div className="mt-6 p-5 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-xl text-center animate-fade-in">
            <h2 className="text-2xl font-bold mb-3 text-cyan-400">{result.title}</h2>
            <p className="text-lg mb-2"><span className="font-semibold">{result.points}点</span> - {result.type}</p>
            <p className="text-gray-300 text-left">{result.condition}</p>
          </div>
        )}
      </div>
      
      {/* CSS for fade-in animation */}
      {/* 'jsx' 属性を削除し、通常の <style> タグに変更しました */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}