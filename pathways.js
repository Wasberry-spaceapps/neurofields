const pathwaysData = {
    nodes: [
        { id: "High School Biology", group: 1, type: "Education", desc: "The foundational introduction to living systems and basic cellular mechanisms.", skills: ["Cellular Biology", "Genetics basics", "Scientific Method"] },
        { id: "High School CompSci", group: 1, type: "Education", desc: "Early introduction to programming logic. Increasingly crucial for modern neuroscience.", skills: ["Python/Java basics", "Logic", "Algorithms"] },
        
        { id: "Undergrad Neuroscience", group: 2, type: "Education", desc: "Core principles of the nervous system, neuroanatomy, and basic experimental research.", skills: ["Neuroanatomy", "Cellular Neuroscience", "Behavioral assays"] },
        { id: "Undergrad Psychology", group: 2, type: "Education", desc: "Focuses on behavior, cognition, and experimental design in human populations.", skills: ["Experimental Design", "Statistics", "Cognitive Psychology"] },
        { id: "Undergrad CompSci / Data", group: 2, type: "Education", desc: "Building strong quantitative skills necessary for modeling and big data.", skills: ["Machine Learning", "Data Structures", "Linear Algebra"] },
        { id: "Undergrad Bioengineering", group: 2, type: "Education", desc: "Hardware and signal processing fundamentals for neural interfaces.", skills: ["Signal Processing", "Circuit Design", "Biomechanics"] },

        { id: "Systems Neuroscience", group: 3, type: "Specialization", desc: "Studying how neural circuits and networks function together to produce behavior.", skills: ["In-vivo Electrophysiology", "Optogenetics", "Calcium Imaging"] },
        { id: "Computational Neuroscience", group: 3, type: "Specialization", desc: "Using mathematical models to understand brain function and neural dynamics.", skills: ["Differential Equations", "Neural Networks", "Information Theory"] },
        { id: "Cognitive Neuroscience", group: 3, type: "Specialization", desc: "Mapping mental processes (memory, attention) to physical brain structures.", skills: ["fMRI Analysis", "EEG/MEG", "Psychophysics"] },
        { id: "Clinical Neuroscience", group: 3, type: "Specialization", desc: "Focusing on the mechanisms of neurological and psychiatric diseases.", skills: ["Translational Models", "Neuropathology", "Clinical Trials"] },

        { id: "Academia (Postdoc/PI)", group: 4, type: "Career", desc: "Pursuing independent research, grant writing, and teaching at a university.", skills: ["Grant Writing", "Lab Management", "Mentorship"] },
        { id: "Industry: Neurotech", group: 4, type: "Career", desc: "Building brain-computer interfaces (BCIs) and clinical devices at startups/companies.", skills: ["Product Development", "Regulatory (FDA)", "Real-time Signal Processing"] },
        { id: "Industry: Data Science", group: 4, type: "Career", desc: "Applying computational skills learned in neuro to massive datasets outside or adjacent to biology.", skills: ["Deep Learning", "SQL/Cloud", "A/B Testing"] },
        { id: "Clinical Practice", group: 4, type: "Career", desc: "Medical doctors (Neurology, Psychiatry, Neurosurgery) treating patients directly.", skills: ["Patient Care", "Diagnostics", "Surgical/Pharmacological Tx"] }
    ],
    links: [
        { source: "High School Biology", target: "Undergrad Neuroscience" },
        { source: "High School Biology", target: "Undergrad Psychology" },
        { source: "High School CompSci", target: "Undergrad CompSci / Data" },
        { source: "High School CompSci", target: "Undergrad Bioengineering" },
        
        { source: "Undergrad Neuroscience", target: "Systems Neuroscience" },
        { source: "Undergrad Neuroscience", target: "Cognitive Neuroscience" },
        { source: "Undergrad Neuroscience", target: "Clinical Neuroscience" },
        
        { source: "Undergrad Psychology", target: "Cognitive Neuroscience" },
        { source: "Undergrad Psychology", target: "Clinical Neuroscience" },
        
        { source: "Undergrad CompSci / Data", target: "Computational Neuroscience" },
        { source: "Undergrad Bioengineering", target: "Systems Neuroscience" },
        { source: "Undergrad Bioengineering", target: "Industry: Neurotech" },
        
        // Interdisciplinary crossovers
        { source: "Undergrad CompSci / Data", target: "Cognitive Neuroscience" },
        { source: "Undergrad Neuroscience", target: "Computational Neuroscience" },
        
        // Grad to Career
        { source: "Systems Neuroscience", target: "Academia (Postdoc/PI)" },
        { source: "Computational Neuroscience", target: "Academia (Postdoc/PI)" },
        { source: "Cognitive Neuroscience", target: "Academia (Postdoc/PI)" },
        
        { source: "Computational Neuroscience", target: "Industry: Data Science" },
        { source: "Computational Neuroscience", target: "Industry: Neurotech" },
        { source: "Systems Neuroscience", target: "Industry: Neurotech" },
        
        { source: "Clinical Neuroscience", target: "Clinical Practice" },
        { source: "Clinical Neuroscience", target: "Industry: Neurotech" }
    ]
};