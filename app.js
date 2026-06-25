import * as THREE from 'three';
import SpriteText from 'three-spritetext';
import ForceGraph3D from '3d-force-graph';

// --- Bind globally for HTML 'onclick' triggers ---
window.navigate = navigate;
window.generateChecklist = generateChecklist;
window.checkSignOff = checkSignOff;
window.exportProtocol = exportProtocol;
window.renderResources = renderResources;
window.startGuidedTour = startGuidedTour;
window.endTour = endTour;
window.tourNav = tourNav;
window.resetGraphView = resetGraphView;
window.closeSidebar = closeSidebar;
window.focusNode = focusNode;

// --- Routing ---
function navigate(viewId) {
    document.querySelectorAll('.page-view').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('active');
    });
    
    const target = document.getElementById(`view-${viewId}`);
    target.classList.remove('hidden');
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
        el.href = r.url; el.target = "_blank";
        el.className = "bg-neuro-card p-5 rounded-xl border border-neuro-border hover:border-neuro-blue transition-all group block shadow-md hover:-translate-y-1";
        
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
        "Define spike sorting parameters and cluster isolation thresholds.",
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
        "Establish threshold for differential expression significance."
    ]
};

async function generateChecklist() {
    const modality = document.getElementById('byc-modality').value;
    const desc = document.getElementById('byc-desc').value;
    const btn = document.getElementById('btn-generate');
    const container = document.getElementById('checklist-container');
    const listEl = document.getElementById('checklist-items');
    
    if(!desc) { alert("Please provide a brief study description."); return; }
    btn.innerHTML = `Generating Protocol...`;
    
    await new Promise(r => setTimeout(r, 600)); 
    const items = hardcodedFallbacks[modality];

    listEl.innerHTML = '';
    items.forEach(item => {
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
    const date = new Date().toISOString().split('T')[0];
    const items = Array.from(document.querySelectorAll('#checklist-items .text-sm')).map(el => el.innerText);
    
    let content = `# Data Analysis Protocol\nDate: ${date}\nModality: ${modality}\n\n`;
    items.forEach((item, i) => content += `${i+1}. [x] ${item}\n`);
    
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data_protocol_${date}.md`;
    a.click();
}


// --- 3D Graph Pathways Map ---
let Graph;
let graphInitialized = false;
let searchHighlightNodes = new Set();
let activeLayers = new Set(["education", "skills", "research", "career"]);

function initGraph() {
    if(graphInitialized) return;
    
    const elem = document.getElementById('3d-graph');
    elem.innerHTML = '';
    
    const legend = document.getElementById('graph-legend');
    if (legend && window.clusterColors) {
        legend.innerHTML = '';
        for (const [key, color] of Object.entries(window.clusterColors)) {
            legend.innerHTML += `<div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background:${color}; box-shadow: 0 0 8px ${color}"></div><span class="text-neuro-muted capitalize">${key.replace('_',' ')}</span></div>`;
        }
    }

    // Protect against data missing
    if (!window.pathwaysData) {
        console.error("Pathways Data not loaded.");
        return;
    }

    Graph = ForceGraph3D()(elem)
        .backgroundColor('#050914')
        .graphData(window.pathwaysData)
        .nodeRelSize(4)
        .nodeThreeObject(node => {
            const group = new THREE.Group();
            
            const isDimmed = searchHighlightNodes.size > 0 && !searchHighlightNodes.has(node);
            const opacity = isDimmed ? 0.1 : 0.9;
            
            // Add robust fallbacks to prevent WebGL crash if a node has missing data
            const size = node.size || 2;
            const color = node.color || '#ffffff';
            const labelText = node.label || node.id || "Node";
            
            // Core Sphere
            const geometry = new THREE.SphereGeometry(size * 2, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: opacity });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Halo glow
            if (!isDimmed) {
                const haloGeo = new THREE.SphereGeometry(size * 3.5, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.15 });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                group.add(halo);
            }

            // Billboard Text Label
            const sprite = new SpriteText(labelText);
            sprite.color = isDimmed ? '#334155' : '#ffffff';
            sprite.textHeight = Math.max(2, size * 0.8);
            sprite.position.y = -(size * 2.5);
            group.add(sprite);

            return group;
        })
        .linkColor(() => 'rgba(51, 65, 85, 0.4)')
        .linkWidth(1)
        .linkDirectionalParticles(link => (searchHighlightNodes.size === 0 || searchHighlightNodes.has(link.source) || searchHighlightNodes.has(link.target)) ? 2 : 0)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleSpeed(0.005)
        .onNodeClick(node => focusNode(node));

    graphInitialized = true;
    
    // Event Listeners for Filters
    document.getElementById('graph-search').addEventListener('input', e => {
        const query = e.target.value.toLowerCase();
        searchHighlightNodes.clear();
        if (query) {
            window.pathwaysData.nodes.forEach(n => {
                if (n.label && n.label.toLowerCase().includes(query) || n.desc && n.desc.toLowerCase().includes(query)) {
                    searchHighlightNodes.add(n);
                }
            });
        }
        updateGraphVisuals();
    });

    document.querySelectorAll('.layer-toggle').forEach(chk => {
        chk.addEventListener('change', (e) => {
            if(e.target.checked) activeLayers.add(e.target.value);
            else activeLayers.delete(e.target.value);
            filterGraphData();
        });
    });

    window.addEventListener('resize', () => {
        if(!document.getElementById('view-pathways').classList.contains('hidden') && Graph) {
            Graph.width(elem.clientWidth).height(elem.clientHeight);
        }
    });

    setTimeout(() => resetGraphView(), 1000);
}

function updateGraphVisuals() {
    if (Graph) {
        Graph.nodeThreeObject(Graph.nodeThreeObject());
        Graph.linkDirectionalParticles(Graph.linkDirectionalParticles());
    }
}

function filterGraphData() {
    if (!window.pathwaysData || !Graph) return;

    const fNodes = window.pathwaysData.nodes.filter(n => n.layers && n.layers.some(l => activeLayers.has(l)));
    const nodeIds = new Set(fNodes.map(n => n.id));
    const fLinks = window.pathwaysData.links.filter(l => {
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });

    Graph.graphData({ nodes: fNodes, links: fLinks });
}

function focusNode(nodeOrId) {
    if (!window.pathwaysData || !Graph) return;
    let node = typeof nodeOrId === 'string' ? window.pathwaysData.nodes.find(n => n.id === nodeOrId) : nodeOrId;
    if(!node) return;

    const distance = 80;
    const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
    Graph.cameraPosition(
        { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
        node, 
        2000
    );
    showSidebar(node);
}

function resetGraphView() {
    if(Graph) Graph.zoomToFit(1500, 50);
    closeSidebar();
}

// --- Sidebar Logic ---
function showSidebar(node) {
    const sidebar = document.getElementById('pathway-sidebar');
    
    const tagsDiv = document.getElementById('node-tags');
    tagsDiv.innerHTML = '';
    if (node.layers) {
        node.layers.forEach(l => tagsDiv.innerHTML += `<span class="px-2 py-1 bg-neuro-dark border border-neuro-border rounded text-[10px] uppercase font-bold text-neuro-muted">${l}</span>`);
    }
    
    document.getElementById('node-title').innerText = node.label || 'Node';
    document.getElementById('node-title').style.color = node.color || '#fff';
    document.getElementById('node-desc').innerText = node.desc || '';
    document.getElementById('node-time').innerText = node.time || '';
    document.getElementById('node-difficulty').innerText = node.difficulty || '';
    
    const preDiv = document.getElementById('node-prereqs');
    preDiv.innerHTML = '';
    if(!node.prereqs || node.prereqs.length === 0) preDiv.innerHTML = '<span class="text-xs text-neuro-border italic">None required</span>';
    else {
        node.prereqs.forEach(pid => {
            const pNode = window.pathwaysData.nodes.find(n => n.id === pid);
            if(pNode) preDiv.innerHTML += `<button onclick="focusNode('${pid}')" class="nav-chip">${pNode.label}</button>`;
        });
    }

    const unDiv = document.getElementById('node-unlocks');
    unDiv.innerHTML = '';
    if(!node.unlocks || node.unlocks.length === 0) unDiv.innerHTML = '<span class="text-xs text-neuro-border italic">End of current path</span>';
    else {
        node.unlocks.forEach(uid => {
            const uNode = window.pathwaysData.nodes.find(n => n.id === uid);
            if(uNode) unDiv.innerHTML += `<button onclick="focusNode('${uid}')" class="nav-chip">${uNode.label}</button>`;
        });
    }

    const resUl = document.getElementById('node-resources');
    resUl.innerHTML = '';
    if(!node.resources || node.resources.length === 0) {
        resUl.innerHTML = '<span class="text-xs text-neuro-border italic">No specific links curated yet.</span>';
    } else {
        node.resources.forEach(r => {
            resUl.innerHTML += `
                <li>
                    <a href="${r.url}" target="_blank" class="resource-link">
                        <svg class="w-4 h-4 mr-2 mt-0.5 text-neuro-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                        <span>${r.title}</span>
                    </a>
                </li>
            `;
        });
    }

    sidebar.classList.remove('translate-x-full');
}

function closeSidebar() {
    document.getElementById('pathway-sidebar').classList.add('translate-x-full');
}

// --- Guided Tour ---
const tourStops = [
    { id: "hs_bio", title: "The Foundation", desc: "Every journey starts here. High School Biology and Math form the bedrock. From here, you can diverge into pure biology, math, or dive straight into Intro to Neuroscience." },
    { id: "intro_neuro", title: "Entering the Brain", desc: "The core node. Mastering Intro to Neuroscience unlocks nearly everything else: Anatomy, Cellular, Cognitive, and Computational subfields." },
    { id: "action_potentials", title: "The Neural Code", desc: "Understanding how neurons fire electrical spikes. Notice how this requires Calculus and leads directly into Patch Clamp methods and Hodgkin-Huxley modeling." },
    { id: "cog_neuro", title: "Mind and Brain", desc: "Where psychology meets biology. This massive hub unlocks specializations in Memory, Decision Making, and Social Neuroscience." },
    { id: "python_neuro", title: "The Modern Scalpel", desc: "Python. A critical skill node. Notice the massive web of connections extending from it—into Machine Learning, fMRI analysis, and BCI." },
    { id: "academia_pi", title: "The Academic Summit", desc: "The traditional apex of the academic path. Achieved after a PhD and Postdoc, demanding a lifetime mastery of your chosen sub-cluster." }
];
let tourIndex = 0;

function startGuidedTour() {
    document.getElementById('tour-overlay').classList.remove('hidden');
    tourIndex = 0;
    showTourStep();
}

function endTour() {
    document.getElementById('tour-overlay').classList.add('hidden');
    resetGraphView();
}

function tourNav(dir) {
    tourIndex += dir;
    if(tourIndex < 0) tourIndex = 0;
    if(tourIndex >= tourStops.length) { endTour(); return; }
    showTourStep();
}

function showTourStep() {
    const step = tourStops[tourIndex];
    document.getElementById('tour-step').innerText = `${tourIndex + 1}/${tourStops.length}`;
    document.getElementById('tour-title').innerText = step.title;
    document.getElementById('tour-desc').innerText = step.desc;
    
    document.getElementById('tour-prev').disabled = (tourIndex === 0);
    document.getElementById('tour-next').innerText = (tourIndex === tourStops.length - 1) ? "Finish" : "Next →";

    focusNode(step.id);
}

// --- BOOT SEQUENCE ---
// Run automatically once the DOM completes its initial parse
document.addEventListener('DOMContentLoaded', () => {
    const activeView = document.querySelector('.page-view.active');
    if (activeView) {
        const viewId = activeView.id.replace('view-', '');
        if (viewId === 'pathways') initGraph();
        if (viewId === 'resources') renderResources();
    }
});
