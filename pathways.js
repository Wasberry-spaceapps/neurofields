// CLUSTER COLORS
const clusterColors = {
    biology: "#4ade80",      // Green
    math_stats: "#3b82f6",   // Blue
    comp_sci: "#f97316",     // Orange
    core_neuro: "#2dd4bf",   // Teal
    cognitive: "#c084fc",    // Purple
    systems: "#facc15",      // Yellow
    computational: "#06b6d4",// Cyan
    methods: "#ec4899",      // Pink
    clinical: "#ef4444",     // Red
    career: "#fbbf24"        // Gold
};

const rawNodes = [
    // =================================================================================
    // 1. FUNDAMENTALS (BIOLOGY & CHEMISTRY)
    // =================================================================================
    { id: "hs_bio", label: "High School Biology", cluster: "biology", layers: ["education"], difficulty: "beginner", size: 4, desc: "Foundational concepts of living systems, cell structure, and Mendelian genetics.", time: "1 Year", resources: [{title: "Khan Academy: High School Biology", url: "https://www.khanacademy.org/science/high-school-biology"}], prereqs: [] },
    { id: "hs_chem", label: "High School Chemistry", cluster: "biology", layers: ["education"], difficulty: "beginner", size: 3, desc: "Basic atomic structure, bonding, and stoichiometry.", time: "1 Year", resources: [{title: "CrashCourse Chemistry", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtPHzzYuWy6fYEaX9mQQ8oGr"}], prereqs: [] },
    { id: "gen_bio", label: "General Biology (Undergrad)", cluster: "biology", layers: ["education"], difficulty: "intermediate", size: 4, desc: "In-depth cellular biology, evolution, and physiology.", time: "1 Semester", resources: [{title: "MIT OCW: Fundamentals of Biology", url: "https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/"}], prereqs: ["hs_bio"] },
    { id: "gen_chem", label: "General Chemistry", cluster: "biology", layers: ["education"], difficulty: "intermediate", size: 3, desc: "Thermodynamics, kinetics, and equilibrium.", time: "1 Semester", resources: [], prereqs: ["hs_chem"] },
    { id: "ochem", label: "Organic Chemistry", cluster: "biology", layers: ["education"], difficulty: "advanced", size: 3, desc: "Structure, properties, and reactions of organic compounds. Essential for neuropharmacology.", time: "2 Semesters", resources: [], prereqs: ["gen_chem"] },
    { id: "biochem", label: "Biochemistry", cluster: "biology", layers: ["skills"], difficulty: "advanced", size: 4, desc: "Chemical processes within living organisms. Crucial for understanding receptors and metabolism.", time: "1 Semester", resources: [{title: "MIT OCW: Biochemistry", url: "https://ocw.mit.edu/courses/7-05-general-biochemistry-spring-2020/"}], prereqs: ["gen_bio", "ochem"] },
    { id: "genetics", label: "Genetics & Genomics", cluster: "biology", layers: ["skills"], difficulty: "intermediate", size: 3, desc: "Study of genes, genetic variation, and heredity.", time: "1 Semester", resources: [], prereqs: ["gen_bio"] },
    
    // =================================================================================
    // 2. FUNDAMENTALS (MATH & CS)
    // =================================================================================
    { id: "hs_math", label: "High School Math (Pre-Calc)", cluster: "math_stats", layers: ["education"], difficulty: "beginner", size: 4, desc: "Algebra, trigonometry, and functions.", time: "2 Years", resources: [], prereqs: [] },
    { id: "calc_1", label: "Calculus I", cluster: "math_stats", layers: ["skills"], difficulty: "intermediate", size: 4, desc: "Limits, derivatives, and basic integrals. Foundational for computational models.", time: "1 Semester", resources: [{title: "3Blue1Brown: Essence of Calculus", url: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMsr9K-rj53DwVRMYO3t5Yr"}], prereqs: ["hs_math"] },
    { id: "calc_2", label: "Calculus II & III", cluster: "math_stats", layers: ["skills"], difficulty: "advanced", size: 3, desc: "Multivariable calculus, differential equations basics.", time: "1-2 Semesters", resources: [], prereqs: ["calc_1"] },
    { id: "lin_alg", label: "Linear Algebra", cluster: "math_stats", layers: ["skills"], difficulty: "intermediate", size: 5, desc: "Vectors, matrices, eigenvalues. The backbone of neuroimaging analysis and machine learning.", time: "1 Semester", resources: [{title: "MIT OCW: Linear Algebra", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/"}], prereqs: ["hs_math"] },
    { id: "stats_1", label: "Intro to Statistics", cluster: "math_stats", layers: ["skills"], difficulty: "intermediate", size: 5, desc: "Probability distributions, t-tests, ANOVA.", time: "1 Semester", resources: [{title: "CrashCourse Statistics", url: "https://www.youtube.com/playlist?list=PL8dPuuaLjXtNM_Y-bUAhblSAdWRnmBUcr"}], prereqs: ["hs_math"] },
    { id: "stats_glm", label: "General Linear Models (GLM)", cluster: "math_stats", layers: ["skills"], difficulty: "advanced", size: 4, desc: "Multiple regression, mixed-effects models. Critical for fMRI and behavioral analysis.", time: "1 Semester", resources: [], prereqs: ["stats_1", "lin_alg"] },
    { id: "diff_eq", label: "Differential Equations", cluster: "math_stats", layers: ["skills"], difficulty: "advanced", size: 3, desc: "Equations mapping rates of change. Essential for dynamic neural models (Hodgkin-Huxley).", time: "1 Semester", resources: [], prereqs: ["calc_2"] },
    { id: "intro_cs", label: "Intro to Programming", cluster: "comp_sci", layers: ["education", "skills"], difficulty: "beginner", size: 5, desc: "Basic logic, loops, and variables. A must-have skill for modern neuroscience.", time: "1 Semester", resources: [{title: "Harvard CS50", url: "https://pll.harvard.edu/course/cs50-introduction-computer-science"}], prereqs: ["hs_math"] },
    { id: "python_neuro", label: "Python for Neuroscience", cluster: "comp_sci", layers: ["skills"], difficulty: "intermediate", size: 5, desc: "Numpy, Pandas, Matplotlib, SciPy. The default language of computational neuroscience.", time: "3 Months", resources: [{title: "Neuromatch Academy prep", url: "https://academy.neuromatch.io/"}], prereqs: ["intro_cs"] },
    { id: "matlab_neuro", label: "MATLAB for Neuroscience", cluster: "comp_sci", layers: ["skills"], difficulty: "intermediate", size: 4, desc: "Historically dominant language for EEG (EEGLAB) and fMRI (SPM).", time: "3 Months", resources: [], prereqs: ["intro_cs"] },
    { id: "signal_proc", label: "Signal Processing", cluster: "comp_sci", layers: ["skills"], difficulty: "advanced", size: 4, desc: "Fourier transforms, filtering, spectral analysis. Vital for EEG/MEG and electrophysiology.", time: "1 Semester", resources: [], prereqs: ["calc_1", "python_neuro"] },

    // =================================================================================
    // 3. CORE NEUROSCIENCE
    // =================================================================================
    { id: "intro_neuro", label: "Introduction to Neuroscience", cluster: "core_neuro", layers: ["education"], difficulty: "beginner", size: 6, desc: "Overview of neurons, synapses, brain anatomy, and sensory systems.", time: "1 Semester", resources: [{title: "HarvardX: Fundamentals of Neuroscience", url: "https://online-learning.harvard.edu/course/fundamentals-neuroscience"}], prereqs: ["hs_bio"] },
    { id: "neuroanatomy", label: "Neuroanatomy", cluster: "core_neuro", layers: ["education", "skills"], difficulty: "intermediate", size: 5, desc: "Detailed structural organization of the central and peripheral nervous system.", time: "1 Semester", resources: [{title: "BrainFacts 3D Brain", url: "https://www.brainfacts.org/3d-brain"}], prereqs: ["intro_neuro"] },
    { id: "cellular_neuro", label: "Cellular & Molecular Neuro", cluster: "core_neuro", layers: ["research"], difficulty: "intermediate", size: 4, desc: "Ion channels, neurotransmitter release, and intracellular signaling.", time: "1 Semester", resources: [], prereqs: ["intro_neuro", "gen_bio"] },
    { id: "action_potentials", label: "Action Potentials & Biophysics", cluster: "core_neuro", layers: ["skills"], difficulty: "intermediate", size: 4, desc: "The electrical basis of neural communication.", time: "1 Month", resources: [], prereqs: ["cellular_neuro", "calc_1"] },
    { id: "synaptic_plast", label: "Synaptic Plasticity", cluster: "core_neuro", layers: ["research"], difficulty: "advanced", size: 3, desc: "LTP, LTD, and the molecular basis of learning and memory.", time: "1 Month", resources: [], prereqs: ["cellular_neuro"] },
    { id: "neuropharmacology", label: "Neuropharmacology", cluster: "core_neuro", layers: ["research"], difficulty: "advanced", size: 4, desc: "How drugs affect cellular function in the nervous system.", time: "1 Semester", resources: [], prereqs: ["cellular_neuro", "biochem"] },
    
    // =================================================================================
    // 4. SYSTEMS NEUROSCIENCE
    // =================================================================================
    { id: "systems_neuro", label: "Systems Neuroscience", cluster: "systems", layers: ["research", "education"], difficulty: "intermediate", size: 5, desc: "How neural circuits work together to form sensory and motor networks.", time: "1 Semester", resources: [], prereqs: ["neuroanatomy", "cellular_neuro"] },
    { id: "visual_system", label: "Visual System", cluster: "systems", layers: ["research"], difficulty: "advanced", size: 3, desc: "Retina to V1 and beyond. The most heavily studied sensory system.", time: "Weeks", resources: [], prereqs: ["systems_neuro"] },
    { id: "auditory_system", label: "Auditory System", cluster: "systems", layers: ["research"], difficulty: "advanced", size: 3, desc: "Cochlea to Auditory Cortex.", time: "Weeks", resources: [], prereqs: ["systems_neuro"] },
    { id: "motor_system", label: "Motor System", cluster: "systems", layers: ["research"], difficulty: "advanced", size: 3, desc: "Basal ganglia, cerebellum, and motor cortex. Action planning and execution.", time: "Weeks", resources: [], prereqs: ["systems_neuro"] },
    { id: "autonomic_ns", label: "Autonomic Nervous System", cluster: "systems", layers: ["research"], difficulty: "intermediate", size: 2, desc: "Sympathetic and parasympathetic control of bodily functions.", time: "Weeks", resources: [], prereqs: ["systems_neuro"] },
    
    // =================================================================================
    // 5. COGNITIVE NEUROSCIENCE & PSYCHOLOGY
    // =================================================================================
    { id: "intro_psych", label: "Intro to Psychology", cluster: "cognitive", layers: ["education"], difficulty: "beginner", size: 4, desc: "Overview of human behavior, cognition, and development.", time: "1 Semester", resources: [], prereqs: [] },
    { id: "cog_psych", label: "Cognitive Psychology", cluster: "cognitive", layers: ["education"], difficulty: "intermediate", size: 4, desc: "Information processing, mental representations, and psychological models.", time: "1 Semester", resources: [], prereqs: ["intro_psych"] },
    { id: "cog_neuro", label: "Cognitive Neuroscience", cluster: "cognitive", layers: ["research", "education"], difficulty: "advanced", size: 5, desc: "Mapping cognitive psychological phenomena onto brain substrates.", time: "1 Semester", resources: [{title: "Cognitive Neuroscience Society", url: "https://www.cogneurosociety.org/"}], prereqs: ["cog_psych", "intro_neuro"] },
    { id: "memory", label: "Learning & Memory", cluster: "cognitive", layers: ["research"], difficulty: "advanced", size: 4, desc: "Working memory, episodic memory, hippocampus function.", time: "1 Semester", resources: [], prereqs: ["cog_neuro"] },
    { id: "attention", label: "Attention & Perception", cluster: "cognitive", layers: ["research"], difficulty: "advanced", size: 3, desc: "Top-down vs bottom-up processing, frontoparietal networks.", time: "1 Semester", resources: [], prereqs: ["cog_neuro"] },
    { id: "decision_making", label: "Decision Making", cluster: "cognitive", layers: ["research"], difficulty: "advanced", size: 3, desc: "Value-based choices, prefrontal cortex, reward prediction errors.", time: "1 Semester", resources: [], prereqs: ["cog_neuro"] },
    { id: "language_brain", label: "Language in the Brain", cluster: "cognitive", layers: ["research"], difficulty: "advanced", size: 3, desc: "Broca's, Wernicke's, and modern network theories of semantic processing.", time: "1 Semester", resources: [], prereqs: ["cog_neuro"] },
    { id: "social_neuro", label: "Social Neuroscience", cluster: "cognitive", layers: ["research"], difficulty: "advanced", size: 3, desc: "Theory of mind, empathy, and social network processing in the brain.", time: "1 Semester", resources: [], prereqs: ["cog_neuro"] },

    // =================================================================================
    // 6. COMPUTATIONAL NEUROSCIENCE
    // =================================================================================
    { id: "comp_neuro", label: "Computational Neuroscience", cluster: "computational", layers: ["research", "education"], difficulty: "advanced", size: 6, desc: "Using mathematical models to understand neural function.", time: "1-2 Semesters", resources: [{title: "Coursera: Comp Neuro", url: "https://www.coursera.org/learn/computational-neuroscience"}], prereqs: ["intro_neuro", "python_neuro", "diff_eq", "lin_alg"] },
    { id: "hodgkin_huxley", label: "Hodgkin-Huxley Models", cluster: "computational", layers: ["research", "skills"], difficulty: "advanced", size: 3, desc: "Biophysically detailed models of action potentials.", time: "Weeks", resources: [], prereqs: ["comp_neuro", "action_potentials"] },
    { id: "integrate_fire", label: "Integrate & Fire Models", cluster: "computational", layers: ["research", "skills"], difficulty: "advanced", size: 3, desc: "Simplified phenomenological models of spiking neurons.", time: "Weeks", resources: [], prereqs: ["comp_neuro"] },
    { id: "network_dynamics", label: "Neural Network Dynamics", cluster: "computational", layers: ["research"], difficulty: "advanced", size: 4, desc: "Attractor networks, oscillations, and population dynamics.", time: "1 Semester", resources: [], prereqs: ["comp_neuro"] },
    { id: "machine_learning", label: "Machine Learning (Neuro)", cluster: "computational", layers: ["skills", "research"], difficulty: "advanced", size: 5, desc: "Applying SVMs, Random Forests, and clustering to brain data.", time: "1 Semester", resources: [], prereqs: ["python_neuro", "stats_glm"] },
    { id: "deep_learning", label: "Deep Learning & ANNs", cluster: "computational", layers: ["skills", "research"], difficulty: "advanced", size: 5, desc: "Using artificial neural networks as models of brain hierarchies.", time: "1 Semester", resources: [{title: "Neuromatch Deep Learning", url: "https://deeplearning.neuromatch.io/"}], prereqs: ["machine_learning", "calc_2"] },
    { id: "rl_neuro", label: "Reinforcement Learning", cluster: "computational", layers: ["research"], difficulty: "advanced", size: 4, desc: "Markov decision processes, TD-learning, and dopamine.", time: "1 Semester", resources: [{title: "Niv Lab RL Tutorial", url: "https://nivlab.princeton.edu/resources"}], prereqs: ["comp_neuro", "decision_making"] },
    { id: "predictive_coding", label: "Predictive Coding", cluster: "computational", layers: ["research"], difficulty: "advanced", size: 3, desc: "The brain as an inference machine minimizing prediction error.", time: "Months", resources: [], prereqs: ["comp_neuro", "visual_system"] },

    // =================================================================================
    // 7. METHODS & ENGINEERING
    // =================================================================================
    { id: "neuroimaging_intro", label: "Intro to Neuroimaging", cluster: "methods", layers: ["skills", "education"], difficulty: "intermediate", size: 5, desc: "Overview of human brain scanning technologies.", time: "1 Semester", resources: [], prereqs: ["neuroanatomy", "stats_1"] },
    { id: "fmri_basics", label: "fMRI Basics", cluster: "methods", layers: ["skills"], difficulty: "advanced", size: 4, desc: "BOLD signal, experimental design, and preprocessing.", time: "Months", resources: [{title: "Andy's Brain Book", url: "https://andysbrainbook.readthedocs.io/"}], prereqs: ["neuroimaging_intro", "stats_glm"] },
    { id: "fmri_resting", label: "Resting-State fMRI", cluster: "methods", layers: ["research"], difficulty: "advanced", size: 3, desc: "Functional connectivity maps without explicit tasks.", time: "Weeks", resources: [], prereqs: ["fmri_basics"] },
    { id: "eeg_meg", label: "EEG & MEG", cluster: "methods", layers: ["skills", "research"], difficulty: "advanced", size: 4, desc: "High temporal resolution electrophysiology at the scalp.", time: "Months", resources: [], prereqs: ["neuroimaging_intro", "signal_proc"] },
    { id: "dti_mri", label: "Diffusion Tensor Imaging", cluster: "methods", layers: ["skills"], difficulty: "advanced", size: 3, desc: "Mapping white matter tracts (structural connectivity).", time: "Weeks", resources: [], prereqs: ["neuroimaging_intro", "lin_alg"] },
    { id: "graph_theory", label: "Network Science / Connectomics", cluster: "methods", layers: ["research"], difficulty: "advanced", size: 4, desc: "Applying graph theory to structural and functional brain networks.", time: "1 Semester", resources: [], prereqs: ["fmri_resting", "dti_mri", "python_neuro"] },
    
    { id: "wet_lab_basics", label: "Wet Lab Fundamentals", cluster: "methods", layers: ["skills"], difficulty: "intermediate", size: 4, desc: "Pipetting, sterile technique, cell culturing.", time: "1 Semester", resources: [], prereqs: ["gen_bio"] },
    { id: "optogenetics", label: "Optogenetics", cluster: "methods", layers: ["skills", "research"], difficulty: "advanced", size: 4, desc: "Using light to control genetically modified neurons in vivo.", time: "Months", resources: [], prereqs: ["genetics", "systems_neuro"] },
    { id: "patch_clamp", label: "Patch-Clamp Electrophysiology", cluster: "methods", layers: ["skills"], difficulty: "advanced", size: 3, desc: "Measuring currents from single ion channels or cells.", time: "Months", resources: [], prereqs: ["action_potentials", "wet_lab_basics"] },
    { id: "invivo_ephys", label: "In-vivo Electrophysiology", cluster: "methods", layers: ["skills", "research"], difficulty: "advanced", size: 4, desc: "Multi-electrode arrays, Neuropixels, spike sorting.", time: "Months", resources: [], prereqs: ["systems_neuro", "signal_proc"] },
    { id: "calcium_imaging", label: "Two-Photon Calcium Imaging", cluster: "methods", layers: ["skills", "research"], difficulty: "advanced", size: 3, desc: "Visualizing population activity using fluorescent calcium indicators.", time: "Months", resources: [], prereqs: ["systems_neuro", "optogenetics"] },
    { id: "bci", label: "Brain-Computer Interfaces", cluster: "methods", layers: ["research"], difficulty: "advanced", size: 4, desc: "Decoding neural signals to control external devices.", time: "1 Semester", resources: [], prereqs: ["signal_proc", "machine_learning", "eeg_meg", "invivo_ephys"] },

    // =================================================================================
    // 8. CLINICAL NEUROSCIENCE
    // =================================================================================
    { id: "neuropathology", label: "Neuropathology", cluster: "clinical", layers: ["education", "research"], difficulty: "advanced", size: 4, desc: "Study of disease in nervous system tissue.", time: "1 Semester", resources: [], prereqs: ["neuroanatomy", "cellular_neuro"] },
    { id: "alzheimers", label: "Alzheimer's & Dementias", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 3, desc: "Amyloid, tau, and neurodegeneration.", time: "Months", resources: [], prereqs: ["neuropathology", "memory"] },
    { id: "parkinsons", label: "Parkinson's Disease", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 3, desc: "Dopaminergic cell loss and motor dysfunction.", time: "Months", resources: [], prereqs: ["neuropathology", "motor_system"] },
    { id: "psychiatry_bio", label: "Biological Psychiatry", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 4, desc: "Neurobiology of mental disorders.", time: "1 Semester", resources: [], prereqs: ["neuropharmacology", "cog_neuro"] },
    { id: "schizophrenia", label: "Schizophrenia", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 3, desc: "Dopamine hypothesis, network dysconnectivity.", time: "Months", resources: [], prereqs: ["psychiatry_bio"] },
    { id: "depression", label: "Major Depressive Disorder", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 3, desc: "Serotonin, neurogenesis, and default mode network.", time: "Months", resources: [], prereqs: ["psychiatry_bio"] },
    { id: "comp_psychiatry", label: "Computational Psychiatry", cluster: "clinical", layers: ["research"], difficulty: "advanced", size: 4, desc: "Using comp models (e.g. RL) to phenotype psychiatric conditions.", time: "1 Semester", resources: [], prereqs: ["psychiatry_bio", "comp_neuro", "rl_neuro"] },

    // =================================================================================
    // 9. CAREER TRACKS
    // =================================================================================
    { id: "grad_school", label: "PhD in Neuroscience", cluster: "career", layers: ["career"], difficulty: "advanced", size: 6, desc: "5-6 years of intensive original research.", time: "5-6 Years", resources: [], prereqs: ["gen_bio", "intro_neuro", "stats_1"] },
    { id: "postdoc", label: "Postdoctoral Fellowship", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Temporary training phase post-PhD to establish independence.", time: "2-4 Years", resources: [], prereqs: ["grad_school"] },
    { id: "academia_pi", label: "Academia (PI / Professor)", cluster: "career", layers: ["career"], difficulty: "advanced", size: 5, desc: "Running an independent lab, writing grants, teaching.", time: "Lifetime", resources: [], prereqs: ["postdoc"] },
    
    { id: "industry_pharma", label: "Industry: Pharma & Biotech", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Drug discovery and clinical trials.", time: "Lifetime", resources: [], prereqs: ["grad_school", "neuropharmacology", "wet_lab_basics"] },
    { id: "industry_neurotech", label: "Industry: Neurotech", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Building hardware and algorithms for BCI (e.g., Neuralink, CTRL-Labs).", time: "Lifetime", resources: [], prereqs: ["grad_school", "bci", "deep_learning"] },
    { id: "industry_data", label: "Industry: Data Science", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Applying quant skills to tech, finance, or health tech.", time: "Lifetime", resources: [], prereqs: ["grad_school", "machine_learning", "python_neuro"] },
    
    { id: "med_school", label: "Medical School (MD)", cluster: "career", layers: ["career"], difficulty: "advanced", size: 5, desc: "4 years of medical education.", time: "4 Years", resources: [], prereqs: ["gen_bio", "ochem"] },
    { id: "neurology", label: "Neurology Practice", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Diagnosing and treating structural/organic nervous system disorders.", time: "Lifetime", resources: [], prereqs: ["med_school", "neuropathology"] },
    { id: "psychiatry", label: "Psychiatry Practice", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Treating mental, emotional, and behavioral disorders.", time: "Lifetime", resources: [], prereqs: ["med_school", "psychiatry_bio"] },
    { id: "neurosurgery", label: "Neurosurgery", cluster: "career", layers: ["career"], difficulty: "advanced", size: 4, desc: "Surgical intervention for brain and spine conditions.", time: "Lifetime", resources: [], prereqs: ["med_school", "neuroanatomy"] },
    
    { id: "scicomm", label: "Science Communication", cluster: "career", layers: ["career"], difficulty: "advanced", size: 3, desc: "Journalism, writing, or media translating science to the public.", time: "Lifetime", resources: [], prereqs: ["intro_neuro"] },
    { id: "science_policy", label: "Science Policy & Funding", cluster: "career", layers: ["career"], difficulty: "advanced", size: 3, desc: "Working at NIH, NSF, or non-profits to guide research funding and ethics.", time: "Lifetime", resources: [], prereqs: ["grad_school"] }
];

// -------------------------------------------------------------------------------------
// DYNAMIC GRAPH GENERATOR
// -------------------------------------------------------------------------------------
// Instead of manually tracking bi-directional links and unlocks, this script 
// builds the full `pathwaysData` object from the pure relationships above.

const pathwaysData = { nodes: [], links: [] };
const unlocksMap = {};
const prereqMap = {};

rawNodes.forEach(n => {
    // Fill maps
    n.prereqs.forEach(p => {
        if(!unlocksMap[p]) unlocksMap[p] = [];
        unlocksMap[p].push(n.id);
        
        pathwaysData.links.push({
            source: p,
            target: n.id,
            value: 1
        });
    });
    
    prereqMap[n.id] = n.prereqs;
    
    // Default color assignment
    n.color = clusterColors[n.cluster] || "#ffffff";
    
    pathwaysData.nodes.push(n);
});

// Inject dynamic unlocks back into nodes
pathwaysData.nodes.forEach(n => {
    n.unlocks = unlocksMap[n.id] || [];
});

// Export globally
window.pathwaysData = pathwaysData;
window.clusterColors = clusterColors;
