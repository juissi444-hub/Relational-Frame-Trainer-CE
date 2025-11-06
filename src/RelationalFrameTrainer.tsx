import React, { useState, useEffect, useCallback } from 'react';
import { Settings, History, Play, Pause, RotateCcw, X, Check, Clock, TrendingUp, Info, LogIn, LogOut, User, Heart, Users, Mail } from 'lucide-react';
import { supabase } from './supabaseClient';

interface RelationalFrameTrainerProps {
  user: { id: string; username: string } | null;
  onShowLogin: () => void;
  onLogout: () => void;
}

export default function RelationalFrameTrainer({ user, onShowLogin, onLogout }: RelationalFrameTrainerProps) {
  const [difficulty, setDifficulty] = useState(3);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [networkComplexity, setNetworkComplexity] = useState(0.5);
  const [spoilerPremises, setSpoilerPremises] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [useRealWords, setUseRealWords] = useState(true);
  const [useNonsenseWords, setUseNonsenseWords] = useState(false);
  const [useRandomLetters, setUseRandomLetters] = useState(false);
  const [useEmojis, setUseEmojis] = useState(false);
  const [useVoronoi, setUseVoronoi] = useState(false);
  const [useMandelbrot, setUseMandelbrot] = useState(false);
  const [useVibration, setUseVibration] = useState(false);
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
    containment: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
    space3d: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 }
  });
  const [showResetConfirmation, setShowResetConfirmation] = useState(false);
  const [showResetComplete, setShowResetComplete] = useState(false);
  const [statsHistory, setStatsHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTrial, setCurrentTrial] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timePerQuestion);
  const [score, setScore] = useState({ correct: 0, incorrect: 0, missed: 0 });
  const [feedback, setFeedback] = useState(null);
  const [history, setHistory] = useState([]);
  const [hoveredPremise, setHoveredPremise] = useState(null);
  const [showExplanationModal, setShowExplanationModal] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [enabledRelationModes, setEnabledRelationModes] = useState({
    equality: true,
    temporal: false,
    spatial: false,
    containment: false,
    space3d: false
  });

  const relationSets = {
    equality: ['SAME', 'OPPOSITE', 'DIFFERENT'],
    temporal: ['BEFORE', 'AFTER', 'AT'],
    spatial: ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'],
    containment: ['CONTAINS', 'WITHIN'],
    space3d: [
      'AT', 'ABOVE', 'BELOW',
      'NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST',
      'ABOVE_NORTH', 'ABOVE_SOUTH', 'ABOVE_EAST', 'ABOVE_WEST', 'ABOVE_NORTHEAST', 'ABOVE_NORTHWEST', 'ABOVE_SOUTHEAST', 'ABOVE_SOUTHWEST',
      'BELOW_NORTH', 'BELOW_SOUTH', 'BELOW_EAST', 'BELOW_WEST', 'BELOW_NORTHEAST', 'BELOW_NORTHWEST', 'BELOW_SOUTHEAST', 'BELOW_SOUTHWEST'
    ]
  };

  // Vibration patterns for stimuli in milliseconds [vibrate, pause, vibrate, ...]
  const vibrationPatterns = [
    [500],                          // Pattern 0: Long buzz
    [100],                          // Pattern 1: Short tap
    [100, 100, 100, 100, 100],     // Pattern 2: Double pulse
    [200, 100, 200],                // Pattern 3: Wave
    [150, 50, 150, 50, 150],        // Pattern 4: Triple tap
    [300, 100, 100],                // Pattern 5: Long-short
    [100, 100, 300],                // Pattern 6: Short-long
    [80, 80, 80, 80, 80, 80, 80],   // Pattern 7: Rapid
  ];

  const oppositeRelations = {
    'CONTAINS': 'WITHIN',
    'WITHIN': 'CONTAINS'
  };

  const emojiList = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃', '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔', '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥', '😌', '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧', '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '🥸', '😎', '🤓', '🧐', '😕', '😟', '🙁', '☹️', '😮', '😯', '😲', '😳', '🥺', '😦', '😧', '😨', '😰', '😥', '😢', '😭', '😱', '😖', '😣', '😞', '😓', '😩', '😫', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '☠️', '💩', '🤡', '👹', '👺', '👻', '👽', '👾', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞', '💕', '💟', '❣️', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💯', '💢', '💥', '💫', '💦', '💨', '🕳️', '💣', '💬', '👁️', '🗨️', '🗯️', '💭', '💤', '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎', '✊', '👊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁', '🦷', '🦴', '👀', '👁️', '👅', '👄', '👶', '🧒', '👦', '👧', '🧑', '👱', '👨', '🧔', '👩', '🧓', '👴', '👵', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🧏', '🙇', '🤦', '🤷', '👮', '🕵️', '💂', '🥷', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸', '🦹', '🧙', '🧚', '🧛', '🧜', '🧝', '🧞', '🧟', '💆', '💇', '🚶', '🧍', '🧎', '🏃', '💃', '🕺', '🕴️', '👯', '🧖', '🧗', '🤺', '🏇', '⛷️', '🏂', '🏌️', '🏄', '🚣', '🏊', '⛹️', '🏋️', '🚴', '🚵', '🤸', '🤼', '🤽', '🤾', '🤹', '🧘', '🛀', '🛌', '👫', '👬', '👭', '💏', '💑', '👪', '🗣️', '👤', '👥', '🫂', '👣', '🐵', '🐒', '🦍', '🦧', '🐶', '🐕', '🦮', '🐩', '🐺', '🦊', '🦝', '🐱', '🐈', '🦁', '🐯', '🐅', '🐆', '🐴', '🐎', '🦄', '🦓', '🦌', '🦬', '🐮', '🐂', '🐃', '🐄', '🐷', '🐖', '🐗', '🐽', '🐏', '🐑', '🐐', '🐪', '🐫', '🦙', '🦒', '🐘', '🦣', '🦏', '🦛', '🐭', '🐁', '🐀', '🐹', '🐰', '🐇', '🐿️', '🦫', '🦔', '🦇', '🐻', '🐨', '🐼', '🦥', '🦦', '🦨', '🦘', '🦡', '🐾', '🦃', '🐔', '🐓', '🐣', '🐤', '🐥', '🐦', '🐧', '🕊️', '🦅', '🦆', '🦢', '🦉', '🦤', '🪶', '🦩', '🦚', '🦜', '🐸', '🐊', '🐢', '🦎', '🐍', '🐲', '🐉', '🦕', '🦖', '🐳', '🐋', '🐬', '🦭', '🐟', '🐠', '🐡', '🦈', '🐙', '🐚', '🐌', '🦋', '🐛', '🐜', '🐝', '🪲', '🐞', '🦗', '🪳', '🕷️', '🕸️', '🦂', '🦟', '🪰', '🪱', '🦠', '💐', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🪴', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍇', '🍈', '🍉', '🍊', '🍋', '🍌', '🍍', '🥭', '🍎', '🍏', '🍐', '🍑', '🍒', '🍓', '🫐', '🥝', '🍅', '🫒', '🥥', '🥑', '🍆', '🥔', '🥕', '🌽', '🌶️', '🫑', '🥒', '🥬', '🥦', '🧄', '🧅', '🍄', '🥜', '🌰', '🍞', '🥐', '🥖', '🫓', '🥨', '🥯', '🥞', '🧇', '🧀', '🍖', '🍗', '🥩', '🥓', '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🫔', '🥙', '🧆', '🥚', '🍳', '🥘', '🍲', '🫕', '🥣', '🥗', '🍿', '🧈', '🧂', '🥫', '🍱', '🍘', '🍙', '🍚', '🍛', '🍜', '🍝', '🍠', '🍢', '🍣', '🍤', '🍥', '🥮', '🍡', '🥟', '🥠', '🥡', '🦀', '🦞', '🦐', '🦑', '🦪', '🍦', '🍧', '🍨', '🍩', '🍪', '🎂', '🍰', '🧁', '🥧', '🍫', '🍬', '🍭', '🍮', '🍯', '🍼', '🥛', '☕', '🫖', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧋', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄', '🔪', '🏺', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🪨', '🪵', '🛖', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰', '💒', '🗼', '🗽', '⛪', '🕌', '🛕', '🕍', '⛩️', '🕋', '⛲', '⛺', '🌁', '🌃', '🏙️', '🌄', '🌅', '🌆', '🌇', '🌉', '♨️', '🎠', '🎡', '🎢', '💈', '🎪', '🚂', '🚃', '🚄', '🚅', '🚆', '🚇', '🚈', '🚉', '🚊', '🚝', '🚞', '🚋', '🚌', '🚍', '🚎', '🚐', '🚑', '🚒', '🚓', '🚔', '🚕', '🚖', '🚗', '🚘', '🚙', '🛻', '🚚', '🚛', '🚜', '🏎️', '🏍️', '🛵', '🦽', '🦼', '🛺', '🚲', '🛴', '🛹', '🛼', '🚏', '🛣️', '🛤️', '🛢️', '⛽', '🚨', '🚥', '🚦', '🛑', '🚧', '⚓', '⛵', '🛶', '🚤', '🛳️', '⛴️', '🛥️', '🚢', '✈️', '🛩️', '🛫', '🛬', '🪂', '💺', '🚁', '🚟', '🚠', '🚡', '🛰️', '🚀', '🛸', '🛎️', '🧳', '⌛', '⏳', '⌚', '⏰', '⏱️', '⏲️', '🕰️', '🕛', '🕧', '🕐', '🕜', '🕑', '🕝', '🕒', '🕞', '🕓', '🕟', '🕔', '🕠', '🕕', '🕡', '🕖', '🕢', '🕗', '🕣', '🕘', '🕤', '🕙', '🕥', '🕚', '🕦', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '🌡️', '☀️', '🌝', '🌞', '🪐', '⭐', '🌟', '🌠', '🌌', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊', '🎃', '🎄', '🎆', '🎇', '🧨', '✨', '🎈', '🎉', '🎊', '🎋', '🎍', '🎎', '🎏', '🎐', '🎑', '🧧', '🎀', '🎁', '🎗️', '🎟️', '🎫', '🎖️', '🏆', '🏅', '🥇', '🥈', '🥉', '⚽', '⚾', '🥎', '🏀', '🏐', '🏈', '🏉', '🎾', '🥏', '🎳', '🏏', '🏑', '🏒', '🥍', '🏓', '🏸', '🥊', '🥋', '🥅', '⛳', '⛸️', '🎣', '🤿', '🎽', '🎿', '🛷', '🥌', '🎯', '🪀', '🪁', '🎱', '🔮', '🪄', '🧿', '🎮', '🕹️', '🎰', '🎲', '🧩', '🧸', '🪅', '🪆', '♠️', '♥️', '♦️', '♣️', '♟️', '🃏', '🀄', '🎴', '🎭', '🖼️', '🎨', '🧵', '🪡', '🧶', '🪢', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🛍️', '🎒', '🩴', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '🪖', '⛑️', '📿', '💄', '💍', '💎', '🔇', '🔈', '🔉', '🔊', '📢', '📣', '📯', '🔔', '🔕', '🎼', '🎵', '🎶', '🎙️', '🎚️', '🎛️', '🎤', '🎧', '📻', '🎷', '🪗', '🎸', '🎹', '🎺', '🎻', '🪕', '🥁', '🪘', '📱', '📲', '☎️', '📞', '📟', '📠', '🔋', '🔌', '💻', '🖥️', '🖨️', '⌨️', '🖱️', '🖲️', '💽', '💾', '💿', '📀', '🧮', '🎥', '🎞️', '📽️', '🎬', '📺', '📷', '📸', '📹', '📼', '🔍', '🔎', '🕯️', '💡', '🔦', '🏮', '🪔', '📔', '📕', '📖', '📗', '📘', '📙', '📚', '📓', '📒', '📃', '📜', '📄', '📰', '🗞️', '📑', '🔖', '🏷️', '💰', '🪙', '💴', '💵', '💶', '💷', '💸', '💳', '🧾', '💹', '✉️', '📧', '📨', '📩', '📤', '📥', '📦', '📫', '📪', '📬', '📭', '📮', '🗳️', '✏️', '✒️', '🖋️', '🖊️', '🖌️', '🖍️', '📝', '💼', '📁', '📂', '🗂️', '📅', '📆', '🗒️', '🗓️', '📇', '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐', '✂️', '🗃️', '🗄️', '🗑️', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🔨', '🪓', '⛏️', '⚒️', '🛠️', '🗡️', '⚔️', '🔫', '🪃', '🏹', '🛡️', '🪚', '🔧', '🪛', '🔩', '⚙️', '🗜️', '⚖️', '🦯', '🔗', '⛓️', '🪝', '🧰', '🧲', '🪜', '⚗️', '🧪', '🧫', '🧬', '🔬', '🔭', '📡', '💉', '🩸', '💊', '🩹', '🩺', '🚪', '🛗', '🪞', '🪟', '🛏️', '🛋️', '🪑', '🚽', '🪠', '🚿', '🛁', '🪤', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🪣', '🧼', '🪥', '🧽', '🧯', '🛒', '🚬', '⚰️', '🪦', '⚱️', '🗿', '🪧', '🏧', '🚮', '🚰', '♿', '🚹', '🚺', '🚻', '🚼', '🚾', '🛂', '🛃', '🛄', '🛅', '⚠️', '🚸', '⛔', '🚫', '🚳', '🚭', '🚯', '🚱', '🚷', '📵', '🔞', '☢️', '☣️', '⬆️', '↗️', '➡️', '↘️', '⬇️', '↙️', '⬅️', '↖️', '↕️', '↔️', '↩️', '↪️', '⤴️', '⤵️', '🔃', '🔄', '🔙', '🔚', '🔛', '🔜', '🔝', '🛐', '⚛️', '🕉️', '✡️', '☸️', '☯️', '✝️', '☦️', '☪️', '☮️', '🕎', '🔯', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '⛎', '🔀', '🔁', '🔂', '▶️', '⏩', '⏭️', '⏯️', '◀️', '⏪', '⏮️', '🔼', '⏫', '🔽', '⏬', '⏸️', '⏹️', '⏺️', '⏏️', '🎦', '🔅', '🔆', '📶', '📳', '📴', '♀️', '♂️', '⚧️', '✖️', '➕', '➖', '➗', '♾️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '💱', '💲', '⚕️', '♻️', '⚜️', '🔱', '📛', '🔰', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '©️', '®️', '™️', '#️⃣', '*️⃣', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹', '🔺', '🔻', '💠', '🔘', '🔳', '🔲', '🏁', '🚩', '🎌', '🏴', '🏳️', '🏳️‍🌈', '🏳️‍⚧️', '🏴‍☠️'];

  // Word lists for Real Words mode - organized by length
  const realWordLists = {
    1: ['A', 'I'],
    2: ['AT', 'BE', 'DO', 'GO', 'HE', 'IF', 'IN', 'IS', 'IT', 'ME', 'MY', 'NO', 'OF', 'ON', 'OR', 'SO', 'TO', 'UP', 'US', 'WE'],
    3: ['ACE', 'ACT', 'ADD', 'AGE', 'AGO', 'AID', 'AIM', 'AIR', 'ALL', 'AND', 'ANT', 'ANY', 'APE', 'ARC', 'ARE', 'ARK', 'ARM', 'ART', 'ASH', 'ASK', 'ATE', 'BAD', 'BAG', 'BAR', 'BAT', 'BAY', 'BED', 'BEE', 'BET', 'BIG', 'BIN', 'BIT', 'BOW', 'BOX', 'BOY', 'BUD', 'BUG', 'BUS', 'BUT', 'BUY', 'CAB', 'CAP', 'CAR', 'CAT', 'COW', 'CRY', 'CUP', 'CUT', 'DAD', 'DAY', 'DEN', 'DEW', 'DID', 'DIE', 'DIG', 'DOC', 'DOG', 'DOT', 'DRY', 'DUE', 'DUG', 'EAR', 'EAT', 'EGG', 'ELF', 'ELK', 'ELM', 'EMU', 'END', 'ERA', 'EVE', 'EYE', 'FAD', 'FAN', 'FAR', 'FAT', 'FAX', 'FED', 'FEE', 'FEW', 'FIG', 'FIN', 'FIR', 'FIT', 'FIX', 'FLY', 'FOE', 'FOG', 'FOR', 'FOX', 'FRY', 'FUN', 'FUR', 'GAP', 'GAS', 'GAY', 'GEL', 'GEM', 'GET', 'GNU', 'GOD', 'GOT', 'GUM', 'GUN', 'GUT', 'GUY', 'GYM', 'HAD', 'HAM', 'HAS', 'HAT', 'HAY', 'HEN', 'HER', 'HEW', 'HEX', 'HID', 'HIM', 'HIP', 'HIS', 'HIT', 'HOB', 'HOE', 'HOG', 'HOP', 'HOT', 'HOW', 'HUB', 'HUE', 'HUG', 'HUM', 'HUT', 'ICE', 'ICY', 'ILL', 'IMP', 'INK', 'INN', 'ION', 'IRE', 'IRK', 'ITS', 'IVY', 'JAB', 'JAG', 'JAM', 'JAR', 'JAW', 'JAY', 'JET', 'JIG', 'JOB', 'JOG', 'JOT', 'JOY', 'JUG', 'KEG', 'KEN', 'KEY', 'KID', 'KIN', 'KIT', 'LAB', 'LAC', 'LAD', 'LAG', 'LAP', 'LAW', 'LAX', 'LAY', 'LEA', 'LED', 'LEG', 'LET', 'LID', 'LIE', 'LIP', 'LIT', 'LOG', 'LOT', 'LOW', 'LUG', 'MAD', 'MAN', 'MAP', 'MAR', 'MAT', 'MAY', 'MEN', 'MET', 'MIX', 'MOB', 'MOM', 'MOP', 'MOW', 'MUD', 'MUG', 'NAB', 'NAG', 'NAP', 'NAY', 'NET', 'NEW', 'NIL', 'NIT', 'NOD', 'NOR', 'NOT', 'NOW', 'NUN', 'NUT', 'OAK', 'OAR', 'OAT', 'ODD', 'ODE', 'OFF', 'OFT', 'OIL', 'OLD', 'ONE', 'OPT', 'ORB', 'ORE', 'OUR', 'OUT', 'OWE', 'OWL', 'OWN', 'PAD', 'PAL', 'PAN', 'PAP', 'PAR', 'PAT', 'PAW', 'PAY', 'PEA', 'PEG', 'PEN', 'PEP', 'PER', 'PET', 'PEW', 'PIE', 'PIG', 'PIN', 'PIT', 'PLY', 'POD', 'POP', 'POT', 'POW', 'PRY', 'PUB', 'PUG', 'PUN', 'PUP', 'PUT', 'RAG', 'RAM', 'RAN', 'RAP', 'RAT', 'RAW', 'RAY', 'RED', 'RIB', 'RID', 'RIG', 'RIM', 'RIP', 'ROB', 'ROD', 'ROE', 'ROT', 'ROW', 'RUB', 'RUG', 'RUM', 'RUN', 'RUT', 'RYE', 'SAC', 'SAD', 'SAG', 'SAP', 'SAT', 'SAW', 'SAX', 'SAY', 'SEA', 'SET', 'SEW', 'SHE', 'SHY', 'SIN', 'SIP', 'SIR', 'SIS', 'SIT', 'SIX', 'SKI', 'SKY', 'SLY', 'SOB', 'SOD', 'SON', 'SOP', 'SOT', 'SOW', 'SOX', 'SOY', 'SPA', 'SPY', 'STY', 'SUB', 'SUM', 'SUN', 'SUP', 'TAB', 'TAD', 'TAG', 'TAN', 'TAP', 'TAR', 'TAT', 'TAX', 'TEA', 'TEN', 'THE', 'THY', 'TIC', 'TIE', 'TIN', 'TIP', 'TOE', 'TON', 'TOO', 'TOP', 'TOT', 'TOW', 'TOY', 'TRY', 'TUB', 'TUG', 'TUT', 'TWO', 'UGH', 'UMP', 'URN', 'USE', 'VAN', 'VAT', 'VET', 'VEX', 'VIA', 'VIE', 'VOW', 'WAD', 'WAG', 'WAR', 'WAS', 'WAX', 'WAY', 'WEB', 'WED', 'WEE', 'WET', 'WHO', 'WHY', 'WIG', 'WIN', 'WIT', 'WOE', 'WOK', 'WON', 'WOO', 'WOW', 'YAK', 'YAM', 'YAP', 'YAW', 'YEA', 'YES', 'YET', 'YEW', 'YIN', 'YON', 'YOU', 'YOW', 'ZAP', 'ZEN', 'ZIP', 'ZIT', 'ZOO'],
    4: ['ABLE', 'ACHE', 'ACRE', 'AGED', 'ALSO', 'ARCH', 'AREA', 'ARMY', 'ATOM', 'BABY', 'BACK', 'BAKE', 'BALL', 'BAND', 'BANK', 'BARN', 'BASE', 'BATH', 'BEAD', 'BEAM', 'BEAN', 'BEAR', 'BEAT', 'BEEN', 'BEER', 'BELL', 'BELT', 'BEND', 'BENT', 'BEST', 'BIKE', 'BILE', 'BILL', 'BIND', 'BIRD', 'BITE', 'BLOW', 'BLUE', 'BLUR', 'BOAR', 'BOAT', 'BODY', 'BOIL', 'BOLD', 'BOLT', 'BOMB', 'BOND', 'BONE', 'BOOK', 'BOOM', 'BOOT', 'BORE', 'BORN', 'BOSS', 'BOTH', 'BOWL', 'BRED', 'BREW', 'BUMP', 'BURN', 'BURY', 'BUSH', 'BUSY', 'BYTE', 'CAGE', 'CAKE', 'CALF', 'CALL', 'CALM', 'CAME', 'CAMP', 'CANE', 'CAPE', 'CARD', 'CARE', 'CART', 'CASE', 'CASH', 'CAST', 'CAVE', 'CELL', 'CHAT', 'CHEF', 'CHIP', 'CHOP', 'CITY', 'CLAD', 'CLAM', 'CLAN', 'CLAP', 'CLAW', 'CLAY', 'CLIP', 'CLUB', 'COAL', 'COAT', 'CODE', 'COIL', 'COIN', 'COLD', 'COLT', 'COMB', 'COME', 'CONE', 'COOK', 'COOL', 'COPE', 'COPY', 'CORD', 'CORE', 'CORK', 'CORN', 'COST', 'COUP', 'COVE', 'CRAB', 'CREW', 'CROP', 'CROW', 'CUBE', 'CURE', 'CURL', 'CUTE', 'DAMP', 'DARE', 'DARK', 'DART', 'DASH', 'DATA', 'DATE', 'DAWN', 'DAYS', 'DEAD', 'DEAF', 'DEAL', 'DEAN', 'DEAR', 'DEBT', 'DECK', 'DEED', 'DEEM', 'DEEP', 'DEER', 'DENY', 'DESK', 'DIAL', 'DICE', 'DIED', 'DIET', 'DIME', 'DINE', 'DIRT', 'DISC', 'DISH', 'DISK', 'DIVE', 'DOCK', 'DOES', 'DOLL', 'DOME', 'DONE', 'DOOM', 'DOOR', 'DOSE', 'DOVE', 'DOWN', 'DOZE', 'DRAG', 'DRAW', 'DREW', 'DRIP', 'DROP', 'DRUG', 'DRUM', 'DUCK', 'DULL', 'DUMB', 'DUMP', 'DUNE', 'DUNG', 'DUNK', 'DUSK', 'DUST', 'DUTY', 'EACH', 'EARL', 'EARN', 'EASE', 'EAST', 'EASY', 'EATS', 'ECHO', 'EDGE', 'EDIT', 'ELSE', 'EMIT', 'EPIC', 'EVEN', 'EVER', 'EVIL', 'EXAM', 'EXIT', 'FACE', 'FACT', 'FADE', 'FAIL', 'FAIR', 'FAKE', 'FALL', 'FAME', 'FANG', 'FARM', 'FAST', 'FATE', 'FAWN', 'FEAR', 'FEAT', 'FEED', 'FEEL', 'FEET', 'FELL', 'FELT', 'FERN', 'FILE', 'FILL', 'FILM', 'FIND', 'FINE', 'FIRE', 'FIRM', 'FISH', 'FIST', 'FIVE', 'FLAG', 'FLAP', 'FLAT', 'FLAW', 'FLEA', 'FLED', 'FLEE', 'FLEW', 'FLIP', 'FLOP', 'FLOW', 'FOAM', 'FOIL', 'FOLK', 'FOND', 'FONT', 'FOOD', 'FOOL', 'FOOT', 'FORD', 'FORK', 'FORM', 'FORT', 'FOUL', 'FOUR', 'FOWL', 'FRAY', 'FREE', 'FROG', 'FROM', 'FUEL', 'FULL', 'FUME', 'FUND', 'FUSE', 'FUSS', 'GAIN', 'GALE', 'GAME', 'GANG', 'GATE', 'GAVE', 'GAZE', 'GEAR', 'GENE', 'GERM', 'GIFT', 'GILL', 'GIRL', 'GIVE', 'GLAD', 'GLOW', 'GLUE', 'GNAT', 'GOAL', 'GOAT', 'GOES', 'GOLD', 'GOLF', 'GONE', 'GOOD', 'GORE', 'GORY', 'GOWN', 'GRAB', 'GRAM', 'GRAY', 'GREW', 'GRID', 'GRIM', 'GRIN', 'GRIP', 'GROW', 'GULF', 'GULL', 'GURU', 'GUST', 'GUYS', 'HACK', 'HAIL', 'HAIR', 'HALF', 'HALL', 'HALT', 'HAND', 'HANG', 'HARD', 'HARE', 'HARM', 'HARP', 'HASH', 'HATE', 'HAUL', 'HAVE', 'HAWK', 'HAZE', 'HEAD', 'HEAL', 'HEAP', 'HEAR', 'HEAT', 'HEED', 'HEEL', 'HEIR', 'HELD', 'HELL', 'HELM', 'HELP', 'HEMP', 'HERB', 'HERD', 'HERE', 'HERO', 'HERS', 'HIDE', 'HIGH', 'HIKE', 'HILL', 'HILT', 'HINT', 'HIRE', 'HISS', 'HIVE', 'HOLD', 'HOLE', 'HOME', 'HONE', 'HOOD', 'HOOF', 'HOOK', 'HOOP', 'HOOT', 'HOPE', 'HORN', 'HOSE', 'HOST', 'HOUR', 'HUGE', 'HULL', 'HUMP', 'HUNG', 'HUNK', 'HUNT', 'HURL', 'HURT', 'HUSH', 'HYMN', 'IBEX', 'ICON', 'IDEA', 'IDLE', 'IDOL', 'INCH', 'INTO', 'IRIS', 'IRON', 'ISLE', 'ITCH', 'ITEM', 'JACK', 'JADE', 'JAIL', 'JEAN', 'JEEP', 'JERK', 'JEST', 'JINX', 'JOBS', 'JOCK', 'JOIN', 'JOKE', 'JOLT', 'JOWL', 'JUDGE', 'JULY', 'JUMP', 'JUNE', 'JUNK', 'JURY', 'JUST', 'JUTE', 'KALE', 'KEEN', 'KEEP', 'KEPT', 'KICK', 'KILL', 'KILT', 'KIND', 'KING', 'KISS', 'KITE', 'KNEE', 'KNEW', 'KNIT', 'KNOB', 'KNOT', 'KNOW', 'LACE', 'LACK', 'LACY', 'LADY', 'LAID', 'LAIR', 'LAKE', 'LAMB', 'LAME', 'LAMP', 'LAND', 'LANE', 'LARK', 'LASH', 'LASS', 'LAST', 'LATE', 'LAUD', 'LAVA', 'LAWN', 'LAWS', 'LEAD', 'LEAF', 'LEAK', 'LEAN', 'LEAP', 'LEFT', 'LEND', 'LENS', 'LENT', 'LESS', 'LEVY', 'LIAR', 'LICE', 'LICK', 'LIED', 'LIEN', 'LIES', 'LIFE', 'LIFT', 'LIKE', 'LILY', 'LIMB', 'LIME', 'LIMP', 'LINE', 'LINK', 'LINT', 'LION', 'LIPS', 'LIST', 'LIVE', 'LOAD', 'LOAF', 'LOAM', 'LOAN', 'LOBE', 'LOCK', 'LOFT', 'LOGO', 'LONE', 'LONG', 'LOOK', 'LOOM', 'LOOP', 'LOOT', 'LORD', 'LORE', 'LORN', 'LOSE', 'LOSS', 'LOST', 'LOUD', 'LOUT', 'LOVE', 'LUCK', 'LULL', 'LUMP', 'LUNG', 'LURE', 'LURK', 'LUSH', 'LUST', 'LUTE', 'LYNX', 'LYRE', 'MACE', 'MADE', 'MAGI', 'MAID', 'MAIL', 'MAIM', 'MAIN', 'MAKE', 'MALE', 'MALL', 'MALT', 'MANE', 'MANY', 'MAPS', 'MARE', 'MARK', 'MARS', 'MASH', 'MASK', 'MASS', 'MAST', 'MATE', 'MATH', 'MAUL', 'MAZE', 'MEAD', 'MEAL', 'MEAN', 'MEAT', 'MEEK', 'MEET', 'MELD', 'MELT', 'MEND', 'MENU', 'MEOW', 'MERE', 'MESH', 'MESS', 'MICE', 'MIDI', 'MILD', 'MILE', 'MILK', 'MILL', 'MIME', 'MIND', 'MINE', 'MINT', 'MIRE', 'MISS', 'MIST', 'MITE', 'MITT', 'MOAN', 'MOAT', 'MOCK', 'MODE', 'MOLD', 'MOLE', 'MOLT', 'MONK', 'MOOD', 'MOON', 'MOOR', 'MOOT', 'MORE', 'MORN', 'MOSS', 'MOST', 'MOTH', 'MOVE', 'MUCH', 'MUCK', 'MULE', 'MULL', 'MURK', 'MUSE', 'MUSH', 'MUSK', 'MUST', 'MUTE', 'MYTH', 'NAIL', 'NAME', 'NAPE', 'NAVY', 'NEAR', 'NEAT', 'NECK', 'NEED', 'NEON', 'NEST', 'NEWS', 'NEWT', 'NEXT', 'NICE', 'NICK', 'NINE', 'NODE', 'NONE', 'NOON', 'NORM', 'NOSE', 'NOTE', 'NOUN', 'NOVA', 'NULL', 'NUMB', 'OATH', 'OBEY', 'ODDS', 'ODOR', 'OGRE', 'OKAY', 'OKRA', 'OMEN', 'OMIT', 'ONCE', 'ONLY', 'ONTO', 'ONUS', 'OOZE', 'OPAL', 'OPEN', 'OPUS', 'ORAL', 'ORCA', 'OVEN', 'OVER', 'OWED', 'OWES', 'OWNS', 'OXEN', 'PACE', 'PACK', 'PACT', 'PAGE', 'PAID', 'PAIL', 'PAIN', 'PAIR', 'PALE', 'PALM', 'PANE', 'PANG', 'PANT', 'PAPA', 'PARK', 'PART', 'PASS', 'PAST', 'PATH', 'PAVE', 'PAWN', 'PEAK', 'PEAL', 'PEAR', 'PEAT', 'PECK', 'PEEK', 'PEEL', 'PEER', 'PELT', 'PERK', 'PEST', 'PHEW', 'PICK', 'PIER', 'PIKE', 'PILE', 'PILL', 'PINE', 'PING', 'PINK', 'PINT', 'PIPE', 'PITY', 'PLAN', 'PLAY', 'PLEA', 'PLED', 'PLOD', 'PLOT', 'PLOW', 'PLOY', 'PLUG', 'PLUM', 'PLUS', 'POCK', 'POEM', 'POET', 'POKE', 'POLE', 'POLL', 'POLO', 'POMP', 'POND', 'PONY', 'POOL', 'POOR', 'POPE', 'PORE', 'PORK', 'PORT', 'POSE', 'POST', 'POUR', 'POUT', 'PRAY', 'PREY', 'PRIM', 'PROD', 'PROM', 'PROP', 'PROW', 'PRUNE', 'PUCK', 'PUFF', 'PULL', 'PULP', 'PUMA', 'PUMP', 'PUNK', 'PUNY', 'PUPA', 'PURE', 'PURR', 'PUSH', 'QUID', 'QUIZ', 'RACE', 'RACK', 'RAFT', 'RAGE', 'RAID', 'RAIL', 'RAIN', 'RAKE', 'RAMP', 'RANG', 'RANK', 'RANT', 'RARE', 'RASH', 'RASP', 'RATE', 'RAVE', 'RAYS', 'RAZE', 'READ', 'REAL', 'REAM', 'REAP', 'REAR', 'REED', 'REEF', 'REEK', 'REEL', 'REIN', 'RELY', 'REND', 'RENT', 'REST', 'RHYME', 'RICE', 'RICH', 'RIDE', 'RIFE', 'RIFT', 'RILE', 'RILL', 'RIME', 'RIND', 'RING', 'RINK', 'RIOT', 'RIPE', 'RISE', 'RISK', 'RITE', 'ROAD', 'ROAM', 'ROAN', 'ROAR', 'ROBE', 'ROCK', 'RODE', 'ROLE', 'ROLL', 'ROMP', 'ROOF', 'ROOK', 'ROOM', 'ROOT', 'ROPE', 'ROSE', 'ROSY', 'ROTE', 'ROUT', 'ROVE', 'ROWS', 'RUBE', 'RUBY', 'RUDE', 'RUFF', 'RUIN', 'RULE', 'RUMP', 'RUNG', 'RUNS', 'RUNT', 'RUSE', 'RUSH', 'RUST', 'RUTS', 'SACK', 'SAFE', 'SAGA', 'SAGE', 'SAID', 'SAIL', 'SAKE', 'SALE', 'SALT', 'SAME', 'SAND', 'SANE', 'SANG', 'SANK', 'SASH', 'SASS', 'SAVE', 'SCAM', 'SCAN', 'SCAR', 'SCAT', 'SEAL', 'SEAM', 'SEAR', 'SEAS', 'SEAT', 'SECT', 'SEED', 'SEEK', 'SEEM', 'SEEN', 'SEEP', 'SEER', 'SELF', 'SELL', 'SEMI', 'SEND', 'SENT', 'SEPT', 'SERF', 'SETS', 'SEWN', 'SHAD', 'SHAG', 'SHAM', 'SHARD', 'SHAW', 'SHED', 'SHIN', 'SHIP', 'SHOD', 'SHOE', 'SHOP', 'SHOT', 'SHOW', 'SHUN', 'SHUT', 'SICK', 'SIDE', 'SIFT', 'SIGH', 'SIGN', 'SILK', 'SILL', 'SILO', 'SILT', 'SING', 'SINK', 'SIRE', 'SITE', 'SIZE', 'SKEW', 'SKID', 'SKIM', 'SKIN', 'SKIP', 'SKIT', 'SLAB', 'SLAG', 'SLAM', 'SLAP', 'SLAT', 'SLAW', 'SLAY', 'SLED', 'SLEW', 'SLID', 'SLIM', 'SLIP', 'SLIT', 'SLOB', 'SLOP', 'SLOT', 'SLOW', 'SLUG', 'SLUM', 'SLUR', 'SMOG', 'SNAP', 'SNARE', 'SNIP', 'SNOB', 'SNORE', 'SNOW', 'SNUB', 'SNUG', 'SOAK', 'SOAP', 'SOAR', 'SOCK', 'SODA', 'SOFA', 'SOFT', 'SOIL', 'SOLD', 'SOLE', 'SOLO', 'SOME', 'SONG', 'SONS', 'SOON', 'SOOT', 'SORE', 'SORT', 'SOUL', 'SOUP', 'SOUR', 'SOWN', 'SPAN', 'SPAR', 'SPAT', 'SPEC', 'SPED', 'SPIN', 'SPIT', 'SPOT', 'SPUD', 'SPUR', 'STAB', 'STAG', 'STAR', 'STAY', 'STEM', 'STEP', 'STEW', 'STIR', 'STOP', 'STOW', 'STUB', 'STUD', 'STUN', 'SUCH', 'SUDS', 'SUED', 'SUES', 'SUIT', 'SULK', 'SUMO', 'SUMP', 'SUMS', 'SUNG', 'SUNK', 'SUNS', 'SUPE', 'SURF', 'SWAB', 'SWAG', 'SWAM', 'SWAN', 'SWAP', 'SWAT', 'SWAY', 'SWEAR', 'SWIM', 'SWUM', 'TACK', 'TACT', 'TAIL', 'TAKE', 'TALE', 'TALK', 'TALL', 'TAME', 'TANG', 'TANK', 'TAPE', 'TAPS', 'TARE', 'TARN', 'TART', 'TASK', 'TAUT', 'TAXI', 'TEAK', 'TEAL', 'TEAM', 'TEAR', 'TEAS', 'TEAT', 'TEEN', 'TELL', 'TEMP', 'TEND', 'TENS', 'TENT', 'TERM', 'TERN', 'TEST', 'TEXT', 'THAN', 'THAT', 'THAW', 'THEE', 'THEM', 'THEN', 'THEW', 'THEY', 'THIN', 'THIS', 'THOU', 'THUD', 'THUG', 'THUS', 'TICK', 'TIDE', 'TIDY', 'TIED', 'TIER', 'TIES', 'TIFF', 'TILE', 'TILL', 'TILT', 'TIME', 'TINE', 'TING', 'TINT', 'TINY', 'TIPS', 'TIRE', 'TOAD', 'TOES', 'TOFU', 'TOGA', 'TOIL', 'TOLD', 'TOLL', 'TOMB', 'TOME', 'TONE', 'TONG', 'TONS', 'TOOK', 'TOOL', 'TOOT', 'TOPS', 'TORE', 'TORN', 'TOSS', 'TOTE', 'TOUR', 'TOUT', 'TOWN', 'TOYS', 'TRAM', 'TRAP', 'TRAY', 'TREE', 'TREK', 'TRIM', 'TRIO', 'TRIP', 'TROD', 'TROT', 'TROY', 'TRUE', 'TSAR', 'TUBA', 'TUBE', 'TUCK', 'TUFT', 'TUNA', 'TUNE', 'TURF', 'TURN', 'TUSK', 'TUTU', 'TWIG', 'TWIN', 'TWIT', 'TYKE', 'TYPE', 'UGLY', 'UNDO', 'UNIT', 'UNTO', 'UPON', 'USED', 'USER', 'USES', 'VAIN', 'VALE', 'VAMP', 'VANE', 'VARY', 'VASE', 'VAST', 'VATS', 'VEAL', 'VEER', 'VEIL', 'VEIN', 'VEND', 'VENT', 'VERB', 'VERY', 'VEST', 'VETO', 'VIAL', 'VICE', 'VIEW', 'VILE', 'VINE', 'VISA', 'VISE', 'VOID', 'VOLT', 'VOTE', 'VOWS', 'WADE', 'WAFT', 'WAGE', 'WAIL', 'WAIT', 'WAKE', 'WALK', 'WALL', 'WAND', 'WANE', 'WANT', 'WARD', 'WARE', 'WARM', 'WARN', 'WARP', 'WARS', 'WART', 'WARY', 'WASH', 'WASP', 'WAVE', 'WAVY', 'WAXY', 'WAYS', 'WEAK', 'WEAL', 'WEAN', 'WEAR', 'WEED', 'WEEK', 'WEEP', 'WEFT', 'WEIR', 'WELD', 'WELL', 'WELT', 'WENT', 'WEPT', 'WERE', 'WEST', 'WHAM', 'WHAT', 'WHEN', 'WHET', 'WHEW', 'WHIG', 'WHIM', 'WHINE', 'WHIP', 'WHIR', 'WHIT', 'WICK', 'WIDE', 'WIFE', 'WILD', 'WILE', 'WILL', 'WILT', 'WILY', 'WIMP', 'WIND', 'WINE', 'WING', 'WINK', 'WINS', 'WIPE', 'WIRE', 'WIRY', 'WISE', 'WISH', 'WISP', 'WITH', 'WITS', 'WOKE', 'WOLF', 'WOMB', 'WONT', 'WOOD', 'WOOF', 'WOOL', 'WORD', 'WORE', 'WORK', 'WORM', 'WORN', 'WORT', 'WOVE', 'WOVEN', 'WRAP', 'WREN', 'WRIT', 'YANK', 'YARD', 'YARN', 'YAWL', 'YAWN', 'YEAH', 'YEAR', 'YEAS', 'YELL', 'YELP', 'YENS', 'YETI', 'YEWS', 'YOKE', 'YOLK', 'YOUR', 'YOWL', 'YULE', 'ZEAL', 'ZERO', 'ZEST', 'ZINC', 'ZING', 'ZONE', 'ZOOM', 'ZOOS']
  };

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
  
  // Helper to check if a string is a real word
  const isRealWord = (str) => {
    const upperStr = str.toUpperCase();
    const len = upperStr.length;
    if (realWordLists[len]) {
      return realWordLists[len].includes(upperStr);
    }
    return false;
  };

  const generateStimulus = () => {
    const availableTypes = [];
    if (useRealWords) availableTypes.push('realwords');
    if (useNonsenseWords) availableTypes.push('nonsense');
    if (useRandomLetters) availableTypes.push('randomletters');
    if (useEmojis) availableTypes.push('emojis');
    if (useVoronoi) availableTypes.push('voronoi');
    if (useMandelbrot) availableTypes.push('mandelbrot');
    if (useVibration) availableTypes.push('vibration');

    if (availableTypes.length === 0) availableTypes.push('realwords');

    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];

    if (selectedType === 'realwords') {
      // Get word list for current letter length, or use length 3 if not available
      const wordList = realWordLists[letterLength] || realWordLists[3];
      return wordList[Math.floor(Math.random() * wordList.length)];
    } else if (selectedType === 'nonsense') {
      // Generate random letters that don't form a real word
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      let attempts = 0;
      do {
        result = '';
        for (let i = 0; i < letterLength; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        attempts++;
      } while (isRealWord(result) && attempts < 100); // Ensure it's not a real word
      return result;
    } else if (selectedType === 'randomletters') {
      // Completely random letters with no filter
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < letterLength; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    } else if (selectedType === 'emojis') {
      return emojiList[Math.floor(Math.random() * emojiList.length)];
    } else if (selectedType === 'voronoi') {
      return `voronoi_${Math.floor(Math.random() * 1000000)}`;
    } else if (selectedType === 'mandelbrot') {
      return `mandelbrot_${Math.floor(Math.random() * 1000000)}`;
    } else if (selectedType === 'vibration') {
      return `vibration_${Math.floor(Math.random() * vibrationPatterns.length)}`;
    }
  };

  const getRelationMode = (relation) => {
    if (['SAME', 'OPPOSITE', 'DIFFERENT'].includes(relation)) return 'equality';
    if (['BEFORE', 'AFTER', 'AT'].includes(relation)) return 'temporal';
    if (['CONTAINS', 'WITHIN'].includes(relation)) return 'containment';
    if (relation === 'ABOVE' || relation === 'BELOW' || relation.startsWith('ABOVE_') || relation.startsWith('BELOW_') ||
        (relation === 'AT' && enabledRelationModes.space3d) ||
        (enabledRelationModes.space3d && !enabledRelationModes.spatial && ['NORTH', 'SOUTH', 'EAST', 'WEST', 'NORTHEAST', 'NORTHWEST', 'SOUTHEAST', 'SOUTHWEST'].includes(relation))) {
      return 'space3d';
    }
    return 'spatial';
  };

  const deriveRelation = (rel1, rel2) => {
    const mode1 = getRelationMode(rel1);
    const mode2 = getRelationMode(rel2);
    
    // Can't derive across different modes
    if (mode1 !== mode2) return 'AMBIGUOUS';
    
    if (mode1 === 'equality') {
      // Identity element: SAME
      if (rel1 === 'SAME') return rel2;
      if (rel2 === 'SAME') return rel1;

      // OPPOSITE compositions
      if (rel1 === 'OPPOSITE' && rel2 === 'OPPOSITE') return 'SAME';

      // OPPOSITE + DIFFERENT is ambiguous
      // If A is OPPOSITE to B, and B is DIFFERENT to C, we can't determine A and C
      // (DIFFERENT just means "not same", doesn't specify if it's OPPOSITE or just different)
      if (rel1 === 'OPPOSITE' && rel2 === 'DIFFERENT') return 'AMBIGUOUS';
      if (rel1 === 'DIFFERENT' && rel2 === 'OPPOSITE') return 'AMBIGUOUS';

      // DIFFERENT cannot be composed with itself - it's non-transitive
      // X DIFFERENT Y, Y DIFFERENT Z tells us nothing definitive about X and Z
      // (they could be SAME, OPPOSITE, or DIFFERENT)
      if (rel1 === 'DIFFERENT' && rel2 === 'DIFFERENT') return 'AMBIGUOUS';

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
    } else if (mode1 === 'space3d') {
      // Space 3D relations
      // AT is identity
      if (rel1 === 'AT') return rel2;
      if (rel2 === 'AT') return rel1;

      // Parse 3D relations into vertical and horizontal components
      const parse3D = (rel) => {
        if (rel === 'AT') return { v: 'AT', h: 'AT' };
        if (rel === 'ABOVE') return { v: 'ABOVE', h: 'AT' };
        if (rel === 'BELOW') return { v: 'BELOW', h: 'AT' };
        if (rel.startsWith('ABOVE_')) return { v: 'ABOVE', h: rel.substring(6) };
        if (rel.startsWith('BELOW_')) return { v: 'BELOW', h: rel.substring(6) };
        // Pure horizontal
        return { v: 'AT', h: rel };
      };

      const compose3D = (v, h) => {
        if (v === 'AT' && h === 'AT') return 'AT';
        if (v === 'AT') return h;
        if (h === 'AT') return v;
        return `${v}_${h}`;
      };

      const p1 = parse3D(rel1);
      const p2 = parse3D(rel2);

      // Compose vertical components
      // In Space 3D, opposite vertical directions cancel out to AT
      let vResult;
      if (p1.v === 'AT') vResult = p2.v;
      else if (p2.v === 'AT') vResult = p1.v;
      else if (p1.v === p2.v) vResult = p1.v; // ABOVE + ABOVE = ABOVE
      else if (p1.v === 'ABOVE' && p2.v === 'BELOW') vResult = 'AT'; // Opposite directions cancel
      else if (p1.v === 'BELOW' && p2.v === 'ABOVE') vResult = 'AT'; // Opposite directions cancel
      else vResult = 'AT';

      // Compose horizontal components
      // In Space 3D, opposite horizontal directions cancel out to AT
      const opposites = {
        'NORTH': 'SOUTH', 'SOUTH': 'NORTH',
        'EAST': 'WEST', 'WEST': 'EAST',
        'NORTHEAST': 'SOUTHWEST', 'SOUTHWEST': 'NORTHEAST',
        'NORTHWEST': 'SOUTHEAST', 'SOUTHEAST': 'NORTHWEST'
      };

      let hResult;
      if (p1.h === 'AT') hResult = p2.h;
      else if (p2.h === 'AT') hResult = p1.h;
      else if (p1.h === p2.h) hResult = p1.h; // Same direction compounds
      else if (opposites[p1.h] === p2.h) hResult = 'AT'; // Opposite directions cancel
      else hResult = p2.h; // Different non-opposite directions: use second relation

      return compose3D(vResult, hResult);
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

  const getReverseRelation = (relation) => {
    // Equality relations
    if (relation === 'SAME') return 'SAME';
    if (relation === 'OPPOSITE') return 'OPPOSITE';
    if (relation === 'DIFFERENT') return 'DIFFERENT';

    // Temporal relations - reverse the direction
    if (relation === 'BEFORE') return 'AFTER';
    if (relation === 'AFTER') return 'BEFORE';
    if (relation === 'AT') return 'AT';

    // Containment relations - reverse the hierarchy
    if (relation === 'CONTAINS') return 'WITHIN';
    if (relation === 'WITHIN') return 'CONTAINS';

    // Space 3D relations - reverse both vertical and horizontal
    if (relation === 'ABOVE' || relation === 'BELOW' || relation.startsWith('ABOVE_') || relation.startsWith('BELOW_')) {
      const horizontalOpposites = {
        'NORTH': 'SOUTH', 'SOUTH': 'NORTH',
        'EAST': 'WEST', 'WEST': 'EAST',
        'NORTHEAST': 'SOUTHWEST', 'SOUTHWEST': 'NORTHEAST',
        'NORTHWEST': 'SOUTHEAST', 'SOUTHEAST': 'NORTHWEST'
      };

      if (relation === 'ABOVE') return 'BELOW';
      if (relation === 'BELOW') return 'ABOVE';
      if (relation.startsWith('ABOVE_')) {
        const horizontal = relation.substring(6);
        return `BELOW_${horizontalOpposites[horizontal] || horizontal}`;
      }
      if (relation.startsWith('BELOW_')) {
        const horizontal = relation.substring(6);
        return `ABOVE_${horizontalOpposites[horizontal] || horizontal}`;
      }
    }

    // Spatial relations - reverse the direction
    const spatialOpposites = {
      'NORTH': 'SOUTH', 'SOUTH': 'NORTH',
      'EAST': 'WEST', 'WEST': 'EAST',
      'NORTHEAST': 'SOUTHWEST', 'SOUTHWEST': 'NORTHEAST',
      'NORTHWEST': 'SOUTHEAST', 'SOUTHEAST': 'NORTHWEST'
    };

    return spatialOpposites[relation] || relation;
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
        // When traversing backwards, reverse the relation
        const reversedRelation = getReverseRelation(edge.relation);
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
            // Key logical rules for equality relations:
            // 1. OPPOSITE implies DIFFERENT (opposites are different)
            // 2. DIFFERENT and SAME are mutually exclusive
            // 3. DIFFERENT doesn't tell us if something is OPPOSITE
            // 4. DIFFERENT is non-transitive

            if (derivedRelation === 'OPPOSITE' && questionRelation === 'DIFFERENT') {
              correctAnswer = true; // OPPOSITE implies DIFFERENT
            } else if (derivedRelation === 'DIFFERENT' && questionRelation === 'SAME') {
              correctAnswer = false; // DIFFERENT means NOT SAME (mutually exclusive)
            } else if (derivedRelation === 'SAME' && questionRelation === 'DIFFERENT') {
              correctAnswer = false; // SAME means NOT DIFFERENT (mutually exclusive)
            } else if (derivedRelation === 'DIFFERENT' && questionRelation === 'OPPOSITE') {
              correctAnswer = 'ambiguous'; // DIFFERENT doesn't tell us if it's OPPOSITE or just different
            } else if (derivedRelation === 'DIFFERENT' && questionRelation === 'DIFFERENT') {
              correctAnswer = 'ambiguous'; // DIFFERENT is non-transitive: X≠Y, Y≠Z doesn't tell us about X and Z
            } else {
              correctAnswer = false; // All other cases (e.g., SAME vs OPPOSITE, OPPOSITE vs SAME)
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
  }, [difficulty, networkComplexity, useRealWords, useNonsenseWords, useRandomLetters, useEmojis, useVoronoi, useMandelbrot, useVibration, letterLength, enabledRelationModes]);

  const startNewTrial = useCallback(() => {
    try {
      const trial = generateTrial();
      console.log('Generated new trial:', trial ? 'success' : 'null');
      setCurrentTrial(trial);
      setTimeLeft(timePerQuestion);
      setFeedback(null);
    } catch (error) {
      console.error('Error generating trial:', error);
    }
  }, [generateTrial, timePerQuestion]);

  const saveToStorage = useCallback(async () => {
    try {
      const saveData = {
        score, history, statsHistory,
        currentTrial, timeLeft, feedback, isPaused,
        settings: { difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode, useRealWords, useNonsenseWords, useRandomLetters, useEmojis, useVoronoi, useMandelbrot, useVibration, letterLength, autoProgressMode, universalProgress, modeSpecificProgress, enabledRelationModes },
      };

      if (user) {
        // Save to Supabase if logged in
        const progressData = {
          user_id: user.id,
          score: score,
          history: history,
          stats_history: statsHistory,
          current_trial: currentTrial,
          time_left: timeLeft,
          feedback: feedback,
          is_paused: isPaused,
          settings: saveData.settings,
          updated_at: new Date().toISOString()
        };

        // Use upsert to insert or update
        const { error } = await supabase
          .from('user_progress')
          .upsert(progressData, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Save to Supabase failed:', error);
        }
      } else {
        // Save to localStorage if not logged in
        localStorage.setItem('rft_local_progress', JSON.stringify(saveData));
      }
    } catch (error) {
      console.error('Save failed:', error);
    }
  }, [user, score, history, statsHistory, currentTrial, timeLeft, feedback, isPaused, difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode, useRealWords, useNonsenseWords, useRandomLetters, useEmojis, useVoronoi, useMandelbrot, useVibration, letterLength, autoProgressMode, universalProgress, modeSpecificProgress, enabledRelationModes]);

  const loadFromStorage = useCallback(async () => {
    try {
      console.log('loadFromStorage called, user:', user ? user.id : 'null');
      let hasTrialData = false;

      if (user) {
        // Check if there's localStorage data from anonymous session
        const localData = localStorage.getItem('rft_local_progress');
        if (localData) {
          console.log('Found localStorage data, migrating to Supabase for logged-in user...');
          const parsedLocalData = JSON.parse(localData);

          // Prepare data for migration to Supabase
          const migrateData = {
            user_id: user.id,
            score: parsedLocalData.score || { correct: 0, incorrect: 0, missed: 0 },
            history: parsedLocalData.history || [],
            stats_history: parsedLocalData.statsHistory || [],
            current_trial: parsedLocalData.currentTrial || null,
            time_left: parsedLocalData.timeLeft !== undefined ? parsedLocalData.timeLeft : 30,
            feedback: parsedLocalData.feedback || null,
            is_paused: parsedLocalData.isPaused || false,
            settings: parsedLocalData.settings || {},
            updated_at: new Date().toISOString()
          };

          // Save localStorage data to Supabase
          const { error: migrateError } = await supabase
            .from('user_progress')
            .upsert(migrateData, {
              onConflict: 'user_id',
              ignoreDuplicates: false
            });

          if (migrateError) {
            console.error('Failed to migrate localStorage to Supabase:', migrateError);
          } else {
            console.log('Successfully migrated localStorage data to Supabase');
            // Clear localStorage after successful migration
            localStorage.removeItem('rft_local_progress');
          }
        }

        // Load from Supabase if logged in
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.log('No saved data found in Supabase');
          return hasTrialData;
        }

        if (data) {
          console.log('Loading data from Supabase');
          if (data.score) setScore(data.score);
          if (data.history) setHistory(data.history);
          if (data.stats_history) setStatsHistory(data.stats_history);
          if (data.current_trial) {
            setCurrentTrial(data.current_trial);
            hasTrialData = true;
          }
          if (data.time_left !== undefined) setTimeLeft(data.time_left);
          if (data.feedback !== undefined) setFeedback(data.feedback);
          if (data.is_paused !== undefined) setIsPaused(data.is_paused);
          if (data.settings) {
            if (data.settings.difficulty !== undefined) setDifficulty(data.settings.difficulty);
            if (data.settings.timePerQuestion !== undefined) setTimePerQuestion(data.settings.timePerQuestion);
            if (data.settings.networkComplexity !== undefined) setNetworkComplexity(data.settings.networkComplexity);
            if (data.settings.spoilerPremises !== undefined) setSpoilerPremises(data.settings.spoilerPremises);
            if (data.settings.darkMode !== undefined) setDarkMode(data.settings.darkMode);
            // Backward compatibility: convert old useLetters to useRealWords
            if (data.settings.useLetters !== undefined) setUseRealWords(data.settings.useLetters);
            if (data.settings.useRealWords !== undefined) setUseRealWords(data.settings.useRealWords);
            if (data.settings.useNonsenseWords !== undefined) setUseNonsenseWords(data.settings.useNonsenseWords);
            if (data.settings.useRandomLetters !== undefined) setUseRandomLetters(data.settings.useRandomLetters);
            if (data.settings.useEmojis !== undefined) setUseEmojis(data.settings.useEmojis);
            if (data.settings.useVoronoi !== undefined) setUseVoronoi(data.settings.useVoronoi);
            if (data.settings.useMandelbrot !== undefined) setUseMandelbrot(data.settings.useMandelbrot);
            if (data.settings.useVibration !== undefined) setUseVibration(data.settings.useVibration);
            if (data.settings.letterLength !== undefined) setLetterLength(data.settings.letterLength);
            if (data.settings.autoProgressMode !== undefined) setAutoProgressMode(data.settings.autoProgressMode);
            if (data.settings.universalProgress !== undefined) setUniversalProgress(data.settings.universalProgress);
            if (data.settings.modeSpecificProgress !== undefined) setModeSpecificProgress(data.settings.modeSpecificProgress);
            if (data.settings.enabledRelationModes !== undefined) setEnabledRelationModes(data.settings.enabledRelationModes);
          }
        }
      } else {
        // Load from localStorage if not logged in
        console.log('Loading from localStorage');
        const saved = localStorage.getItem('rft_local_progress');
        if (saved) {
          console.log('Found localStorage data');
          const data = JSON.parse(saved);
          if (data.score) setScore(data.score);
          if (data.history) setHistory(data.history);
          if (data.statsHistory) setStatsHistory(data.statsHistory);
          if (data.currentTrial) {
            setCurrentTrial(data.currentTrial);
            hasTrialData = true;
          }
          if (data.timeLeft !== undefined) setTimeLeft(data.timeLeft);
          if (data.feedback !== undefined) setFeedback(data.feedback);
          if (data.isPaused !== undefined) setIsPaused(data.isPaused);
          if (data.settings) {
            if (data.settings.difficulty !== undefined) setDifficulty(data.settings.difficulty);
            if (data.settings.timePerQuestion !== undefined) setTimePerQuestion(data.settings.timePerQuestion);
            if (data.settings.networkComplexity !== undefined) setNetworkComplexity(data.settings.networkComplexity);
            if (data.settings.spoilerPremises !== undefined) setSpoilerPremises(data.settings.spoilerPremises);
            if (data.settings.darkMode !== undefined) setDarkMode(data.settings.darkMode);
            // Backward compatibility: convert old useLetters to useRealWords
            if (data.settings.useLetters !== undefined) setUseRealWords(data.settings.useLetters);
            if (data.settings.useRealWords !== undefined) setUseRealWords(data.settings.useRealWords);
            if (data.settings.useNonsenseWords !== undefined) setUseNonsenseWords(data.settings.useNonsenseWords);
            if (data.settings.useRandomLetters !== undefined) setUseRandomLetters(data.settings.useRandomLetters);
            if (data.settings.useEmojis !== undefined) setUseEmojis(data.settings.useEmojis);
            if (data.settings.useVoronoi !== undefined) setUseVoronoi(data.settings.useVoronoi);
            if (data.settings.useMandelbrot !== undefined) setUseMandelbrot(data.settings.useMandelbrot);
            if (data.settings.useVibration !== undefined) setUseVibration(data.settings.useVibration);
            if (data.settings.letterLength !== undefined) setLetterLength(data.settings.letterLength);
            if (data.settings.autoProgressMode !== undefined) setAutoProgressMode(data.settings.autoProgressMode);
            if (data.settings.universalProgress !== undefined) setUniversalProgress(data.settings.universalProgress);
            if (data.settings.modeSpecificProgress !== undefined) setModeSpecificProgress(data.settings.modeSpecificProgress);
            if (data.settings.enabledRelationModes !== undefined) setEnabledRelationModes(data.settings.enabledRelationModes);
          }
        } else {
          console.log('No localStorage data found');
        }
      }
      return hasTrialData;
    } catch (error) {
      console.error('Error loading data:', error);
      return false;
    }
    // Intentionally empty dependencies - setState functions are stable
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Auto-save to storage whenever important state changes
  useEffect(() => {
    // Only save after initial load is complete
    if (isInitialized) {
      console.log('Auto-saving state to storage...');
      saveToStorage();
    }
  }, [isInitialized, currentTrial, timeLeft, feedback, isPaused, score, history, statsHistory,
      difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode,
      useRealWords, useNonsenseWords, useRandomLetters, useEmojis, useVoronoi, useMandelbrot, useVibration, letterLength,
      autoProgressMode, universalProgress, modeSpecificProgress, enabledRelationModes]);

  const resetGame = async () => {
    setShowResetConfirmation(false);

    // Define reset values
    const resetScore = { correct: 0, incorrect: 0, missed: 0 };
    const resetHistory = [];
    const resetStatsHistory = [];
    const resetDifficulty = 3;
    const resetTimePerQuestion = 30;
    const resetNetworkComplexity = 0.5;
    const resetSpoilerPremises = false;
    const resetDarkMode = false;
    const resetUseRealWords = true;
    const resetUseNonsenseWords = false;
    const resetUseRandomLetters = false;
    const resetUseEmojis = false;
    const resetUseVoronoi = false;
    const resetUseMandelbrot = false;
    const resetUseVibration = false;
    const resetLetterLength = 3;
    const resetAutoProgressMode = 'universal';
    const resetUniversalProgress = {
      targetPremiseCount: 40,
      targetAccuracy: 95,
      recentAnswers: []
    };
    const resetModeSpecificProgress = {
      equality: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      temporal: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      spatial: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      containment: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 },
      space3d: { targetPremiseCount: 40, targetAccuracy: 95, recentAnswers: [], currentDifficulty: 3, currentTime: 30 }
    };
    const resetEnabledRelationModes = {
      equality: true,
      temporal: false,
      spatial: false,
      containment: false,
      space3d: false
    };

    // Save reset data to storage immediately
    try {
      const resetData = {
        score: resetScore,
        history: resetHistory,
        statsHistory: resetStatsHistory,
        currentTrial: null,
        timeLeft: resetTimePerQuestion,
        feedback: null,
        isPaused: false,
        settings: {
          difficulty: resetDifficulty,
          timePerQuestion: resetTimePerQuestion,
          networkComplexity: resetNetworkComplexity,
          spoilerPremises: resetSpoilerPremises,
          darkMode: resetDarkMode,
          useRealWords: resetUseRealWords,
          useNonsenseWords: resetUseNonsenseWords,
          useRandomLetters: resetUseRandomLetters,
          useEmojis: resetUseEmojis,
          useVoronoi: resetUseVoronoi,
          useMandelbrot: resetUseMandelbrot,
          useVibration: resetUseVibration,
          letterLength: resetLetterLength,
          autoProgressMode: resetAutoProgressMode,
          universalProgress: resetUniversalProgress,
          modeSpecificProgress: resetModeSpecificProgress,
          enabledRelationModes: resetEnabledRelationModes
        }
      };

      if (user) {
        // Reset in Supabase for logged-in users
        console.log('Resetting data for logged-in user:', user.id);
        const progressData = {
          user_id: user.id,
          score: resetScore,
          history: resetHistory,
          stats_history: resetStatsHistory,
          current_trial: null,
          time_left: resetTimePerQuestion,
          feedback: null,
          is_paused: false,
          settings: resetData.settings,
          updated_at: new Date().toISOString()
        };

        // Use upsert to insert or update
        const { error } = await supabase
          .from('user_progress')
          .upsert(progressData, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (error) {
          console.error('Reset save to Supabase failed:', error);
        } else {
          console.log('Reset data successfully saved to Supabase');
        }
      } else {
        // Reset in localStorage for anonymous users
        console.log('Resetting data for anonymous user (localStorage)');
        localStorage.setItem('rft_local_progress', JSON.stringify(resetData));
      }
    } catch (error) {
      console.error('Reset failed:', error);
    }

    // Now update state
    setScore(resetScore);
    setHistory(resetHistory);
    setStatsHistory(resetStatsHistory);
    setDifficulty(resetDifficulty);
    setTimePerQuestion(resetTimePerQuestion);
    setNetworkComplexity(resetNetworkComplexity);
    setSpoilerPremises(resetSpoilerPremises);
    setDarkMode(resetDarkMode);
    setUseRealWords(resetUseRealWords);
    setUseNonsenseWords(resetUseNonsenseWords);
    setUseRandomLetters(resetUseRandomLetters);
    setUseEmojis(resetUseEmojis);
    setUseVoronoi(resetUseVoronoi);
    setUseMandelbrot(resetUseMandelbrot);
    setUseVibration(resetUseVibration);
    setLetterLength(resetLetterLength);
    setAutoProgressMode(resetAutoProgressMode);
    setUniversalProgress(resetUniversalProgress);
    setModeSpecificProgress(resetModeSpecificProgress);
    setEnabledRelationModes(resetEnabledRelationModes);

    startNewTrial();
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
      
      // Timer goes 3x faster if Mandelbrot is present and activated
      const speedMultiplier = (useMandelbrot && hasMandelbrot) ? 3 : 1;
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

  // Initial load on mount - only runs once
  useEffect(() => {
    const initializeGame = async () => {
      try {
        console.log('Initializing game...');
        const hasTrialData = await loadFromStorage();
        console.log('Storage loaded, hasTrialData:', hasTrialData);
        // Only start a new trial if there isn't one already loaded
        if (!hasTrialData) {
          console.log('No trial found, starting new one...');
          startNewTrial();
        } else {
          console.log('Trial loaded from storage, resuming...');
        }
        // Mark as initialized to enable auto-save
        setIsInitialized(true);
        console.log('Game initialized successfully');
      } catch (error) {
        console.error('Error initializing game:', error);
        // Still start a trial even if loading fails
        startNewTrial();
        setIsInitialized(true);
      }
    };
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reload data when user logs in or out
  useEffect(() => {
    if (user) {
      loadFromStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);
  
  const renderStimulus = (stimulus) => {
    if (stimulus.startsWith('voronoi_')) {
      return <div className="inline-block w-16 h-16 align-middle border-2 border-slate-300 rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: generateVoronoiSVG(parseInt(stimulus.split('_')[1])) }} />;
    }
    if (stimulus.startsWith('mandelbrot_')) {
      return <div className="inline-block w-16 h-16 align-middle border-2 border-slate-300 rounded-md overflow-hidden" dangerouslySetInnerHTML={{ __html: generateMandelbrotSVG(parseInt(stimulus.split('_')[1])) }} />;
    }
    if (stimulus.startsWith('vibration_')) {
      const patternIndex = parseInt(stimulus.split('_')[1]);
      return (
        <button
          onClick={(e) => {
            e.preventDefault();
            triggerVibration(stimulus);
          }}
          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold text-sm transition-all active:scale-95 ${
            darkMode
              ? 'bg-pink-900/40 text-pink-300 border-2 border-pink-500 hover:bg-pink-900/60 active:bg-pink-900/80'
              : 'bg-pink-100 text-pink-700 border-2 border-pink-300 hover:bg-pink-200 active:bg-pink-300'
          }`}
          title={`Vibration Pattern ${patternIndex} - ${vibrationPatterns[patternIndex]?.join(', ')}ms`}
        >
          📳 V{patternIndex}
        </button>
      );
    }
    const isEmoji = emojiList.includes(stimulus);
    return <span className={`font-bold ${isEmoji ? 'text-3xl' : ''} ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{stimulus}</span>;
  };

  const triggerVibration = (stimulus) => {
    // Extract pattern index from stimulus (e.g., "vibration_3" -> 3)
    if (stimulus && stimulus.startsWith('vibration_')) {
      const patternIndex = parseInt(stimulus.split('_')[1]);
      const pattern = vibrationPatterns[patternIndex];

      console.log('🔔 Vibration triggered:', {
        stimulus,
        patternIndex,
        pattern,
        hasVibrateAPI: 'vibrate' in navigator,
        userAgent: navigator.userAgent
      });

      if ('vibrate' in navigator) {
        if (pattern) {
          const success = navigator.vibrate(pattern);
          console.log('📳 Vibrate called, success:', success);
        } else {
          console.warn('⚠️ No pattern found for index:', patternIndex);
        }
      } else {
        console.warn('⚠️ Vibration API not supported on this device/browser');
        console.log('💡 Tip: Vibration only works on mobile browsers (Android Chrome, Firefox, etc.)');
      }
    }
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
      if (relation === 'ABOVE' || relation === 'BELOW' || relation.startsWith('ABOVE_') || relation.startsWith('BELOW_')) {
        return 'bg-indigo-900/40 text-indigo-300 border-indigo-500';
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
    if (relation === 'ABOVE' || relation === 'BELOW' || relation.startsWith('ABOVE_') || relation.startsWith('BELOW_')) {
      return 'bg-indigo-100 text-indigo-700 border-indigo-300';
    }
    return 'bg-blue-100 text-blue-700 border-blue-300';
  };

  // Format relation for display (e.g., "ABOVE_NORTH" -> "ABOVE and NORTH")
  const formatRelation = (relation) => {
    if (relation.startsWith('ABOVE_')) {
      return `ABOVE and ${relation.substring(6)}`;
    }
    if (relation.startsWith('BELOW_')) {
      return `BELOW and ${relation.substring(6)}`;
    }
    return relation;
  };

  // Render relation with separate styling for vertical and horizontal components
  const renderRelationStyled = (relation, size = 'sm') => {
    const sizeClasses = size === 'lg' ? 'px-3 sm:px-4 py-1 sm:py-2 text-sm sm:text-base' : 'px-2 py-1 text-xs';

    if (relation.startsWith('ABOVE_')) {
      const horizontal = relation.substring(6);
      return (
        <>
          <span className={`font-bold rounded border ${darkMode ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500' : 'bg-indigo-100 text-indigo-700 border-indigo-300'} ${sizeClasses}`}>ABOVE</span>
          <span className={`mx-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>and</span>
          <span className={`font-bold rounded border ${darkMode ? 'bg-teal-900/40 text-teal-300 border-teal-500' : 'bg-teal-100 text-teal-700 border-teal-300'} ${sizeClasses}`}>{horizontal}</span>
        </>
      );
    }
    if (relation.startsWith('BELOW_')) {
      const horizontal = relation.substring(6);
      return (
        <>
          <span className={`font-bold rounded border ${darkMode ? 'bg-indigo-900/40 text-indigo-300 border-indigo-500' : 'bg-indigo-100 text-indigo-700 border-indigo-300'} ${sizeClasses}`}>BELOW</span>
          <span className={`mx-1 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>and</span>
          <span className={`font-bold rounded border ${darkMode ? 'bg-teal-900/40 text-teal-300 border-teal-500' : 'bg-teal-100 text-teal-700 border-teal-300'} ${sizeClasses}`}>{horizontal}</span>
        </>
      );
    }
    return <span className={`font-bold rounded border ${getRelationColor(relation)} ${sizeClasses}`}>{relation}</span>;
  };

  // Render 3D grid visualization for spatial relations
  const renderSpatialGrid = (trial, size = 'small') => {
    if (!trial || !trial.premises) return null;

    const mode = getRelationMode(trial.question.relation);
    if (mode !== 'spatial' && mode !== 'space3d') return null;

    // Calculate positions for all objects based on all premises
    const positions = {}; // stimulus -> { v: vertical, h: horizontal, row: number, col: number }

    // Start with the first premise's SECOND stimulus at origin (0,0)
    // No fixed reference point - build dynamically from premises
    const firstStimulus = trial.premises[0].stimulus2;
    positions[firstStimulus] = { v: 'CENTER', h: 'CENTER', row: 0, col: 0, vLevel: 0 };

    // Helper to get row/col offset from direction
    // "X is NORTH of Y" means X is positioned north (above) of Y
    // Grid layout: row 0 is top, col 0 is left
    const getOffset = (direction) => {
      const offsets = {
        'NORTH': [-1, 0],   // X is above Y (decrease row)
        'SOUTH': [1, 0],    // X is below Y (increase row)
        'EAST': [0, 1],     // X is right of Y (increase col)
        'WEST': [0, -1],    // X is left of Y (decrease col)
        'NORTHEAST': [-1, 1],   // X is above-right of Y
        'NORTHWEST': [-1, -1],  // X is above-left of Y
        'SOUTHEAST': [1, 1],    // X is below-right of Y
        'SOUTHWEST': [1, -1],   // X is below-left of Y
        'CENTER': [0, 0]
      };
      return offsets[direction] || [0, 0];
    };

    const getVerticalLevel = (v) => {
      if (v === 'ABOVE') return 1;
      if (v === 'BELOW') return -1;
      return 0;
    };

    // Parse 3D relation
    const parse3D = (rel) => {
      if (rel === 'AT') return { v: 'CENTER', h: 'CENTER' };
      if (rel === 'ABOVE') return { v: 'ABOVE', h: 'CENTER' };
      if (rel === 'BELOW') return { v: 'BELOW', h: 'CENTER' };
      if (rel.startsWith('ABOVE_')) return { v: 'ABOVE', h: rel.substring(6) };
      if (rel.startsWith('BELOW_')) return { v: 'BELOW', h: rel.substring(6) };
      return { v: 'CENTER', h: rel };
    };

    // Process all premises to calculate positions
    // "X is DIRECTION of Y" means X is at position (Y + direction_offset)
    for (const premise of trial.premises) {
      const { v, h } = parse3D(premise.relation);
      const [rowOffset, colOffset] = getOffset(h);
      const vLevel = getVerticalLevel(v);

      if (positions[premise.stimulus2]) {
        // We know stimulus2 (reference point), calculate stimulus1 (the positioned object)
        // "X is ABOVE_WEST of Y" means X = Y + (ABOVE_WEST offset)
        const pos2 = positions[premise.stimulus2];
        positions[premise.stimulus1] = {
          v: v,
          h: h,
          row: pos2.row + rowOffset,
          col: pos2.col + colOffset,
          vLevel: pos2.vLevel + vLevel
        };
      } else if (positions[premise.stimulus1]) {
        // We know stimulus1, calculate stimulus2 (reverse the relation)
        // If "X is ABOVE_WEST of Y" and we know X, then Y = X - (ABOVE_WEST offset)
        const pos1 = positions[premise.stimulus1];
        positions[premise.stimulus2] = {
          v: v === 'ABOVE' ? 'BELOW' : v === 'BELOW' ? 'ABOVE' : 'CENTER',
          h: h,
          row: pos1.row - rowOffset,
          col: pos1.col - colOffset,
          vLevel: pos1.vLevel - vLevel
        };
      }
    }

    const is3D = mode === 'space3d';
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-cyan-500', 'bg-yellow-500', 'bg-red-500'];
    const stimuliList = Object.keys(positions);

    // Create a mapping from stimulus to number (1-indexed)
    const stimulusToNumber = {};
    stimuliList.forEach((stimulus, index) => {
      stimulusToNumber[stimulus] = index + 1;
    });

    // Cell size based on context
    const cellSize = size === 'large' ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-8 h-8 sm:w-10 sm:h-10';
    const textSize = size === 'large' ? 'text-sm sm:text-base' : 'text-[10px]';
    const gapSize = size === 'large' ? 'gap-1' : 'gap-0.5';

    // Calculate global bounds across ALL positions (all vertical levels)
    const allPositions = Object.values(positions);
    if (allPositions.length === 0) return null;

    const allRows = allPositions.map(p => p.row);
    const allCols = allPositions.map(p => p.col);
    const globalMinRow = Math.min(...allRows);
    const globalMaxRow = Math.max(...allRows);
    const globalMinCol = Math.min(...allCols);
    const globalMaxCol = Math.max(...allCols);

    // Build grid arrays to cover the global range
    const gridRows = [];
    for (let r = globalMinRow; r <= globalMaxRow; r++) {
      gridRows.push(r);
    }
    const gridCols = [];
    for (let c = globalMinCol; c <= globalMaxCol; c++) {
      gridCols.push(c);
    }
    const numCols = gridCols.length;

    // Render a grid for a specific vertical level using global bounds
    const render2DGrid = (vLevelNum) => {
      // Find objects at this vertical level
      const objectsHere = {};
      for (const [stimulus, pos] of Object.entries(positions)) {
        if (pos.vLevel === vLevelNum) {
          const key = `${pos.row},${pos.col}`;
          if (!objectsHere[key]) objectsHere[key] = [];
          objectsHere[key].push(stimulus);
        }
      }

      return (
        <div className={`flex flex-col ${gapSize}`}>
          <div className={`grid ${gapSize}`} style={{ gridTemplateColumns: `repeat(${numCols}, minmax(0, 1fr))` }}>
            {gridRows.map(row =>
              gridCols.map(col => {
                const key = `${row},${col}`;
                const objectsInCell = objectsHere[key] || [];

                return (
                  <div
                    key={`${row}-${col}`}
                    className={`${cellSize} flex items-center justify-center ${textSize} border rounded ${
                      objectsInCell.length > 0 ? (darkMode ? `${colors[stimuliList.indexOf(objectsInCell[0]) % colors.length]} border-slate-300 font-bold text-white` : `${colors[stimuliList.indexOf(objectsInCell[0]) % colors.length]} border-slate-600 font-bold text-white`) :
                      (darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-300')
                    }`}
                  >
                    {objectsInCell.map((stimulus, i) => (
                      <span key={i} className={`${textSize} font-bold`}>
                        {size === 'large' ? stimulusToNumber[stimulus] : renderStimulus(stimulus)}
                      </span>
                    ))}
                  </div>
                );
              })
            )}
          </div>
        </div>
      );
    };

    const levelGap = size === 'large' ? 'gap-4' : 'gap-2';

    // Render object legend (only for large size in explanation modal)
    const renderLegend = () => {
      if (size !== 'large') return null;

      return (
        <div className={`mb-4 p-3 rounded-lg ${darkMode ? 'bg-slate-700/50' : 'bg-slate-100'}`}>
          <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Objects:</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {stimuliList.map((stimulus, index) => (
              <div key={stimulus} className="flex items-center gap-2">
                <div className={`w-8 h-8 flex items-center justify-center rounded border-2 font-bold text-white ${colors[index % colors.length]} ${darkMode ? 'border-slate-300' : 'border-slate-600'}`}>
                  {index + 1}
                </div>
                <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  {renderStimulus(stimulus)}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    };

    if (is3D) {
      // Get all unique vertical levels and sort them (highest to lowest)
      const verticalLevels = [...new Set(Object.values(positions).map(p => p.vLevel))].sort((a, b) => b - a);

      return (
        <div className="w-full">
          {renderLegend()}
          <div className={`flex flex-col ${levelGap} items-center`}>
            {verticalLevels.map(vLevel => (
              <div key={vLevel}>
                {render2DGrid(vLevel)}
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full">
          {renderLegend()}
          {render2DGrid(0)}
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      


      {showTutorial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>How to Play</h2>
              <button onClick={() => setShowTutorial(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className={`space-y-3 sm:space-y-4 text-sm sm:text-base ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <p>
                <strong className={darkMode ? 'text-indigo-300' : 'text-indigo-600'}>Relational Frame Training</strong> helps you practice deriving logical relationships between stimuli.
              </p>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Game Rules:</h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li>You will be given several <strong>premises</strong> that establish relationships between stimuli</li>
                  <li>Based on these premises, you must answer whether a <strong>question relationship</strong> is true</li>
                  <li>Answer <strong>YES</strong> if the relationship follows from the premises</li>
                  <li>Answer <strong>NO</strong> if the relationship contradicts the premises</li>
                  <li>Answer <strong>CAN'T TELL</strong> if there is insufficient information or contradictions</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Relation Types:</h3>
                <ul className="list-disc pl-5 sm:pl-6 space-y-1 sm:space-y-2">
                  <li><strong>Equality:</strong> SAME (identical), OPPOSITE (inverse), DIFFERENT (distinct)</li>
                  <li><strong>Temporal:</strong> BEFORE, AFTER, AT (time relationships)</li>
                  <li><strong>Spatial:</strong> NORTH, SOUTH, EAST, WEST, etc. (directional)</li>
                  <li><strong>Containment:</strong> CONTAINS, WITHIN (hierarchical relationships)</li>
                  <li><strong>Space 3D:</strong> ABOVE, BELOW, ABOVE_NORTH, BELOW_SOUTH, etc. (3D positioning)</li>
                </ul>
              </div>
              <div className="hidden sm:block">
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Keyboard Shortcuts:</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>1</kbd> - Answer YES</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>2</kbd> - Answer NO</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>3</kbd> - Answer CAN'T TELL</li>
                  <li><kbd className={`px-2 py-1 rounded ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>Space</kbd> - Pause/Resume</li>
                </ul>
              </div>
              <div>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Example:</h3>
                <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
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
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Tips:</h3>
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

      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                <Mail className="w-6 h-6 sm:w-8 sm:h-8" />
                Contact Us
              </h2>
              <button onClick={() => setShowContactModal(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className={`space-y-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <div className="text-center">
                <p className={`text-lg sm:text-xl mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  If you have any questions or requests, feel free to contact us.
                </p>
              </div>

              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'border-blue-500 bg-blue-900/20' : 'border-blue-300 bg-blue-50'}`}>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Email Address
                </h3>
                <a
                  href="mailto:stimlus44@gmail.com"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors text-lg ${darkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                >
                  <Mail className="w-5 h-5" />
                  stimlus44@gmail.com
                </a>
                <p className={`mt-4 text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Click to open in your email client, or copy the address above.
                </p>
              </div>

              <button
                onClick={() => setShowContactModal(false)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-700/80 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showAboutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                <Users className="w-6 h-6 sm:w-8 sm:h-8" />
                About Us
              </h2>
              <button onClick={() => setShowAboutModal(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className={`space-y-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <div className="text-center">
                <p className={`text-lg sm:text-xl mb-4 ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                  We are a team of like-minded people who share the same goal of helping people to increase their intelligence.
                </p>
              </div>

              <div className={`p-6 rounded-lg border-2 ${darkMode ? 'border-indigo-500 bg-indigo-900/20' : 'border-indigo-300 bg-indigo-50'}`}>
                <h3 className={`text-lg font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                  Join Our Community
                </h3>
                <p className={`mb-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  If you aren't already in our Discord server, join now to stay tuned to the latest research:
                </p>
                <a
                  href="https://discord.gg/cogn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                >
                  <svg width="24" height="24" viewBox="0 0 71 55" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60.1045 4.8978C55.5792 2.8214 50.7265 1.2916 45.6527 0.41542C45.5603 0.39851 45.468 0.440769 45.4204 0.525289C44.7963 1.6353 44.105 3.0834 43.6209 4.2216C38.1637 3.4046 32.7345 3.4046 27.3892 4.2216C26.905 3.0581 26.1886 1.6353 25.5617 0.525289C25.5141 0.443589 25.4218 0.40133 25.3294 0.41542C20.2584 1.2888 15.4057 2.8186 10.8776 4.8978C10.8384 4.9147 10.8048 4.9429 10.7825 4.9795C1.57795 18.7309 -0.943561 32.1443 0.293408 45.3914C0.299005 45.4562 0.335386 45.5182 0.385761 45.5576C6.45866 50.0174 12.3413 52.7249 18.1147 54.5195C18.2071 54.5477 18.305 54.5139 18.3638 54.4378C19.7295 52.5728 20.9469 50.6063 21.9907 48.5383C22.0523 48.4172 21.9935 48.2735 21.8676 48.2256C19.9366 47.4931 18.0979 46.6 16.3292 45.5858C16.1893 45.5041 16.1781 45.304 16.3068 45.2082C16.679 44.9293 17.0513 44.6391 17.4067 44.3461C17.471 44.2926 17.5606 44.2813 17.6362 44.3151C29.2558 49.6202 41.8354 49.6202 53.3179 44.3151C53.3935 44.2785 53.4831 44.2898 53.5502 44.3433C53.9057 44.6363 54.2779 44.9293 54.6529 45.2082C54.7816 45.304 54.7732 45.5041 54.6333 45.5858C52.8646 46.6197 51.0259 47.4931 49.0921 48.2228C48.9662 48.2707 48.9102 48.4172 48.9718 48.5383C50.038 50.6034 51.2554 52.5699 52.5959 54.435C52.6519 54.5139 52.7526 54.5477 52.845 54.5195C58.6464 52.7249 64.529 50.0174 70.6019 45.5576C70.6551 45.5182 70.6887 45.459 70.6943 45.3942C72.1747 30.0791 68.2147 16.7757 60.1968 4.9823C60.1772 4.9429 60.1437 4.9147 60.1045 4.8978ZM23.7259 37.3253C20.2276 37.3253 17.3451 34.1136 17.3451 30.1693C17.3451 26.225 20.1717 23.0133 23.7259 23.0133C27.308 23.0133 30.1626 26.2532 30.1066 30.1693C30.1066 34.1136 27.28 37.3253 23.7259 37.3253ZM47.3178 37.3253C43.8196 37.3253 40.9371 34.1136 40.9371 30.1693C40.9371 26.225 43.7636 23.0133 47.3178 23.0133C50.9 23.0133 53.7545 26.2532 53.6986 30.1693C53.6986 34.1136 50.9 37.3253 47.3178 37.3253Z"/>
                  </svg>
                  Join Discord Server
                </a>
              </div>

              <button
                onClick={() => setShowAboutModal(false)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-700/80 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showSupportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-2xl w-full rounded-2xl p-6 sm:p-8 shadow-2xl ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className={`text-2xl sm:text-3xl font-bold flex items-center gap-2 ${darkMode ? 'text-pink-400' : 'text-pink-600'}`}>
                <Heart className="w-6 h-6 sm:w-8 sm:h-8 fill-current" />
                Support Us!
              </h2>
              <button onClick={() => setShowSupportModal(false)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className={`space-y-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              <div className="text-center">
                <p className={`text-xl sm:text-2xl font-semibold mb-4 ${darkMode ? 'text-pink-300' : 'text-pink-700'}`}>
                  Thank you so much for supporting us!
                </p>
                <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Your support helps us keep this training tool free and continuously improve it for everyone.
                </p>
              </div>

              {/* Placeholder for Google AdSense */}
              <div className={`border-2 border-dashed rounded-lg p-12 min-h-[280px] flex flex-col items-center justify-center text-center ${darkMode ? 'border-slate-600 bg-slate-700/50' : 'border-slate-300 bg-slate-50'}`}>
                <p className={`text-base ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                  Advertisement space
                </p>
                <p className={`text-sm mt-3 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                  (Google AdSense will be displayed here)
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-pink-50'}`}>
                <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  💡 <strong>Did you know?</strong> This training tool helps improve cognitive flexibility and relational reasoning skills, which are valuable for learning, problem-solving, and academic success.
                </p>
              </div>

              <button
                onClick={() => setShowSupportModal(false)}
                className={`w-full py-3 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-pink-600 hover:bg-pink-700 text-white' : 'bg-pink-500 hover:bg-pink-600 text-white'}`}
              >
                Continue Training
              </button>
            </div>
          </div>
        </div>
      )}

      {showExplanationModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4">
          <div className={`max-w-4xl w-full rounded-2xl p-4 sm:p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-slate-50' : 'text-slate-800'}`}>Spatial Explanation</h2>
              <button onClick={() => setShowExplanationModal(null)} className={`p-2 rounded-lg ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-6 sm:h-6 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className={`space-y-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
              {(() => {
                const item = history.find(h => h.timestamp === showExplanationModal);
                if (!item) return null;
                return (
                  <>
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Premises:</h3>
                      <div className="space-y-1">
                        {item.trial.premises.map((premise, pidx) => (
                          <div key={pidx} className={`text-sm flex items-center gap-1 flex-wrap ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            {renderStimulus(premise.stimulus1)} is {renderRelationStyled(premise.relation, 'sm')} to {renderStimulus(premise.stimulus2)}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Visual Representation:
                        {getRelationMode(item.trial.question.relation) === 'space3d' && (
                          <span className={`ml-2 text-xs font-normal ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            (3D Space - Vertical levels stack top to bottom. Directions remain consistent across levels.)
                          </span>
                        )}
                      </h3>
                      <div className={`flex justify-center p-4 sm:p-6 rounded-lg ${darkMode ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
                        {renderSpatialGrid(item.trial, 'large')}
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Question:</h3>
                      <div className={`text-sm font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                        Is {renderStimulus(item.trial.question.stimulus1)} {renderRelationStyled(item.trial.question.relation, 'sm')} to {renderStimulus(item.trial.question.stimulus2)}?
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${item.isCorrect ? (darkMode ? 'bg-green-900/20 border-2 border-green-500/50' : 'bg-green-50 border-2 border-green-300') : (darkMode ? 'bg-red-900/20 border-2 border-red-500/50' : 'bg-red-50 border-2 border-red-300')}`}>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="font-semibold">Your answer:</span> <span className={item.isCorrect ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-red-400' : 'text-red-700')}>{getAnswerLabel(item.userAnswer)}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Correct answer:</span> <span className={darkMode ? 'text-green-400' : 'text-green-700'}>{getAnswerLabel(item.trial.correctAnswer)}</span>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {(showHistory || showStats) && (
        <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => { setShowHistory(false); setShowStats(false); }} />
      )}

      <div className={`${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showHistory ? 'fixed sm:relative inset-y-0 left-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showHistory && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <History className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-slate-50' : 'text-slate-800'}`}>History</h2>
              </div>
              <button onClick={() => setShowHistory(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3">
              {history.length === 0 ? (
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No questions answered yet</p>
              ) : (
                history.slice().reverse().map((item, idx) => (
                  <div key={item.timestamp} className={`p-2.5 sm:p-3 rounded-lg border-2 ${darkMode ? (item.isCorrect ? 'border-green-500/50 bg-green-900/20' : 'border-red-500/50 bg-red-900/20') : (item.isCorrect ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50')}`}>
                    <div className={`text-xs font-semibold mb-1.5 sm:mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                      Question #{history.length - idx} • {item.timeUsed.toFixed(1)}s
                    </div>
                    <div className="mb-1.5 sm:mb-2 text-xs space-y-0.5 sm:space-y-1">
                      {item.trial.premises.map((premise, pidx) => (
                        <div key={pidx} className={`flex items-center gap-1 flex-wrap ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                          {renderStimulus(premise.stimulus1)} is {renderRelationStyled(premise.relation, 'sm')} to {renderStimulus(premise.stimulus2)}
                        </div>
                      ))}
                    </div>
                    {(getRelationMode(item.trial.question.relation) === 'spatial' || getRelationMode(item.trial.question.relation) === 'space3d') && (
                      <div className="mb-2">
                        <button
                          onClick={() => setShowExplanationModal(item.timestamp)}
                          className={`w-full px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-indigo-500 hover:bg-indigo-600 text-white'}`}
                        >
                          Show Explanation
                        </button>
                      </div>
                    )}
                    <div className={`text-xs sm:text-sm mb-1.5 sm:mb-2 font-semibold flex items-center gap-1 flex-wrap ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                      Is {renderStimulus(item.trial.question.stimulus1)} {renderRelationStyled(item.trial.question.relation, 'sm')} to {renderStimulus(item.trial.question.stimulus2)}?
                    </div>
                    <div className="text-xs space-y-0.5 sm:space-y-1">
                      <div className={darkMode ? 'text-slate-200' : 'text-slate-700'}>
                        <span className="font-semibold">Your answer:</span> <span className={item.isCorrect ? (darkMode ? 'text-green-400' : 'text-green-700') : (darkMode ? 'text-red-400' : 'text-red-700')}>{getAnswerLabel(item.userAnswer)}</span>
                      </div>
                      <div className={darkMode ? 'text-slate-200' : 'text-slate-700'}>
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

      <div className={`${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showStats ? 'fixed sm:relative inset-y-0 left-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showStats && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <TrendingUp className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-slate-50' : 'text-slate-800'}`}>Statistics</h2>
              </div>
              <button onClick={() => setShowStats(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              {statsHistory.length === 0 ? (
                <p className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No statistics yet</p>
              ) : (
                <>
                  <div className={`p-3 sm:p-4 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Overall</h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Total Questions:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{statsHistory.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Accuracy:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                          {((statsHistory.filter(s => s.isCorrect).length / statsHistory.length) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Time:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                          {(statsHistory.reduce((sum, s) => sum + s.timeUsed, 0) / statsHistory.length).toFixed(1)}s
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Avg Premises:</span>
                        <span className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                          {(statsHistory.reduce((sum, s) => sum + s.premiseCount, 0) / statsHistory.length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Time per Question (Last 20)</h3>
                    <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
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
                      <div className={`text-xs text-center mt-1.5 sm:mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Questions (most recent →)</div>
                    </div>
                  </div>

                  <div>
                    <h3 className={`text-xs sm:text-sm font-semibold mb-2 sm:mb-3 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Premise Count (Last 20)</h3>
                    <div className={`p-2 sm:p-3 rounded-lg ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
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
                      <div className={`text-xs text-center mt-1.5 sm:mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Questions (most recent →)</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <div className={`shadow-md p-2 sm:p-3 transition-colors duration-300 ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm/90 backdrop-blur' : 'bg-white'}`}>
          {/* Buttons at top - left and right sides */}
          <div className="flex justify-between items-start gap-2 mb-3">
            {/* Left side buttons */}
            <div className="flex flex-wrap gap-2 justify-start">
              <button onClick={() => setShowHistory(!showHistory)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-slate-900'}`}>
                <History className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">History</span>
              </button>

              <button onClick={() => setShowStats(!showStats)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-purple-900/50 hover:bg-purple-900/70 text-purple-200' : 'bg-purple-100 hover:bg-purple-200 text-slate-900'}`}>
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Stats</span>
              </button>

              <button onClick={() => setShowTutorial(true)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-cyan-900/50 hover:bg-cyan-900/70 text-cyan-200' : 'bg-cyan-100 hover:bg-cyan-200 text-slate-900'}`}>
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Help</span>
              </button>

              {user ? (
                <button onClick={onLogout} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-red-900/50 hover:bg-red-900/70 text-red-200' : 'bg-red-100 hover:bg-red-200 text-slate-900'}`} title={`Logged in as ${user.username}`}>
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">{user.username}</span>
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4 ml-0.5" />
                </button>
              ) : (
                <button onClick={onShowLogin} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-green-900/50 hover:bg-green-900/70 text-green-200' : 'bg-green-100 hover:bg-green-200 text-slate-900'}`}>
                  <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline">Login</span>
                </button>
              )}
            </div>

            {/* Right side buttons */}
            <div className="flex flex-wrap gap-2 justify-end">
              <button
                onClick={() => {
                  console.log('Settings button clicked, current state:', showSettings);
                  setShowSettings(prev => !prev);
                }}
                className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-slate-900'}`}
              >
                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Settings</span>
              </button>
              <button onClick={() => setShowAboutModal(true)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-indigo-900/50 hover:bg-indigo-900/70 text-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200 text-slate-900'}`}>
                <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">About Us</span>
              </button>
              <button onClick={() => setShowContactModal(true)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-blue-900/50 hover:bg-blue-900/70 text-blue-200' : 'bg-blue-100 hover:bg-blue-200 text-slate-900'}`}>
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Contact</span>
              </button>
              <button onClick={() => setShowSupportModal(true)} className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors text-sm sm:text-base ${darkMode ? 'bg-pink-900/50 hover:bg-pink-900/70 text-pink-200' : 'bg-pink-100 hover:bg-pink-200 text-slate-900'}`}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Support Us</span>
              </button>
            </div>
          </div>

          {/* Timer centered */}
          <div className="flex justify-center items-center mb-2">
            <div className="text-center">
              <div className={`text-2xl sm:text-4xl font-bold tabular-nums ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>{timeLeft.toFixed(1)}s</div>
              <div className={`text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Time</div>
            </div>
          </div>

          {/* Play/Pause button centered below timer */}
          <div className="flex justify-center items-center mb-2">
            <button onClick={togglePause} className={`text-white p-3 sm:p-4 rounded-xl transition-colors shadow-lg ${isPaused ? 'bg-green-500 hover:bg-green-600' : (darkMode ? 'bg-yellow-600 hover:bg-yellow-700' : 'bg-yellow-500 hover:bg-yellow-600')}`} title="Pause/Resume">
              {isPaused ? <Play className="w-6 h-6 sm:w-8 sm:h-8" /> : <Pause className="w-6 h-6 sm:w-8 sm:h-8" />}
            </button>
          </div>

          <div className="flex gap-2 sm:gap-4 justify-center sm:justify-start">
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{score.correct}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Correct</div>
            </div>
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-red-400' : 'text-red-600'}`}>{score.incorrect}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Incorrect</div>
            </div>
            <div className="text-center">
              <div className={`text-base sm:text-xl font-bold ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{score.missed}</div>
              <div className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Missed</div>
            </div>
          </div>
        </div>

        <div className={`shadow-sm p-1 sm:p-2 transition-colors duration-300 ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm/50' : 'bg-white'}`}>
          <div className={`h-2 sm:h-3 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
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
              <div className={`rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-8 transition-colors duration-300 ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm/90 backdrop-blur' : 'bg-white'}`}>
                <h3 className={`text-xs sm:text-sm font-semibold uppercase tracking-wide mb-3 sm:mb-4 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Given:</h3>
                <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                  {currentTrial.premises.map((premise, idx) => {
                    const mode = getRelationMode(premise.relation);
                    const preposition = mode === 'equality' ? 'to' : mode === 'containment' ? '' : mode === 'temporal' ? '' : 'of';
                    return (
                      <div key={idx} className={`relative flex items-center justify-center text-base sm:text-xl p-3 sm:p-4 rounded-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-700/50' : 'bg-slate-50'}`} onMouseEnter={() => spoilerPremises && setHoveredPremise(idx)} onMouseLeave={() => spoilerPremises && setHoveredPremise(null)}>
                        <div className="relative z-0 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                          {renderStimulus(premise.stimulus1)}
                          {premise.relation === 'CONTAINS' ? (
                            <>
                              <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>CONTAINS</span>
                              {renderStimulus(premise.stimulus2)}
                            </>
                          ) : premise.relation === 'WITHIN' ? (
                            <>
                              <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>is</span>
                              <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>WITHIN</span>
                              {renderStimulus(premise.stimulus2)}
                            </>
                          ) : (
                            <>
                              <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>is</span>
                              {renderRelationStyled(premise.relation, 'lg')}
                              {preposition && <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{preposition}</span>}
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
                  <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Question:</h3>
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
                            <span className="mx-1 sm:mx-2">{renderRelationStyled(rel, 'lg')}</span>
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
                      <button onClick={() => handleAnswer('ambiguous')} className={`w-full px-6 py-3 sm:py-4 text-white text-lg sm:text-xl font-bold rounded-xl transition-all transform active:scale-95 sm:hover:scale-105 ${darkMode ? 'bg-slate-600 hover:bg-slate-700/80 shadow-lg shadow-slate-900/50' : 'bg-slate-500 hover:bg-gray-600'}`}>
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
        <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
      )}

      <div className={`${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'} shadow-xl transition-all duration-300 overflow-hidden ${showSettings ? 'fixed inset-y-0 right-0 w-[90vw] sm:w-96 z-50' : 'w-0'}`}>
        {showSettings && (
          <div className="h-full flex flex-col p-3 sm:p-4">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center">
                <Settings className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`} />
                <h2 className={`text-base sm:text-lg font-bold ${darkMode ? 'text-slate-50' : 'text-slate-800'}`}>Settings</h2>
              </div>
              <button onClick={() => setShowSettings(false)} className={`p-1.5 sm:p-1 rounded ${darkMode ? 'hover:bg-slate-700/80' : 'hover:bg-slate-100'}`}>
                <X className={`w-5 h-5 sm:w-4 sm:h-4 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Dark Mode</label>
                <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between">
                  <div className={`relative w-14 h-7 rounded-full transition-colors ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white rounded-full transition-transform shadow-md ${darkMode ? 'transform translate-x-7' : ''}`}></div>
                  </div>
                  <span className={`text-sm font-medium ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>{darkMode ? 'Enabled' : 'Disabled'}</span>
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
                  <p className={`mb-4 text-sm ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
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
                      className={`flex-1 px-4 py-2 rounded-lg font-semibold transition-colors ${darkMode ? 'bg-slate-600 hover:bg-slate-700/80 text-white' : 'bg-slate-300 hover:bg-slate-400 text-slate-800'}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                <button onClick={() => setShowResetConfirmation(true)} className={`w-full px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${darkMode ? 'bg-red-900/50 hover:bg-red-900/70 text-red-200' : 'bg-red-100 hover:bg-red-200 text-red-700'}`}>
                  <RotateCcw className="w-4 h-4" />
                  <span className="font-semibold">Reset All to Default</span>
                </button>
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Relation Modes</h3>
                <p className={`text-xs mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Enable one or more relation types to use in training</p>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.equality} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, equality: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Equality (SAME, OPPOSITE, DIFFERENT)</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.temporal} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, temporal: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Temporal (BEFORE, AFTER, AT)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={enabledRelationModes.spatial} 
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, spatial: e.target.checked }))} 
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Space 2D (NORTH, SOUTH, EAST, WEST, etc.)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledRelationModes.containment}
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, containment: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Containment (CONTAINS, WITHIN)</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enabledRelationModes.space3d}
                      onChange={(e) => setEnabledRelationModes(prev => ({ ...prev, space3d: e.target.checked }))}
                      className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500"
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Space 3D (ABOVE, BELOW, ABOVE_NORTH, etc.)</span>
                  </label>

                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Premise Count</label>
                <input type="number" min="2" max="20" value={difficulty} onChange={(e) => setDifficulty(Math.max(2, parseInt(e.target.value) || 2))} className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} />
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Stimulus Display</h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useRealWords} onChange={(e) => setUseRealWords(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Real Words</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useNonsenseWords} onChange={(e) => setUseNonsenseWords(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Nonsense Words</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useRandomLetters} onChange={(e) => setUseRandomLetters(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Random Letters</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useEmojis} onChange={(e) => setUseEmojis(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Emojis 🎨</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useVoronoi} onChange={(e) => setUseVoronoi(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Use Voronoi Patterns</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useMandelbrot} onChange={(e) => setUseMandelbrot(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Use Mandelbrot Fractals</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={useVibration} onChange={(e) => setUseVibration(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Use Vibration Patterns 📳 (Mobile only)</span>
                  </label>

                  <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    Select one or more types. Stimuli will be randomly chosen from selected types.
                  </p>

                  {(useRealWords || useNonsenseWords || useRandomLetters) && (
                    <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Word Length: {letterLength}</label>
                      <input type="range" min="1" max="20" value={letterLength} onChange={(e) => setLetterLength(parseInt(e.target.value))} className="w-full accent-indigo-600" />
                      <input type="number" min="1" max="20" value={letterLength} onChange={(e) => setLetterLength(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} />
                      <p className={`text-xs mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        Real words use dictionary words (1-4 letters). Nonsense words are random letters that don't form real words. Random letters are completely uncensored with no filtering.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Time Per Question (seconds): {timePerQuestion.toFixed(1)}</label>
                <input type="range" min="5" max="120" step="0.5" value={timePerQuestion} onChange={(e) => setTimePerQuestion(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                <input type="number" min="5" max="120" step="0.5" value={timePerQuestion} onChange={(e) => setTimePerQuestion(Math.max(5, parseFloat(e.target.value) || 5))} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Network Complexity: {networkComplexity.toFixed(2)}</label>
                <input type="range" min="0" max="1" step="0.01" value={networkComplexity} onChange={(e) => setNetworkComplexity(parseFloat(e.target.value))} className="w-full accent-indigo-600" />
                <p className={`text-xs mt-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Probability of resolving ambiguous relationships</p>
              </div>

              <div className={`border-t pt-4 ${darkMode ? 'border-slate-600' : 'border-slate-200'}`}>
                <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>Auto-Progression</h3>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'off'} 
                      onChange={() => setAutoProgressMode('off')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Off</span>
                  </label>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'universal'} 
                      onChange={() => setAutoProgressMode('universal')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Universal Auto-Progression</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="radio" 
                      checked={autoProgressMode === 'mode-specific'} 
                      onChange={() => setAutoProgressMode('mode-specific')} 
                      className="w-4 h-4 text-indigo-600" 
                    />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Mode-Specific Auto-Progression</span>
                  </label>
                </div>

                {autoProgressMode === 'universal' && (
                  <div className={`p-3 rounded-lg space-y-3 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
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
                        className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} 
                      />
                    </div>

                    <div>
                      <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
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
                        className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} 
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
                  <div className={`p-3 rounded-lg space-y-4 ${darkMode ? 'bg-slate-700' : 'bg-slate-100'}`}>
                    {Object.keys(enabledRelationModes).filter(mode => enabledRelationModes[mode]).map(mode => (
                      <div key={mode} className={`p-3 rounded-lg ${darkMode ? 'bg-slate-800/95 backdrop-blur-sm' : 'bg-white'}`}>
                        <h4 className={`font-bold text-sm mb-3 capitalize ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>{mode}</h4>
                        
                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                            Current: {modeSpecificProgress[mode].currentDifficulty} premises, {modeSpecificProgress[mode].currentTime}s
                          </label>
                        </div>

                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
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
                            className={`w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} 
                          />
                        </div>

                        <div className="mb-3">
                          <label className={`block text-xs font-semibold mb-1 ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
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
                            className={`w-full mt-1 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-purple-500 ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-50' : 'bg-white border-slate-300 text-slate-900'}`} 
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
                  <p className={`text-xs mt-3 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    When target is reached: Timer decreases by 5s (min: 10s). At 10s, premise count increases by 1.
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input type="checkbox" checked={spoilerPremises} onChange={(e) => setSpoilerPremises(e.target.checked)} className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-indigo-500" />
                  <span className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-700'}`}>Spoiler Premises</span>
                </label>
                <p className={`text-xs mt-1 ml-6 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hover to reveal premises</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
                     }
