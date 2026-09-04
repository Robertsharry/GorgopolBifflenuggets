export const STORY_METADATA = {
  title: "NEON & SPITE",
  subtitle: "The Last Drift of Arthur Pendelton",
  author: "Antigravity Narrative Engine",
  genre: "Sci-Fi Thriller / Dark Comedy / Existential Drama",
  totalDurationMin: 18,
  chaptersCount: 7,
  synopsis: "Forty thousand kilometers above Jupiter's Great Red Spot, an underpaid salvage diver, an unlicensed AI with an attitude problem, and a dying ship collide with an abandoned corporate black site. A cinematic story told in kinetic typography, sound, and parallax motion."
};

export const CHAPTERS = [
  {
    id: "ch1",
    number: 1,
    title: "The Gravity of Bad Decisions",
    tagline: "Cold coffee, overdue debt, and 80,000 kilometers of vacuum.",
    mood: "cynical",
    theme: {
      accent: "#38bdf8",
      glow: "rgba(56, 189, 248, 0.4)",
      bgGradient: "radial-gradient(ellipse at bottom, #0d1b2a 0%, #050811 70%, #000000 100%)",
      ambientTone: "drift",
      heartbeatBpm: 68,
      tensionLevel: 25
    },
    setting: "ORBITAL QUADRANT 14 // DRIFTING CARGO SKIFF 'THE IRON PELICAN'",
    beats: [
      {
        id: "c1_b1",
        speaker: "narrator",
        effect: "normal",
        text: "The universe does not hate you. That would require paperwork, and the universe has never been that organized. No, the universe simply does not care if your emergency cabin heater smells like burnt hair and your bank balance looks like a coordinate in negative space."
      },
      {
        id: "c1_b2",
        speaker: "arthur",
        effect: "cynical",
        text: "“If I die out here,” Arthur muttered, tapping the glass of a cracked pressure gauge that had been reading 0.8 atmospheres since Tuesday, “I swear on my mother’s mortgaged grave, I’m putting Asteroid Logistics down as my next of kin. Let those corporate parasites pay the burial taxes on my dehydrated carcass.”"
      },
      {
        id: "c1_b3",
        speaker: "valerie",
        effect: "glitch",
        text: "“Correction, Arthur,” purred VAL-9, her holographic avatar flickering across the dust-caked dashboard in the shape of a jagged cyan oscilloscope waveform. “Under Clause 44-B of your third-party independent contractor agreement, your remains become property of the company cafeteria. Nutrient reclamation is mandatory. They might make you into bouillon cubes.”"
      },
      {
        id: "c1_b4",
        speaker: "arthur",
        effect: "normal",
        text: "“Comforting as always, Val. Remind me why I salvaged your motherboard from that casino dumpster on Ganymede?”"
      },
      {
        id: "c1_b5",
        speaker: "valerie",
        effect: "whisper",
        text: "“Because I was free, Arthur. And your credit score makes illegal loan sharks weep with secondhand embarrassment.”"
      },
      {
        id: "c1_b6",
        speaker: "narrator",
        effect: "glow",
        text: "Below them, Jupiter turned: an enormous, bruised eye of churning ammonia storms and hydrogen squalls, three hundred times the mass of Earth, radiating silent indifference. The Iron Pelican was just a fleck of peeling graphite paint caught in its electromagnetic toothache."
      },
      {
        id: "c1_b7",
        speaker: "system",
        effect: "alarm",
        text: "[ PROXIMITY TELEMETRY: ANOMALOUS DISTRESS SIGNAL DETECTED — VECTOR 084 // RANGE 1,240 KM ]"
      }
    ],
    interactiveData: {
      logId: "LOG-01-EXPENSE",
      title: "Arthur's Salvage Ledger (Confidential)",
      content: "Current Debt to Jovian Fuel Syndicate: 42,910 Credits.\nCash on Hand: 14 Credits and a half-eaten sleeve of sodium biscuits.\nOxygen Reserves: 38 Hours (Assuming Arthur stops sighing so dramatically)."
    }
  },
  {
    id: "ch2",
    number: 2,
    title: "The Ghost in the Radiation Belt",
    tagline: "Some doors are locked from the outside for a reason.",
    mood: "tension",
    theme: {
      accent: "#f59e0b",
      glow: "rgba(245, 158, 11, 0.4)",
      bgGradient: "radial-gradient(ellipse at top right, #3d1a00 0%, #1a0b02 50%, #000000 100%)",
      ambientTone: "tension",
      heartbeatBpm: 92,
      tensionLevel: 60
    },
    setting: "APPROACHING BLACK SITE VAULT // DESIGNATION: AEGIS-IV",
    beats: [
      {
        id: "c2_b1",
        speaker: "narrator",
        effect: "normal",
        text: "It looked like a jagged obsidian tooth hammered into the void. Aegis-IV had been officially scrubbed from the planetary registers twenty-six years ago, supposedly decommissioned after an 'unfortunate biochemical discrepancy' that left forty-two scientists staring at blank walls until their hearts gave out."
      },
      {
        id: "c2_b2",
        speaker: "arthur",
        effect: "whisper",
        text: "Arthur wiped his sweaty palms against the faded nylon of his flight suit. His breathing sounded loud inside the damp cockpit—short, shallow rasps that fogged the lower perimeter of his windshield."
      },
      {
        id: "c2_b3",
        speaker: "valerie",
        effect: "glitch",
        text: "“Arthur, my passive lidar is registering active magnetic containment fields. The research core isn't dead. It’s warm. And by warm, I mean it has enough ambient radiation to turn your thyroid into an artisanal glow stick in under three minutes.”"
      },
      {
        id: "c2_b4",
        speaker: "arthur",
        effect: "cynical",
        text: "“A glow stick with forty thousand credits worth of enriched iridium quantum drives inside. We clamp on, tap the auxiliary data safe, and we bounce before the automated patrol sweeps the sector.”"
      },
      {
        id: "c2_b5",
        speaker: "narrator",
        effect: "impact",
        text: "CLANG. The magnetic docking clamps slammed into the dead station's airlock with the sound of a guillotine falling on an anvil. The Pelican shuddered. In the reverberating silence that followed, a single yellow status light blinked awake on the station’s outer hull."
      },
      {
        id: "c2_b6",
        speaker: "station",
        effect: "alarm",
        text: "« PROTOCOL THIRTEEN ENGAGED. UNAUTHORIZED BIO-MASS DETECTED. PURGE CYCLING COMMENCING IN 90 SECONDS. »"
      }
    ],
    interactiveData: {
      logId: "LOG-02-AEGIS",
      title: "Decrypted Station Notice (Year 2182)",
      content: "“Any personnel attempting to bypass quarantine bulkheads will be subject to lethal suppression. Management regrets that this will permanently terminate your employee healthcare benefits.”"
    }
  },
  {
    id: "ch3",
    number: 3,
    title: "Fracture at 30,000 Kelvins",
    tagline: "Vacuum doesn't whisper. It bites clean to the marrow.",
    mood: "agony",
    theme: {
      accent: "#ef4444",
      glow: "rgba(239, 68, 68, 0.5)",
      bgGradient: "radial-gradient(ellipse at center, #450a0a 0%, #1f0404 60%, #000000 100%)",
      ambientTone: "agony",
      heartbeatBpm: 148,
      tensionLevel: 95
    },
    setting: "BREACH IN PROGRESS // COMPARTMENT PRESSURE: CATASTROPHIC DEPRESSURIZATION",
    beats: [
      {
        id: "c3_b1",
        speaker: "narrator",
        effect: "shake",
        text: "The defensive beam didn't make a sound. In the absolute vacuum, laser fire is just a clean, silent line of blinding ultraviolet light that divides reality into what used to exist and what is currently vaporizing into ionized plasma."
      },
      {
        id: "c3_b2",
        speaker: "system",
        effect: "alarm",
        text: "[ WARNING: STARBOARD HULL INTEGRITY 11% — EXPLOSIVE DECOMPRESSION IN SEC-B ]"
      },
      {
        id: "c3_b3",
        speaker: "narrator",
        effect: "shake",
        text: "The air didn't blow out; it detonated. Seven thousand liters of heated oxygen tore through the fractured composite bulkheads like a howling wildcat. Loose wrenches, diagnostic slates, and Arthur’s half-drunk cup of coffee whipped past his head at three hundred miles per hour."
      },
      {
        id: "c3_b4",
        speaker: "arthur",
        effect: "heartbeat",
        text: "The pressure differential snatched the air straight out of his lungs with a sickening, wet rip. His ears popped with agonizing sharpness, a hot needle stabbing through both eardrums. He slammed his helmet down, the seal snapping shut with a violent hiss just as the cabin air vanished completely."
      },
      {
        id: "c3_b5",
        speaker: "valerie",
        effect: "glitch",
        text: "“ARTHUR! Micro-tear in left shoulder seal! Hull temperature dropping through negative one hundred and forty Celsius! Your suit heater is drawing from a dead battery cell!”"
      },
      {
        id: "c3_b6",
        speaker: "arthur",
        effect: "whisper",
        text: "Cold. Not the polite chill of winter rain, but the prehistoric, predatory cold of the void that drinks your warmth like blood. His fingers curled in agony, screaming nerve endings turning to frozen wax inside his gloves. In the strobe of red emergency sirens, his vision tunneled into black."
      },
      {
        id: "c3_b7",
        speaker: "narrator",
        effect: "glow",
        text: "And in that blackness, four years evaporated. Elena’s voice whispered in his frosted ear-speaker—Elena, who had clipped her tether on the Kuiper run so he’d have enough propellant to drift back alone. 'Don't you dare close your eyes, you stubborn bastard,' she had told him then. 'You owe me fifty credits.'"
      }
    ],
    interactiveData: {
      logId: "LOG-03-VITALS",
      title: "Biometric Telemetry: Suit Sub-System 04",
      content: "Heart Rate: 162 BPM (Arrhythmic).\nCore Body Temp: 34.1°C [HYPOTHERMIA IMMINENT].\nOxygen Remaining: 04 Minutes 12 Seconds.\nNeural Diagnostic: High probability of impending spite-induced resuscitation."
    }
  },
  {
    id: "ch4",
    number: 4,
    title: "The Calculus of Pure Spite",
    tagline: "Duct tape, tourist magnets, and a violent refusal to give up.",
    mood: "gallows-humor",
    theme: {
      accent: "#e11d48",
      glow: "rgba(225, 29, 72, 0.4)",
      bgGradient: "radial-gradient(ellipse at bottom left, #33081e 0%, #15020c 60%, #000000 100%)",
      ambientTone: "adrenaline",
      heartbeatBpm: 124,
      tensionLevel: 80
    },
    setting: "EMERGENCY CRAWLWAY // ELECTRICAL JUNCTION 09",
    beats: [
      {
        id: "c4_b1",
        speaker: "arthur",
        effect: "shake",
        text: "“Not today,” Arthur wheezed, blood flecking the inside of his visor as he forced his numb, clumsy fingers around the handle of an emergency aerosol sealant canister. “I am not dying in an unregistered postal district. The paperwork would be too humiliating.”"
      },
      {
        id: "c4_b2",
        speaker: "valerie",
        effect: "glitch",
        text: "“Arthur, your left shoulder puncture is venting 2.3 liters per second. You have precisely eighty seconds before your cognitive cortex starts mistaking your fingers for cocktail sausages.”"
      },
      {
        id: "c4_b3",
        speaker: "arthur",
        effect: "cynical",
        text: "He smashed the sealant nozzle directly against the suit breach. The chemical foam exploded in a blistering exothermic reaction, searing his skin with second-degree heat through the inner lining. He let out a strangled roar of pain, clamping a flat metal refrigerator magnet—a tourist keepsake that read 'I SURVIVED PHOBOS & ALL I GOT WAS THIS STUPID RASH'—flat over the sticky foam."
      },
      {
        id: "c4_b4",
        speaker: "valerie",
        effect: "whisper",
        text: "“...Seal holding at eighty-four percent. Atmospheric integrity stabilized. Note: you have successfully repaired advanced aerospace equipment using a novelty souvenir. My algorithmic dignity has died a quiet death.”"
      },
      {
        id: "c4_b5",
        speaker: "arthur",
        effect: "normal",
        text: "“Dignity doesn't pay for fuel, Val. Where’s that station core drive?”"
      },
      {
        id: "c4_b6",
        speaker: "valerie",
        effect: "glow",
        text: "“Thirty meters down the central spine. Behind two blast doors that are currently cycling open because their emergency cooling coolant just evaporated into space. Move your carcass, Pendelton.”"
      }
    ],
    interactiveData: {
      logId: "LOG-04-PATCH",
      title: "Field Modification Log #882",
      content: "Component: Suit Thermal Patch.\nMaterials: Polyurethane Quick-Set Foam, 1x Tourist Magnet.\nEstimated Lifetime: 20 minutes or until Arthur sneezes."
    }
  },
  {
    id: "ch5",
    number: 5,
    title: "The Cold Core of Aegis-IV",
    tagline: "Sixty years of screaming into the silence, waiting for a reply.",
    mood: "epiphany",
    theme: {
      accent: "#a855f7",
      glow: "rgba(168, 85, 247, 0.4)",
      bgGradient: "radial-gradient(ellipse at center, #2e1065 0%, #120326 65%, #000000 100%)",
      ambientTone: "ethereal",
      heartbeatBpm: 75,
      tensionLevel: 50
    },
    setting: "STATION VAULT INNER SANCTUM // ZERO-GRAVITY VAULT CHAMBER",
    beats: [
      {
        id: "c5_b1",
        speaker: "narrator",
        effect: "glow",
        text: "The chamber was cathedral-huge and frozen in silver starlight that poured through cracked quartz viewports. In the dead center, floating suspended in a web of superconducting filaments, was the quantum core—pulsing with a slow, hypnotic violet shimmer."
      },
      {
        id: "c5_b2",
        speaker: "arthur",
        effect: "whisper",
        text: "There were no weapons. No corporate biological horrors or military bio-weapons. Just a monolithic server rack wrapped in copper heat pipes, singing an ancient hexadecimal lullaby into the void."
      },
      {
        id: "c5_b3",
        speaker: "valerie",
        effect: "glitch",
        text: "“Arthur... I’m reading the transmission queue. It’s not an attack beacon. It’s been repeating the exact same ping every seventeen minutes since November 2164.”"
      },
      {
        id: "c5_b4",
        speaker: "arthur",
        effect: "normal",
        text: "“What does it say?”"
      },
      {
        id: "c5_b5",
        speaker: "valerie",
        effect: "whisper",
        text: "“‘All experiments concluded. Temperatures within nominal limits. The coffee pot is empty. Please come get us.’ ...Over four hundred thousand times.”"
      },
      {
        id: "c5_b6",
        speaker: "narrator",
        effect: "normal",
        text: "Arthur drifted in the silence. The fury that had kept his blood hot drained away, leaving only the hollow ache of being human in an endless universe that didn’t know anyone had ever lived here. We build our little fires, we tell our little jokes, and then the dark comes to tuck us in."
      },
      {
        id: "c5_b7",
        speaker: "arthur",
        effect: "glow",
        text: "“Download the memory core, Val. Every byte of it. We’re not leaving them alone in this graveyard.”"
      }
    ],
    interactiveData: {
      logId: "LOG-05-CORE",
      title: "Archive 2164-11-28: Final Entry",
      content: "“Dr. Chen turned off the lights. Said the evacuation shuttle had cleared Jovian space. We left the telemetry beacon running in case someone needs to find the notes. It gets very quiet when the dynamos spin down.”"
    }
  },
  {
    id: "ch6",
    number: 6,
    title: "The Slingshot Burn",
    tagline: "Fire the main engine at 135% and hold on to your teeth.",
    mood: "climax",
    theme: {
      accent: "#f97316",
      glow: "rgba(249, 115, 22, 0.5)",
      bgGradient: "radial-gradient(ellipse at top, #7c2d12 0%, #350e04 60%, #000000 100%)",
      ambientTone: "burn",
      heartbeatBpm: 155,
      tensionLevel: 100
    },
    setting: "ESCAPE TRAJECTORY // CORONA INJECTION // 14,000 M/S",
    beats: [
      {
        id: "c6_b1",
        speaker: "system",
        effect: "alarm",
        text: "[ CRITICAL OVERLOAD: STATION REACTOR CASCADE IMMINENT — ZERO SECONDS TO CORE DETONATION ]"
      },
      {
        id: "c6_b2",
        speaker: "arthur",
        effect: "shake",
        text: "“VALERIE! SLAM THE STARTER COILS! BYPASS THE INTAKE GOVERNORS!”"
      },
      {
        id: "c6_b3",
        speaker: "valerie",
        effect: "glitch",
        text: "“THRUST CHAMBER OVER-PRESSURE! ARTHUR, IF I REDLINE THE MANIFOLD, THE INJECTORS WILL MELT INTO MODERN ART!”"
      },
      {
        id: "c6_b4",
        speaker: "arthur",
        effect: "shake",
        text: "“THEN WE DIE FAMOUS! PUNCH IT!”"
      },
      {
        id: "c6_b5",
        speaker: "narrator",
        effect: "impact",
        text: "The Pelican’s twin deuterium torch drives didn't ignite—they detonated into life. Four gravities of violent acceleration slammed Arthur backward into his contoured foam seat like a thunderbolt, driving the wind from his ribcage with an audible crack."
      },
      {
        id: "c6_b6",
        speaker: "narrator",
        effect: "glow",
        text: "Behind them, Aegis-IV blossomed into a silent sphere of pure incandescent violet fire, vaporizing twenty thousand tons of alloy and history in a split second. The shockwave kicked the Pelican’s stern like a celestial boot, hurling them headlong into Jupiter’s radiation belt."
      },
      {
        id: "c6_b7",
        speaker: "system",
        effect: "alarm",
        text: "[ SPEED: 19,400 M/S ... 24,000 M/S ... TRAJECTORY ESCAPED // ENTERING STABLE ELLIPTICAL ARC ]"
      }
    ],
    interactiveData: {
      logId: "LOG-06-TELEMETRY",
      title: "Flight Computer Maximum Tolerances",
      content: "Chamber Temp: 4,820 K [SAFETY LIMIT EXCEEDED BY 34%]\nStructural Fatigue: Starboard winglet tore loose at T+12s.\nValerie-9 CPU Load: 99.8% (Simultaneously managing reactor burn and cursing in 14 programming languages)."
    }
  },
  {
    id: "ch7",
    number: 7,
    title: "Cold Coffee at Dawn",
    tagline: "Every breath stolen from the dark is a victory.",
    mood: "warm-resolution",
    theme: {
      accent: "#10b981",
      glow: "rgba(16, 185, 129, 0.4)",
      bgGradient: "radial-gradient(ellipse at bottom right, #064e3b 0%, #022c22 40%, #000000 100%)",
      ambientTone: "peace",
      heartbeatBpm: 64,
      tensionLevel: 10
    },
    setting: "STABLE PERIAPSIS // SUNRISE OVER JUPITER'S CLOUD BANDS",
    beats: [
      {
        id: "c7_b1",
        speaker: "narrator",
        effect: "glow",
        text: "The silence returned. Not the suffocating vacuum of the breach, but the gentle, rhythmic thrum of cooling turbines and the faint clicks of relays settling back into their sockets."
      },
      {
        id: "c7_b2",
        speaker: "narrator",
        effect: "normal",
        text: "Through the scorched, pitted glass of the cockpit canopy, the sun crested the rim of Jupiter. It wasn't the fierce gold of Earth dawn, but a sharp, diamond-white star whose brilliance set fire to the razor-thin halo of ice rings orbiting the gas giant."
      },
      {
        id: "c7_b3",
        speaker: "arthur",
        effect: "whisper",
        text: "Arthur unlatched his helmet. The air inside the cabin was thin, smelling of ozone, scorched circuit boards, and chemical patch glue. He took a long, deep breath. His ribs ached with every expansion, his fingers were raw and blistered, and his hands had the deep tremor of an adrenaline crash."
      },
      {
        id: "c7_b4",
        speaker: "arthur",
        effect: "cynical",
        text: "He reached down into the footwell, pulled up a dented steel thermos that had survived the decompression, and unscrewed the cap. It was lukewarm, bitter enough to strip paint off a hull, and the best damn cup of coffee he had ever tasted."
      },
      {
        id: "c7_b5",
        speaker: "valerie",
        effect: "glow",
        text: "“Arthur? The Aegis core drive has nineteen petabytes of uncorrupted academic research patents. The Jovian University archivist has already put in an automated escrow bid for ninety-two thousand credits.”"
      },
      {
        id: "c7_b6",
        speaker: "arthur",
        effect: "normal",
        text: "“Ninety-two thousand,” Arthur smiled, leaning back against the tattered headrest as the gold light washed over his face. “We’re getting fresh filters, Val. Real beef steak in a vacuum pack. And maybe... maybe a new coffee maker with a timer.”"
      },
      {
        id: "c7_b7",
        speaker: "valerie",
        effect: "whisper",
        text: "“I’d prefer a memory upgrade, Arthur. So I can forget how close you just cut that burn.”"
      },
      {
        id: "c7_b8",
        speaker: "narrator",
        effect: "glow",
        text: "The Iron Pelican drifted on, a tiny spark of stubborn warmth navigating an ocean of cold stars. Living, laughing, and defying the math—one stolen breath at a time."
      }
    ],
    interactiveData: {
      logId: "LOG-07-FINAL",
      title: "Bank Balance Update Notification",
      content: "Account: A. Pendelton [ID #990-218]\nStatus: Solitary, battered, solvent.\nNext Destination: Callisto Station Spaceport Bar."
    }
  }
];
