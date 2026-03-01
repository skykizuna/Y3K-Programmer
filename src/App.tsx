/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Timer, 
  Zap, 
  Bug, 
  Search, 
  Home, 
  ChevronRight, 
  Play, 
  User, 
  Award,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameState, GameMode, Character, Question, TappleRound, GlitchRound, QuestRound, Difficulty } from './types';
import { 
  CHARACTERS, 
  BASIC_TIME_TRIAL_QUESTIONS, 
  ADVANCED_TIME_TRIAL_QUESTIONS,
  BASIC_TAPPLE_ROUNDS,
  ADVANCED_TAPPLE_ROUNDS,
  BASIC_GLITCH_ROUNDS, 
  ADVANCED_GLITCH_ROUNDS,
  BASIC_QUEST_ROUNDS,
  ADVANCED_QUEST_ROUNDS
} from './constants';
import { soundService } from './services/soundService';

// --- Sub-components ---

const PixelButton = ({ children, onClick, className = "", disabled = false }: { children: React.ReactNode, onClick?: () => void, className?: string, disabled?: boolean }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className={`pixel-button ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'} ${className}`}
  >
    {children}
  </button>
);

const GlitchOverlay = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20">
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-y3k-cyan/20 to-transparent animate-pulse" />
    <div className="absolute top-0 left-0 w-full h-1 bg-y3k-pink animate-[scanline_4s_linear_infinite]" />
  </div>
);

const Badge = ({ name, active }: { name: string, active: boolean }) => (
  <div className={`p-2 border-2 ${active ? 'border-y3k-cyan bg-y3k-cyan/20' : 'border-gray-700 opacity-30'} rounded-lg flex flex-col items-center gap-1`}>
    <Award className={active ? 'text-y3k-cyan' : 'text-gray-500'} size={24} />
    <span className="text-[8px] font-pixel">{name}</span>
  </div>
);

// --- Main App ---

export default function App() {
  const [state, setState] = useState<GameState>({
    screen: 'INTRO',
    selectedMode: null,
    character: null,
    difficulty: 'EASY',
    points: 0,
    badges: [],
    completedModes: [],
    powerActive: false,
    powerUsed: false
  });

  const [currentRound, setCurrentRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [isGameOver, setIsGameOver] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [continueTimer, setContinueTimer] = useState(9);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Sound effects
  const playSound = (type: 'success' | 'error' | 'click') => {
    if (type === 'success') soundService.playSuccess();
    else if (type === 'error') soundService.playFail();
    else soundService.playClick();
  };

  const handleStart = () => {
    setState(prev => ({ ...prev, screen: 'CHAR_SELECT' }));
    playSound('click');
  };

  const selectCharacter = (char: Character) => {
    setState(prev => ({ ...prev, character: char, screen: 'DIFFICULTY_SELECT' }));
    playSound('click');
  };

  const selectDifficulty = (diff: Difficulty) => {
    setState(prev => ({ ...prev, difficulty: diff, screen: 'MENU' }));
    playSound('click');
  };

  const startMode = (mode: GameMode) => {
    setState(prev => ({ ...prev, selectedMode: mode, screen: 'PLAYING', powerActive: false, powerUsed: false }));
    setCurrentRound(0);
    setTimeLeft(mode === 'TIME_TRIAL' ? 10 : 0);
    setIsGameOver(false);
    setFeedback(null);
    playSound('click');
  };

  const activatePower = () => {
    if (state.powerUsed || !state.character) return;
    
    playSound('success');
    setState(prev => ({ ...prev, powerActive: true, powerUsed: true }));
    
    if (state.character.ability.type === 'TIME') {
      setTimeLeft(prev => prev + 5);
    }
  };

  const goHome = () => {
    setState(prev => ({ ...prev, screen: 'MENU', selectedMode: null }));
    playSound('click');
  };

  const addPoints = (amount: number) => {
    setState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const completeMode = (mode: GameMode) => {
    if (!state.completedModes.includes(mode)) {
      setState(prev => ({
        ...prev,
        completedModes: [...prev.completedModes, mode],
        badges: [...prev.badges, mode]
      }));
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: [state.character?.color || '#00f3ff', '#ffffff']
      });
    }
    setIsGameOver(true);
  };

  // --- Game Logic ---

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (state.screen === 'PLAYING' && state.selectedMode === 'TIME_TRIAL' && !isGameOver && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && state.selectedMode === 'TIME_TRIAL' && !isGameOver) {
      soundService.playFail();
      setShowContinue(true);
      setContinueTimer(9);
      setIsGameOver(true);
    }
    return () => clearInterval(timer);
  }, [state.screen, state.selectedMode, isGameOver, timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showContinue && continueTimer > 0) {
      timer = setInterval(() => {
        setContinueTimer(prev => prev - 1);
      }, 1000);
    } else if (showContinue && continueTimer === 0) {
      setShowContinue(false);
      // Final game over
    }
    return () => clearInterval(timer);
  }, [showContinue, continueTimer]);

  const handleContinue = (success: boolean) => {
    if (success) {
      setIsGameOver(false);
      setShowContinue(false);
      setTimeLeft(10);
      playSound('success');
    } else {
      setShowContinue(false);
      playSound('click');
    }
  };

  const handleAnswer = (answer: string) => {
    if (isGameOver) return;

    let isCorrect = false;
    let pointsToAdd = 10;

    if (state.powerActive && state.character?.ability.type === 'MULTIPLIER') {
      pointsToAdd *= 2;
    }

    const timeTrialSet = state.difficulty === 'EASY' ? BASIC_TIME_TRIAL_QUESTIONS : ADVANCED_TIME_TRIAL_QUESTIONS;
    const questSet = state.difficulty === 'EASY' ? BASIC_QUEST_ROUNDS : ADVANCED_QUEST_ROUNDS;

    if (state.selectedMode === 'TIME_TRIAL') {
      isCorrect = answer === timeTrialSet[currentRound].answer;
    } else if (state.selectedMode === 'ALGORITHM_QUEST') {
      isCorrect = answer === questSet[currentRound].correctValue;
    }

    if (isCorrect) {
      addPoints(pointsToAdd);
      setFeedback({ type: 'success', message: `CORRECT! +${pointsToAdd} PTS` });
      playSound('success');
      setState(prev => ({ ...prev, powerActive: false })); // Reset active power after correct answer
      setTimeout(() => {
        if (currentRound < 9) {
          setCurrentRound(prev => prev + 1);
          setTimeLeft(10);
          setFeedback(null);
        } else {
          completeMode(state.selectedMode!);
        }
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: 'INCORRECT! TRY AGAIN' });
      playSound('error');
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  // --- Render Screens ---

  const renderIntro = () => (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="flex flex-col items-center justify-center h-screen bg-y3k-black p-8 text-center"
    >
      <motion.div 
        animate={{ scale: [1, 1.05, 1] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-pixel text-y3k-cyan glitch-text mb-4">Y3K PROGRAMMER</h1>
        <p className="text-y3k-silver font-pixel text-xs tracking-widest">RETRO-FUTURIST REVISION ENGINE</p>
      </motion.div>
      
      <div className="max-w-md bg-y3k-purple/10 border-2 border-y3k-purple p-6 mb-8 rounded-lg">
        <p className="text-sm text-y3k-silver leading-relaxed mb-4">
          Welcome, Initiate. The year is 3026. Code is the lifeblood of the galaxy. 
          To survive the coming Singularity, you must master the ancient arts of C++.
        </p>
        <div className="flex justify-center gap-4">
          <Zap className="text-y3k-cyan animate-pulse" />
          <Bug className="text-y3k-pink animate-pulse" />
          <Search className="text-y3k-purple animate-pulse" />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <PixelButton onClick={handleStart} className="px-12 py-4 text-lg">
          INITIALIZE SYSTEM
        </PixelButton>
        <button 
          onClick={() => setState(prev => ({ ...prev, screen: 'HOW_TO_PLAY' }))}
          className="text-y3k-cyan font-pixel text-[10px] hover:underline"
        >
          HOW TO PLAY
        </button>
      </div>
    </motion.div>
  );

  const renderHowToPlay = () => (
    <div className="flex flex-col h-screen p-8 overflow-y-auto">
      <header className="flex justify-between items-center mb-12 shrink-0">
        <h2 className="text-2xl font-pixel text-y3k-cyan">SYSTEM DOCUMENTATION</h2>
        <PixelButton onClick={() => setState(prev => ({ ...prev, screen: 'INTRO' }))} className="bg-gray-800">
          CLOSE
        </PixelButton>
      </header>
      
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 shrink-0">
        <div className="pixel-card border-y3k-cyan">
          <h3 className="font-pixel text-y3k-cyan mb-4 flex items-center gap-2"><Timer size={16}/> TIME TRIAL</h3>
          <p className="text-xs leading-relaxed text-y3k-silver mb-4">
            Rapid-fire C++ questions. You have 10 seconds per question. 
            Accuracy and speed are key to surviving the clock.
          </p>
          <div className="text-[10px] font-pixel text-y3k-cyan/60 uppercase">Objective: Solve 10 questions before time runs out.</div>
        </div>

        <div className="pixel-card border-y3k-pink">
          <h3 className="font-pixel text-y3k-pink mb-4 flex items-center gap-2"><User size={16}/> TAP MODE</h3>
          <p className="text-xs leading-relaxed text-y3k-silver mb-4">
            A memory core challenge. A category is given, and you must tap a letter 
            to reset the 10s timer. Don't repeat letters!
          </p>
          <div className="text-[10px] font-pixel text-y3k-pink/60 uppercase">Objective: Keep the timer alive for 5 rounds.</div>
        </div>

        <div className="pixel-card border-y3k-purple">
          <h3 className="font-pixel text-y3k-purple mb-4 flex items-center gap-2"><Bug size={16}/> GLITCH MODE</h3>
          <p className="text-xs leading-relaxed text-y3k-silver mb-4">
            The system is corrupted. Analyze broken code snippets, identify the bug, 
            and apply the correct fix to restore integrity.
          </p>
          <div className="text-[10px] font-pixel text-y3k-purple/60 uppercase">Objective: Repair 10 corrupted code modules.</div>
        </div>

        <div className="pixel-card border-y3k-silver">
          <h3 className="font-pixel text-y3k-silver mb-4 flex items-center gap-2"><Award size={16}/> ALGORITHM QUEST</h3>
          <p className="text-xs leading-relaxed text-y3k-silver mb-4">
            Scenario-based problem solving. Apply C++ logic to real-world challenges 
            aligned with Sustainable Development Goals.
          </p>
          <div className="text-[10px] font-pixel text-y3k-silver/60 uppercase">Objective: Complete 10 scenario-based missions.</div>
        </div>
      </div>
      
      <div className="mt-12 p-6 bg-y3k-cyan/5 border-2 border-dashed border-y3k-cyan/30 rounded-lg text-center shrink-0">
        <h4 className="font-pixel text-y3k-cyan text-sm mb-4">SUPER POWERS</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-[10px] font-pixel">
          <div className="text-y3k-cyan">SINE: +5 SECONDS</div>
          <div className="text-y3k-pink">COSINE: ERASE WRONG ANSWER</div>
          <div className="text-y3k-purple">TANGENT: 2X SCORE MULTIPLIER</div>
        </div>
      </div>
    </div>
  );

  const renderCharSelect = () => (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h2 className="text-2xl font-pixel text-y3k-cyan mb-12">SELECT YOUR AVATAR</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
        {CHARACTERS.map(char => (
          <motion.div
            key={char.id}
            whileHover={{ scale: 1.05, y: -10 }}
            onClick={() => selectCharacter(char)}
            className="cursor-pointer bg-y3k-purple/20 border-2 border-y3k-purple p-6 rounded-xl flex flex-col items-center text-center hover:border-y3k-cyan transition-colors"
          >
            <div className="text-6xl mb-4">{char.avatar}</div>
            <h3 className="text-xl font-pixel mb-2" style={{ color: char.color }}>{char.name}</h3>
            <p className="text-xs text-y3k-silver">{char.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderDifficultySelect = () => (
    <div className="flex flex-col items-center justify-center h-screen p-8">
      <h2 className="text-2xl font-pixel text-y3k-cyan mb-12">SELECT DIFFICULTY</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl w-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => selectDifficulty('EASY')}
          className="cursor-pointer bg-y3k-cyan/10 border-2 border-y3k-cyan p-8 rounded-xl flex flex-col items-center text-center hover:bg-y3k-cyan/20 transition-all"
        >
          <Zap className="text-y3k-cyan mb-4" size={48} />
          <h3 className="text-xl font-pixel text-y3k-cyan mb-2">EASY</h3>
          <p className="text-xs text-y3k-silver">Basic C++ Concepts & Logic</p>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          onClick={() => selectDifficulty('HARD')}
          className="cursor-pointer bg-y3k-pink/10 border-2 border-y3k-pink p-8 rounded-xl flex flex-col items-center text-center hover:bg-y3k-pink/20 transition-all"
        >
          <Bug className="text-y3k-pink mb-4" size={48} />
          <h3 className="text-xl font-pixel text-y3k-pink mb-2">HARD</h3>
          <p className="text-xs text-y3k-silver">Advanced C++ & Project Euler</p>
        </motion.div>
      </div>
      <PixelButton onClick={() => setState(prev => ({ ...prev, screen: 'CHAR_SELECT' }))} className="mt-12 bg-gray-800">
        BACK TO AVATARS
      </PixelButton>
    </div>
  );

  const renderMenu = () => (
    <div className="flex flex-col h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="text-4xl">{state.character?.avatar}</div>
          <div>
            <h2 className="font-pixel text-y3k-cyan">{state.character?.name}</h2>
            <p className="text-[10px] font-pixel text-y3k-silver">LVL 1 PROGRAMMER | {state.difficulty}</p>
          </div>
        </div>
        <div className="bg-y3k-purple/30 px-4 py-2 border-2 border-y3k-purple rounded-lg">
          <span className="font-pixel text-y3k-pink text-sm">{state.points} PTS</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full">
        <MenuCard 
          title="TIME TRIAL" 
          icon={<Timer size={32} />} 
          desc="Algorithm Speed Challenge" 
          color="cyan"
          completed={state.completedModes.includes('TIME_TRIAL')}
          onClick={() => startMode('TIME_TRIAL')}
        />
        <MenuCard 
          title="TAP MODE" 
          icon={<Zap size={32} />} 
          desc="Memory Core Activation" 
          color="pink"
          completed={state.completedModes.includes('TAP_MODE')}
          onClick={() => startMode('TAP_MODE')}
        />
        <MenuCard 
          title="GLITCH MODE" 
          icon={<Bug size={32} />} 
          desc="System Integrity Repair" 
          color="purple"
          completed={state.completedModes.includes('GLITCH_MODE')}
          onClick={() => startMode('GLITCH_MODE')}
        />
        <MenuCard 
          title="QUEST MODE" 
          icon={<Search size={32} />} 
          desc="AI Decision Engine Training" 
          color="silver"
          completed={state.completedModes.includes('ALGORITHM_QUEST')}
          onClick={() => startMode('ALGORITHM_QUEST')}
        />
      </div>

      <footer className="mt-8 flex justify-center gap-4">
        <Badge name="SPEED" active={state.badges.includes('TIME_TRIAL')} />
        <Badge name="RECALL" active={state.badges.includes('TAP_MODE')} />
        <Badge name="DEBUG" active={state.badges.includes('GLITCH_MODE')} />
        <Badge name="LOGIC" active={state.badges.includes('ALGORITHM_QUEST')} />
      </footer>

      {state.completedModes.length === 4 && (
        <motion.div 
          initial={{ y: 50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="mt-8 text-center"
        >
          <PixelButton onClick={() => setState(prev => ({ ...prev, screen: 'BOSS' }))} className="bg-y3k-pink animate-bounce">
            FINAL BOSS ROUND UNLOCKED
          </PixelButton>
        </motion.div>
      )}
    </div>
  );

  const renderPlaying = () => {
    const timeTrialSet = state.difficulty === 'EASY' ? BASIC_TIME_TRIAL_QUESTIONS : ADVANCED_TIME_TRIAL_QUESTIONS;
    const glitchSet = state.difficulty === 'EASY' ? BASIC_GLITCH_ROUNDS : ADVANCED_GLITCH_ROUNDS;
    const questSet = state.difficulty === 'EASY' ? BASIC_QUEST_ROUNDS : ADVANCED_QUEST_ROUNDS;
    const tappleSet = state.difficulty === 'EASY' ? BASIC_TAPPLE_ROUNDS : ADVANCED_TAPPLE_ROUNDS;

    if (showContinue && state.selectedMode === 'TIME_TRIAL') {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-black p-8 text-center">
          <h2 className="text-6xl font-pixel text-red-500 glitch-text mb-12">CONTINUE?</h2>
          <div className="text-9xl font-pixel text-white mb-12 animate-pulse">{continueTimer}</div>
          <div className="flex gap-8">
            <PixelButton onClick={() => handleContinue(true)} className="px-12 py-6 text-xl bg-green-600">YES</PixelButton>
            <PixelButton onClick={() => handleContinue(false)} className="px-12 py-6 text-xl bg-red-600">NO</PixelButton>
          </div>
          <p className="mt-12 text-y3k-silver font-pixel text-xs">TIME EXPIRED ON ROUND {currentRound + 1}</p>
        </div>
      );
    }

    switch(state.selectedMode) {
      case 'TIME_TRIAL': return <TimeTrialView 
        round={currentRound} 
        question={timeTrialSet[currentRound]}
        timeLeft={timeLeft} 
        onAnswer={handleAnswer} 
        feedback={feedback}
        isGameOver={isGameOver}
        onHome={goHome}
        character={state.character}
        powerActive={state.powerActive}
        powerUsed={state.powerUsed}
        onActivatePower={activatePower}
      />;
      case 'TAP_MODE': return <TapModeView 
        round={currentRound} 
        tappleSet={tappleSet}
        onNext={() => {
          let pts = 5;
          if (state.powerActive && state.character?.ability.type === 'MULTIPLIER') pts *= 2;
          addPoints(pts);
          setState(prev => ({ ...prev, powerActive: false }));
          if (currentRound < 4) setCurrentRound(prev => prev + 1);
          else completeMode('TAP_MODE');
        }}
        onHome={goHome}
        isGameOver={isGameOver}
        character={state.character}
        powerActive={state.powerActive}
        powerUsed={state.powerUsed}
        onActivatePower={activatePower}
        onAddTime={(sec: number) => setTimeLeft(prev => prev + sec)}
      />;
      case 'GLITCH_MODE': return <GlitchModeView 
        round={currentRound}
        glitch={glitchSet[currentRound]}
        onSolve={() => {
          let pts = 15;
          if (state.powerActive && state.character?.ability.type === 'MULTIPLIER') pts *= 2;
          addPoints(pts);
          setState(prev => ({ ...prev, powerActive: false }));
          soundService.playSuccess();
          if (currentRound < 9) setCurrentRound(prev => prev + 1);
          else completeMode('GLITCH_MODE');
        }}
        onHome={goHome}
        isGameOver={isGameOver}
        character={state.character}
        powerActive={state.powerActive}
        powerUsed={state.powerUsed}
        onActivatePower={activatePower}
      />;
      case 'ALGORITHM_QUEST': return <QuestModeView 
        round={currentRound}
        quest={questSet[currentRound]}
        onAnswer={handleAnswer}
        feedback={feedback}
        isGameOver={isGameOver}
        onHome={goHome}
        character={state.character}
        powerActive={state.powerActive}
        powerUsed={state.powerUsed}
        onActivatePower={activatePower}
      />;
      default: return null;
    }
  };

  const renderBoss = () => (
    <div className="flex flex-col items-center justify-center h-screen p-8 bg-red-900/20">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], rotate: [0, 1, -1, 0] }}
        transition={{ repeat: Infinity, duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h2 className="text-4xl font-pixel text-red-500 glitch-text mb-4">FINAL BOSS: THE SINGULARITY</h2>
        <div className="text-8xl mb-4">👾</div>
      </motion.div>
      
      <div className="max-w-2xl bg-black border-4 border-red-500 p-8 rounded-xl text-center">
        <p className="text-xl font-pixel text-white mb-8">
          "SO YOU THINK YOU ARE A PROGRAMMER? PROVE IT IN THE FINAL EXAM!"
        </p>
        <div className="grid grid-cols-1 gap-4">
          <p className="text-y3k-silver italic">This round is designed for the whole class to solve together.</p>
          <PixelButton onClick={() => setState(prev => ({ ...prev, screen: 'RESULTS' }))} className="bg-red-600">
            INITIATE DEBRIEF
          </PixelButton>
        </div>
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
      <Trophy size={80} className="text-y3k-cyan mb-6" />
      <h2 className="text-4xl font-pixel text-y3k-cyan mb-4">MISSION COMPLETE</h2>
      <p className="text-2xl font-pixel text-y3k-pink mb-8">FINAL SCORE: {state.points}</p>
      
      <div className="bg-y3k-purple/20 border-2 border-y3k-purple p-8 rounded-xl mb-8 max-w-md">
        <h3 className="font-pixel text-y3k-silver mb-4">CERTIFIED Y3K PROGRAMMER</h3>
        <div className="flex justify-center gap-4 mb-6">
          {state.badges.map(b => <Award key={b} className="text-y3k-cyan" size={32} />)}
        </div>
        <p className="text-sm text-y3k-silver">
          You have mastered Variables, Loops, Arrays, and Algorithms. 
          The future of code is safe in your hands.
        </p>
      </div>

      <PixelButton onClick={() => window.location.reload()}>
        REBOOT SYSTEM
      </PixelButton>
    </div>
  );

  return (
    <div className="min-h-screen bg-y3k-black text-white selection:bg-y3k-cyan selection:text-black">
      <AnimatePresence mode="wait">
        {state.screen === 'INTRO' && renderIntro()}
        {state.screen === 'CHAR_SELECT' && renderCharSelect()}
        {state.screen === 'DIFFICULTY_SELECT' && renderDifficultySelect()}
        {state.screen === 'HOW_TO_PLAY' && renderHowToPlay()}
        {state.screen === 'MENU' && renderMenu()}
        {state.screen === 'PLAYING' && renderPlaying()}
        {state.screen === 'BOSS' && renderBoss()}
        {state.screen === 'RESULTS' && renderResults()}
      </AnimatePresence>
      <GlitchOverlay />
    </div>
  );
}

// --- Helper Components ---

const MenuCard = ({ title, icon, desc, color, completed, onClick }: { title: string, icon: React.ReactNode, desc: string, color: string, completed: boolean, onClick: () => void }) => {
  const colorMap: any = {
    cyan: 'border-y3k-cyan text-y3k-cyan bg-y3k-cyan/10 hover:bg-y3k-cyan/20',
    pink: 'border-y3k-pink text-y3k-pink bg-y3k-pink/10 hover:bg-y3k-pink/20',
    purple: 'border-y3k-purple text-y3k-purple bg-y3k-purple/10 hover:bg-y3k-purple/20',
    silver: 'border-y3k-silver text-y3k-silver bg-y3k-silver/10 hover:bg-y3k-silver/20'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`cursor-pointer border-2 p-6 rounded-xl flex flex-col gap-4 transition-all relative overflow-hidden ${colorMap[color]}`}
    >
      <div className="flex justify-between items-start">
        {icon}
        {completed && <CheckCircle2 className="text-green-500" />}
      </div>
      <div>
        <h3 className="font-pixel text-lg">{title}</h3>
        <p className="text-xs opacity-80">{desc}</p>
      </div>
      <div className="flex justify-end">
        <ChevronRight />
      </div>
      {completed && <div className="absolute top-0 right-0 bg-green-500 text-black font-pixel text-[8px] px-2 py-1 rotate-45 translate-x-4 translate-y-2">COMPLETED</div>}
    </motion.div>
  );
};

const PowerButton = ({ character, active, used, onClick }: any) => {
  if (!character) return null;
  return (
    <motion.button
      whileHover={!used ? { scale: 1.1 } : {}}
      whileTap={!used ? { scale: 0.9 } : {}}
      onClick={onClick}
      disabled={used}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-pixel text-[10px] border-2 transition-all ${
        used 
          ? 'bg-gray-800 border-gray-700 text-gray-600 cursor-not-allowed' 
          : active 
            ? 'bg-white text-black border-white shadow-[0_0_15px_#fff] animate-pulse'
            : `bg-${character.id === 'sine' ? 'y3k-cyan' : character.id === 'cosine' ? 'y3k-pink' : 'y3k-purple'}/20 border-${character.id === 'sine' ? 'y3k-cyan' : character.id === 'cosine' ? 'y3k-pink' : 'y3k-purple'} text-white`
      }`}
    >
      <Zap size={14} className={active ? 'animate-bounce' : ''} />
      <span>{character.ability.name} {used ? '(USED)' : ''}</span>
    </motion.button>
  );
};

// --- Mode Views ---

const TimeTrialView = ({ round, question, timeLeft, onAnswer, feedback, isGameOver, onHome, character, powerActive, powerUsed, onActivatePower }: any) => {
  const q = question;
  
  // Cosine Power: Erase one wrong answer
  const [erasedOption, setErasedOption] = useState<string | null>(null);
  
  useEffect(() => {
    if (powerActive && character?.id === 'cosine' && !erasedOption) {
      const wrongOptions = q.options.filter((opt: string) => opt !== q.answer);
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setErasedOption(randomWrong);
    }
  }, [powerActive, character, q, erasedOption]);

  useEffect(() => {
    setErasedOption(null);
  }, [round]);

  if (isGameOver && round >= 9) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <h2 className="text-3xl font-pixel text-y3k-cyan mb-8">MODE COMPLETE!</h2>
        <PixelButton onClick={onHome}>RETURN TO MENU</PixelButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6">
      <header className="flex justify-between items-center mb-12">
        <PixelButton onClick={onHome} className="bg-gray-800"><Home size={16} /></PixelButton>
        <div className="flex items-center gap-4 bg-y3k-black border-2 border-y3k-cyan px-4 py-2 rounded-lg">
          <Timer className={timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-y3k-cyan'} />
          <span className={`font-pixel text-xl ${timeLeft < 10 ? 'text-red-500' : 'text-y3k-cyan'}`}>{timeLeft}s</span>
        </div>
        <div className="font-pixel text-y3k-silver">ROUND {round + 1}/10</div>
      </header>

      <div className="mb-8 flex justify-center">
        <PowerButton character={character} active={powerActive} used={powerUsed} onClick={onActivatePower} />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col justify-center">
        <div className="bg-y3k-purple/10 border-2 border-y3k-purple p-8 rounded-xl mb-8 relative">
          <h3 className="text-xl font-pixel leading-relaxed mb-4">{q.text}</h3>
          <div className="absolute -top-4 -left-4 bg-y3k-purple px-2 py-1 font-pixel text-[10px]">DIFFICULTY: {q.difficulty}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {q.options?.map((opt: string) => (
            <button
              key={opt}
              onClick={() => onAnswer(opt)}
              disabled={opt === erasedOption}
              className={`p-4 border-2 rounded-lg font-pixel text-sm text-left transition-colors flex justify-between items-center group ${
                opt === erasedOption 
                  ? 'border-red-900/50 text-red-900/50 cursor-not-allowed line-through' 
                  : 'border-y3k-purple text-white hover:bg-y3k-purple/20'
              }`}
            >
              {opt}
              {opt !== erasedOption && <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`mt-8 p-4 rounded-lg font-pixel text-center ${feedback.type === 'success' ? 'bg-green-500/20 text-green-500 border-2 border-green-500' : 'bg-red-500/20 text-red-500 border-2 border-red-500'}`}
            >
              {feedback.message}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const TapModeView = ({ round, tappleSet, onNext, onHome, isGameOver, character, powerActive, powerUsed, onActivatePower, onAddTime }: any) => {
  const [currentRoundData, setCurrentRoundData] = useState(tappleSet[round]);
  const r = currentRoundData;
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [usedLetters, setUsedLetters] = useState<string[]>([]);
  const [lastLetter, setLastLetter] = useState<string | null>(null);
  const [timer, setTimer] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [failed, setFailed] = useState(false);

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  useEffect(() => {
    setCurrentRoundData(tappleSet[round]);
    setUsedLetters([]);
    setLastLetter(null);
    setTimer(10);
    setIsTimerActive(false);
    setFailed(false);
  }, [round, tappleSet]);

  const randomizeTopic = () => {
    const random = tappleSet[Math.floor(Math.random() * tappleSet.length)];
    setCurrentRoundData(random);
    soundService.playClick();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && timer > 0 && !isGameOver) {
      interval = setInterval(() => {
        setTimer(prev => {
          const next = Math.max(0, prev - 0.1);
          if (next === 0) {
            soundService.playFail();
            setFailed(true);
            setIsTimerActive(false);
          } else if (Math.floor(next * 10) % 10 === 0 && next <= 3) {
            soundService.playTick();
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timer, isGameOver]);

  const handleTap = (letter: string) => {
    if (usedLetters.includes(letter)) return;
    
    soundService.playClick();
    setActiveLetter(letter);
    setLastLetter(letter);
    setUsedLetters(prev => [...prev, letter]);
    setTimer(10);
    setIsTimerActive(true);
    setFailed(false);
    
    setTimeout(() => setActiveLetter(null), 500);
  };

  const handleTapplePress = () => {
    if (!isTimerActive && !failed) {
      setIsTimerActive(true);
      soundService.playClick();
    } else if (failed) {
      setTimer(10);
      setIsTimerActive(true);
      setFailed(false);
      soundService.playClick();
    }
  };

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <h2 className="text-3xl font-pixel text-y3k-pink mb-8">MODE COMPLETE!</h2>
        <PixelButton onClick={onHome}>RETURN TO MENU</PixelButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6">
      <header className="flex justify-between items-center mb-8">
        <PixelButton onClick={onHome} className="bg-gray-800"><Home size={16} /></PixelButton>
        <h2 className="font-pixel text-y3k-pink">TAP MODE: MEMORY CORE</h2>
        <div className="font-pixel text-y3k-silver">ROUND {round + 1}/5</div>
      </header>

      <div className="mb-4 flex justify-center gap-4">
        <PowerButton character={character} active={powerActive} used={powerUsed} onClick={onActivatePower} />
        <PixelButton onClick={randomizeTopic} className="bg-y3k-cyan/20 border-y3k-cyan text-y3k-cyan">
          RANDOMIZE TOPIC
        </PixelButton>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-4">
        <div className="text-center mb-4">
          <p className="text-y3k-silver font-pixel text-[10px] mb-2 uppercase tracking-widest">Category</p>
          <h3 className="text-4xl font-pixel text-white glitch-text mb-2">{r.category}</h3>
          <div className="h-1 w-32 bg-y3k-pink mx-auto rounded-full shadow-[0_0_10px_#ff00ff]" />
        </div>

        {/* Tapple Machine UI */}
        <div className="relative w-[450px] h-[450px] flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-y3k-purple/30 shadow-[0_0_30px_rgba(112,0,255,0.2)]" />
          
          {/* Letters in a circle */}
          {letters.map((l, i) => {
            const angle = (i / letters.length) * 2 * Math.PI - Math.PI / 2;
            const radius = 180;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            return (
              <motion.button
                key={l}
                onClick={() => handleTap(l)}
                disabled={usedLetters.includes(l)}
                style={{ left: `calc(50% + ${x}px - 16px)`, top: `calc(50% + ${y}px - 16px)` }}
                className={`absolute w-8 h-8 rounded-full font-pixel text-[10px] flex items-center justify-center transition-all z-10 ${
                  usedLetters.includes(l) 
                    ? 'bg-gray-800 text-gray-600 border-2 border-gray-700' 
                    : activeLetter === l 
                      ? 'bg-white text-y3k-pink scale-125 shadow-[0_0_20px_#fff]' 
                      : 'bg-y3k-pink text-white border-2 border-white/20 hover:scale-110 hover:shadow-[0_0_15px_#ff00ff]'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                {l}
              </motion.button>
            );
          })}

          {/* Central Tapple Button & Timer */}
          <div className="relative w-48 h-48 rounded-full bg-y3k-black border-4 border-y3k-purple flex flex-col items-center justify-center overflow-hidden group">
            {/* Timer Ring */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                className="text-y3k-purple/20"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="88"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="552.92"
                animate={{ strokeDashoffset: 552.92 * (1 - timer / 10) }}
                className={failed ? 'text-red-500' : 'text-y3k-pink'}
              />
            </svg>

            <button 
              onClick={handleTapplePress}
              className={`z-20 w-32 h-32 rounded-full font-pixel text-xs flex flex-col items-center justify-center transition-all active:scale-95 ${
                failed 
                  ? 'bg-red-600 text-white shadow-[0_0_30px_#ef4444]' 
                  : isTimerActive 
                    ? 'bg-y3k-pink text-white shadow-[0_0_30px_#ff00ff]'
                    : 'bg-y3k-purple text-white shadow-[0_0_20px_#7000ff]'
              }`}
            >
              <span className="mb-1">{failed ? 'FAILED' : isTimerActive ? (lastLetter || 'TAPPLE!') : 'START'}</span>
              <span className="text-xl">{timer.toFixed(1)}</span>
            </button>
            
            {/* Background Pulse */}
            {isTimerActive && (
              <div className="absolute inset-0 bg-y3k-pink/5 animate-pulse pointer-events-none" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-2 max-w-md mt-4 min-h-[40px]">
          {usedLetters.map(l => (
            <motion.span 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }} 
              key={l} 
              className="w-8 h-8 flex items-center justify-center bg-y3k-pink/20 border border-y3k-pink text-y3k-pink font-pixel text-[10px] rounded"
            >
              {l}
            </motion.span>
          ))}
        </div>

        <div className="flex gap-4 mt-4">
          <PixelButton onClick={() => {
            setUsedLetters([]);
            setLastLetter(null);
            setTimer(10);
            setIsTimerActive(false);
            setFailed(false);
            soundService.playSuccess();
            onNext();
          }} className="bg-y3k-cyan text-black">
            NEXT CATEGORY
          </PixelButton>
        </div>

        <div className="max-w-md text-center">
          <p className="text-[10px] font-pixel text-y3k-silver leading-relaxed opacity-60">
            TAP A LETTER TO RESET THE 10s TIMER. DON'T LET IT RUN OUT!
          </p>
        </div>
      </div>
    </div>
  );
};

const GlitchModeView = ({ round, glitch, onSolve, onHome, isGameOver, character, powerActive, powerUsed, onActivatePower }: any) => {
  const r = glitch;
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <h2 className="text-3xl font-pixel text-y3k-purple mb-8">MODE COMPLETE!</h2>
        <PixelButton onClick={onHome}>RETURN TO MENU</PixelButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6 overflow-y-auto">
      <header className="flex justify-between items-center mb-8 shrink-0">
        <PixelButton onClick={onHome} className="bg-gray-800"><Home size={16} /></PixelButton>
        <h2 className="font-pixel text-y3k-purple">GLITCH MODE: REPAIR</h2>
        <div className="font-pixel text-y3k-silver">ROUND {round + 1}/10</div>
      </header>

      <div className="mb-8 flex justify-center">
        <PowerButton character={character} active={powerActive} used={powerUsed} onClick={onActivatePower} />
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col gap-6">
        <div className="bg-black border-2 border-y3k-purple p-6 rounded-lg font-mono relative overflow-hidden shrink-0">
          <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-y3k-purple">
              <Bug size={16} />
              <span className="font-pixel text-[10px]">CORRUPTED_CODE.CPP</span>
            </div>
            <button 
              onClick={() => setShowHint(!showHint)}
              className="text-[10px] font-pixel text-y3k-cyan hover:underline"
            >
              {showHint ? "HIDE HINT" : "NEED A HINT?"}
            </button>
          </div>
          <pre className="text-lg text-green-400 animate-glitch whitespace-pre-wrap">
            <code>{r.corruptedCode}</code>
          </pre>
          
          <AnimatePresence>
            {showHint && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="mt-4 p-3 bg-y3k-cyan/10 border border-y3k-cyan rounded text-xs text-y3k-cyan font-pixel leading-relaxed"
              >
                HINT: {r.hint}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
          <div className="bg-y3k-purple/10 border-2 border-y3k-purple p-6 rounded-lg">
            <h4 className="font-pixel text-y3k-pink text-xs mb-4 flex items-center gap-2">
              <AlertTriangle size={14} /> SYSTEM ANALYSIS
            </h4>
            {!showSolution ? (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-y3k-silver">Identify the error, cause, and fix to proceed.</p>
                <PixelButton onClick={() => setShowSolution(true)}>REVEAL ANALYSIS</PixelButton>
              </div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-pixel text-y3k-cyan mb-1">ERROR TYPE</p>
                  <p className="text-sm">{r.error}</p>
                </div>
                <div>
                  <p className="text-[10px] font-pixel text-y3k-cyan mb-1">CAUSE</p>
                  <p className="text-sm">{r.cause}</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="bg-y3k-purple/10 border-2 border-y3k-purple p-6 rounded-lg">
            <h4 className="font-pixel text-y3k-cyan text-xs mb-4 flex items-center gap-2">
              <CheckCircle2 size={14} /> FIX INTEGRITY
            </h4>
            {showSolution ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4">
                <div>
                  <p className="text-[10px] font-pixel text-y3k-cyan mb-1">CORRECTED CODE</p>
                  <code className="text-sm text-green-400">{r.fix}</code>
                </div>
                <PixelButton onClick={() => {
                  setShowSolution(false);
                  setShowHint(false);
                  onSolve();
                }} className="bg-y3k-purple">
                  APPLY FIX
                </PixelButton>
              </motion.div>
            ) : (
              <div className="flex items-center justify-center h-full opacity-30">
                <RefreshCw className="animate-spin" />
              </div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showSolution && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-y3k-black border-2 border-y3k-cyan p-6 rounded-lg shrink-0"
            >
              <h4 className="font-pixel text-y3k-cyan text-xs mb-2 uppercase">Learning Reflection</h4>
              <p className="text-sm text-y3k-silver leading-relaxed">
                {r.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const QuestModeView = ({ round, quest, onAnswer, feedback, isGameOver, onHome, character, powerActive, powerUsed, onActivatePower }: any) => {
  const q = quest;
  
  // Cosine Power: Erase one wrong answer
  const [erasedOption, setErasedOption] = useState<string | null>(null);
  
  useEffect(() => {
    if (powerActive && character?.id === 'cosine' && !erasedOption) {
      const wrongOptions = q.options.filter((opt: any) => opt.value !== q.correctValue);
      const randomWrong = wrongOptions[Math.floor(Math.random() * wrongOptions.length)];
      setErasedOption(randomWrong.value);
    }
  }, [powerActive, character, q, erasedOption]);

  useEffect(() => {
    setErasedOption(null);
  }, [round]);

  if (isGameOver) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center">
        <h2 className="text-3xl font-pixel text-y3k-silver mb-8">MODE COMPLETE!</h2>
        <PixelButton onClick={onHome}>RETURN TO MENU</PixelButton>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen p-6">
      <header className="flex justify-between items-center mb-12">
        <PixelButton onClick={onHome} className="bg-gray-800"><Home size={16} /></PixelButton>
        <h2 className="font-pixel text-y3k-silver">ALGORITHM QUEST</h2>
        <div className="font-pixel text-y3k-silver">ROUND {round + 1}/10</div>
      </header>

      <div className="mb-8 flex justify-center">
        <PowerButton character={character} active={powerActive} used={powerUsed} onClick={onActivatePower} />
      </div>

      <div className="flex-1 max-w-3xl mx-auto w-full flex flex-col justify-center">
        <div className="bg-y3k-silver/10 border-2 border-y3k-silver p-8 rounded-xl mb-8">
          <p className="text-[10px] font-pixel text-y3k-silver mb-4">SCENARIO ANALYSIS</p>
          <h3 className="text-xl font-pixel leading-relaxed">{q.scenario}</h3>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {q.options.map((opt: any) => (
            <button
              key={opt.value}
              onClick={() => onAnswer(opt.value)}
              disabled={opt.value === erasedOption}
              className={`p-6 border-2 rounded-lg font-pixel text-sm text-left transition-colors flex justify-between items-center group ${
                opt.value === erasedOption 
                  ? 'border-red-900/50 text-red-900/50 cursor-not-allowed line-through' 
                  : 'border-y3k-silver text-white hover:bg-y3k-silver/20'
              }`}
            >
              <span><span className="text-y3k-cyan mr-4">{opt.value})</span> {opt.label}</span>
              {opt.value !== erasedOption && <ChevronRight className="opacity-0 group-hover:opacity-100 transition-opacity" />}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {feedback && (
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`mt-8 p-6 rounded-lg font-pixel text-center ${feedback.type === 'success' ? 'bg-green-500/20 text-green-500 border-2 border-green-500' : 'bg-red-500/20 text-red-500 border-2 border-red-500'}`}
            >
              <div className="mb-2">{feedback.message}</div>
              {feedback.type === 'success' && <div className="text-[10px] font-sans normal-case text-white">{q.reasoning}</div>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

