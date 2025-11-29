'use client'; // Next.js 13+ (App Router) を使用する場合、ファイルの先頭にこれが必要です

import React, { useState, useEffect } from 'react';

// --- 型定義 ---
// イベントオブジェクトの型を定義します
interface Event {
  title: string;
  type: string;
  effect: string;
}

// --- イベントデータ ---
// 先ほど作成したイベントリスト
// Event[] 型（Eventオブジェクトの配列）であることを明記します
const events: Event[] = [
  // 【移動・ワープ系】
  { title: '秘密の近道', type: '移動・ワープ系', effect: '自分のコマを「スタートマス」にワープさせる。' },
  { title: '強制ワープ：書庫', type: '移動・ワープ系', effect: 'マップ上で、今いる場所から一番近い「書庫マス」にワープする。（複数ある場合は自分で選ぶ）' },
  { title: '強制ワープ：カオス', type: '移動・ワープ系', effect: 'マップ上で、自分から一番遠くにいるプレイヤーのマスにワープする。' },
  { title: '緊急会議', type: '移動・ワープ系', effect: '全プレイヤーは、即座に自分のコマを「スタートマス」に集める。' },
  { title: '場所交換：トップ狙い', type: '移動・ワープ系', effect: '現在ポイントが一番多いプレイヤーと、自分のコマの位置を入れ替える。（自分がトップの場合は何も起こらない）' },
  { title: '場所交換：ランダム', type: '移動・ワープ系', effect: 'サイコロを振り、出た目（1～3）に応じて「左隣のプレイヤー」「右隣のプレイヤー」「一番近いプレイヤー」のうち1人を選び、場所を入れ替える。' },

  // 【妨害・ハプニング系】
  { title: '本の雪崩', type: '妨害・ハプニング系', effect: '次のあなたのターン、1回休み。' },
  { title: '静粛に！', type: '妨害・ハプニング系', effect: '次のあなたのターン、魔法（数学者カード）は使用できない。' },
  { title: '蔵書点検', type: '妨害・ハプニング系', effect: '全員、手札の数学者カードを1枚、左隣の人に渡す。' },
  { title: '魔力流出', type: '妨害・ハプニング系', effect: '全員、MPを2失う。' },
  { title: '落とし物', type: '妨害・ハプニング系', effect: '自分の手札から、数学者カードをランダムに1枚選び、捨てる。' },
  { title: '開かずの間', type: '妨害・ハプニング系', effect: '今いるタイル上の「道」1つを、次の自分のターン開始時まで封鎖する。（「通行止めコマ」を置く）' },
  { title: '逆走注意！', type: '妨害・ハプニング系', effect: '次のあなたのターン、あなたは今来た道を引き返す（Uターンする）ことができない。' },

  // 【リソース・ボーナス系】
  { title: 'インスピレーション', type: 'リソース・ボーナス系', effect: 'MPを3回復し、数学者カードを1枚引く。' },
  { title: '大発見！', type: 'リソース・ボーナス系', effect: '山札から数学者カードを2枚引く。' },
  { title: '魔力活性', type: 'リソース・ボーナス系', effect: '全員、MPを2回復する。' },
  { title: '司書の知恵', type: 'リソース・ボーナス系', effect: '手札の（未達成の）Missionカード1枚を捨て、山札から1枚引く。' },
  { title: '緊急修復', type: 'リソース・ボーナス系', effect: '自分のMPを3回復する。' },

  // 【マップ操作系（カオス）】
  { title: '図書館の再編', type: 'マップ操作系（カオス）', effect: '今いるタイルと、それに隣接するタイル1枚（ただし誰も乗っていないもの）を選び、位置を入れ替える。（道が繋がるように配置し直す必要があります）' },
  { title: 'タイルの回転', type: 'マップ操作系（カオス）', effect: '今いるタイルを時計回りに90度、または180度回転させる。（道が繋がなくなってもOK。カオス！）' },
];


// --- 定数 ---
const EVENT_ITEM_HEIGHT = 80; // 各イベント項目の高さ (h-20 in Tailwind = 5rem = 80px)
const ROULETTE_WINDOW_HEIGHT = 320; // ルーレット表示ウィンドウの高さ (h-80 = 20rem = 320px)
const SPIN_DURATION_MS = 7000; // スピンのアニメーション時間（ミリ秒）
const REEL_REPETITIONS = 5; // リストを何回繰り返してリールを作成するか

// --- ヘルパー関数 ---
// 配列をシャッフルする（Fisher-Yatesアルゴリズム）
// (TS) パラメータ 'array' に Event[] 型を指定します
const shuffle = (array: Event[]) => {
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
  // (TS) result の型を <Event | null> （Event または null） に指定します
  const [result, setResult] = useState<Event | null>(null);
  const [spinnerStyle, setSpinnerStyle] = useState({
    transform: 'translateY(0px)',
    transition: 'none',
  });
  // (TS) shuffledReel の型を <Event[]> （Event の配列）に指定します
  const [shuffledReel, setShuffledReel] = useState<Event[]>([]);

  // コンポーネントのマウント時に、シャッフルされた長いリールを作成
  useEffect(() => {
    const shuffled = shuffle([...events]);
    const reel: Event[] = []; // (TS) reel にも Event[] 型を指定します
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

    // 1. 停止するイベントをランダムに決定
    const targetEventIndex = Math.floor(Math.random() * events.length);
    const targetEvent = events[targetEventIndex];

    // 2. リール（繰り返し配列）の「中央」セクションでそのイベントが停止するようにインデックスを計算
    //    こうすることで、常に前後に十分なスクロール要素が確保される
    const reelOffset = events.length * Math.floor(REEL_REPETITIONS / 2);
    const targetReelIndex = reelOffset + targetEventIndex;

    // 3. 停止位置のY座標を計算
    //    ウィンドウの中央に停止するように調整
    const centerOffset = (ROULETTE_WINDOW_HEIGHT / 2) - (EVENT_ITEM_HEIGHT / 2);
    const targetY = -(targetReelIndex * EVENT_ITEM_HEIGHT) + centerOffset;

    // 4. 最終停止位置に少しランダムな「ブレ」を追加して、毎回同じ場所に見えないようにする
    const wobble = (Math.random() - 0.5) * (EVENT_ITEM_HEIGHT * 0.8);
    const finalY = targetY + wobble;

    // 5. アニメーションの「巻き戻り」を防ぐため、一度トランジションを切り、
    //    リールの現在位置に近い（ように見える）開始位置にリセットする
    const startReelIndex = events.length * (Math.floor(REEL_REPETITIONS / 2) - 1);
    const startY = -(startReelIndex * EVENT_ITEM_HEIGHT) + centerOffset;
    
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
      setResult(targetEvent);
    }, SPIN_DURATION_MS + 100); // アニメーション時間 + バッファ
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4 sm:p-6 font-sans">
      <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-cyan-400">イベントルーレット</h1>
      
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
            style={{ height: `${EVENT_ITEM_HEIGHT}px` }}
          ></div>

          {/* --- スピナー本体（動く部分）--- */}
          <div 
            className="w-full"
            style={spinnerStyle}
          >
            {/* (TS) 'event' はここで Event 型だと正しく推論されます */}
            {shuffledReel.map((event, index) => (
              <div 
                key={index}
                className="flex items-center justify-center p-4 border-b border-gray-700"
                style={{ height: `${EVENT_ITEM_HEIGHT}px` }}
              >
                <div className="text-center">
                  <div className="text-lg font-semibold truncate max-w-xs">{event.title}</div>
                  <div className="text-sm text-gray-400">({event.type})</div>
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
        {/* (TS) 'result' はここで Event 型だと正しく推論されます */}
        {result && !spinning && (
          <div className="mt-6 p-5 bg-gray-800 border-2 border-cyan-400 rounded-lg shadow-xl text-left animate-fade-in">
            <h2 className="text-2xl font-bold mb-3 text-cyan-400 text-center">{result.title}</h2>
            <p className="text-lg mb-2 text-center text-gray-300">{result.type}</p>
            <p className="text-gray-200 mt-4">{result.effect}</p>
          </div>
        )}
      </div>
      
      {/* CSS for fade-in animation */}
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