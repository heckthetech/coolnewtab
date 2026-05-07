
const styleOverride = document.createElement('style');
styleOverride.innerHTML = `
  .overlay-actions { flex-direction: row !important; justify-content: space-between !important; }
  .overlay-actions > * { border-radius: 8px !important; }
  .overlay-actions > *::before { display: none !important; /* Hide broken CSS icons */ }
  .status-badge { border-radius: 6px !important; }
  .status-badge::before { display: none !important; /* Hide broken CSS icons */ }
  .btn-status { border-radius: 8px !important; display: flex !important; align-items: center !important; justify-content: center !important; gap: 8px !important; font-weight: 600 !important; cursor: default !important; height: 48px !important; padding: 0 24px !important; min-width: 140px !important; }
  .btn-installed { background: rgba(16, 185, 129, 0.15) !important; color: #10b981 !important; border: 1px solid rgba(16, 185, 129, 0.3) !important; }
  .btn-disabled { background: rgba(156, 163, 175, 0.15) !important; color: #9ca3af !important; border: 1px solid rgba(156, 163, 175, 0.3) !important; }
`;
document.head.appendChild(styleOverride);

const iconDownload = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>`;
const iconTick = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const iconCross = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 6px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;

const iconDownloadSm = iconDownload.replace(/18/g, "14");
const iconTickSm = iconTick.replace(/18/g, "14");
const iconCrossSm = iconCross.replace(/18/g, "14");

window.isRendering = false;

(function robustDbLoader() {
  const url = 'plugindatabase.js?ts=' + Date.now();
  
  if (Array.isArray(window.plugins) && window.plugins.length > 0) {
    if (typeof onPluginsReady === 'function') setTimeout(() => onPluginsReady(), 50);
    return;
  }

  let loaded = false;
  
  fetch(url).then(async r => {
    if (!r.ok) throw new Error("Fetch failed");
    const txt = await r.text();
    
    try {
      if (/window\.plugins\s*=/.test(txt)) {
        const blob = new Blob([txt], { type: 'application/javascript' });
        const s = document.createElement('script');
        s.src = URL.createObjectURL(blob);
        s.onload = () => { 
            URL.revokeObjectURL(s.src); 
            loaded = true;
            if (typeof onPluginsReady === 'function') onPluginsReady(); 
        };
        document.head.appendChild(s);
        return;
      }
      
      const firstBracket = txt.indexOf('['); 
      const lastBracket = txt.lastIndexOf(']');
      if (firstBracket !== -1 && lastBracket > firstBracket) {
        const arrText = txt.slice(firstBracket, lastBracket + 1);
        const arr = (new Function('return ' + arrText))();
        if (Array.isArray(arr)) {
            if (!Array.isArray(window.plugins) || window.plugins.length === 0) window.plugins = arr;
            loaded = true;
            if (typeof onPluginsReady === 'function') onPluginsReady();
            return;
        }
      }
    } catch (e) {}
    
    const blob2 = new Blob([txt], { type: 'application/javascript' }); 
    const s2 = document.createElement('script'); 
    s2.src = URL.createObjectURL(blob2);
    s2.onload = () => {
        URL.revokeObjectURL(s2.src);
        loaded = true;
        if (typeof onPluginsReady === 'function') onPluginsReady();
    };
    document.head.appendChild(s2);

  }).catch(e => {
    const s = document.createElement('script'); 
    s.src = url;
    s.onload = () => { 
        loaded = true;
        if (typeof onPluginsReady === 'function') onPluginsReady(); 
    };
    document.head.appendChild(s);
  });

  setTimeout(() => {
      if (!loaded) {
          if (typeof onPluginsReady === 'function') onPluginsReady();
      }
  }, 4000); 
})();

if (!Array.isArray(window.plugins)) window.plugins = window.plugins || [];

const grid = document.getElementById("pluginGrid");
const overlay = document.getElementById("expandedOverlay");
const overlaybg = document.getElementById("expandedOverlaybg");
const overlayClose = document.getElementById("overlayClose");
const overlayTitle = document.getElementById("overlayTitle");
const overlaySlogan = document.getElementById("overlaySlogan");
const overlayDesc = document.getElementById("overlayDesc");
const overlayPoster = document.getElementById("overlayPoster");
const overlayActions = document.getElementById("overlayActions");
const searchInput = document.getElementById("searchInput");

let sending = false;
const pluginJsonCache = {};

let mainContentLoaded = false;
function showMainContent() {
    if (mainContentLoaded) return;
    mainContentLoaded = true;
    document.querySelector('aside').style.display = 'flex';
    document.querySelector('.main-area').style.display = 'block';
}

function checkExtensionAndInitialize() {
    const versionElement = document.getElementById('versionnumber');
    const versionString = versionElement ? versionElement.textContent.trim() : '0';
    const versionParts = versionString.split('.').map(n => parseInt(n) || 0);
    const majorVersion = versionParts[0];

    if (versionElement) {
        if (majorVersion < 3) {
            window.location.replace('deprecatedstore.html');
            return;
        }
        showMainContent();
    } else {
        document.getElementById('loadingOverlay').classList.remove('visible');
        document.getElementById('extensionWarning').style.display = 'flex';
    }
}

let pluginsReadyFired = false;
async function onPluginsReady() {
    if (pluginsReadyFired) {
        return;
    }
    pluginsReadyFired = true;

    await renderGrid(searchInput.value.toLowerCase());

    const params = new URLSearchParams(window.location.search);
    const queryName = params.get("q");
    const queryAuthor = params.get("author");

    if (!queryName || !queryAuthor) {
        return;
    }
    
    const list = Array.isArray(window.plugins) ? window.plugins : [];
    let matched = null;

    for (const p of list) {
        let meta = null;
        if (typeof p === 'string') {
            meta = await fetchPluginJson(p);
            if (!meta) continue;
        } else if (Array.isArray(p)) {
            const [name, slogan, poster, largePoster, desc, jsPath] = p;
            meta = { name, slogan, poster, largePoster, desc, jsPath, version: "0", author: "", uuid: "" };
        } else continue;

        if ((!meta.author || meta.author === "") && meta.jsPath) {
            const fallback = await fetchIntheckMetadata(meta.jsPath).catch(()=>null);
            if (fallback) { meta.author = meta.author || fallback.author || ""; meta.version = meta.version || fallback.version || "0"; meta.uuid = meta.uuid || fallback.uuid || ""; }
        }

        if ((meta.name || "").toLowerCase() === queryName.toLowerCase() && (meta.author || "").toLowerCase() === queryAuthor.toLowerCase()) {
            matched = meta;
            break;
        }
    }

    if (!matched) {
        return;
    }

    const installedList = await getInstalledMetadata();
    let btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(matched.jsPath)}','${escapeAttr(matched.poster||'')}')">${iconDownload} Install</button>`;

    const existing = installedList.find(inst => inst.uuid && matched.uuid && inst.uuid === matched.uuid);

    if (existing) {
        const cmp = versionCompare(matched.version, existing.version);
        if (existing.turned === "off") {
            btnHTML = `<div class="btn-status btn-disabled">${iconCross} Disabled</div>`;
        } else if (cmp === 0) {
            btnHTML = `<div class="btn-status btn-installed">${iconTick} Installed</div>`;
        } else if (cmp > 0) {
            btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(matched.jsPath)}','${escapeAttr(matched.poster||'')}')">${iconDownload} Update</button>`;
        } else {
            btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(matched.jsPath)}','${escapeAttr(matched.poster||'')}')">${iconDownload} Downgrade</button>`;
        }
    }
    
    showOverlay(matched.name, matched.slogan, matched.largePoster || matched.poster, matched.desc, matched.jsPath, btnHTML);
}

function createlisten(){ window.open("https://heckthetech.github.io/coolnewtab/pluginstore/submityourwork.html"); }
function arrayBufferToBase64(buffer){ const bytes = new Uint8Array(buffer); let binary = ""; for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]); return btoa(binary); }
async function urlToBase64(url){ const res = await fetch(url); if (!res.ok) throw new Error("Fetch failed: " + res.status); const buffer = await res.arrayBuffer(); return arrayBufferToBase64(buffer); }

async function getInstalledMetadata() {
  return new Promise(resolve => {
    const req = indexedDB.open("plugindata", 2);
    req.onupgradeneeded = e => { 
        const db = e.target.result; if (!db.objectStoreNames.contains("pluginsettings")) db.createObjectStore("pluginsettings", {keyPath: "uuid"}); 
    };
    req.onsuccess = () => {
      const db = req.result; if (!db.objectStoreNames.contains("pluginsettings")) { db.close(); resolve([]); return; }
      const tx = db.transaction("pluginsettings", "readonly"), store = tx.objectStore("pluginsettings"), getReq = store.getAll();
      getReq.onsuccess = () => {
        resolve(getReq.result || []); 
      }; 
      getReq.onerror = () => resolve([]);
    }; 
    req.onerror = () => resolve([]);
  });
}

function versionCompare(v1 = "0", v2 = "0") {
  const a = String(v1).split('.').map(n => parseInt(n||0,10));
  const b = String(v2).split('.').map(n => parseInt(n||0,10));
  
  const len = Math.max(a.length, b.length);
  
  for (let i = 0; i < len; i++) {
      const n1 = a[i] || 0;
      const n2 = b[i] || 0;
      if (n1 > n2) return 1;
      if (n1 < n2) return -1;
  }
  
  return 0; 
}

async function fetchPluginJson(jsonPath) {
  if (!jsonPath) return null; 

  let fetchUrl = jsonPath;
  if (fetchUrl.endsWith('/')) {
      fetchUrl += 'update';
  } else if (fetchUrl.endsWith('/plugininfo.json')) {
      fetchUrl = fetchUrl.replace('/plugininfo.json', '/update');
  }

  if (pluginJsonCache[fetchUrl]) return pluginJsonCache[fetchUrl];
  
  try {
    const res = await fetch(fetchUrl); 
    if (!res.ok) throw new Error('Fetch failed ' + res.status); 
    const j = await res.json();
    
    const norm = { 
        uuid: j.uuid || "",
        name: j["Full name"] || j.storetitle || j.pluginname || j.title || "", 
        actualName: j["Full name"] || j.actualtitle || "",
        slogan: j.storeshortdescription || "", 
        desc: j.storelongdescription || "", 
        poster: j.storeimg1 || j.storeimg || j.poster || "", 
        largePoster: j.storeimg2 || j.largePoster || j.storeimg1 || "", 
        jsPath: j.currentfile || "", 
        version: j.currentversion || j.version || "0", 
        author: j.author || j.Author || j.storeauthor || "" 
    };
    pluginJsonCache[fetchUrl] = norm; 
    return norm;
  } catch (e) { 
    pluginJsonCache[fetchUrl] = null; 
    return null; 
  }
}

async function fetchIntheckMetadata(fileUrl) {
  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return null;
    const txt = await res.text();
    const header = txt.slice(0, 5000);
    const uuidMatch = header.match(/\/\/uuid\s*:\s*"([^"]+)"/i);
    const nameMatch = header.match(/\/\/name\s*:\s*"([^"]+)"/i) || header.match(/pluginname\{([^}]+)\}/i);
    const versionMatch = header.match(/\/\/version\s*:\s*"([^"]+)"/i) || header.match(/version\{([^}]+)\}/i);
    const authorMatch = header.match(/\/\/author\s*:\s*"([^"]+)"/i) || header.match(/Author\{([^}]+)\}/i) || header.match(/author\{([^}]+)\}/i);
    return {
      uuid: uuidMatch?.[1]?.trim() || "",
      name: nameMatch?.[1]?.trim() || "",
      version: versionMatch?.[1]?.trim() || "0",
      author: authorMatch?.[1]?.trim() || ""
    };
  } catch (e) {
    return null;
  }
}

let renderDebounceTimer;
function renderGrid(filter = "") {
    clearTimeout(renderDebounceTimer);
    renderDebounceTimer = setTimeout(() => {
        performRenderGrid(filter);
    }, 150);
}

async function performRenderGrid(filter = "") {
  
  const installed = await getInstalledMetadata();
  const list = Array.isArray(window.plugins) ? window.plugins : [];
  const start = Date.now();
  
  const preparedItems = await Promise.all(list.map(async (entry, index) => {
    try {
        let meta = null;
        if (typeof entry === 'string') { meta = await fetchPluginJson(entry); } 
        else if (Array.isArray(entry)) { 
             const [name, slogan, poster, largePoster, desc, jsPath] = entry; 
             meta = { name, slogan, poster, largePoster, desc, jsPath, version: "0", author: "", uuid: "" }; 
        } 
        else { return null; }
        
        if (!meta) return null;

        if ((!meta.author || !meta.version || !meta.uuid) && meta.jsPath) {
             const fallback = await fetchIntheckMetadata(meta.jsPath).catch(()=>null);
             if (fallback) { 
                 meta.author = meta.author || fallback.author || ""; 
                 meta.version = meta.version || fallback.version || "0"; 
                 meta.uuid = meta.uuid || fallback.uuid || "";
                 if (!meta.actualName) meta.actualName = fallback.name;
                 meta.name = meta.name || fallback.name || meta.name; 
             }
        }
        return meta;
    } catch(e) { 
        return null; 
    }
  }));
  
  grid.innerHTML = ""; 

  let renderedCount = 0;
  for (let i = 0; i < preparedItems.length; i++) {
    const meta = preparedItems[i];
    if (!meta) continue;
    
    const storeEntry = list[i];
    const nameLower = (meta.name || "").toLowerCase();
    const sloganLower = (meta.slogan || "").toLowerCase();
    if (filter && !nameLower.includes(filter) && !sloganLower.includes(filter)) continue;

    let cardClass = "plugin-card", btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(meta.jsPath)}','${escapeAttr(meta.poster || '')}')">${iconDownload} Install</button>`;
    
    let badgeHTML = "";

    if (meta && meta.name) {
      const installedPlugin = installed.find(inst => inst.uuid && meta.uuid && inst.uuid === meta.uuid);
      
      if (installedPlugin) {
        
        const cmp = versionCompare(meta.version, installedPlugin.version || "0");
        
        if (installedPlugin.turned === "off") {
            cardClass += " installed-disabled"; 
            badgeHTML = `<span class="status-badge badge-disabled">${iconCrossSm} Disabled</span>`;
            btnHTML = `<div class="btn-status btn-disabled">${iconCross} Disabled</div>`; 
        }
        else if (cmp === 0) { 
            cardClass += " installed-same-version"; 
            badgeHTML = `<span class="status-badge badge-installed">${iconTickSm} Installed</span>`;
            btnHTML = `<div class="btn-status btn-installed">${iconTick} Installed</div>`; 
        }
        else if (cmp > 0) { 
            cardClass += " installed-update-available"; 
            badgeHTML = `<span class="status-badge badge-update">${iconDownloadSm} Need Update</span>`; 
            btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(meta.jsPath)}','${escapeAttr(meta.poster || '')}')">${iconDownload} Update</button>`; 
        }
        else if (cmp < 0) { 
            cardClass += " installed-downgrade-available"; 
            btnHTML = `<button class="btn-primary" onclick="sendFile('${escapeAttr(meta.jsPath)}','${escapeAttr(meta.poster || '')}')">${iconDownload} Downgrade</button>`; 
        }
      }
    }
    const card = document.createElement("div"); card.className = cardClass;
    card.innerHTML = `<img class="poster" src="${escapeAttr(meta.poster || '')}" alt="${escapeAttr(meta.name || '')} poster" /><img class="larposter" src="${escapeAttr(meta.largePoster || meta.poster || '')}" alt="${escapeAttr(meta.name || '')} poster" /><div class="plugin-content"><h3>${escapeHtml(meta.name || '')} ${badgeHTML}</h3><p class="slogan">${escapeHtml(meta.slogan || '')}</p><div class="plugin-actions"><button class="view-btn">View</button></div></div>`;
    card.addEventListener("click", () => { showOverlay(meta.name, meta.slogan, meta.largePoster || meta.poster, meta.desc || "", meta.jsPath, btnHTML); });
    const viewBtn = card.querySelector(".view-btn");
    if (viewBtn) { viewBtn.addEventListener("click", e => { e.stopPropagation(); showOverlay(meta.name, meta.slogan, meta.largePoster || meta.poster, meta.desc || "", meta.jsPath, btnHTML); }); }
    grid.appendChild(card);
    renderedCount++;
  }
  document.getElementById('loadingOverlay').classList.remove('visible');
  
  setTimeout(() => { window.isRendering = false; }, 500);
}

function showOverlay(name, slogan, poster, desc, jsPath, btnHTML) {
  overlayTitle.textContent = name || ""; overlaySlogan.textContent = slogan || ""; overlayPoster.src = poster || ""; overlayDesc.innerHTML = desc || "";
  
  const downloadBtnHTML = `<button class="btn-download" onclick="downloadPlugin('${escapeAttr(jsPath)}')">${iconDownload} Download</button>`;
  
  overlayActions.innerHTML = `${downloadBtnHTML} ${btnHTML}`;
  
  overlay.classList.add('active'); overlaybg.classList.add('active'); overlay.focus();
}

overlayClose.addEventListener('click', () => { overlay.classList.remove('active'); overlaybg.classList.remove('active'); });
overlaybg.addEventListener('click', () => { overlay.classList.remove('active'); overlaybg.classList.remove('active'); });
window.addEventListener('keydown', e => { if (e.key === "Escape" && overlay.classList.contains('active')) { overlay.classList.remove('active'); overlaybg.classList.remove('active'); }});

function downloadPlugin(jsPath) { if (!jsPath) return; const a = document.createElement('a'); a.href = jsPath; a.download = jsPath.split("/").pop(); document.body.appendChild(a); a.click(); a.remove(); }

async function sendFile(fileUrl, logoUrl) {
  if (sending) return; const loader = document.getElementById('loadingOverlay'); loader.classList.add('visible'); sending = true;
  try {
    const base64Plugin = await urlToBase64(fileUrl), base64Logo = logoUrl ? await urlToBase64(logoUrl) : "", fileName = (fileUrl || "").split('/').pop() || "Unnamed Plugin";
    window.postMessage({ type: "send-int-plugin-to-install-heck", base64Data: base64Plugin, fileName, logo: base64Logo }, "*");
  } catch (e) { } finally { sending = false; loader.classList.remove('visible'); }
}

function escapeAttr(s) { if (!s && s !== 0) return ""; return String(s).replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
function escapeHtml(s){ if (!s && s !== 0) return ""; return String(s).replace(/[&<>"']/g, function(m){ return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]; }); }

window.addEventListener("message", (event) => {
  if (event.data?.type === "injectPluginData") {
    showMainContent();
    const pluginSettingsArray = event.data.data;

    if (!pluginSettingsArray || pluginSettingsArray === "none" || pluginSettingsArray.length === 0) {
      const deleteRequest = indexedDB.deleteDatabase("plugindata");
      deleteRequest.onsuccess = () => { window.plugins = []; renderGrid(searchInput.value.toLowerCase()); }; return;
    }
    const dbReq = indexedDB.open("plugindata", 2);
    dbReq.onupgradeneeded = e => { 
      const db = e.target.result; 
      if (!db.objectStoreNames.contains("pluginsettings")) db.createObjectStore("pluginsettings", {keyPath: "uuid"}); 
    };
    dbReq.onsuccess = e => {
      const db = e.target.result; 
      const tx = db.transaction("pluginsettings", "readwrite"); 
      const store = tx.objectStore("pluginsettings"); 
      store.clear();
      pluginSettingsArray.forEach(p => store.put(p));
      tx.oncomplete = () => { 
        window.isRendering = false;
        renderGrid(searchInput.value.toLowerCase()); 
      };
    };
  }
});

searchInput.addEventListener("input", () => { const val = searchInput.value.toLowerCase(); renderGrid(val); });

function waitForExtensionElement() {
    let attempts = 50;
    const intervalTime = 100;
    const interval = setInterval(() => {
        const versionElement = document.getElementById('versionnumber');
        if (versionElement) {
            clearInterval(interval);
            checkExtensionAndInitialize();
        } else {
            attempts--;
            if (attempts <= 0) {
                clearInterval(interval);
                checkExtensionAndInitialize();
            }
        }
    }, intervalTime);
}
waitForExtensionElement();
