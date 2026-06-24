# NeuroCanvas 🧠

The premier hub for neuroscience students, researchers, and enthusiasts. Built to be fast, clear, and immensely useful.

## Features
1. **Before You Code**: A "Data Protocol" builder that helps researchers pre-register their data-handling decisions (like filters, exclusions, and regressors) *before* writing any analysis code to prevent p-hacking. Works offline via a robust fallback engine, or dynamically if you provide a free OpenRouter API key.
2. **Neuro Resources**: An aggressively curated, zero-noise wiki of 105 actual, high-quality neuroscience datasets, tools, courses, and opportunities.
3. **Pathways Map**: An interactive 3D spatial map of neuroscience education and career trajectories.

## How to Run Locally
Because NeuroCanvas is built with Vanilla HTML/JS and uses CDN imports for styling and 3D rendering, there is **zero build step**.

1. Download all the files into a single folder.
2. Open `index.html` in your web browser.
   *(Note: To avoid CORS issues with local file loading in some browsers, you can run a simple local server: `python -m http.server 8000` or use VS Code's Live Server extension).*

## How to Deploy to GitHub Pages
1. Create a new repository on GitHub.
2. Upload all the files (`index.html`, `styles.css`, `app.js`, `resources.js`, `pathways.js`).
3. Go to your repository **Settings** > **Pages**.
4. Set the source to deploy from the `main` branch.
5. Save, and your site will be live in minutes! 🚀