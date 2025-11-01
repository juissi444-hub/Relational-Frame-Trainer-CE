import React, { useState, useEffect, useCallback } from 'react';
import { Settings, History, Play, Pause, RotateCcw, X, Check, Clock, TrendingUp, Info } from 'lucide-react';

export default function RelationalFrameTrainer() {
  const [difficulty, setDifficulty] = useState(3);
  const [timePerQuestion, setTimePerQuestion] = useState(30);
  const [networkComplexity, setNetworkComplexity] = useState(0.5);
  const [spoilerPremises, setSpoilerPremises] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [useLetters, setUseLetters] = useState(true);
  const [useEmojis, setUseEmojis] = useState(false);
  const [useVoronoi, setUseVoronoi] = useState(false);
  const [letterLength, setLetterLength] = useState(3);
  const [autoProgressEnabled, setAutoProgressEnabled] = useState(true);
  const [targetPremiseCount, setTargetPremiseCount] = useState(40);
  const [targetAccuracy, setTargetAccuracy] = useState(95);
  const [recentAnswers, setRecentAnswers] = useState([]);
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

  const emojiList = ['🌟', '🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎹', '🎺', '🎻', '🌈', '🌊', '🌙', '⭐', '🔥', '💎', '🌸', '🌺', '🌻', '🌼', '🍀', '🍁', '🍂', '🍃', '🎈', '🎉', '🎊', '🎁', '🏆', '⚡', '💫', '✨', '🌠', '🔮', '💝', '🎀', '🌹', '🦋', '🐝', '🐞', '🦄', '🐉', '🦊', '🐺', '🦁', '🐯', '🐻', '🐼', '🐨', '🐸', '🦉', '🦅', '🦆', '🦢', '🐧', '🐙', '🦑', '🦀', '🐠', '🐡', '🐬', '🐳', '🦈', '🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝'];
  
  const generateVoronoiSVG = (seed) => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
    const random = (s) => { const x = Math.sin(s++) * 10000; return x - Math.floor(x); };
    const points = [];
    for (let i = 0; i < 8; i++) {
      points.push({ x: random(seed + i) * 100, y: random(seed + i + 100) * 100, color: colors[i % colors.length] });
    }
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">${points.map((p, i) => `<circle cx="${p.x}" cy="${p.y}" r="${15 + random(seed + i + 200) * 10}" fill="${p.color}" opacity="0.7" />`).join('')}</svg>`;
  };
  
  const generateStimulus = () => {
    const availableTypes = [];
    if (useLetters) availableTypes.push('letters');
    if (useEmojis) availableTypes.push('emojis');
    if (useVoronoi) availableTypes.push('voronoi');
    
    if (availableTypes.length === 0) availableTypes.push('letters');
    
    const selectedType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
    
    if (selectedType === 'emojis') {
      return emojiList[Math.floor(Math.random() * emojiList.length)];
    } else if (selectedType === 'voronoi') {
      return `voronoi_${Math.floor(Math.random() * 1000000)}`;
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
    return 'spatial';
  };

  const deriveRelation = (rel1, rel2) => {
    const mode1 = getRelationMode(rel1);
    const mode2 = getRelationMode(rel2);
    
    if (mode1 !== mode2) return 'AMBIGUOUS';
    
    if (mode1 === 'equality') {
      if (rel1 === 'SAME') return rel2;
      if (rel2 === 'SAME') return rel1;
      if (rel1 === 'OPPOSITE' && rel2 === 'OPPOSITE') return 'SAME';
      if (rel1 === 'OPPOSITE' && rel2 === 'DIFFERENT') return 'DIFFERENT';
      if (rel1 === 'DIFFERENT' && rel2 === 'OPPOSITE') return 'DIFFERENT';
      if (rel1 === 'DIFFERENT' && rel2 === 'DIFFERENT') return 'AMBIGUOUS';
      return 'AMBIGUOUS';
    } else if (mode1 === 'temporal') {
      if (rel1 === 'AT') return rel2;
      if (rel2 === 'AT') return rel1;
      if (rel1 === 'BEFORE' && rel2 === 'BEFORE') return 'BEFORE';
      if (rel1 === 'AFTER' && rel2 === 'AFTER') return 'AFTER';
      if (rel1 === 'BEFORE' && rel2 === 'AFTER') return 'AMBIGUOUS';
      if (rel1 === 'AFTER' && rel2 === 'BEFORE') return 'AMBIGUOUS';
      return 'AMBIGUOUS';
    } else {
      const opposites = {
        'NORTH': 'SOUTH', 'SOUTH': 'NORTH',
        'EAST': 'WEST', 'WEST': 'EAST',
        'NORTHEAST': 'SOUTHWEST', 'SOUTHWEST': 'NORTHEAST',
        'NORTHWEST': 'SOUTHEAST', 'SOUTHEAST': 'NORTHWEST'
      };
      
      if (rel1 === rel2) return rel1;
      if (opposites[rel1] === rel2) return 'AMBIGUOUS';
      
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
        edgeToAdd = { ...edge, reversed: true };
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

    return { premises, question: { stimulus1: stimuli[startIdx], relation: questionRelation, stimulus2: stimuli[endIdx] }, correctAnswer, derivedRelation: derivedRelation || 'AMBIGUOUS', allPaths: findAllPaths(premises, stimuli[startIdx], stimuli[endIdx]), allStimuli: stimuli };
  }, [difficulty, networkComplexity, useLetters, useEmojis, useVoronoi, letterLength, enabledRelationModes]);

  const startNewTrial = useCallback(() => {
    setCurrentTrial(generateTrial());
    setTimeLeft(timePerQuestion);
    setFeedback(null);
  }, [generateTrial, timePerQuestion]);

  const saveToStorage = async () => {
    try {
      await window.storage.set('rft-data', JSON.stringify({ 
        score, history, statsHistory, 
        settings: { difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode, useLetters, useEmojis, useVoronoi, letterLength, autoProgressEnabled, targetPremiseCount, targetAccuracy, enabledRelationModes }, 
        recentAnswers 
      }));
    } catch (error) {
      console.error('Save failed:', error);
    }
  };
  
  const loadFromStorage = async () => {
    try {
      const result = await window.storage.get('rft-data');
      if (result?.value) {
        const data = JSON.parse(result.value);
        if (data.score) setScore(data.score);
        if (data.history) setHistory(data.history);
        if (data.statsHistory) setStatsHistory(data.statsHistory);
        if (data.recentAnswers) setRecentAnswers(data.recentAnswers);
        if (data.settings) {
          if (data.settings.difficulty !== undefined) setDifficulty(data.settings.difficulty);
          if (data.settings.timePerQuestion !== undefined) setTimePerQuestion(data.settings.timePerQuestion);
          if (data.settings.networkComplexity !== undefined) setNetworkComplexity(data.settings.networkComplexity);
          if (data.settings.spoilerPremises !== undefined) setSpoilerPremises(data.settings.spoilerPremises);
          if (data.settings.darkMode !== undefined) setDarkMode(data.settings.darkMode);
          if (data.settings.useLetters !== undefined) setUseLetters(data.settings.useLetters);
          if (data.settings.useEmojis !== undefined) setUseEmojis(data.settings.useEmojis);
          if (data.settings.useVoronoi !== undefined) setUseVoronoi(data.settings.useVoronoi);
          if (data.settings.letterLength !== undefined) setLetterLength(data.settings.letterLength);
          if (data.settings.autoProgressEnabled !== undefined) setAutoProgressEnabled(data.settings.autoProgressEnabled);
          if (data.settings.targetPremiseCount !== undefined) setTargetPremiseCount(data.settings.targetPremiseCount);
          if (data.settings.targetAccuracy !== undefined) setTargetAccuracy(data.settings.targetAccuracy);
          if (data.settings.enabledRelationModes !== undefined) setEnabledRelationModes(data.settings.enabledRelationModes);
        }
      }
    } catch (error) {
      console.log('No saved data found');
    }
  };

  const resetGame = () => {
    setScore({ correct: 0, incorrect: 0, missed: 0 });
    setHistory([]);
    setRecentAnswers([]);
    setStatsHistory([]);
    startNewTrial();
    saveToStorage();
  };

  const getAnswerLabel = (answer) => {
    if (answer === true) return 'YES';
    if (answer === false) return 'NO';
    if (answer === 'ambiguous') return "CAN'T TELL";
    return 'NO ANSWER';
  };

  const checkAutoProgress = useCallback((updatedAnswers) => {
    if (!autoProgressEnabled || updatedAnswers.length < targetPremiseCount) return;
    const recentWindow = updatedAnswers.slice(-targetPremiseCount);
    const accuracy = (recentWindow.filter(a => a).length / targetPremiseCount) * 100;
    if (accuracy >= targetAccuracy) {
      if (timePerQuestion > 10) {
        const newTime = Math.max(10, timePerQuestion - 5);
        setTimePerQuestion(newTime);
        if (newTime === 10) {
          setDifficulty(prev => prev + 1);
          setTimePerQuestion(30);
          setRecentAnswers([]);
        }
      } else {
        setDifficulty(prev => prev + 1);
        setTimePerQuestion(30);
        setRecentAnswers([]);
      }
    }
  }, [autoProgressEnabled, targetPremiseCount, targetAccuracy, timePerQuestion]);

  const handleAnswer = useCallback((userAnswer) => {
    if (isPaused || feedback) return;
    const isCorrect = userAnswer === currentTrial.correctAnswer;
    const timeUsed = timePerQuestion - timeLeft;
    setScore(prev => ({ ...prev, correct: prev.correct + (isCorrect ? 1 : 0), incorrect: prev.incorrect + (isCorrect ? 0 : 1) }));
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    const entry = { trial: currentTrial, userAnswer, isCorrect, timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length };
    setHistory(prev => [...prev, entry]);
    setStatsHistory(prev => [...prev, { timestamp: Date.now(), timeUsed, premiseCount: currentTrial.premises.length, isCorrect }]);
    const updatedAnswers = [...recentAnswers, isCorrect];
    setRecentAnswers(updatedAnswers);
    checkAutoProgress(updatedAnswers);
    setTimeout(() => { startNewTrial(); saveToStorage(); }, 1500);
  }, [isPaused, currentTrial, feedback, startNewTrial, recentAnswers, checkAutoProgress, timeLeft, timePerQuestion]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => {
      if (!prev) { setCurrentTrial(generateTrial()); setFeedback(null); }
      return !prev;
    });
  }, [generateTrial]);

  useEffect(() => {
    if (!isPaused && !feedback && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft(prev => Math.max(0, prev - 0.1)), 100);
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
  }, [difficulty, timePerQuestion, networkComplexity, spoilerPremises, darkMode, useLetters, useEmojis, useVoronoi, letterLength, autoProgressEnabled, targetPremiseCount, targetAccuracy, enabledRelationModes]);
  
  const renderStimulus = (stimulus) => {
    if (stimulus.startsWith('voronoi_')) {
      return <div className="inline-block w-16 h-16 align-middle" dangerouslySetInnerHTML={{ __html: generateVoronoiSVG(parseInt(stimulus.split('_')[1])) }} />;
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
              <button onClick={resetGame} className={`p-1.5 sm:p-2 rounded-lg transition-colors ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`} title="Reset Game">
                <RotateCcw className={`w-4 h-4 sm:w-5 sm:h-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`} />
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
                  {currentTrial.premises.map((premise, idx) => (
                    <div key={idx} className={`relative flex items-center justify-center text-base sm:text-xl p-3 sm:p-4 rounded-lg overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`} onMouseEnter={() => spoilerPremises && setHoveredPremise(idx)} onMouseLeave={() => spoilerPremises && setHoveredPremise(null)}>
                      <div className="relative z-0 flex items-center gap-1.5 sm:gap-2 flex-wrap justify-center">
                        {renderStimulus(premise.stimulus1)}
                        <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>is</span>
                        <span className={`font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded border text-sm sm:text-base ${getRelationColor(premise.relation)}`}>{premise.relation}</span>
                        <span className={`mx-1 text-sm sm:text-base ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>to</span>
                        {renderStimulus(premise.stimulus2)}
                      </div>
                      {spoilerPremises && hoveredPremise !== idx && (
                        <div className={`absolute inset-0 rounded-lg z-10 ${darkMode ? 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600' : 'bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400'}`}></div>
                      )}
                    </div>
                  ))}
                </div>

                <div className={`border-t-4 pt-6 sm:pt-8 ${feedback === 'correct' ? (darkMode ? 'border-green-500' : 'border-green-500') : feedback === 'incorrect' ? (darkMode ? 'border-red-500' : 'border-red-500') : feedback === 'missed' ? (darkMode ? 'border-orange-500' : 'border-orange-500') : (darkMode ? 'border-indigo-500' : 'border-indigo-500')}`}>
                  <h3 className={`text-base sm:text-lg font-semibold mb-3 sm:mb-4 ${darkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>Question:</h3>
                  <div className={`flex items-center justify-center text-lg sm:text-2xl p-4 sm:p-6 rounded-xl mb-4 sm:mb-6 transition-colors duration-300 gap-1.5 sm:gap-2 flex-wrap ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                    {(() => {
                      const rel = currentTrial.question.relation;
                      const mode = getRelationMode(rel);
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
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Spatial 2D (NORTH, SOUTH, EAST, WEST, etc.)</span>
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
                <div className="mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input type="checkbox" checked={autoProgressEnabled} onChange={(e) => setAutoProgressEnabled(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                    <span className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Enable Auto-Progression</span>
                  </label>
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Premise Count: {targetPremiseCount}</label>
                  <input type="range" min="1" max="100" value={targetPremiseCount} onChange={(e) => setTargetPremiseCount(parseInt(e.target.value))} disabled={!autoProgressEnabled} className="w-full accent-indigo-600 disabled:opacity-50" />
                  <input type="number" min="1" max="100" value={targetPremiseCount} onChange={(e) => setTargetPremiseCount(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))} disabled={!autoProgressEnabled} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:opacity-50 ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Number of questions to evaluate</p>
                </div>
                <div className="mb-4">
                  <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Target Accuracy: {targetAccuracy}%</label>
                  <input type="range" min="0" max="100" value={targetAccuracy} onChange={(e) => setTargetAccuracy(parseInt(e.target.value))} disabled={!autoProgressEnabled} className="w-full accent-indigo-600 disabled:opacity-50" />
                  <input type="number" min="0" max="100" value={targetAccuracy} onChange={(e) => setTargetAccuracy(Math.max(0, Math.min(100, parseInt(e.target.value) || 0)))} disabled={!autoProgressEnabled} className={`w-full mt-2 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors disabled:opacity-50 ${darkMode ? 'bg-slate-700 border-slate-600 text-gray-100' : 'bg-white border-gray-300 text-gray-900'}`} />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Required accuracy to progress</p>
                </div>
                {autoProgressEnabled && (
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-indigo-900/30' : 'bg-indigo-50'}`}>
                    <p className={`text-xs ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                      <strong>Progress:</strong> {recentAnswers.length}/{targetPremiseCount} questions answered
                    </p>
                    {recentAnswers.length >= targetPremiseCount && (
                      <p className={`text-xs mt-1 ${darkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                        <strong>Current Accuracy:</strong> {((recentAnswers.slice(-targetPremiseCount).filter(a => a).length / targetPremiseCount) * 100).toFixed(0)}%
                      </p>
                    )}
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      When {targetAccuracy}% accuracy is reached over {targetPremiseCount} questions:
                      <br />• Timer decreases by 5s (min: 10s)
                      <br />• At 10s, premise count increases by 1
                    </p>
                  </div>
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
