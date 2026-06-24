// --- Routing ---
function navigate(viewId) {
    document.querySelectorAll('.page-view').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('active');
    });
    
    const target = document.getElementById(`view-${viewId}`);
    target.classList.remove('hidden');
    
    // Add small delay for animation to trigger
    setTimeout(() => target.classList.add('active'), 10);
    
    if (viewId === 'resources') renderResources();
    if (viewId === 'pathways') initGraph();
}

// --- Neuro Resources ---
function renderResources() {
    const grid = document.getElementById('resources-grid');
    const catFilter = document.getElementById('filter-category').value;
    const lvlFilter = document.getElementById('filter-level').value;
    
    grid.innerHTML = '';
    
    const filtered = neuroResources.filter(r => {
        const catMatch = catFilter === 'All' || r.category === catFilter;
        const lvlMatch = lvlFilter === 'All' || r.level === lvlFilter;
        return catMatch && lvlMatch;
    });

    document.getElementById('resource-count').innerText = filtered.length;

    filtered.forEach(r => {
        const el = document.createElement('a');
        el.href = r.url;
        el.target = "_blank";
        el.className = "bg-neuro-card p-5 rounded-xl border border-neuro-border hover:border-neuro-blue transition-all group block shadow-md hover:shadow-lg hover:-translate-y-1";
        
        // Badge Colors
        let badgeColor = "bg-gray-700 text-gray-200";
        if(r.level === 'High School') badgeColor = "bg-green-900/40 text-green-400";
        if(r.level === 'Undergrad') badgeColor = "bg-blue-900/40 text-blue-400";
        if(r.level === 'Advanced') badgeColor = "bg-purple-900/40 text-purple-400";

        el.innerHTML = `
            <div class="flex justify-between items-start mb-3">
                <span class="text-xs font-semibold px-2 py-1 rounded border border-neuro-border text-neuro-muted">${r.category}</span>
                <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${badgeColor}">${r.level}</span>
            </div>
            <h3 class="text-lg font-bold text-white mb-2 group-hover:text-neuro-blue transition-colors">${r.name}</h3>
            <p class="text-sm text-neuro-muted mb-4 line-clamp-2">${r.desc}</p>
            <div class="flex items-center text-xs text-neuro-muted mt-auto pt-3 border-t border-neuro-border">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                ${r.time}
            </div>
        `;
        grid.appendChild(el);
    });
}

// --- Before You Code ---
function toggleApiModal() {
    const modal = document.getElementById('api-modal');
    modal.classList.toggle('hidden');
    // load existing if any
    if(!modal.classList.contains('hidden')) {
        document.getElementById('api-key-input').value = localStorage.getItem('openrouter_key') || '';
    }
}

function saveApiKey() {
    const key = document.getElementById('api-key-input').value;
    localStorage.setItem('openrouter_key', key);
    toggleApiModal();
}

const hardcodedFallbacks = {
    "fMRI": [
        "Define motion threshold for volume censoring (scrubbing) (e.g., FD > 0.2mm).",
        "Specify spatial smoothing kernel FWHM before running stats.",
        "Determine exact nuisance regressors to include (CSF, White Matter, 6 or 24 motion params).",
        "Establish cluster-forming threshold for multiple comparisons (e.g., p<0.001 uncorrected).",
        "Define criteria for excluding subjects entirely (e.g., >20% volumes scrubbed)."
    ],
    "EEG": [
        "Define high-pass and low-pass filter cutoff frequencies.",
        "Specify bad channel identification and interpolation method.",
        "Define artifact rejection threshold (e.g., +/- 100 µV).",
        "Establish criteria for rejecting independent components (ICA) related to blinks/heartbeat.",
        "Define epoch baseline correction window (e.g., -200ms to 0ms)."
    ],
    "Behavioral": [
        "Define absolute Reaction Time (RT) cutoff limits (e.g., < 150ms or > 3000ms).",
        "Decide how to handle missing or timed-out trials in modeling.",
        "Establish criteria for participant exclusion based on overall accuracy.",
        "Specify data transformation for skewed variables (e.g., log RT) prior to linear models.",
        "Define exact primary outcome measure (e.g., d-prime vs raw accuracy)."
    ],
    "Electrophysiology": [
        "Define spike sorting parameters and cluster isolation thresholds (e.g., L-ratio).",
        "Specify firing rate criteria to include a unit in group analysis.",
        "Define bin size for Peri-Stimulus Time Histograms (PSTH).",
        "Determine exactly how trials with electrical artifacts will be dropped.",
        "Establish criteria for defining 'significant' responsiveness of a cell to a stimulus."
    ],
    "Transcriptomics": [
        "Define minimum read/UMI count threshold per cell.",
        "Specify cutoff for mitochondrial gene percentage to exclude dead cells.",
        "Determine normalization method (e.g., SCTransform vs standard log normalization).",
        "Define exact parameters for dimensionality reduction (number of PCs).",
        "Establish threshold for differential expression significance (e.g., log2FC > 0.25, adjusted p < 0.05)."
    ]
};

async function generateChecklist() {
    const modality = document.getElementById('byc-modality').value;
    const desc = document.getElementById('byc-desc').value;
    const btn = document.getElementById('btn-generate');
    const container = document.getElementById('checklist-container');
    const listEl = document.getElementById('checklist-items');
    
    if(!desc) { alert("Please provide a brief study description."); return; }

    btn.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-neuro-dark" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Generating Protocol...`;
    
    let items = [];
    const apiKey = localStorage.getItem('openrouter_key');

    if(apiKey && apiKey.length > 10) {
        // Use AI
        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${apiKey}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    model: "google/gemini-2.5-flash-8b", // Fast, standard model. Users can override if they wish.
                    messages: [
                        {role: "system", content: "You are an expert quantitative neuroscientist. Provide 5 crucial data-handling decisions (outliers, filters, regressors, exclusions) the user MUST define before analysis. Output ONLY a valid JSON array of strings. No markdown, no intro."},
                        {role: "user", content: `Data Type: ${modality}. Study: ${desc}`}
                    ]
                })
            });
            const data = await response.json();
            const content = data.choices[0].message.content.trim();
            // Try to parse json
            try {
                items = JSON.parse(content.replace(/```json/g, '').replace(/```/g, ''));
            } catch(e) {
                console.error("Failed to parse JSON, falling back", e);
                items = hardcodedFallbacks[modality];
            }
        } catch (e) {
            console.error("API Call failed, falling back", e);
            items = hardcodedFallbacks[modality];
        }
    } else {
        // Use Fallback
        await new Promise(r => setTimeout(r, 600)); // Simulate thinking
        items = hardcodedFallbacks[modality];
    }

    // Render Items
    listEl.innerHTML = '';
    items.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = "flex gap-4 p-4 bg-neuro-dark rounded-lg border border-neuro-border";
        div.innerHTML = `
            <div class="flex-shrink-0 mt-0.5">
                <input type="checkbox" class="checklist-item-box w-5 h-5 text-neuro-teal bg-neuro-dark border-neuro-border rounded focus:ring-neuro-teal" onchange="checkSignOff()">
            </div>
            <div class="text-sm text-neuro-text">${item}</div>
        `;
        listEl.appendChild(div);
    });

    container.classList.remove('hidden');
    btn.innerHTML = `Generate Data Protocol`;
    
    // Reset sign-off
    document.getElementById('sign-off-box').checked = false;
    checkSignOff();
}

function checkSignOff() {
    const allChecked = Array.from(document.querySelectorAll('.checklist-item-box')).every(cb => cb.checked);
    const signOff = document.getElementById('sign-off-box').checked;
    const btn = document.getElementById('btn-export');
    
    if(allChecked && signOff) {
        btn.disabled = false;
        btn.classList.remove('bg-neuro-border', 'text-neuro-muted', 'cursor-not-allowed');
        btn.classList.add('bg-neuro-teal', 'text-neuro-dark', 'hover:bg-teal-500');
    } else {
        btn.disabled = true;
        btn.classList.add('bg-neuro-border', 'text-neuro-muted', 'cursor-not-allowed');
        btn.classList.remove('bg-neuro-teal', 'text-neuro-dark', 'hover:bg-teal-500');
    }
}

function exportProtocol() {
    const modality = document.getElementById('byc-modality').value;
    const desc = document.getElementById('byc-desc').value;
    const date = new Date().toISOString().split('T')[0];
    
    const items = Array.from(document.querySelectorAll('#checklist-items .text-sm')).map(el => el.innerText);
    
    let content = `# Data Analysis Protocol\nDate: ${date}\nModality: ${modality}\n\n## Study Description\n${desc}\n\n## Pre-registered Decisions\n`;
    items.forEach((item, i) => {
        content += `${i+1}. [x] ${item}\n`;
    });
    
    content += `\n## Code Skeleton\n`;
    if(modality === 'fMRI') {
        content += "```python\n# fMRI Prep and GLM script setup\nimport nipype\nimport nilearn\n\n# TODO: Implement exclusion criteria defined above\n# TODO: Define nuisance regressors\n```";
    } else if (modality === 'Behavioral') {
        content += "```r\n# Behavioral Analysis Setup\nlibrary(dplyr)\nlibrary(lme4)\n\ndata <- read.csv('data.csv')\n\n# TODO: Apply RT cutoffs\nclean_data <- data %>% filter(RT > X & RT < Y)\n\n# TODO: Run mixed effects model\n```";
    } else {
        content += "```python\n# Initial setup script\nimport numpy as np\nimport pandas as pd\n\n# TODO: Load data and apply pre-registered filters\n```";
    }

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_protocol_${date}.md`;
    a.click();
}

// --- 3D Graph Pathways ---
let graphInitialized = false;
function initGraph() {
    if(graphInitialized) return;
    
    const elem = document.getElementById('3d-graph');
    // Clear in case of resize re-renders
    elem.innerHTML = '';
    
    const Graph = ForceGraph3D()(elem)
        .backgroundColor('#0f172a') // neuro-dark
        .graphData(pathwaysData)
        .nodeLabel('id')
        .nodeColor(node => {
            if(node.group === 1) return '#94a3b8'; // muted
            if(node.group === 2) return '#38bdf8'; // blue
            if(node.group === 3) return '#2dd4bf'; // teal
            return '#fbbf24'; // amber for careers
        })
        .nodeRelSize(6)
        .linkColor(() => '#334155') // border color
        .linkWidth(1.5)
        .onNodeClick(node => {
            // Aim camera at node
            const distance = 40;
            const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
            Graph.cameraPosition(
                { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
                node, 
                3000  // ms transition
            );
            showSidebar(node);
        });

    graphInitialized = true;
    
    // Handle resize
    window.addEventListener('resize', () => {
        if(!document.getElementById('view-pathways').classList.contains('hidden')) {
            Graph.width(elem.clientWidth).height(elem.clientHeight);
        }
    });
}

function showSidebar(node) {
    const sidebar = document.getElementById('pathway-sidebar');
    document.getElementById('node-badge').innerText = node.type;
    document.getElementById('node-title').innerText = node.id;
    document.getElementById('node-desc').innerText = node.desc;
    
    const skillsUl = document.getElementById('node-skills');
    skillsUl.innerHTML = '';
    node.skills.forEach(s => {
        const li = document.createElement('li');
        li.innerText = s;
        skillsUl.appendChild(li);
    });
    
    sidebar.classList.remove('translate-x-full');
}

function closeSidebar() {
    document.getElementById('pathway-sidebar').classList.add('translate-x-full');
}