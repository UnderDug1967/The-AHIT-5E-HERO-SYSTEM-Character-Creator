import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Character, 
  Characteristics, 
  FiguredCharacteristics,
  Skill, 
  Perk,
  Talent,
  Power, 
  Disadvantage, 
  CampaignTier,
  PowerOption
} from './types';
import { 
  CAMPAIGN_TIERS, 
  CHARACTERISTIC_BASE, 
  CHARACTERISTIC_COSTS,
  FIGURED_COSTS,
  EVERYMAN_SKILLS_LIST,
  SKILLS_LIBRARY,
  PERKS_LIBRARY,
  TALENTS_LIBRARY,
  POWERS_LIBRARY,
  SAMPLE_ADVANTAGES,
  SAMPLE_LIMITATIONS,
  DISAD_CATEGORIES
} from './constants';
import { calculateFigured, getRoll, heroRound } from './utils';

type AppTab = 'Concept' | 'Characteristics' | 'Skills' | 'Perks' | 'Talents' | 'Powers' | 'Disadvantages' | 'Final';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState<AppTab>('Concept');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [character, setCharacter] = useState<Character>(() => {
    const initialSkills: Skill[] = EVERYMAN_SKILLS_LIST.map(s => ({
      id: Math.random().toString(36).substr(2, 9),
      name: s.name,
      type: s.type,
      characteristic: s.characteristic as any,
      baseCost: s.baseCost,
      pointsAdded: 0,
      rollBonus: 0,
      isEveryman: true,
      specialization: s.specialization || '',
      requiresSpecialization: s.requiresSpecialization,
      isAK: s.isAK
    }));

    return {
      name: 'New Hero',
      alias: '',
      player: '',
      tier: CAMPAIGN_TIERS[3].name,
      concept: '',
      characteristics: { STR: 10, DEX: 10, CON: 10, BODY: 10, INT: 10, EGO: 10, PRE: 10, COM: 10 },
      figuredBonuses: { PD: 0, ED: 0, SPD: 0, REC: 0, END: 0, STUN: 0 },
      skills: initialSkills,
      perks: [],
      talents: [],
      powers: [],
      disadvantages: []
    };
  });

  // Handle Splash Screen Timer
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const tier = useMemo(() => CAMPAIGN_TIERS.find(t => t.name === character.tier) || CAMPAIGN_TIERS[3], [character.tier]);

  const costs = useMemo(() => {
    const charCost = (Object.entries(character.characteristics) as [string, number][]).reduce((acc, [key, val]) => acc + (val - CHARACTERISTIC_BASE) * CHARACTERISTIC_COSTS[key as keyof typeof CHARACTERISTIC_COSTS], 0);
    const figuredCost = (Object.entries(character.figuredBonuses) as [string, number][]).reduce((acc, [key, val]) => acc + val * FIGURED_COSTS[key as keyof typeof FIGURED_COSTS], 0);
    const skillCost = character.skills.reduce((acc, s) => acc + (s.isEveryman ? 0 : s.baseCost + s.pointsAdded), 0);
    const perkCost = character.perks.reduce((acc, p) => acc + p.cost, 0);
    const talentCost = character.talents.reduce((acc, t) => acc + t.cost, 0);
    const powerCost = character.powers.reduce((acc, p) => {
      const optionCost = p.options.filter(o => o.isActive).reduce((sum, o) => sum + o.cost, 0);
      const basePoints = p.fixedBaseCost + (p.level * p.perUnitCost) + optionCost;
      const advMult = 1 + p.advantages.reduce((sum, a) => sum + a.value, 0);
      const limMult = 1 + p.limitations.reduce((sum, l) => sum + l.value, 0);
      const activePoints = Math.ceil(basePoints * advMult);
      return acc + Math.floor(activePoints / limMult);
    }, 0);
    const totalSpent = charCost + figuredCost + skillCost + perkCost + talentCost + powerCost;
    const disadPoints = character.disadvantages.reduce((acc, d) => acc + d.value, 0);
    const totalBudget = tier.basePoints + Math.min(disadPoints, tier.maxDisadPoints);
    return { totalSpent, disadPoints, totalBudget, charCost, figuredCost, skillCost, perkCost, talentCost, powerCost };
  }, [character, tier]);

  // Characteristics Logic
  const updateChar = (field: keyof Characteristics, val: number) => setCharacter(prev => ({ ...prev, characteristics: { ...prev.characteristics, [field]: val } }));
  const updateFiguredBonus = (field: keyof FiguredCharacteristics, val: number) => setCharacter(prev => ({ ...prev, figuredBonuses: { ...prev.figuredBonuses, [field]: val } }));
  const baseFigured = useMemo(() => calculateFigured(character.characteristics), [character.characteristics]);
  const finalFigured = useMemo(() => {
    const final: FiguredCharacteristics = { ...baseFigured };
    (Object.keys(character.figuredBonuses) as Array<keyof FiguredCharacteristics>).forEach(key => final[key] += character.figuredBonuses[key]);
    return final;
  }, [baseFigured, character.figuredBonuses]);

  // Skill Builder State
  const [selectedSkillDef, setSelectedSkillDef] = useState<any>(SKILLS_LIBRARY[0]);
  const [skillForm, setSkillForm] = useState<{proficiency: string, bonus: number, specialization: string, isAK: boolean}>({
    proficiency: 'Full Skill',
    bonus: 0,
    specialization: '',
    isAK: false
  });

  useEffect(() => {
    if (!selectedSkillDef) return;
    setSkillForm(prev => ({ ...prev, specialization: selectedSkillDef.specializations?.[0] || '', isAK: selectedSkillDef.isAK || false }));
  }, [selectedSkillDef]);

  const currentSkillCost = useMemo(() => {
    if (!selectedSkillDef) return 0;
    if (skillForm.proficiency === 'Everyman') return 0;
    if (skillForm.proficiency === 'Familiarity') return 1;
    return selectedSkillDef.baseCost + (skillForm.bonus * 2);
  }, [selectedSkillDef, skillForm]);

  const addSkill = () => {
    const isEveryman = skillForm.proficiency === 'Everyman';
    const isFamiliarity = skillForm.proficiency === 'Familiarity';
    const newSkill: Skill = {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedSkillDef.name,
      type: selectedSkillDef.type,
      characteristic: selectedSkillDef.characteristic as any,
      baseCost: isEveryman ? 0 : (isFamiliarity ? 1 : selectedSkillDef.baseCost),
      pointsAdded: (isEveryman || isFamiliarity) ? 0 : (skillForm.bonus * 2),
      rollBonus: skillForm.bonus,
      isEveryman,
      isFamiliarity,
      specialization: skillForm.specialization,
      requiresSpecialization: selectedSkillDef.requiresSpecialization,
      isAK: selectedSkillDef.isAK
    };
    setCharacter(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
  };
  const removeSkill = (id: string) => setCharacter(prev => ({ ...prev, skills: prev.skills.filter(s => s.id !== id) }));

  // Perks/Talents
  const [selectedPerkDef, setSelectedPerkDef] = useState<any>(PERKS_LIBRARY[0]);
  const [perkForm, setPerkForm] = useState<{options: Record<string, string>, notes: string}>({ options: {}, notes: '' });
  useEffect(() => {
    if (!selectedPerkDef) return;
    const opts: Record<string, string> = {};
    selectedPerkDef.options.forEach((o: any) => opts[o.name] = Object.keys(o.values)[0]);
    setPerkForm({ options: opts, notes: '' });
  }, [selectedPerkDef]);
  const currentPerkCost = useMemo(() => {
    if (!selectedPerkDef) return 0;
    return selectedPerkDef.baseCost + selectedPerkDef.options.reduce((acc: number, o: any) => acc + (o.values[perkForm.options[o.name]] || 0), 0);
  }, [selectedPerkDef, perkForm]);
  const addPerk = () => {
    const details = Object.entries(perkForm.options).map(([k, v]) => `${k}: ${v}`).join(', ');
    setCharacter(prev => ({ ...prev, perks: [...prev.perks, { id: Math.random().toString(36).substr(2, 9), name: selectedPerkDef.name, cost: currentPerkCost, description: details, notes: perkForm.notes }] }));
  };
  const removePerk = (id: string) => setCharacter(prev => ({ ...prev, perks: prev.perks.filter(p => p.id !== id) }));

  const [selectedTalentDef, setSelectedTalentDef] = useState<any>(TALENTS_LIBRARY[0]);
  const [talentForm, setTalentForm] = useState<{options: Record<string, string>, notes: string}>({ options: {}, notes: '' });
  useEffect(() => {
    if (!selectedTalentDef) return;
    const opts: Record<string, string> = {};
    selectedTalentDef.options.forEach((o: any) => opts[o.name] = Object.keys(o.values)[0]);
    setTalentForm({ options: opts, notes: '' });
  }, [selectedTalentDef]);
  const currentTalentCost = useMemo(() => {
    if (!selectedTalentDef) return 0;
    return selectedTalentDef.baseCost + selectedTalentDef.options.reduce((acc: number, o: any) => acc + (o.values[talentForm.options[o.name]] || 0), 0);
  }, [selectedTalentDef, talentForm]);
  const addTalent = () => {
    const details = Object.entries(talentForm.options).map(([k, v]) => `${k}: ${v}`).join(', ');
    setCharacter(prev => ({ ...prev, talents: [...prev.talents, { id: Math.random().toString(36).substr(2, 9), name: selectedTalentDef.name, cost: currentTalentCost, description: details, notes: talentForm.notes }] }));
  };
  const removeTalent = (id: string) => setCharacter(prev => ({ ...prev, talents: prev.talents.filter(t => t.id !== id) }));

  // Powers
  const [selectedPowerDef, setSelectedPowerDef] = useState<any>(POWERS_LIBRARY[0]);
  const [powerForm, setPowerForm] = useState<{level: number, customName: string, options: Record<string, string>, notes: string}>({ level: 1, customName: '', options: {}, notes: '' });
  useEffect(() => {
    if (!selectedPowerDef) return;
    const opts: Record<string, string> = {};
    selectedPowerDef.options.forEach((o: any) => opts[o.name] = Object.keys(o.values)[0]);
    setPowerForm({ level: selectedPowerDef.perUnitCost > 0 ? 1 : 0, customName: selectedPowerDef.name, options: opts, notes: '' });
  }, [selectedPowerDef]);
  const currentPowerBaseCost = useMemo(() => {
    if (!selectedPowerDef) return 0;
    const base = selectedPowerDef.fixedBaseCost + (powerForm.level * selectedPowerDef.perUnitCost);
    return base + selectedPowerDef.options.reduce((acc: number, o: any) => acc + (o.values[powerForm.options[o.name]] || 0), 0);
  }, [selectedPowerDef, powerForm]);
  const addPower = () => {
    setCharacter(prev => ({ ...prev, powers: [...prev.powers, {
      id: Math.random().toString(36).substr(2, 9),
      name: selectedPowerDef.name,
      customName: powerForm.customName || selectedPowerDef.name,
      description: Object.entries(powerForm.options).map(([k,v]) => `${k}: ${v}`).join(', '),
      level: powerForm.level,
      perUnitCost: selectedPowerDef.perUnitCost,
      unitName: selectedPowerDef.unitName,
      fixedBaseCost: selectedPowerDef.fixedBaseCost,
      options: selectedPowerDef.options.map((opt: any) => ({ id: Math.random().toString(36).substr(2, 5), name: `${opt.name}: ${powerForm.options[opt.name]}`, cost: opt.values[powerForm.options[opt.name]], isActive: true })),
      advantages: [], limitations: [], notes: powerForm.notes
    }] }));
  };
  const removePower = (id: string) => setCharacter(prev => ({ ...prev, powers: prev.powers.filter(p => p.id !== id) }));
  const addModifier = (powerId: string, modName: string, type: 'adv' | 'lim') => {
    const list = type === 'adv' ? SAMPLE_ADVANTAGES : SAMPLE_LIMITATIONS;
    const mod = list.find(m => m.name === modName);
    if (!mod) return;
    setCharacter(prev => ({ ...prev, powers: prev.powers.map(p => p.id === powerId ? { ...p, [type === 'adv' ? 'advantages' : 'limitations']: [...p[type === 'adv' ? 'advantages' : 'limitations'], { id: Math.random().toString(), ...mod }] } : p) }));
  };
  const removeModifier = (powerId: string, modId: string, type: 'adv' | 'lim') => {
    setCharacter(prev => ({ ...prev, powers: prev.powers.map(p => p.id === powerId ? { ...p, [type === 'adv' ? 'advantages' : 'limitations']: p[type === 'adv' ? 'advantages' : 'limitations'].filter(m => m.id !== modId) } : p) }));
  };

  // Disadvantages
  const [selectedDisadCat, setSelectedDisadCat] = useState<any>(DISAD_CATEGORIES[0]);
  const [disadForm, setDisadForm] = useState<{templateName: string, customName: string, options: Record<string, string>}>({ templateName: 'Other', customName: '', options: {} });
  
  useEffect(() => {
    if (!selectedDisadCat) return;
    const opts: Record<string, string> = {};
    selectedDisadCat.options.forEach((o: any) => opts[o.name] = Object.keys(o.values)[0]);
    setDisadForm({ templateName: 'Other', customName: '', options: opts });
  }, [selectedDisadCat]);

  const handleDisadTemplateChange = (templateName: string) => {
    if (templateName === 'Other') {
      const opts: Record<string, string> = {};
      selectedDisadCat.options.forEach((o: any) => opts[o.name] = Object.keys(o.values)[0]);
      setDisadForm(prev => ({ ...prev, templateName: 'Other', customName: '', options: opts }));
    } else {
      const example = selectedDisadCat.examples?.find((ex: any) => ex.name === templateName);
      if (example) {
        setDisadForm(prev => ({
          ...prev,
          templateName,
          customName: '',
          options: { ...prev.options, ...example.options }
        }));
      }
    }
  };

  const currentDisadValue = useMemo(() => {
    if (!selectedDisadCat) return 0;
    return selectedDisadCat.baseCost + selectedDisadCat.options.reduce((acc: number, o: any) => acc + (o.values[disadForm.options[o.name]] || 0), 0);
  }, [selectedDisadCat, disadForm]);
  const addDisadvantage = () => {
    const details = Object.entries(disadForm.options).map(([k, v]) => `${k}: ${v}`).join(', ');
    const finalName = disadForm.templateName === 'Other' ? (disadForm.customName || selectedDisadCat.name) : disadForm.templateName;
    setCharacter(prev => ({ ...prev, disadvantages: [...prev.disadvantages, { id: Math.random().toString(36).substr(2, 9), category: selectedDisadCat.name, name: finalName, details, value: currentDisadValue }] }));
  };
  const removeDisadvantage = (id: string) => setCharacter(prev => ({ ...prev, disadvantages: prev.disadvantages.filter(d => d.id !== id) }));

  // Shared UI Helpers
  const getSkillRoll = (s: Skill) => {
    if (s.isEveryman || s.isFamiliarity) return '8-';
    if (s.characteristic === 'None') return 'N/A';
    const base = 9 + heroRound(character.characteristics[s.characteristic as keyof Characteristics] / 5);
    return `${base + (s.pointsAdded / 2)}-`;
  };

  // File IO
  const handlePrint = () => window.print();
  const handleExportJSON = () => {
    const dataStr = JSON.stringify(character, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `${character.alias || character.name || 'character'}.hero`);
    linkElement.click();
  };
  const handleImportJSON = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        setCharacter(JSON.parse(e.target?.result as string));
        setActiveTab('Concept');
      } catch (err) { alert("Invalid .hero file."); }
    };
    reader.readAsText(file);
  };

  const PointGauge = () => (
    <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 text-xs shadow-inner no-print sidebar-gauge">
      <div className="flex justify-between font-bold text-zinc-500 uppercase">
        <span>Spent</span>
        <span className={costs.totalSpent > costs.totalBudget ? 'text-red-500' : 'text-green-500'}>{costs.totalSpent}</span>
      </div>
      <div className="flex justify-between font-bold text-zinc-500 uppercase">
        <span>Budget</span>
        <span>{costs.totalBudget}</span>
      </div>
      <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
        <div 
          className={`h-full transition-all ${costs.totalSpent > costs.totalBudget ? 'bg-red-600' : 'bg-green-600'}`} 
          style={{ width: `${Math.min(100, (costs.totalSpent / costs.totalBudget) * 100)}%` }} 
        />
      </div>
      <p className="text-[10px] text-zinc-600 italic text-center">
        Base: {tier.basePoints} + Disad: {Math.min(costs.disadPoints, tier.maxDisadPoints)}
      </p>
    </div>
  );

  const tabs: AppTab[] = ['Concept', 'Characteristics', 'Skills', 'Perks', 'Talents', 'Powers', 'Disadvantages', 'Final'];

  if (showSplash) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#0d0d0d] flex flex-col items-center justify-center overflow-hidden">
        {/* Cinematic Background Image Overlayed with Glow */}
        <div className="absolute inset-0 z-0">
          <img 
            src="splash.png" 
            alt="Hero System" 
            className="w-full h-full object-cover object-center animate-in fade-in duration-1000 scale-[1.02]"
            onError={(e) => {
              // High contrast fallback if image is missing
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement!.style.background = 'radial-gradient(circle, #2a1000 0%, #000 100%)';
            }}
          />
          {/* Subtle vignette and glow to match the image chest symbol */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,_rgba(255,100,0,0.1)_0%,_transparent_50%)]" />
        </div>

        {/* Dynamic Ember/Spark Particles System */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i} 
              className={`ember ember-${i % 4}`} 
              style={{ 
                left: `${Math.random() * 100}%`, 
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }} 
            />
          ))}
        </div>

        {/* Cinematic Loading Interface */}
        <div className="absolute bottom-16 w-full max-w-sm px-8 z-20 flex flex-col items-center">
          <div className="w-full bg-black/60 backdrop-blur-md h-1.5 rounded-full overflow-hidden border border-orange-500/20 shadow-[0_0_15px_rgba(255,100,0,0.1)]">
            <div 
              className="h-full bg-gradient-to-r from-orange-700 via-orange-500 to-yellow-400 animate-[loading_5s_linear_forwards] shadow-[0_0_10px_#ff6a00]" 
              style={{ width: '0%' }} 
            />
          </div>
          <div className="flex justify-between w-full mt-3 px-1">
             <p className="text-orange-500/60 text-[9px] font-black uppercase tracking-[0.4em] oswald animate-pulse">Initializing Creator</p>
             <p className="text-orange-500/40 text-[9px] font-black uppercase tracking-[0.2em] oswald">Ver 1.0.0</p>
          </div>
        </div>

        <style>{`
          @keyframes loading {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .ember {
            position: absolute;
            bottom: -5%;
            width: 3px;
            height: 3px;
            background: #ff8c00;
            box-shadow: 0 0 8px #ff4500, 0 0 2px white;
            border-radius: 50%;
            opacity: 0;
            filter: blur(0.5px);
            animation: rise infinite ease-out;
          }
          @keyframes rise {
            0% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
            20% { opacity: 0.8; }
            80% { opacity: 0.8; }
            100% { transform: translateY(-110vh) rotate(360deg) scale(0.2); opacity: 0; }
          }
          .ember-1 { width: 2px; height: 2px; box-shadow: 0 0 5px #ffa500; }
          .ember-2 { width: 4px; height: 1px; border-radius: 20%; }
          .ember-3 { width: 1.5px; height: 1.5px; box-shadow: 0 0 10px #ff0000; }
        `}</style>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[100dvh] overflow-hidden bg-zinc-950 transition-opacity duration-1000 animate-in fade-in">
      {/* Sidebar - Desktop */}
      <nav className="hidden lg:flex w-72 bg-zinc-900 flex-col border-r border-zinc-800 flex-shrink-0 z-20 no-print h-full shadow-2xl">
        <div className="p-6">
          <div className="mb-8 group">
            <h1 className="text-3xl font-bold text-red-600 italic tracking-tighter oswald group-hover:scale-105 transition-transform duration-300">HERO 5e</h1>
            <p className="text-zinc-500 text-xs uppercase font-bold tracking-[0.2em]">Character Creator</p>
          </div>
          <div className="flex flex-col gap-2">
            {tabs.map(tab => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)} 
                className={`text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium uppercase text-xs tracking-widest ${activeTab === tab ? 'bg-red-600 text-white shadow-xl shadow-red-900/30 translate-x-1' : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-auto p-6 bg-zinc-950/50 border-t border-zinc-800">
          <PointGauge />
        </div>
      </nav>

      {/* Navigation - Mobile */}
      <header className="lg:hidden flex flex-col bg-zinc-900 border-b border-zinc-800 no-print flex-shrink-0 sticky top-0 z-30 shadow-xl">
        <div className="flex items-center justify-between p-4 pb-2">
          <h1 className="text-xl font-bold text-red-600 italic tracking-tighter oswald uppercase">HERO 5e</h1>
          <div className="text-[10px] font-bold text-zinc-500 uppercase">Points: <span className={costs.totalSpent > costs.totalBudget ? 'text-red-500' : 'text-green-500'}>{costs.totalSpent}</span> / {costs.totalBudget}</div>
        </div>
        <div className="overflow-x-auto scrollbar-hide flex gap-2 px-4 pb-4">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-500'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="px-4 pb-2">
           <PointGauge />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-4 lg:p-10 relative scroll-smooth transition-all duration-500">
        {activeTab === 'Concept' && (
          <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase tracking-tight">Character Conception</h2>
                <p className="text-zinc-400">Define your hero's origin, identity, and the campaign's power level.</p>
              </div>
              <div className="flex gap-2 no-print shrink-0">
                 <input type="file" ref={fileInputRef} onChange={handleImportJSON} className="hidden" accept=".hero,.json" />
                 <button onClick={() => fileInputRef.current?.click()} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-zinc-700 shadow-lg">Import .hero</button>
              </div>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-20">
              <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">True Identity Name</label><input value={character.name} onChange={e => setCharacter({...character, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-zinc-200 transition-all" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Superhero Alias</label><input value={character.alias} onChange={e => setCharacter({...character, alias: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 font-bold text-red-500 uppercase transition-all" placeholder="e.g. THE SENTINEL" /></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Campaign Tier</label><select value={character.tier} onChange={e => setCharacter({...character, tier: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-zinc-200 transition-all">{CAMPAIGN_TIERS.map(t => <option key={t.name}>{t.name}</option>)}</select></div>
              <div className="space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Player Name</label><input value={character.player} onChange={e => setCharacter({...character, player: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-3 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-zinc-200 transition-all" /></div>
              <div className="md:col-span-2 space-y-2"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Concept & Background</label><textarea rows={6} value={character.concept} onChange={e => setCharacter({...character, concept: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 text-zinc-200 transition-all resize-none" placeholder="Explain your hero's origin and motivations..." /></div>
            </div>
          </div>
        )}

        {activeTab === 'Characteristics' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Characteristics</h2><p className="text-zinc-400">Manage primary and figured stats that define your physical and mental capabilities.</p></header>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-red-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Primary Stats</h3>
                <div className="space-y-3">
                  {(Object.keys(character.characteristics) as Array<keyof Characteristics>).map(key => (
                    <div key={key} className="flex items-center gap-4 bg-zinc-950 p-3 rounded-xl border border-zinc-800/50 hover:border-red-600/30 transition-colors">
                      <div className="w-12 font-black text-lg text-zinc-300">{key}</div>
                      <div className="flex-1 flex items-center justify-between px-2 lg:px-4">
                        <div className="hidden sm:block text-[9px] text-zinc-500 uppercase font-bold tracking-wider">{character.characteristics[key] < 10 ? <span className="text-green-500">Selling</span> : `Cost x${CHARACTERISTIC_COSTS[key]}`}</div>
                        <div className="flex items-center gap-2 lg:gap-4">
                          <button onClick={() => updateChar(key, Math.max(0, character.characteristics[key] - 1))} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-600 text-white transition-all shadow-lg">-</button>
                          <span className={`w-10 text-center font-bold text-xl oswald ${character.characteristics[key] < 10 ? 'text-green-500' : 'text-red-500'}`}>{character.characteristics[key]}</span>
                          <button onClick={() => updateChar(key, character.characteristics[key] + 1)} className="w-8 h-8 rounded-lg bg-zinc-800 hover:bg-red-600 text-white transition-all shadow-lg">+</button>
                        </div>
                      </div>
                      <div className="w-14 text-right font-mono font-bold text-zinc-400 text-sm tracking-tighter">{getRoll(character.characteristics[key])}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 h-fit shadow-2xl">
                <h3 className="text-xl font-bold mb-6 text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">Figured Stats</h3>
                <div className="grid grid-cols-1 gap-3">
                  {(Object.keys(character.figuredBonuses) as Array<keyof FiguredCharacteristics>).map(key => (
                    <div key={key} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex items-center gap-4 hover:border-zinc-700 transition-all">
                      <div className="w-12 font-black text-lg text-zinc-300">{key}</div>
                      <div className="flex-1 flex items-center justify-between px-2 lg:px-4">
                        <div className="flex flex-col"><span className="text-[9px] text-zinc-600 uppercase font-bold tracking-wider">Base: {baseFigured[key]}</span></div>
                        <div className="flex items-center gap-2 lg:gap-4">
                          <button onClick={() => updateFiguredBonus(key, character.figuredBonuses[key] - 1)} className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-600 text-white transition-all text-xs shadow-lg">-</button>
                          <div className="flex flex-col items-center min-w-[32px]">
                            <span className="text-xl font-black text-white leading-none oswald">{finalFigured[key]}</span>
                            {character.figuredBonuses[key] !== 0 && <span className={`text-[9px] font-bold ${character.figuredBonuses[key] > 0 ? 'text-red-500' : 'text-green-500'}`}>{character.figuredBonuses[key] > 0 ? '+' : ''}{character.figuredBonuses[key]}</span>}
                          </div>
                          <button onClick={() => updateFiguredBonus(key, character.figuredBonuses[key] + 1)} className="w-7 h-7 rounded-lg bg-zinc-800 hover:bg-red-600 text-white transition-all text-xs shadow-lg">+</button>
                        </div>
                      </div>
                      <div className="w-16 text-right font-mono text-[10px] text-zinc-500 uppercase font-bold">{character.figuredBonuses[key] * FIGURED_COSTS[key]} pts</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Skills' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Skills</h2><p className="text-zinc-400">Broaden your capabilities with Agility, Combat, and Interaction skills.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-zinc-900 p-6 lg:p-8 rounded-3xl border border-zinc-800 h-fit space-y-6 shadow-2xl border-l-red-600 border-l-4">
                <h3 className="text-xl font-bold text-red-500 border-b border-zinc-800 pb-2 uppercase tracking-widest oswald">Skill Builder</h3>
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Select Base Skill</label>
                    <select value={selectedSkillDef?.name} onChange={e => setSelectedSkillDef(SKILLS_LIBRARY.find(s => s.name === e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 font-bold uppercase text-zinc-300 transition-all">
                      {SKILLS_LIBRARY.map(s => <option key={s.name} value={s.name}>{s.name} ({s.baseCost} pts)</option>)}
                    </select>
                  </div>
                  <div className="pt-2 space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Proficiency Level</label>
                      <select value={skillForm.proficiency} onChange={e => setSkillForm({...skillForm, proficiency: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none focus:border-red-600 uppercase font-bold text-zinc-400 transition-all">
                        <option value="Full Skill">Full Skill (Standard Cost)</option>
                        <option value="Familiarity">Familiarity (1 pt, 8- roll)</option>
                        <option value="Everyman">Everyman (0 pt, 8- roll)</option>
                      </select>
                    </div>
                    {skillForm.proficiency === 'Full Skill' && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Additional Roll Bonus</label>
                        <select value={skillForm.bonus} onChange={e => setSkillForm({...skillForm, bonus: parseInt(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none focus:border-red-600 text-zinc-300 font-medium transition-all">
                          <option value={0}>Standard Roll (+0)</option>
                          <option value={1}>+1 to Roll (+2 pts)</option>
                          <option value={2}>+2 to Roll (+4 pts)</option>
                          <option value={3}>+3 to Roll (+6 pts)</option>
                        </select>
                      </div>
                    )}
                    {(selectedSkillDef?.requiresSpecialization || selectedSkillDef?.isAK) && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Specialization / Region</label>
                        <input value={skillForm.specialization} onChange={e => setSkillForm({...skillForm, specialization: e.target.value})} placeholder="e.g. Magic, Physics, Gotham..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-xs outline-none focus:border-red-600 text-zinc-300 font-bold transition-all" />
                      </div>
                    )}
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner group">
                    <p className="text-[9px] font-black uppercase text-zinc-600 mb-1 group-hover:text-red-500 transition-colors">Total Skill Cost</p>
                    <div className="text-5xl font-black text-red-500 oswald tracking-tighter">{currentSkillCost}</div>
                  </div>
                  <button onClick={addSkill} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.2em] active:scale-[0.98]">Add Skill to Character</button>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-lg font-bold text-zinc-500 uppercase tracking-widest px-2 oswald">Acquired Skills</h3>
                <div className="space-y-3">
                  {character.skills.map(s => (
                    <div key={s.id} className={`bg-zinc-900 p-4 lg:p-5 rounded-3xl border ${s.isEveryman ? 'border-zinc-800/50 opacity-80' : 'border-zinc-800 shadow-xl'} flex items-center justify-between group hover:border-zinc-600 transition-all translate-x-0 hover:translate-x-1`}>
                      <div className="flex items-center gap-3 lg:gap-5">
                        <div className={`w-12 lg:w-14 h-12 lg:h-14 rounded-2xl flex flex-col items-center justify-center font-bold border transition-all ${s.isEveryman ? 'bg-zinc-950 text-zinc-600 border-zinc-800' : 'bg-red-600/10 text-red-500 border-red-600/30 group-hover:bg-red-600 group-hover:text-white'}`}>
                          <span className="text-lg lg:text-xl oswald leading-none">{getSkillRoll(s)}</span>
                          <span className="text-[7px] font-black uppercase tracking-tighter mt-0.5 opacity-60">Roll</span>
                        </div>
                        <div>
                          <div className="text-[8px] lg:text-[9px] font-black uppercase text-red-600 mb-0.5 tracking-[0.2em]">{s.isEveryman ? 'Everyman' : (s.isFamiliarity ? 'Familiarity' : 'Full Skill')}</div>
                          <div className="text-base lg:text-lg font-black uppercase tracking-tighter text-zinc-100 leading-tight">
                            {s.name} {s.specialization && <span className="text-zinc-500 font-normal italic ml-1 text-sm lowercase tracking-normal">({s.specialization})</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => removeSkill(s.id)} className="text-zinc-600 hover:text-red-500 p-2 transition-all opacity-0 lg:group-hover:opacity-100 active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Perks/Talents/Powers/Disadvantages Sections - Refined to match standard tabs */}
        {activeTab === 'Perks' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Perks</h2><p className="text-zinc-400">Social advantages, connections, and specialized status.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-zinc-900 p-6 lg:p-8 rounded-3xl border border-zinc-800 h-fit space-y-6 shadow-2xl border-l-red-600 border-l-4">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Perk</label>
                    <select value={selectedPerkDef?.name} onChange={e => setSelectedPerkDef(PERKS_LIBRARY.find(p => p.name === e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 font-bold uppercase text-zinc-300 transition-all">
                      {PERKS_LIBRARY.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  {selectedPerkDef?.options.map((opt: any) => (
                    <div key={opt.name} className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{opt.name}</label>
                      <select value={perkForm.options[opt.name]} onChange={e => setPerkForm({ ...perkForm, options: {...perkForm.options, [opt.name]: e.target.value} })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none text-zinc-300 transition-all">
                        {Object.entries(opt.values).map(([vName, vVal]) => <option key={vName} value={vName}>{vName} ({(vVal as any)} pts)</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="space-y-1"><label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Notes</label><input value={perkForm.notes} onChange={e => setPerkForm({...perkForm, notes: e.target.value})} placeholder="e.g. Identity: Bruce Wayne..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 text-zinc-300 transition-all" /></div>
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner"><div className="text-4xl font-black text-red-500 oswald tracking-tighter">{currentPerkCost}</div></div>
                  <button onClick={addPerk} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.2em] active:scale-[0.98]">Add Perk to Hero</button>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-3">
                {character.perks.map(p => (
                  <div key={p.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all translate-x-0 hover:translate-x-1 shadow-lg">
                    <div>
                      <div className="text-lg font-black uppercase text-zinc-100 tracking-tight">{p.name}</div>
                      <div className="text-[11px] text-zinc-500 italic mt-1 font-medium">{p.notes || p.description}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-3xl font-black text-red-500 oswald tracking-tighter">{p.cost}</div>
                      <button onClick={() => removePerk(p.id)} className="text-zinc-600 hover:text-red-500 p-2 opacity-0 lg:group-hover:opacity-100 transition-all active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Talents' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Talents</h2><p className="text-zinc-400">Innate extraordinary abilities that aren't quite super-powers.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-zinc-900 p-6 lg:p-8 rounded-3xl border border-zinc-800 h-fit space-y-6 shadow-2xl border-l-red-600 border-l-4">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Talent</label>
                    <select value={selectedTalentDef?.name} onChange={e => setSelectedTalentDef(TALENTS_LIBRARY.find(t => t.name === e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 font-bold uppercase text-zinc-300 transition-all">
                      {TALENTS_LIBRARY.map(t => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  {selectedTalentDef?.options.map((opt: any) => (
                    <div key={opt.name} className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{opt.name}</label>
                      <select value={talentForm.options[opt.name]} onChange={e => setTalentForm({ ...talentForm, options: {...talentForm.options, [opt.name]: e.target.value} })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none text-zinc-300 transition-all">
                        {Object.entries(opt.values).map(([vName, vVal]) => <option key={vName} value={vName}>{vName} ({(vVal as any)} pts)</option>)}
                      </select>
                    </div>
                  ))}
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner"><div className="text-4xl font-black text-red-500 oswald tracking-tighter">{currentTalentCost}</div></div>
                  <button onClick={addTalent} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.2em] active:scale-[0.98]">Add Talent to Hero</button>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-3">
                {character.talents.map(t => (
                  <div key={t.id} className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all translate-x-0 hover:translate-x-1 shadow-lg">
                    <div>
                      <div className="text-lg font-black uppercase text-zinc-100 tracking-tight">{t.name}</div>
                      <div className="text-[11px] text-zinc-500 italic mt-1 font-medium">{t.notes || t.description}</div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-3xl font-black text-red-500 oswald tracking-tighter">{t.cost}</div>
                      <button onClick={() => removeTalent(t.id)} className="text-zinc-600 hover:text-red-500 p-2 opacity-0 lg:group-hover:opacity-100 transition-all active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Powers' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Powers</h2><p className="text-zinc-400">Design custom super-human abilities with modifiers.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-zinc-900 p-6 lg:p-8 rounded-3xl border border-zinc-800 h-fit space-y-6 shadow-2xl border-l-red-600 border-l-4">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Base Power</label>
                    <select value={selectedPowerDef?.name} onChange={e => setSelectedPowerDef(POWERS_LIBRARY.find(p => p.name === e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 font-bold uppercase text-zinc-300 transition-all">
                      {POWERS_LIBRARY.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Display Label</label>
                    <input value={powerForm.customName} onChange={e => setPowerForm({...powerForm, customName: e.target.value})} placeholder="e.g. Laser Eyes..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 text-zinc-300 font-bold transition-all" />
                  </div>
                  {selectedPowerDef?.perUnitCost > 0 && (
                    <div className="flex items-center gap-4 bg-zinc-950 p-4 rounded-xl border border-zinc-800 shadow-inner">
                       <button onClick={() => setPowerForm({...powerForm, level: Math.max(1, powerForm.level - 1)})} className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-red-600 transition-all font-bold text-xl">-</button>
                       <div className="flex-1 text-center font-black uppercase text-xs tracking-widest text-zinc-400">
                          <span className="text-xl text-white block oswald">{powerForm.level}</span>
                          {selectedPowerDef.unitName}
                       </div>
                       <button onClick={() => setPowerForm({...powerForm, level: powerForm.level + 1})} className="w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-red-600 transition-all font-bold text-xl">+</button>
                    </div>
                  )}
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner group">
                    <p className="text-[9px] font-black uppercase text-zinc-600 mb-1 group-hover:text-red-500 transition-colors">Base Points</p>
                    <div className="text-5xl font-black text-red-500 oswald tracking-tighter">{currentPowerBaseCost}</div>
                  </div>
                  <button onClick={addPower} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.2em] active:scale-[0.98]">Construct Power Card</button>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-6">
                {character.powers.map(p => {
                  const basePts = p.fixedBaseCost + (p.level * p.perUnitCost) + p.options.filter(o => o.isActive).reduce((sum, o) => sum + o.cost, 0);
                  const adv = 1 + p.advantages.reduce((sum, a) => sum + a.value, 0);
                  const lim = 1 + p.limitations.reduce((sum, l) => sum + l.value, 0);
                  const act = Math.ceil(basePts * adv);
                  const real = Math.floor(act / lim);
                  return (
                    <div key={p.id} className="bg-zinc-900 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl group transition-all hover:border-zinc-600">
                      <div className="p-4 lg:p-6 bg-zinc-950/40 border-b border-zinc-800 flex justify-between items-center">
                        <div>
                          <div className="text-xl font-bold text-red-500 uppercase tracking-tighter oswald group-hover:scale-105 transition-transform origin-left">{p.customName}</div>
                          <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{p.name}</div>
                        </div>
                        <button onClick={() => removePower(p.id)} className="text-zinc-600 hover:text-red-500 p-2 transition-colors active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                      </div>
                      <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-5">
                          <div className="space-y-2">
                             <div className="text-[9px] font-black text-green-500 uppercase tracking-[0.2em] flex justify-between border-b border-green-500/20 pb-1">Advantages <span>+{(adv-1).toFixed(2)}</span></div>
                             <div className="flex flex-wrap gap-1 mt-2">
                               {p.advantages.map(a => <div key={a.id} className="flex items-center gap-1.5 bg-green-950/30 text-green-400 border border-green-500/20 px-2 py-1 rounded-md text-[9px] font-bold"><span>{a.name} (+{a.value})</span><button onClick={() => removeModifier(p.id, a.id, 'adv')} className="hover:text-white transition-colors">×</button></div>)}
                             </div>
                             <select onChange={e => { addModifier(p.id, e.target.value, 'adv'); e.target.value = ''; }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] outline-none text-zinc-400 hover:border-green-500/30 transition-all font-bold uppercase">
                               <option value="">+ Add Advantage...</option>{SAMPLE_ADVANTAGES.map(a => <option key={a.name} value={a.name}>{a.name} (+{a.value})</option>)}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <div className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] flex justify-between border-b border-orange-500/20 pb-1">Limitations <span>-{(lim-1).toFixed(2)}</span></div>
                             <div className="flex flex-wrap gap-1 mt-2">
                               {p.limitations.map(l => <div key={l.id} className="flex items-center gap-1.5 bg-orange-950/30 text-orange-400 border border-orange-500/20 px-2 py-1 rounded-md text-[9px] font-bold"><span>{l.name} (-{l.value})</span><button onClick={() => removeModifier(p.id, l.id, 'lim')} className="hover:text-white transition-colors">×</button></div>)}
                             </div>
                             <select onChange={e => { addModifier(p.id, e.target.value, 'lim'); e.target.value = ''; }} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[10px] outline-none text-zinc-400 hover:border-orange-500/30 transition-all font-bold uppercase">
                               <option value="">+ Add Limitation...</option>{SAMPLE_LIMITATIONS.map(l => <option key={l.name} value={l.name}>{l.name} (-{l.value})</option>)}
                             </select>
                          </div>
                        </div>
                        <div className="bg-zinc-950 rounded-2xl p-6 space-y-3 text-xs border border-zinc-800 shadow-inner flex flex-col justify-center">
                           <div className="flex justify-between items-center text-zinc-500 font-bold uppercase text-[10px]"><span>Active Points</span><span className="font-black text-zinc-300">{act}</span></div>
                           <div className="flex justify-between items-end border-t border-zinc-800 pt-3 text-red-600 font-black uppercase tracking-widest">
                              <span className="text-xs">Real Cost</span>
                              <span className="text-4xl oswald leading-none">{(real as any)}</span>
                           </div>
                           <div className="flex justify-between items-center text-zinc-600 font-black uppercase text-[8px] mt-2 tracking-[0.2em]"><span>END Cost</span><span>{Math.max(1, Math.floor(act/10))}</span></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Disadvantages' && (
          <div className="max-w-6xl space-y-8 animate-in fade-in slide-in-from-left-4 duration-500 pb-20">
            <header><h2 className="text-3xl lg:text-4xl font-bold mb-2 h2 uppercase">Disadvantages</h2><p className="text-zinc-400">Balance your hero's power with flaws and complications that define their character.</p></header>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-5 bg-zinc-900 p-6 lg:p-8 rounded-3xl border border-zinc-800 h-fit space-y-6 shadow-2xl border-l-red-600 border-l-4">
                <div className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Category</label>
                    <select value={selectedDisadCat?.name} onChange={e => setSelectedDisadCat(DISAD_CATEGORIES.find(c => c.name === e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 font-bold uppercase text-zinc-300 transition-all">
                      {DISAD_CATEGORIES.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                  </div>
                  <div className="pt-2 space-y-5">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Specific Template</label>
                      <select value={disadForm.templateName} onChange={e => handleDisadTemplateChange(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none focus:border-red-600 uppercase font-bold text-zinc-400 transition-all">
                        <option value="Other">Custom Detail...</option>{selectedDisadCat?.examples?.map((ex: any) => <option key={ex.name} value={ex.name}>{ex.name}</option>)}
                      </select>
                    </div>
                    {disadForm.templateName === 'Other' && (
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Description</label>
                        <input value={disadForm.customName} onChange={e => setDisadForm({...disadForm, customName: e.target.value})} placeholder="e.g. Fear of Spiders..." className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-3 text-sm outline-none focus:border-red-600 text-zinc-300 font-bold transition-all" />
                      </div>
                    )}
                    {selectedDisadCat?.options.map((opt: any) => (
                      <div key={opt.name} className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{opt.name}</label>
                        <select value={disadForm.options[opt.name]} onChange={e => setDisadForm({ ...disadForm, options: {...disadForm.options, [opt.name]: e.target.value} })} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-xs outline-none text-zinc-300 transition-all">
                          {Object.entries(opt.values).map(([vName, vVal]) => <option key={vName} value={vName}>{vName} ({(vVal as any)} pts)</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 text-center shadow-inner group">
                    <p className="text-[9px] font-black uppercase text-zinc-600 mb-1">Point Value</p>
                    <div className="text-4xl font-black text-red-500 oswald tracking-tighter">{currentDisadValue}</div>
                  </div>
                  <button onClick={addDisadvantage} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-2xl uppercase text-[10px] tracking-[0.2em] active:scale-[0.98]">Add Complication</button>
                </div>
              </div>
              <div className="lg:col-span-7 space-y-3">
                {character.disadvantages.map(d => (
                  <div key={d.id} className="bg-zinc-900 p-5 lg:p-6 rounded-3xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all translate-x-0 hover:translate-x-1 shadow-lg animate-in slide-in-from-right-4">
                    <div className="flex-1 pr-4">
                      <div className="text-[8px] font-black uppercase text-red-600 bg-red-600/10 px-2 py-0.5 rounded border border-red-600/20 w-fit mb-1 tracking-widest">{d.category}</div>
                      <div className="text-lg font-black uppercase tracking-tight text-zinc-100">{d.name}</div>
                      <p className="text-xs text-zinc-500 italic mt-1 font-medium">{d.details}</p>
                    </div>
                    <div className="flex items-center gap-4 lg:gap-6">
                      <div className="text-3xl font-black text-red-500 oswald tracking-tighter">{(d.value as any)}</div>
                      <button onClick={() => removeDisadvantage(d.id)} className="text-zinc-600 hover:text-red-500 p-2 opacity-0 lg:group-hover:opacity-100 transition-all active:scale-90"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Final' && (
          <div className="max-w-4xl mx-auto pb-40 animate-in zoom-in-95 duration-500">
             <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between no-print items-center">
               <div>
                 <h2 className="text-3xl font-black uppercase tracking-tight h2">Export Module</h2>
                 <p className="text-zinc-500 text-sm">Review your hero and save for your campaign.</p>
               </div>
               <div className="flex gap-3">
                 <button onClick={handleExportJSON} className="bg-zinc-900 hover:bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border border-zinc-800 flex items-center gap-2 shadow-xl hover:text-white active:scale-95"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>Export .hero</button>
                 <button onClick={handlePrint} className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-2xl shadow-red-900/40 transition-all flex items-center gap-2 active:scale-95"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>Print / Save PDF</button>
               </div>
             </div>
             
             <div className="bg-white text-zinc-900 p-6 lg:p-14 rounded-lg shadow-2xl character-sheet-container border-8 border-zinc-900 transition-all overflow-hidden relative">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-[6px] border-zinc-900 pb-6 mb-10 text-black">
                  <div>
                    <h2 className="text-4xl lg:text-6xl font-black uppercase leading-none oswald-print tracking-tighter mb-2">{character.alias || character.name || 'UNNAMED HERO'}</h2>
                    <div className="flex flex-wrap gap-4 items-center">
                      {character.alias && <span className="text-zinc-500 font-black uppercase tracking-widest text-[11px] bg-zinc-100 px-3 py-1 rounded border border-zinc-200">Identity: {character.name}</span>}
                      <span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">Tier: {character.tier}</span>
                    </div>
                    <p className="text-zinc-600 font-medium uppercase tracking-tight text-xs mt-3 italic max-w-lg">{character.concept || 'No concept defined'}</p>
                  </div>
                  <div className="text-right mt-6 md:mt-0 bg-zinc-900 text-white p-4 rounded-xl shadow-inner min-w-[140px]">
                    <div className="text-[9px] font-black uppercase tracking-[0.3em] mb-1 opacity-60">Total Points</div>
                    <div className="text-5xl lg:text-7xl font-black leading-none oswald-print tracking-tighter">{costs.totalSpent}</div>
                  </div>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                   <div className="space-y-6">
                      <h3 className="bg-zinc-900 text-white text-center py-2 font-black uppercase text-xs tracking-[0.4em] oswald-print skew-x-[-12deg] mb-4">Characteristics</h3>
                      <div className="grid grid-cols-1 gap-2 text-xs border-b-2 border-zinc-100 pb-4">
                        {Object.entries(character.characteristics).map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center py-1 border-b border-zinc-50 hover:bg-zinc-50 transition-colors px-1 text-black">
                            <b className="font-black text-sm uppercase">{k}</b>
                            <span className="font-black text-lg oswald-print">{(v as any)}</span>
                          </div>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {Object.entries(finalFigured).map(([k, v]) => (
                          <div key={k} className="bg-zinc-100 p-3 rounded-xl font-black uppercase border-2 border-zinc-200 shadow-sm text-black flex flex-col items-center justify-center">
                            <b className="text-[10px] tracking-widest mb-1 opacity-70">{k}</b>
                            <div className="text-3xl font-black oswald-print leading-none mt-1">{(v as any)}</div>
                          </div>
                        ))}
                      </div>
                   </div>
                   <div className="md:col-span-2 space-y-8">
                      <section>
                        <h3 className="border-b-[4px] border-zinc-900 font-black uppercase text-sm italic mb-4 tracking-[0.2em] text-black pb-1">Powers & Combat Gear</h3>
                        <div className="space-y-3">
                          {character.powers.map(p => {
                            const act = Math.ceil((p.fixedBaseCost + (p.level * p.perUnitCost) + p.options.filter(o => o.isActive).reduce((sum, o) => sum + o.cost, 0)) * (1 + p.advantages.reduce((sum, a) => sum + a.value, 0)));
                            const real = Math.floor(act / (1 + p.limitations.reduce((sum, l) => sum + l.value, 0)));
                            return (
                              <div key={p.id} className="flex justify-between items-start text-xs border-l-4 border-red-600 pl-4 py-2 bg-zinc-50/50 rounded-r-xl transition-all hover:bg-zinc-100/50 text-black">
                                <div className="pr-4">
                                  <b className="uppercase tracking-tight text-[13px] block leading-tight oswald-print">{p.customName}</b>
                                  <span className="text-[9px] text-zinc-500 font-bold uppercase block tracking-[0.2em] leading-none mt-1">{p.name} {p.level > 0 && `(${p.level} units)`}</span>
                                </div>
                                <div className="text-right flex flex-col items-end">
                                  <span className="font-black text-lg oswald-print leading-none">{(real as any)}</span>
                                  <span className="text-[8px] font-bold uppercase opacity-40">pts</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <section>
                          <h3 className="border-b-4 border-zinc-900 font-black uppercase text-[11px] italic mb-3 tracking-widest text-black pb-1">Perks & Talents</h3>
                          <div className="space-y-2">
                            {[...character.perks, ...character.talents].map(item => (
                              <div key={item.id} className="flex justify-between border-b border-zinc-100 py-1 text-black">
                                <span className="font-bold uppercase text-[10px] pr-2">{item.name}</span>
                                <b className="font-black text-sm oswald-print">{item.cost}</b>
                              </div>
                            ))}
                          </div>
                        </section>
                        <section>
                          <h3 className="border-b-4 border-zinc-900 font-black uppercase text-[11px] italic mb-3 tracking-widest text-black pb-1">Skills & Training</h3>
                          <div className="space-y-2">
                            {character.skills.map(s => (
                              <div key={s.id} className="flex justify-between border-b border-zinc-100 py-1 text-black">
                                <span className="font-bold uppercase text-[10px] truncate max-w-[120px]">{s.name} {s.specialization && `(${s.specialization})`}</span>
                                <b className="font-black text-sm oswald-print">{getSkillRoll(s)}</b>
                              </div>
                            ))}
                          </div>
                        </section>
                      </div>
                      <section>
                        <h3 className="border-b-[4px] border-zinc-900 font-black uppercase text-sm italic mb-4 tracking-[0.2em] text-red-600 pb-1">Complications / Disadvantages</h3>
                        <div className="grid grid-cols-1 gap-2 text-black">
                          {character.disadvantages.map(d => (
                            <div key={d.id} className="flex justify-between items-center text-[11px] border-b border-zinc-100 pb-1.5 bg-red-50/20 px-2 py-1.5 rounded-md">
                              <span className="font-medium">
                                <b className="uppercase text-red-600 tracking-tighter mr-2">{d.category}:</b> 
                                {d.name}
                              </span>
                              <b className="oswald-print text-base font-black">{(d.value as any)}</b>
                            </div>
                          ))}
                        </div>
                      </section>
                   </div>
                </div>
                <footer className="mt-16 pt-6 border-t-[6px] border-zinc-900 flex justify-between items-center">
                  <div className="text-[9px] font-black text-zinc-300 uppercase tracking-[0.6em] oswald-print">HERO RECORD SHEET V5.0</div>
                  <div className="text-[10px] font-bold text-zinc-800 uppercase oswald-print">A HERO IN THE SYSTEM</div>
                </footer>
             </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;