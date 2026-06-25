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

// --- Neuro Resources (Unchanged) ---
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

// --- Before You Code (Unchanged) ---
// [The existing Before You Code functions (generateChecklist, checkSignOff, exportProtocol) remain exactly the same as previously written.]

// --- 3D Graph Pathways Map ---
let Graph;
let graphInitialized = false;
let searchHighlightNodes = new Set();
let activeLayers = new Set(["education", "skills", "research", "career"]);

function initGraph() {
    if(graphInitialized) return;
    
    const elem = document.getElementById('3d-graph');
    elem.innerHTML = '';
    
    // Build Legend
    const legend = document.getElementById('graph-legend');
    for (const [key, color] of Object.entries(window.clusterColors)) {
        legend.innerHTML += `<div class="flex items-center gap-2"><div class="w-3 h-3 rounded-full" style="background:${color}; box-shadow: 0 0 8px ${color}"></div><span class="text-neuro-muted capitalize">${key.replace('_',' ')}</span></div>`;
    }

    Graph = ForceGraph3D()(elem)
        .backgroundColor('#050914')
        .graphData(window.pathwaysData)
        .nodeRelSize(4)
        .nodeThreeObject(node => {
            // Group holds sphere + halo + label
            const group = new THREE.Group();
            
            // Core Sphere
            const isDimmed = searchHighlightNodes.size > 0 && !searchHighlightNodes.has(node);
            const opacity = isDimmed ? 0.1 : 0.9;
            
            const geometry = new THREE.SphereGeometry(node.size * 2, 16, 16);
            const material = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: opacity });
            const sphere = new THREE.Mesh(geometry, material);
            group.add(sphere);

            // Halo glow
            if (!isDimmed) {
                const haloGeo = new THREE.SphereGeometry(node.size * 3.5, 16, 16);
                const haloMat = new THREE.MeshBasicMaterial({ color: node.color, transparent: true, opacity: 0.15 });
                const halo = new THREE.Mesh(haloGeo, haloMat);
                group.add(halo);
            }

            // Billboard Text Label
            const sprite = new SpriteText(node.label);
            sprite.color = isDimmed ? '#334155' : '#ffffff';
            sprite.textHeight = Math.max(2, node.size * 0.8);
            sprite.position.y = -(node.size * 2.5); // position below sphere
            group.add(sprite);

            return group;
        })
        .linkColor(() => 'rgba(51, 65, 85, 0.4)')
        .linkWidth(1)
        .linkDirectionalParticles(link => (searchHighlightNodes.size === 0 || searchHighlightNodes.has(link.source) || searchHighlightNodes.has(link.target)) ? 2 : 0)
        .linkDirectionalParticleWidth(1.5)
        .linkDirectionalParticleSpeed(0.005)
        .onNodeClick(node => {
            focusNode(node);
        });

    graphInitialized = true;
    
    // Event Listeners for Filters
    document.getElementById('graph-search').addEventListener('input', e => {
        const query = e.target.value.toLowerCase();
        searchHighlightNodes.clear();
        if (query) {
            window.pathwaysData.nodes.forEach(n => {
                if (n.label.toLowerCase().includes(query) || n.desc.toLowerCase().includes(query)) {
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
        if(!document.getElementById('view-pathways').classList.contains('hidden')) {
            Graph.width(elem.clientWidth).height(elem.clientHeight);
        }
    });

    setTimeout(() => resetGraphView(), 1000);
}

function updateGraphVisuals() {
    // Refresh node three objects to apply dimming
    Graph.nodeThreeObject(Graph.nodeThreeObject());
    Graph.linkDirectionalParticles(Graph.linkDirectionalParticles());
}

function filterGraphData() {
    // Filter nodes based on active layers
    const fNodes = window.pathwaysData.nodes.filter(n => n.layers.some(l => activeLayers.has(l)));
    const nodeIds = new Set(fNodes.map(n => n.id));
    const fLinks = window.pathwaysData.links.filter(l => {
        // Links are objects after init, so we check id or source/target
        const srcId = typeof l.source === 'object' ? l.source.id : l.source;
        const tgtId = typeof l.target === 'object' ? l.target.id : l.target;
        return nodeIds.has(srcId) && nodeIds.has(tgtId);
    });

    Graph.graphData({ nodes: fNodes, links: fLinks });
}

function focusNode(nodeOrId) {
    let node = typeof nodeOrId === 'string' ? window.pathwaysData.nodes.find(n => n.id === nodeOrId) : nodeOrId;
    if(!node) return;

    // Camera Fly
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
    Graph.zoomToFit(1500, 50);
    closeSidebar();
}

// --- Sidebar Logic ---
function showSidebar(node) {
    const sidebar = document.getElementById('pathway-sidebar');
    
    // Tags
    const tagsDiv = document.getElementById('node-tags');
    tagsDiv.innerHTML = '';
    node.layers.forEach(l => tagsDiv.innerHTML += `<span class="px-2 py-1 bg-neuro-dark border border-neuro-border rounded text-[10px] uppercase font-bold text-neuro-muted">${l}</span>`);
    
    document.getElementById('node-title').innerText = node.label;
    document.getElementById('node-title').style.color = node.color;
    document.getElementById('node-desc').innerText = node.desc;
    document.getElementById('node-time').innerText = node.time;
    document.getElementById('node-difficulty').innerText = node.difficulty;
    
    // Prereqs
    const preDiv = document.getElementById('node-prereqs');
    preDiv.innerHTML = '';
    if(node.prereqs.length === 0) preDiv.innerHTML = '<span class="text-xs text-neuro-border italic">None required</span>';
    node.prereqs.forEach(pid => {
        const pNode = window.pathwaysData.nodes.find(n => n.id === pid);
        if(pNode) preDiv.innerHTML += `<button onclick="focusNode('${pid}')" class="nav-chip">${pNode.label}</button>`;
    });

    // Unlocks
    const unDiv = document.getElementById('node-unlocks');
    unDiv.innerHTML = '';
    if(node.unlocks.length === 0) unDiv.innerHTML = '<span class="text-xs text-neuro-border italic">End of current path</span>';
    node.unlocks.forEach(uid => {
        const uNode = window.pathwaysData.nodes.find(n => n.id === uid);
        if(uNode) unDiv.innerHTML += `<button onclick="focusNode('${uid}')" class="nav-chip">${uNode.label}</button>`;
    });

    // Resources
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
