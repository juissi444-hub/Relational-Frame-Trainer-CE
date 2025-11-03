import React, { useState, useEffect, useCallback } from 'react';
import { Settings, History, Play, Pause, RotateCcw, X, Check, Clock, TrendingUp, Info } from 'lucide-react';
import { supabase } from './supabaseClient';

interface RelationalFrameTrainerProps {
  userId: string;
  username: string;
}

export default function RelationalFrameTrainer({ userId, username }: RelationalFrameTrainerProps) {
  const [difficulty, setDifficulty] = useState(3);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [networkComplexity, setNetworkComplexity] = useState(0.5);
  const [spoilerPremises, setSpoilerPremises] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [useLetters, setUseLetters] = useState(true);
  const [useEmojis, setUseEmojis] = useState(false);
  const [useVoronoi, setUseVoronoi] = useState(false);
  const [useMandelbrot, setUseMandelbrot] = useState(false);
  const [letterLength, setLetterLength] = useState(3);
  const [autoProgressMode, setAutoProgressMode] = useState('universal'); // 'universal', 'mode-specific', or 'off'
  const [universalProgress, setUniversalProgress] = useState({
    targetPremiseCount: 40,
    targetAccuracy: 95,
    recentAnswers: []
  });
  const [modeSpecificProgress, setModeSpecificProgress] = useState({
    equality: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
    temporal: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
    spatial: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
    containment: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 }
  });
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showResetComplete, setShowResetComplete] = useState(false);
  const [statsHistory, setStatsHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, missed: 0 });
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [hoveredPremise, setHoveredPremise] = useState(null);
  const [enabledRelationModes, setEnabledRelationModes] = useState({
    equality: true,
    temporal: false,
    spatial: false,
    containment: false
  });

  const relationSets = {
    equality: ['SAME', 'OPPOSITE', 'DIFFERENT'],
    temporal: ['BEFORE', 'AFTER', 'AT'],
    spatial: ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'],
    containment: ['CONTAINS', 'WITHIN']
  };

  const oppositeRelations = {
    'CONTAINS': 'WITHIN',
    'WITHIN': 'CONTAINS'
  };

  const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌', '👫', '👬', '👭', '💏', '💑', '👪', '🗣️', '👤', '👥', '🫂', '👣', '🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱', '🦠', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🏺', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑️', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📽️', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛗', '🪞', '🪟', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️'];
  
  const generateMandelbrotSVG = (seed) => {
    const random = (s) => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    
    // Random zoom and position in the Mandelbrot set
    const centerX = -0.7 + (random(seed) - 0.5) * 0.5;
    const centerY = 0 + (random(seed + 100) - 0.5) * 0.5;
    const zoom = 0.3 + random(seed + 200) * 0.7;
    
    const width = 64;
    const height = 64;
    const maxIterations = 50;
    
    let svgContent = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="border-radius: 0.375rem;">';
    
    // Color palette
    const colors = [
      '#000033', '#000055', '#0000AA', '#0000FF', '#0055FF',
      '#00AAFF', '#00FFFF', '#55FFAA', '#AAFF55', '#FFFF00',
      '#FFAA00', '#FF5500', '#FF0000', '#AA0000', '#550000', '#000000'
    ];
    
    for (let py = 0; py < height; py++) {
      for (let px = 0; px < width; px++) {
        // Map pixel to complex plane
        const x0 = centerX + (px / width - 0.5) * zoom;
        const y0 = centerY + (py / height - 0.5) * zoom;
        
        let x = 0;
        let y = 0;
        let iteration = 0;
        
        // Mandelbrot iteration: z = z^2 + c
        while (x * x + y * y <= 4 && iteration < maxIterations) {
          const xtemp = x * x - y * y + x0;
          y = 2 * x * y + y0;
          x = xtemp;
          iteration++;
        }
        
        // Color based on iteration count
        let color;
        if (iteration === maxIterations) {
          color = '#000000'; // Inside the set
        } else {
          const colorIndex = Math.floor((iteration / maxIterations) * (colors.length - 1));
          color = colors[colorIndex];
        }
        
        svgContent += `<rect x="${px}" y="${py}" width="1" height="1" fill="${color}"/>`;
      }
    }
    
    svgContent += '</svg>';
    return svgContent;
  };
  
  const generateVoronoiSVG = (seed) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2', '#F06292', '#AED581', '#FFB74D', '#4DB6AC', '#9575CD', '#F06292', '#DCE775', '#4DD0E1', '#FF8A65', '#A1887F'];
    const random = (s) => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    
    // Create a simple mosaic pattern with 4x4 grid
    let svgContent = '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" style="border-radius: 0.375rem;">';
    
    const gridSize = 4; // 4x4 grid = 16 tiles
    const tileSize = 64 / gridSize;
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const colorIndex = Math.floor(random(seed + row * gridSize + col) * colors.length);
        const color = colors[colorIndex];
        const x = col * tileSize;
        const y = row * tileSize;
        
        svgContent += `<rect x="${x}" y="${y}" width="${tileSize}" height="${tileSize}" fill="${color}" opacity="0.9"/>`;
      }
    }
    
    svgContent += '</svg>';
    return svgContent;
  };
  
  const generateStimulus = () => {
    const availableTypes = [];
    if (useLetters) availableTypes.push('letters');
    if (useEmojis) availableTypes.push('emojis');
    if (useVoronoi) availableTypes.push('voronoi');
    if (useMandelbrot) availableTypes.push('mandelbrot');
    
    if (availableTypes.length === 0) availableTypes.push('letters');
    
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    if (selectedType === 'emojis') {
      return emojiList[Math.floor(Math.random() * emojiList.length)];
    } else if (selectedType === 'voronoi') {
      return `voronoi_${Math.floor(Math.random() * 1000000)}`;
    } else if (selectedType === 'mandelbrot') {
      return `mandelbrot_${Math.floor(Math.random() * 1000000)}`;
    } else {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < letterLength; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
      return result;
    }
  };

  const getRelationMode = (relation) => {
    if (['SAME', 'OPPOSITE', 'DIFFERENT'].includes(relation)) return 'equality';
    if (['BEFORE', 'AFTER', 'AT'].includes(relation)) return 'temporal';
    if (['CONTAINS', 'WITHIN'].includes(relation)) return 'containment';
    return 'spatial';
  };

  const deriveRelation = (rel1, rel2) => {
    const mode1 = getRelationMode(rel1);
    const mode2 = getRelationMode(rel2);
    
    // Can't derive across different modes
    if (mode1 !== mode2) return 'AMBIGUOUS';
    
    if (mode1 === 'equality') {
      // Identity element
      if (rel1 === 'SAME') return rel2;
      if (rel2 === 'SAME') return rel1;
      
      // OPPOSITE is its own inverse: OPPOSITE ∘ OPPOSITE = SAME
      if (rel1 === 'OPPOSITE' && rel2 === 'OPPOSITE') return 'SAME';
      
      // DIFFERENT cannot be composed - it's non-transitive
      // X DIFFERENT Y, Y DIFFERENT Z tells us nothing about X and Z
      // (they could be SAME, OPPOSITE, or DIFFERENT)
      if (rel1 === 'DIFFERENT' || rel2 === 'DIFFERENT') return 'AMBIGUOUS';
      
      return 'AMBIGUOUS';
    } else if (mode1 === 'temporal') {
      // AT is identity
      if (rel1 === 'AT') return rel2;
      if (rel2 === 'AT') return rel1;
      
      // Transitive properties
      if (rel1 === 'BEFORE' && rel2 === 'BEFORE') return 'BEFORE';
      if (rel1 === 'AFTER' && rel2 === 'AFTER') return 'AFTER';
      
      // Contradictory (A before B, B after C doesn't tell us about A and C)
      if (rel1 === 'BEFORE' && rel2 === 'AFTER') return 'AMBIGUOUS';
      if (rel1 === 'AFTER' && rel2 === 'BEFORE') return 'AMBIGUOUS';
      
      return 'AMBIGUOUS';
    } else if (mode1 === 'containment') {
      // Transitive containment: 
      // If A CONTAINS B and B CONTAINS C, then A CONTAINS C
      if (rel1 === 'CONTAINS' && rel2 === 'CONTAINS') return 'CONTAINS';
      
      // If A WITHIN B and B WITHIN C, then A WITHIN C
      if (rel1 === 'WITHIN' && rel2 === 'WITHIN') return 'WITHIN';
      
      // Mixed directions don't compose:
      // A CONTAINS B and B WITHIN C would mean A CONTAINS B and C CONTAINS B
      // This doesn't tell us the relationship between A and C
      if (rel1 === 'CONTAINS' && rel2 === 'WITHIN') return 'AMBIGUOUS';
      if (rel1 === 'WITHIN' && rel2 === 'CONTAINS') return 'AMBIGUOUS';
      
      return 'AMBIGUOUS';
    } else {
      // Spatial relations
      const opposites = {
        'NORTH': 'SOUTH', 'SOUTH': 'NORTH',
        'EAST': 'WEST', 'WEST': 'EAST',
        'NORTHEAST': 'SOUTHWEST', 'SOUTHWEST': 'NORTHEAST',
        'NORTHWEST': 'SOUTHEAST', 'SOUTHEAST': 'NORTHWEST'
      };
      
      // Same direction is transitive
      if (rel1 === rel2) return rel1;
      
      // Opposite directions cancel out (A north of B, B south of C is ambiguous)
      if (opposites[rel1] === rel2) return 'AMBIGUOUS';
      
      // Different non-opposite directions are ambiguous
      return 'AMBIGUOUS';
    }
  };

  const findAllPaths = (graph, start, end, currentPath = [], visited = new Set(), allPaths = []) => {
    if (start === end && currentPath.length > 0) {
      allPaths.push([...currentPath]);
      return allPaths;
    }
    visited.add(start);
    for (const edge of graph) {
      let nextNode = null, edgeToAdd = null;
      if (edge.stimulus1 === start && !visited.has(edge.stimulus2)) {
        nextNode = edge.stimulus2;
        edgeToAdd = { ...edge, reversed: false };
      } else if (edge.stimulus2 === start && !visited.has(edge.stimulus1)) {
        nextNode = edge.stimulus1;
        // For containment, we need to reverse the relation
        const reversedRelation = (edge.relation === 'CONTAINS') ? 'WITHIN' : 
                                  (edge.relation === 'WITHIN') ? 'CONTAINS' : edge.relation;
        edgeToAdd = { ...edge, relation: reversedRelation, reversed: true };
      }
      if (nextNode) {
        currentPath.push(edgeToAdd);
        findAllPaths(graph, nextNode, end, currentPath, new Set(visited), allPaths);
        currentPath.pop();
      }
    }
    return allPaths;
  };

  const deriveFromPath = (path) => {
    if (!path || path.length === 0) return null;
    let result = path[0].relation;
    for (let i = 1; i < path.length; i++) {
      result = deriveRelation(result, path[i].relation);
      if (result === 'AMBIGUOUS') return 'AMBIGUOUS';
    }
    return result;
  };

  const deriveRelationFromGraph = (graph, start, end) => {
    if (start === end) {
      if (enabledRelationModes.equality) return 'SAME';
      if (enabledRelationModes.temporal) return 'AT';
      return null;
    }
    const allPaths = findAllPaths(graph, start, end);
    if (allPaths.length === 0) return null;
    
    const derivedRelations = allPaths.map(path => deriveFromPath(path)).filter(r => r !== null);
    if (derivedRelations.length === 0) return null;
    
    const nonAmbiguous = derivedRelations.filter(r => r !== 'AMBIGUOUS');
    if (nonAmbiguous.length === 0) return 'AMBIGUOUS';
    
    const firstRel = nonAmbiguous[0];
    const allAgree = nonAmbiguous.every(rel => rel === firstRel);
    
    return allAgree ? firstRel : 'AMBIGUOUS';
  };

  const generateTrial = useCallback(() => {
    const enabledModes = Object.keys(enabledRelationModes).filter(mode => enabledRelationModes[mode]);
    const chosenMode = enabledModes.length > 0 
      ? enabledModes[Math.floor(Math.random() * enabledModes.length)]
      : 'equality';
    const activeRelations = relationSets[chosenMode];
    
    const numStimuli = Math.max(3, difficulty + 1);
    const stimuli = [generateStimulus()];
    const premises = [];
    
    for (let p = 0; p < difficulty; p++) {
      let chosenPair = null;
      const ambiguousPairs = [];
      for (let i = 0; i < stimuli.length; i++) {
        for (let j = i + 1; j < stimuli.length; j++) {
          const s1 = stimuli[i], s2 = stimuli[j];
          const alreadyConnected = premises.some(pr => (pr.stimulus1 === s1 && pr.stimulus2 === s2) || (pr.stimulus1 === s2 && pr.stimulus2 === s1));
          if (!alreadyConnected) {
            const derived = deriveRelationFromGraph(premises, s1, s2);
            if (derived === 'AMBIGUOUS') ambiguousPairs.push({ s1, s2 });
          }
        }
      }
      if (ambiguousPairs.length > 0 && Math.random() < networkComplexity) {
        chosenPair = ambiguousPairs[Math.floor(Math.random() * ambiguousPairs.length)];
      } else if (stimuli.length < numStimuli) {
        const newStimulus = generateStimulus();
        stimuli.push(newStimulus);
        chosenPair = { s1: stimuli[Math.floor(Math.random() * (stimuli.length - 1))], s2: newStimulus };
      } else {
        const availablePairs = [];
        for (let i = 0; i < stimuli.length; i++) {
          for (let j = i + 1; j < stimuli.length; j++) {
            const s1 = stimuli[i], s2 = stimuli[j];
            if (!premises.some(pr => (pr.stimulus1 === s1 && pr.stimulus2 === s2) || (pr.stimulus1 === s2 && pr.stimulus2 === s1))) {
              availablePairs.push({ s1, s2 });
            }
          }
        }
        chosenPair = availablePairs.length > 0 ? availablePairs[Math.floor(Math.random() * availablePairs.length)] : { s1: stimuli[0], s2: stimuli[1] };
      }
      if (chosenPair) premises.push({ stimulus1: chosenPair.s1, relation: activeRelations[Math.floor(Math.random() * activeRelations.length)], stimulus2: chosenPair.s2 });
    }
    
    const startIdx = Math.floor(Math.random() * stimuli.length);
    let endIdx = Math.floor(Math.random() * stimuli.length);
    if (startIdx === endIdx) endIdx = (endIdx + 1) % stimuli.length;
    const derivedRelation = deriveRelationFromGraph(premises, stimuli[startIdx], stimuli[endIdx]);
    let questionRelation, correctAnswer;
    
    if (derivedRelation === 'AMBIGUOUS' || derivedRelation === null) {
      questionRelation = activeRelations[Math.floor(Math.random() * activeRelations.length)];
      correctAnswer = 'ambiguous';
    } else {
      const askCompatible = Math.random() < 0.5;
      if (askCompatible) {
        questionRelation = derivedRelation;
        correctAnswer = true;
      } else {
        // For equality mode, handle special cases
        if (getRelationMode(derivedRelation) === 'equality') {
          const incompatible = activeRelations.filter(r => {
            // If derived is OPPOSITE, asking DIFFERENT should be YES (OPPOSITE implies DIFFERENT)
            // If derived is SAME, asking DIFFERENT should be NO
            if (r === 'DIFFERENT') {
              return derivedRelation === 'SAME'; // Only incompatible if derived is SAME
            }
            // If derived is OPPOSITE, asking SAME should be NO
            // If derived is DIFFERENT, asking SAME should be CAN'T TELL (but handled as incompatible for question generation)
            if (r === 'SAME') {
              return derivedRelation !== 'SAME';
            }
            // If derived is SAME, asking OPPOSITE should be NO
            // If derived is DIFFERENT, asking OPPOSITE should be CAN'T TELL (but handled as incompatible)
            if (r === 'OPPOSITE') {
              return derivedRelation !== 'OPPOSITE';
            }
            return r !== derivedRelation;
          });
          if (incompatible.length > 0) {
            questionRelation = incompatible[Math.floor(Math.random() * incompatible.length)];
            // Determine correct answer based on derivedRelation and questionRelation
            if (derivedRelation === 'OPPOSITE' && questionRelation === 'DIFFERENT') {
              correctAnswer = true; // OPPOSITE implies DIFFERENT
            } else if (derivedRelation === 'DIFFERENT' && (questionRelation === 'OPPOSITE' || questionRelation === 'SAME')) {
              correctAnswer = 'ambiguous'; // DIFFERENT doesn't tell us if it's SAME or OPPOSITE
            } else {
              correctAnswer = false;
            }
          } else {
            questionRelation = derivedRelation;
            correctAnswer = true;
          }
        } else {
          // For other modes, use simple incompatibility
          const incompatible = activeRelations.filter(r => r !== derivedRelation);
          if (incompatible.length > 0) {
            questionRelation = incompatible[Math.floor(Math.random() * incompatible.length)];
            correctAnswer = false;
          } else {
            questionRelation = derivedRelation;
            correctAnswer = true;
          }
        }
      }
    }

    return { premises, question: { stimulus1: stimuli[startIdx], relation: questionRelation, stimulus2: stimuli[endIdx] }, correctAnswer, derivedRelation: derivedRelation || 'AMBIGUOUS', allPaths: findAllPaths(premises, stimuli[startIdx], stimuli[endIdx]), allStimuli: stimuli };
  }, [difficulty, networkComplexity, useLetters, useEmojis, useVoronoi, letterLength, enabledRelationModes]);

  const startNewTrial = useCallback(() => {
    setCurrentTrial(generateTrial());
    setTimeLeft(timePerQuestion);
    setFeedback(null);
  }, [generateTrial, timePerQuestion]);

  const saveToStorage = async () => {
    try {
      const progressData = {
        user_id: userId,
        score: score,
        history: history,
        stats_history: statsHistory,
        settings: {
          difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode,
          useLetters, useEmojis, useVoronoi, useMandelbrot, letterLength, autoProgressMode,
          universalProgress, modeSpecificProgress, enabledRelationModes
        },
        updated_at: new Date().toISOString()
      };

      // Try to update first, if it fails, insert
      const { error: updateError } = await supabase
        .from('user_progress')
        .update(progressData)
        .eq('user_id', userId);

      if (updateError) {
        // If update fails (no row exists), insert a new one
        const { error: insertError } = await supabase
          .from('user_progress')
          .insert([progressData]);

        if (insertError) {
          console.error('Save failed:', insertError);
        }
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const loadFromStorage = async () => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.log('No saved data found');
        return;
      }

      if (data) {
        if (data.score) setScore(data.score);
        if (data.history) setHistory(data.history);
        if (data.stats_history) setStatsHistory(data.stats_history);
        if (data.settings) {
          if (data.settings.difficulty !== undefined) setDifficulty(data.settings.difficulty);
          if (data.settings.timePerQuestion !== undefined) setTimePerQuestion(data.settings.timePerQuestion);
          if (data.settings.networkComplexity !== undefined) setNetworkComplexity(data.settings.networkComplexity);
          if (data.settings.spoilerPremises !== undefined) setSpoilerPremises(data.settings.spoilerPremises);
          if (data.settings.darkMode !== undefined) setDarkMode(data.settings.darkMode);
          if (data.settings.useLetters !== undefined) setUseLetters(data.settings.useLetters);
          if (data.settings.useEmojis !== undefined) setUseEmojis(data.settings.useEmojis);
          if (data.settings.useVoronoi !== undefined) setUseVoronoi(data.settings.useVoronoi);
          if (data.settings.useMandelbrot !== undefined) setUseMandelbrot(data.settings.useMandelbrot);
          if (data.settings.letterLength !== undefined) setLetterLength(data.settings.letterLength);
          if (data.settings.autoProgressMode !== undefined) setAutoProgressMode(data.settings.autoProgressMode);
          if (data.settings.universalProgress !== undefined) setUniversalProgress(data.settings.universalProgress);
          if (data.settings.modeSpecificProgress !== undefined) setModeSpecificProgress(data.settings.modeSpecificProgress);
          if (data.settings.enabledRelationModes !== undefined) setEnabledRelationModes(data.settings.enabledRelationModes);
        }
      }
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  const resetGame = () => {
    setShowResetConfirmation(false);
    setScore({ correct: 0, incorrect: 0, missed: 0 });
    setHistory([]);
    setStatsHistory([]);
    setDifficulty(3);
    setTimePerQuestion(30);
    setNetworkComplexity(0.5);
    setSpoilerPremises(false);
    setDarkMode(false);
    setUseLetters(true);
    setUseEmojis(false);
    setUseVoronoi(false);
    setUseMandelbrot(false);
    setLetterLength(3);
    setAutoProgressMode('universal');
    setUniversalProgress({
      targetPremiseCount: 40,
      targetAccuracy: 95,
      recentAnswers: []
    });
    setModeSpecificProgress({
      equality: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      temporal: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      spatial: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      containment: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 }
    });
    setEnabledRelationModes({
      equality: true,
      temporal: false,
      spatial: false,
      containment: false
    });
    startNewTrial();
    saveToStorage();
    setShowResetComplete(true);
    setTimeout(() => setShowResetComplete(false), 2000);
  };

  const getAnswerLabel = (answer) => {
    if (answer === true) return 'YES';
    if (answer === false) return 'NO';
    if (answer === 'ambiguous') return "CAN'T TELL";
    return 'NO ANSWER';
  };

  const checkAutoProgress = useCallback((updatedAnswers, currentMode) => {
    if (autoProgressMode === 'universal') {
      if (updatedAnswers.length < universalProgress.targetPremiseCount) return;
      const recentWindow = updatedAnswers.slice(-universalProgress.targetPremiseCount);
      const accuracy = (recentWindow.filter(a => a).length / universalProgress.targetPremiseCount) * 100;
      if (accuracy >= universalProgress.targetAccuracy) {
        if (timePerQuestion > 10) {
          const newTime = Math.max(10, timePerQuestion - 5);
          setTimePerQuestion(newTime);
          if (newTime === 10) {
            setDifficulty(prev => prev + 1);
            setTimePerQuestion(30);
            setUniversalProgress(prev => ({ ...prev, recentAnswers: [] }));
          }
        } else {
          setDifficulty(prev => prev + 1);
          setTimePerQuestion(30);
          setUniversalProgress(prev => ({ ...prev, recentAnswers: [] }));
        }
      }
    } else if (autoProgressMode === 'mode-specific' && currentMode) {
      const modeProgress = modeSpecificProgress[currentMode];
      if (!modeProgress || updatedAnswers.length < modeProgress.targetPremiseCount) return;
      const recentWindow = updatedAnswers.slice(-modeProgress.targetPremiseCount);
      const accuracy = (recentWindow.filter(a => a).length / modeProgress.targetPremiseCount) * 100;
      if (accuracy >= modeProgress.targetAccuracy) {
        setModeSpecificProgress(prev => {
          const updated = { ...prev };
          if (updated[currentMode].currentTime > 10) {
            updated[currentMode].currentTime = Math.max(10, updated[currentMode].currentTime - 5);
            if (updated[currentMode].currentTime === 10) {
              updated[currentMode].currentDifficulty += 1;
              updated[currentMode].currentTime = 30;
              updated[currentMode].recentAnswers = [];
            }
          } else {
            updated[currentMode].currentDifficulty += 1;
            updated[currentMode].currentTime = 30;
            updated[currentMode].recentAnswers = [];
          }
          return updated;
        });
      }
    }
  }, [autoProgressMode, universalProgress, modeSpecificProgress, timePerQuestion]);

  const handleAnswer = useCallback((userAnswer) => {
    if (isPaused || feedback) return;
    const isCorrect = userAnswer === currentTrial.correctAnswer;
    const timeUsed = timePerQuestion - timeLeft;
    const currentMode = getRelationMode(currentTrial.question.relation);
    setScore(prev => ({ ...prev, correct: prev.correct + (isCorrect ? 1 : 0), incorrect: prev.incorrect + (isCorrect ? 0 : 1) }));
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const entry = { trial: currentTrial, userAnswer, isCorrect, timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length };
    setHistory(prev => [...prev, entry]);
    setStatsHistory(prev => [...prev, { timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length, isCorrect }]);
    
    if (autoProgressMode === 'universal') {
      const updatedAnswers = [...universalProgress.recentAnswers, isCorrect];
      setUniversalProgress(prev => ({ ...prev, recentAnswers: updatedAnswers }));
      checkAutoProgress(updatedAnswers, currentMode);
    } else if (autoProgressMode === 'mode-specific') {
      const updatedModeAnswers = [...modeSpecificProgress[currentMode].recentAnswers, isCorrect];
      setModeSpecificProgress(prev => ({
        ...prev,
        [currentMode]: { ...prev[currentMode], recentAnswers: updatedModeAnswers }
      }));
      checkAutoProgress(updatedModeAnswers, currentMode);
    }
    
    setTimeout(() => { startNewTrial(); saveToStorage(); }, 1500);
  }, [isPaused, currentTrial, feedback, startNewTrial, checkAutoProgress, timeLeft, timePerQuestion, autoProgressMode, universalProgress, modeSpecificProgress]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) { setCurrentTrial(generateTrial()); setFeedback(null); }
      return !prev;
    });
  }, [generateTrial]);

  useEffect(() => {
    if (!isPaused && !feedback && timeLeft > 0) {
      // Check if any premise contains Mandelbrot stimuli
      const hasMandelbrot = currentTrial?.premises.some(p => 
        p.stimulus1.startsWith('mandelbrot_') || p.stimulus2.startsWith('mandelbrot_')
      ) || false;
      
      // Timer goes 10x faster if Mandelbrot is present and activated
      const speedMultiplier = (useMandelbrot && hasMandelbrot) ? 10 : 1;
      const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - (0.1 * speedMultiplier))), 100);
      return () => clearInterval(timer);
    } else if (!isPaused && !feedback && timeLeft <= 0) {
      const timeUsed = timePerQuestion;
      setScore(prev => ({ ...prev, missed: prev.missed + 1 }));
      setFeedback('missed');
      setHistory(prev => [...prev, { trial: currentTrial, userAnswer: null, isCorrect: false, timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length }]);
      setStatsHistory(prev => [...prev, { timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length, isCorrect: false }]);
      setTimeout(() => { startNewTrial(); saveToStorage(); }, 1500);
    } else if (isPaused) {
      setTimeLeft(timePerQuestion);
    }
  }, [isPaused, feedback, timeLeft, currentTrial, startNewTrial, timePerQuestion]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === ' ') { e.preventDefault(); togglePause(); }
      else if (!isPaused && !feedback) {
        if (e.key === '1') handleAnswer(true);
        else if (e.key === '2') handleAnswer(false);
        else if (e.key === '3') handleAnswer('ambiguous');
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isPaused, feedback, handleAnswer, togglePause]);

  useEffect(() => {
    if (!currentTrial) { loadFromStorage(); startNewTrial(); }
  }, []);
  
  useEffect(() => {
    if (currentTrial) saveToStorage();
  }, [difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode, useLetters, useEmojis, useVoronoi, useMandelbrot, letterLength, autoProgressMode, universalProgress, modeSpecificProgress, enabledRelationModes]);
  
  const renderStimulus = (stimulus) => {
    if (stimulus.startsWith('voronoi_')) {
      return <div className="inline-block w-16 h-16 align-middle border-2 border-gray-300 rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: generateVoronoiSVG(parseInt(stimulus.split('_')[1])) }} />;
    }
    if (stimulus.startsWith('mandelbrot_')) {
      return <div className="inline-block w-16 h-16 align-middle border-2 border-gray-300 rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: generateMandelbrotSVG(parseInt(stimulus.split('_')[1])) }} />;
    }
    const isEmoji = emojiList.includes(stimulus);
    return <span className={`font-bold ${isEmoji ? 'text-3xl' : ''} ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{stimulus}</span>;
  };

  const getRelationColor = (relation) => {
    if (darkMode) {
      if (relation === 'SAME') return 'bg-green-900/40 text-green-300 border-green-500';
      if (relation === 'OPPOSITE') return 'bg-red-900/40 text-red-300 border-red-500';
      if (relation === 'DIFFERENT') return 'bg-blue-900/40 text-blue-300 border-blue-500';
      if (relation === 'BEFORE') return 'bg-purple-900/40 text-purple-300 border-purple-500';
      if (relation === 'AFTER') return 'bg-orange-900/40 text-orange-300 border-orange-500';
      if (relation === 'AT') return 'bg-cyan-900/40 text-cyan-300 border-cyan-500';
      if (relation === 'CONTAINS') return 'bg-blue-900/40 text-blue-300 border-blue-500';
      if (relation === 'WITHIN') return 'bg-green-900/40 text-green-300 border-green-500';
      if (['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'].includes(relation)) {
        return 'bg-teal-900/40 text-teal-300 border-teal-500';
      }
      return 'bg-blue-900/40 text-blue-300 border-blue-500';
    }
    
    if (relation === 'SAME') return 'bg-green-100 text-green-700 border-green-300';
    if (relation === 'OPPOSITE') return 'bg-red-100 text-red-700 border-red-300';
    if (relation === 'DIFFERENT') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (relation === 'BEFORE') return 'bg-purple-100 text-purple-700 border-purple-300';
    if (relation === 'AFTER') return 'bg-orange-100 text-orange-700 border-orange-300';
    if (relation === 'AT') return 'bg-cyan-100 text-cyan-700 border-cyan-300';
    if (relation === 'CONTAINS') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (relation === 'WITHIN') return 'bg-green-100 text-green-700 border-green-300';
    if (['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'].includes(relation)) {
      return 'bg-teal-100 text-teal-700 border-teal-300';
    }
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      


      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>How to Play</h2>
              <button onClick={() => setShowTutorial(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
            <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p>
                <strong className={darkMode ? 'text-indigo-400' : 'text-indigo-600'}>Relational Frame Training</strong> helps you practice deriving logical relationships between stimuli.
              </p>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Game Rules:</h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li>You will be given several <strong>premises</strong> that establish relationships between stimuli</li>
                  <li>Based on these premises, you must answer whether a <strong>question relationship</strong> is true</li>
                  <li>Answer <strong>YES</strong> if the relationship follows from the premises</li>
                  <li>Answer <strong>NO</strong> if the relationship contradicts the premises</li>
                  <li>Answer <strong>CAN'T TELL</strong> if there is insufficient information or contradictions</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Relation Types:</h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li><strong>Equality:</strong> SAME (identical), OPPOSITE (inverse), DIFFERENT (distinct)</li>
                  <li><strong>Temporal:</strong> BEFORE, AFTER, AT (time relationships)</li>
                  <li><strong>Spatial:</strong> NORTH, SOUTH, EAST, WEST, etc. (directional)</li>
                  <li><strong>Containment:</strong> CONTAINS, WITHIN (hierarchical relationships)</li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Keyboard Shortcuts:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>1</kbd> - Answer YES</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>2</kbd> - Answer NO</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>3</kbd> - Answer CAN'T TELL</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>Space</kbd> - Pause/Resume</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Example:</h3>
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                  <p className="mb-2">Given premises:</p>
                  <ul className="list-disc pl-5 sm:pl-6 space-y-1 mb-3">
                    <li>A is SAME to B</li>
                    <li>B is OPPOSITE to C</li>
                  </ul>
                  <p className="mb-2">Question: Is A OPPOSITE to C?</p>
                  <p className={`font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>Answer: YES</p>
                  <p className="text-xs sm:text-sm mt-2">Because: A is SAME to B, and B is OPPOSITE to C, therefore A is OPPOSITE to C</p>
                </div>
              </div>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Tips:</h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li>Start with easier difficulties to understand the logic</li>
                  <li>Enable auto-progression to automatically increase difficulty as you improve</li>
                  <li>Use spoiler mode to practice without memorizing premises</li>
                  <li>Check your statistics to track improvement over time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {(showHistory || showStats) && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => { setShowHistory(false); setShowStats(false); }} />
      )}

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showHistory ? 'fixed sm:relative inset-y-0 left-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showHistory && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <History className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>History</h2>
              </div>
              <button onClick={() => setShowHistory(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3">
              {history.length === 0 ? (
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No questions answered yet</p>
              ) : (
                history.slice().reverse().map((item, idx) => (
                  <div key={item.timestamp} className={`p-2.5 sm:p-3 rounded-lg border-2 ${darkMode ? (item.isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20') : (item.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')}`}>
                    <div className={`text-xs font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Question #{history.length - idx} • {item.timeUsed.toFixed(1)}s
                    </div>
                    <div className="mb-1.5 sm:mb-2 text-xs space-y-0.5 sm:space-y-1">
                      {item.trial.premises.map((premise, pidx) => (
                        <div key={pidx} className={`flex items-center gap-1 flex-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {renderStimulus(premise.stimulus1)} is <span className={`px-1 rounded text-xs ${getRelationColor(premise.relation)}`}>{premise.relation}</span> to {renderStimulus(premise.stimulus2)}
                        </div>
                      ))}
                    </div>
                    <div className={`text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold flex items-center gap-1 flex-wrap ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Is {renderStimulus(item.trial.question.stimulus1)} {item.trial.question.relation} to {renderStimulus(item.trial.question.stimulus2)}?
                    </div>
                    <div className="text-xs space-y-0.5 sm:space-y-1">
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-semibold">Your answer:</span> <span className={item.isCorrect ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-red-400' : 'text-red-700')}>{getAnswerLabel(item.userAnswer)}</span>
                      </div>
                      <div className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        <span className="font-semibold">Correct:</span> <span className={darkMode ? 'text-green-400' : 'text-green-700'}>{getAnswerLabel(item.trial.correctAnswer)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showStats ? 'fixed sm:relative inset-y-0 left-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showStats && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Statistics</h2>
              </div>
              <button onClick={() => setShowStats(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              {statsHistory.length === 0 ? (
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No statistics yet</p>
              ) : (
                <>
                  <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Overall</h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Total Questions:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{statsHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Accuracy:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {((statsHistory.filter(s => s.isCorrect).length / statsHistory.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Time:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                          {(statsHistory.reduce((sum, s) => sum + s.timeUsed, 0) / statsHistory.length).toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Premises:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {(statsHistory.reduce((sum, s) => sum + s.premiseCount, 0) / statsHistory.length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time per Question (Last 20)</h3>
                    <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex items-end h-24 sm:h-32 gap-0.5 sm:gap-1">
                        {statsHistory.slice(-20).map((stat, idx) => {
                          const maxTime = Math.max(...statsHistory.slice(-20).map(s => s.timeUsed));
                          const height = (stat.timeUsed / maxTime) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div className={`w-full rounded-t transition-all ${stat.isCorrect ? (darkMode ? 'bg-green-500' : 'bg-green-400') : (darkMode ? 'bg-red-500' : 'bg-red-400')}`} style={{ height: `${height}%` }} title={`Q${statsHistory.length - 19 + idx}: ${stat.timeUsed.toFixed(1)}s`} />
                            </div>
                          );
                        })}
                      </div>
                      <div className={`text-xs text-center mt-1.5 sm:mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Questions (most recent →)</div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Premise Count (Last 20)</h3>
                    <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-gray-50'}`}>
                      <div className="flex items-end h-24 sm:h-32 gap-0.5 sm:gap-1">
                        {statsHistory.slice(-20).map((stat, idx) => {
                          const maxPremises = Math.max(...statsHistory.slice(-20).map(s => s.premiseCount));
                          const height = (stat.premiseCount / maxPremises) * 100;
                          return (
                            <div key={idx} className="flex-1 flex flex-col items-center">
                              <div className={`w-full rounded-t transition-all ${stat.isCorrect ? (darkMode ? 'bg-purple-500' : 'bg-purple-400') : (darkMode ? 'bg-orange-500' : 'bg-orange-400')}`} style={{ height: `${height}%` }} title={`Q${statsHistory.length - 19 + idx}: ${stat.premiseCount} premises`} />
                            </div>
                          );
                        })}
                      </div>
                      <div className={`text-xs text-center mt-1.5 sm:mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Questions (most recent →)</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className={`shadow-md p-2 sm:p-3 flex flex-col gap-2 transition-colors duration-300 ${darkMode ? 'bg-slate-800/90 backdrop-blur' : 'bg-white'}`}>
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-1 sm:gap-2">
              <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-gray-900'}`}>
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">History</span>
              </button>
              
              <button onClick={() => setShowStats(!showStats)} className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${darkMode ? 'bg-purple-900/50 hover:bg-purple-900/70 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-gray-900'}`}>
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Stats</span>
              </button>

              <button onClick={() => setShowTutorial(true)} className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${darkMode ? 'bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-200' : 'bg-cyan-100 hover:bg-cyan-200 text-gray-900'}`}>
                <Info className="w-4 h-4" />
                <span className="hidden sm:inline">Help</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="text-center">
                <div className={`text-base sm:text-xl font-bold tabular-nums ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{timeLeft.toFixed(1)}s</div>
                <div className={`text-xs hidden sm:block ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</div>
              </div>
              <button onClick={togglePause} className={`text-white p-1.5 sm:p-2 rounded-lg transition-colors ${isPaused ? 'bg-green-500 hover:bg-green-600' : (darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600')}`} title="Pause/Resume">
                {isPaused ? <Play className="w-4 h-4 sm:w-5 sm:h-5" /> : <Pause className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
              <button onClick={() => setShowSettings(!showSettings)} className={`flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-gray-900'}`}>
                <Settings className="w-4 h-4" />
                <span className="hidden sm:inline">Settings</span>
              </button>
            </div>
          </div>
          
          <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start">
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{score.correct}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Correct</div>
            </div>
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{score.incorrect}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Incorrect</div>
            </div>
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{score.missed}</div>
              <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Missed</div>
            </div>
          </div>
        </div>

        <div className={`shadow-sm p-1 sm:p-2 transition-colors duration-300 ${darkMode ? 'bg-slate-800/50' : 'bg-white'}`}>
          <div className={`h-2 sm:h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
            <div className={`h-full transition-all duration-100 ${isPaused ? (darkMode ? 'bg-yellow-600' : 'bg-yellow-500') : (darkMode ? 'bg-indigo-500' : 'bg-indigo-600')}`} style={{ width: `${(timeLeft / timePerQuestion) * 100}%` }} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="max-w-4xl mx-auto">
            {isPaused && (
              <div className={`border-2 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 text-center transition-colors duration-300 ${darkMode ? 'bg-yellow-900/20 border-yellow-500/50 backdrop-blur' : 'bg-yellow-50 border-yellow-300'}`}>
                <Pause className={`w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-800'}`}>Paused</h2>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-yellow-200' : 'text-yellow-700'}`}>
                  Press <kbd className={`px-2 sm:px-3 py-1 rounded font-mono text-xs sm:text-sm ${darkMode ? 'bg-slate-700 text-yellow-300' : 'bg-white'}`}>Space</kbd> or the play button to resume
                </p>
              </div>
            )}

                          {currentTrial && !isPaused && (
              <div className={`rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-slate-800/90 backdrop-blur' : 'bg-white'}`}>
                <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Given:</h3>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {currentTrial.premises.map((premise, idx) => {
                    const mode = getRelationMode(premise.relation);
                    const preposition = mode === 'equality' ? 'to' : mode === 'containment' ? '' : mode === 'temporal' ? '' : 'of';
                    return (
                      <div key={idx} className={`relative flex items-center justify-center text-base sm:text-xl p-3 sm:p-4 rounded-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`} onMouseEnter={() => spoilerPremises && setHoveredPremise(idx)} onMouseLeave={() => spoilerPremises && setHoveredPremise(null)}>
                        <div className="relative z-0 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                          {renderStimulus(premise.stimulus1)}
                          {premise.relation === 'CONTAINS' ? (
                            <>
                              <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>CONTAINS</span>
                              {renderStimulus(premise.stimulus2)}
                            </>
                          ) : premise.relation === 'WITHIN' ? (
                            <>
                              <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>is</span>
                              <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>WITHIN</span>
                              {renderStimulus(premise.stimulus2)}
                            </>
                          ) : (
                            <>
                              <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>is</span>
                              <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>{premise.relation}</span>
                              {preposition && <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{preposition}</span>}
                              {renderStimulus(premise.stimulus2)}
                            </>
                          )}
                        </div>
                        {spoilerPremises && hoveredPremise !== idx && (
                          <div className={`absolute inset-0 rounded-lg z-10 ${darkMode ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600' : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'}`}></div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className={`border-t-4 pt-6 sm:pt-8 ${feedback === 'correct' ? (darkMode ? 'border-green-500' : 'border-green-500') : feedback === 'incorrect' ? (darkMode ? 'border-red-500' : 'border-red-500') : feedback === 'missed' ? (darkMode ? 'border-orange-500' : 'border-orange-500') : (darkMode ? 'border-indigo-500' : 'border-indigo-500')}`}>
                  <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Question:</h3>
                  <div className={`flex items-center justify-center text-lg sm:text-2xl p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 transition-colors duration-300 gap-1.5 sm:gap-2 flex-wrap ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                    {(() => {
                      const rel = currentTrial.question.relation;
                      const mode = getRelationMode(rel);
                      
                      if (rel === 'CONTAINS') {
                        return (
                          <>
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Does</span>
                            {renderStimulus(currentTrial.question.stimulus1)}
                            <span className={`mx-1 sm:mx-2 font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 text-sm sm:text-base ${getRelationColor(rel)}`}>CONTAIN</span>
                            {renderStimulus(currentTrial.question.stimulus2)}
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>?</span>
                          </>
                        );
                      } else if (rel === 'WITHIN') {
                        return (
                          <>
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Is</span>
                            {renderStimulus(currentTrial.question.stimulus1)}
                            <span className={`mx-1 sm:mx-2 font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 text-sm sm:text-base ${getRelationColor(rel)}`}>WITHIN</span>
                            {renderStimulus(currentTrial.question.stimulus2)}
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>?</span>
                          </>
                        );
                      } else {
                        const preposition = mode === 'equality' ? 'to' : mode === 'temporal' ? '' : 'of';
                        return (
                          <>
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>Is</span>
                            {renderStimulus(currentTrial.question.stimulus1)}
                            <span className={`mx-1 sm:mx-2 font-semibold px-3 sm:px-4 py-1 sm:py-2 rounded-lg border-2 text-sm sm:text-base ${getRelationColor(rel)}`}>{rel}</span>
                            {preposition && <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>{preposition}</span>}
                            {renderStimulus(currentTrial.question.stimulus2)}
                            <span className={`font-bold text-base sm:text-2xl ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>?</span>
                          </>
                        );
                      }
                    })()}
                  </div>

                  {feedback && (
                    <div className={`text-center text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${feedback === 'correct' ? (darkMode ? 'text-green-400' : 'text-green-600') : feedback === 'incorrect' ? (darkMode ? 'text-red-400' : 'text-red-600') : (darkMode ? 'text-orange-400' : 'text-orange-600')}`}>
                      {feedback === 'correct' ? <><Check className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />Correct!</> : feedback === 'incorrect' ? <><X className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />Incorrect</> : <><Clock className="inline w-6 h-6 sm:w-8 sm:h-8 mr-2" />Time's Up!</>}
                    </div>
                  )}

                  {!feedback && (
                    <div className="flex flex-col gap-3 sm:gap-4">
                      <button onClick={() => handleAnswer(true)} className={`w-full px-6 py-3 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-xl transition-all transform active:scale-95 sm:hover:scale-105 ${darkMode ? 'bg-green-600 hover:bg-green-700 shadow-lg shadow-green-900/50' : 'bg-green-500 hover:bg-green-600'}`}>
                        YES <span className="text-sm">(1)</span>
                      </button>
                      <button onClick={() => handleAnswer(false)} className={`w-full px-6 py-3 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-xl transition-all transform active:scale-95 sm:hover:scale-105 ${darkMode ? 'bg-red-600 hover:bg-red-700 shadow-lg shadow-red-900/50' : 'bg-red-500 hover:bg-red-600'}`}>
                        NO <span className="text-sm">(2)</span>
                      </button>
                      <button onClick={() => handleAnswer('ambiguous')} className={`w-full px-6 py-3 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-xl transition-all transform active:scale-95 sm:hover:scale-105 ${darkMode ? 'bg-slate-600 hover:bg-slate-700 shadow-lg shadow-slate-900/50' : 'bg-gray-500 hover:bg-gray-600'}`}>
                        CAN'T TELL <span className="text-sm">(3)</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSettings && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
      )}
      
      <div className={`${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showSettings ? 'fixed sm:relative inset-y-0 right-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showSettings && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <Settings className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}>Settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Dark Mode</label>
                <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between">
                  <div className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-gray-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${darkMode ? 'transform translate-x-7' : ''}`}></div>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{darkMode ? 'Enabled' : 'Disabled'}</span>
                </button>
              </div>

              {showResetComplete && (
                <div className={`p-6 rounded-xl text-center border-2 ${darkMode ? 'bg-green-900/30 border-green-500' : 'bg-green-50 border-green-300'}`}>
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 ${darkMode ? 'bg-green-900/50' : 'bg-green-100'}`}>
                    <Check className={`w-10 h-10 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <h2 className={`text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>RESET COMPLETE</h2>
                </div>
              )}

              {showResetConfirmation && (
                <div className={`p-4 rounded-xl border-2 ${darkMode ? 'bg-red-900/30 border-red-500' : 'bg-red-50 border-red-300'}`}>
                  <h2 className={`text-lg font-bold mb-3 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Are you sure?</h2>
                  <p className={`mb-4 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    This will reset all progress, settings, and statistics to default values. This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={resetGame}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
                    >
                      Yes, Reset
                    </button>
                    <button 
                      onClick={() => setShowResetConfirmation(false)}
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-700 text-white' : 'bg-gray-300 hover:bg-gray-400 text-gray-800'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <button onClick={() => setShowResetConfirmation(true)} className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${darkMode ? 'bg-red-900/50 hover:bg-red-900/70 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-semibold">Reset All to Default</span>
                </button>
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Relation Modes</h3>
                <p className={`text-xs mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Enable one or more relation types to use in training</p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.equality} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, equality: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Equality (SAME, OPPOSITE, DIFFERENT)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.temporal} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, temporal: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Temporal (BEFORE, AFTER, AT)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.spatial} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, spatial: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Space 2D (NORTH, SOUTH, EAST, WEST, etc.)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.containment} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, containment: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Containment (CONTAINS, WITHIN)</span>
                  </label>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Premise Count</label>
                <input type="number" min="2" max="20" value={difficulty} onChange={(e) => setDifficulty(Math.max(2, parseInt(e.target.value) || 2))} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Stimulus Display</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useLetters} onChange={(e) => setUseLetters(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use Letters (ABC)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useEmojis} onChange={(e) => setUseEmojis(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use Emojis 🎨</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useVoronoi} onChange={(e) => setUseVoronoi(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use Voronoi Patterns</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useMandelbrot} onChange={(e) => setUseMandelbrot(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Use Mandelbrot Fractals</span>
                  </label>
                  
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Select one or more types. Stimuli will be randomly chosen from selected types.
                  </p>

                  {useLetters && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-gray-200'}`}>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Letter Length: {letterLength}</label>
                      <input type="range" min="1" max="20" value={letterLength} onChange={(e) => setLetterLength(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                      <input type="number" min="1" max="20" value={letterLength} onChange={(e) => setLetterLength(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Time Per Question (seconds): {timePerQuestion.toFixed(1)}</label>
                <input type="range" min="5" max="120" step="0.5" value={timePerQuestion} onChange={(e) => setTimePerQuestion(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                <input type="number" min="5" max="120" step="0.5" value={timePerQuestion} onChange={(e) => setTimePerQuestion(Math.max(5, parseFloat(e.target.value) || 5))} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Network Complexity: {networkComplexity.toFixed(2)}</label>
                <input type="range" min="0" max="1" step="0.01" value={networkComplexity} onChange={(e) => setNetworkComplexity(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Probability of resolving ambiguous relationships</p>
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-700' : 'border-gray-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Auto-Progression</h3>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'off'} 
                      onChange={() => setAutoProgressMode('off')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Off</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'universal'} 
                      onChange={() => setAutoProgressMode('universal')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Universal Auto-Progression</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'mode-specific'} 
                      onChange={() => setAutoProgressMode('mode-specific')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Mode-Specific Auto-Progression</span>
                  </label>
                </div>

                {autoProgressMode === 'universal' && (
                  <div className={`p-3 rounded-lg space-y-3 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Target Accuracy: {universalProgress.targetAccuracy}%
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={universalProgress.targetAccuracy} 
                        onChange={(e) => setUniversalProgress(prev => ({ ...prev, targetAccuracy: parseInt(e.target.value) }))} 
                        className="w-full accent-indigo-600" 
                      />
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={universalProgress.targetAccuracy} 
                        onChange={(e) => setUniversalProgress(prev => ({ ...prev, targetAccuracy: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }))} 
                        className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-800 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} 
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Premises to Track: {universalProgress.targetPremiseCount}
                      </label>
                      <input 
                        type="range" 
                        min="1" 
                        max="100" 
                        value={universalProgress.targetPremiseCount} 
                        onChange={(e) => setUniversalProgress(prev => ({ ...prev, targetPremiseCount: parseInt(e.target.value) }))} 
                        className="w-full accent-indigo-600" 
                      />
                      <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={universalProgress.targetPremiseCount} 
                        onChange={(e) => setUniversalProgress(prev => ({ ...prev, targetPremiseCount: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }))} 
                        className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-800 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} 
                      />
                    </div>

                    <div className={`p-2 rounded ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                      <p className={`text-xs ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        <strong>Progress:</strong> {universalProgress.recentAnswers.length}/{universalProgress.targetPremiseCount} questions
                      </p>
                      {universalProgress.recentAnswers.length >= universalProgress.targetPremiseCount && (
                        <p className={`text-xs mt-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                          <strong>Accuracy:</strong> {((universalProgress.recentAnswers.slice(-universalProgress.targetPremiseCount).filter(a => a).length / universalProgress.targetPremiseCount) * 100).toFixed(0)}%
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {autoProgressMode === 'mode-specific' && (
                  <div className={`p-3 rounded-lg space-y-4 ${darkMode ? 'bg-slate-700' : 'bg-gray-100'}`}>
                    {Object.keys(enabledRelationModes).filter(mode => enabledRelationModes[mode]).map(mode => (
                      <div key={mode} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800' : 'bg-white'}`}>
                        <h4 className={`font-bold text-sm mb-3 capitalize ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{mode}</h4>
                        
                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Current: {modeSpecificProgress[mode].currentDifficulty} premises, {modeSpecificProgress[mode].currentTime}s
                          </label>
                        </div>

                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Target Accuracy: {modeSpecificProgress[mode].targetAccuracy}%
                          </label>
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={modeSpecificProgress[mode].targetAccuracy} 
                            onChange={(e) => setModeSpecificProgress(prev => ({
                              ...prev,
                              [mode]: { ...prev[mode], targetAccuracy: parseInt(e.target.value) }
                            }))} 
                            className="w-full accent-purple-600" 
                          />
                          <input 
                            type="number" 
                            min="1" 
                            max="100" 
                            value={modeSpecificProgress[mode].targetAccuracy} 
                            onChange={(e) => setModeSpecificProgress(prev => ({
                              ...prev,
                              [mode]: { ...prev[mode], targetAccuracy: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }
                            }))} 
                            className={`w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} 
                          />
                        </div>

                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                            Premises to Track: {modeSpecificProgress[mode].targetPremiseCount}
                          </label>
                          <input 
                            type="range" 
                            min="1" 
                            max="100" 
                            value={modeSpecificProgress[mode].targetPremiseCount} 
                            onChange={(e) => setModeSpecificProgress(prev => ({
                              ...prev,
                              [mode]: { ...prev[mode], targetPremiseCount: parseInt(e.target.value) }
                            }))} 
                            className="w-full accent-purple-600" 
                          />
                          <input 
                            type="number" 
                            min="1" 
                            max="100" 
                            value={modeSpecificProgress[mode].targetPremiseCount} 
                            onChange={(e) => setModeSpecificProgress(prev => ({
                              ...prev,
                              [mode]: { ...prev[mode], targetPremiseCount: Math.max(1, Math.min(100, parseInt(e.target.value) || 1)) }
                            }))} 
                            className={`w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} 
                          />
                        </div>

                        <div className={`p-2 rounded text-xs ${darkMode ? 'bg-purple-900/30 text-purple-300' : 'bg-purple-50 text-purple-700'}`}>
                          <p><strong>Progress:</strong> {modeSpecificProgress[mode].recentAnswers.length}/{modeSpecificProgress[mode].targetPremiseCount}</p>
                          {modeSpecificProgress[mode].recentAnswers.length >= modeSpecificProgress[mode].targetPremiseCount && (
                            <p className="mt-1">
                              <strong>Accuracy:</strong> {((modeSpecificProgress[mode].recentAnswers.slice(-modeSpecificProgress[mode].targetPremiseCount).filter(a => a).length / modeSpecificProgress[mode].targetPremiseCount) * 100).toFixed(0)}%
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {autoProgressMode !== 'off' && (
                  <p className={`text-xs mt-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    When target is reached: Timer decreases by 5s (min: 10s). At 10s, premise count increases by 1.
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={spoilerPremises} onChange={(e) => setSpoilerPremises(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spoiler Premises</span>
                </label>
                <p className={`text-xs mt-1 ml-6 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Hover to reveal premises</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                     }
