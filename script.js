// ============ DATOS CON ENLACES ============
let currentUser = null;

const gamesData = [
    { id: 1, name: "VALORANT", category: "FPS", rating: 4.8, rank: 1, emoji: "🔫", page: "index_valorant.html" },
    { id: 2, name: "League of Legends", category: "MOBA", rating: 4.7, rank: 2, emoji: "⚔️", page: "index_lol.html" },
    { id: 3, name: "Counter-Strike 2", category: "FPS", rating: 4.6, rank: 3, emoji: "🎯", page: "index_counter.html" },
    { id: 4, name: "Fortnite", category: "Battle Royale", rating: 4.5, rank: 4, emoji: "🪂", page: "fortnite.html" },
    { id: 5, name: "Dota 2", category: "MOBA", rating: 4.4, rank: 5, emoji: "🧙", page: "index_dota.html" },
    { id: 6, name: "Apex Legends", category: "Battle Royale", rating: 4.3, rank: 6, emoji: "🚀", page: "index_apex.html" },
    { id: 7, name: "Call of Duty", category: "FPS", rating: 4.2, rank: 7, emoji: "💥", page: "index_call.html" },
    { id: 8, name: "Minecraft", category: "RPG", rating: 4.9, rank: 8, emoji: "⛏️", page: "index_minecraft.html" },
    { id: 9, name: "Deemo", category: "Musical", rating: 5.0, rank: 9, emoji: "🎹", page: "deemo.html" }
];

let threads = [
    { id: 1, title: "Mejores agentes para subir en VALORANT", category: "Meta", author: "ProPlayer", date: "2026-03-20", replies: 12, content: "Comparto mi experiencia con los agentes más efectivos para ranked." },
    { id: 2, title: "Configuración óptima para CS2", category: "Hardware", author: "TechGamer", date: "2026-03-21", replies: 8, content: "Estos son los mejores settings para maximizar FPS." },
    { id: 3, title: "Estrategias para late game en LoL", category: "Estrategias", author: "StrategyKing", date: "2026-03-22", replies: 5, content: "Consejos para cerrar partidas cuando vas ganando." }
];

let posts = [
    { id: 1, threadId: 1, author: "Newbie", date: "2026-03-21", content: "Muy útil, gracias por compartir!" },
    { id: 2, threadId: 1, author: "GamerX", date: "2026-03-22", content: "Yo recomendaría también a Sage." }
];

const categories = ["Todos", "FPS", "Battle Royale", "MOBA", "RPG", "Musical"];
const forumCategories = ["General", "Meta", "Hardware", "Estrategias", "Noticias"];

// ============ NAVEGACIÓN ============
function navigateTo(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(section).classList.add('active');
    if (section === 'ranking') updateRankingDisplay();
    if (section === 'community') renderForumView();
    window.scrollTo({ top: 0 });
}

// ============ FUNCIÓN PARA ABRIR JUEGO ============
function openGame(page) {
    if (page) {
        window.location.href = page;
    } else {
        alert('🚧 Página en construcción. ¡Próximamente!');
    }
}

// ============ AUTENTICACIÓN ============
function updateAuthUI() {
    const authDiv = document.getElementById('authButtons');
    if (currentUser) {
        authDiv.innerHTML = `
            <span style="color:#00ff88;">👤 ${currentUser.username}</span>
            <button class="btn btn-outline" onclick="showProfile()">Perfil</button>
            <button class="btn btn-outline" onclick="logout()">Salir</button>
        `;
    } else {
        authDiv.innerHTML = `
            <button class="btn btn-outline" onclick="showModal('login')">Ingresar</button>
            <button class="btn btn-primary" onclick="showModal('register')">Registro</button>
        `;
    }
}

function showModal(type, data = null) {
    const modal = document.getElementById('modal');
    const modalContent = document.getElementById('modalContent');
    
    if (type === 'login') {
        modalContent.innerHTML = `
            <h2 style="color:#00ff88;">Iniciar Sesión</h2>
            <input type="email" id="loginEmail" placeholder="Correo electrónico">
            <input type="password" id="loginPassword" placeholder="Contraseña">
            <div id="loginError" class="error-message"></div>
            <button class="btn btn-primary" onclick="login()">Ingresar</button>
            <p style="margin-top:1rem;">¿Sin cuenta? <a onclick="showModal('register')" style="color:#00ff88; cursor:pointer;">Regístrate</a></p>
        `;
    } else if (type === 'register') {
        modalContent.innerHTML = `
            <h2 style="color:#00ff88;">Registrarse</h2>
            <input type="text" id="regUsername" placeholder="Usuario">
            <input type="email" id="regEmail" placeholder="Correo">
            <input type="password" id="regPassword" placeholder="Contraseña (mínimo 8)">
            <input type="password" id="regConfirm" placeholder="Confirmar">
            <div id="registerError" class="error-message"></div>
            <button class="btn btn-primary" onclick="register()">Crear Cuenta</button>
        `;
    } else if (type === 'createThread') {
        modalContent.innerHTML = `
            <h2 style="color:#00ff88;">Crear Hilo</h2>
            <input type="text" id="threadTitle" placeholder="Título">
            <select id="threadCategory">${forumCategories.map(c => `<option>${c}</option>`).join('')}</select>
            <textarea id="threadContent" rows="4" placeholder="Contenido..."></textarea>
            <button class="btn btn-primary" onclick="createThread()">Publicar</button>
        `;
    } else if (type === 'reply' && data) {
        modalContent.innerHTML = `
            <h2 style="color:#00ff88;">Responder</h2>
            <textarea id="replyContent" rows="4" placeholder="Tu respuesta..."></textarea>
            <button class="btn btn-primary" onclick="addReply(${data.threadId})">Publicar</button>
        `;
    }
    modal.classList.add('active');
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function login() {
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        updateAuthUI();
        closeModal();
        alert(`¡Bienvenido ${user.username}!`);
    } else {
        document.getElementById('loginError').innerText = 'Credenciales incorrectas';
    }
}

function register() {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    
    if (password.length < 8) {
        document.getElementById('registerError').innerText = 'Mínimo 8 caracteres';
        return;
    }
    if (password !== confirm) {
        document.getElementById('registerError').innerText = 'No coinciden';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(u => u.email === email)) {
        document.getElementById('registerError').innerText = 'Correo ya registrado';
        return;
    }
    if (users.some(u => u.username === username)) {
        document.getElementById('registerError').innerText = 'Usuario no disponible';
        return;
    }
    
    const newUser = { username, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    alert('Registro exitoso. Ahora inicia sesión.');
    showModal('login');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    navigateTo('home');
}

function showProfile() {
    if (!currentUser) return;
    const userThreads = threads.filter(t => t.author === currentUser.username);
    const userPosts = posts.filter(p => p.author === currentUser.username);
    alert(`👤 ${currentUser.username}\n📝 Hilos: ${userThreads.length}\n💬 Respuestas: ${userPosts.length}`);
}

// ============ RANKING ============
function updateRankingDisplay() {
    const rankingData = [...gamesData].sort((a, b) => b.rating - a.rating);
    rankingData.forEach((g, i) => { g.currentRank = i + 1; g.variation = Math.floor(Math.random() * 5) - 2; });
    
    let html = '<table class="ranking-table"><thead><tr><th>#</th><th>Juego</th><th>Categoría</th><th>Puntuación</th><th>Variación</th></tr></thead><tbody>';
    for (let g of rankingData) {
        let posClass = '';
        if (g.currentRank === 1) posClass = 'position-1';
        else if (g.currentRank === 2) posClass = 'position-2';
        else if (g.currentRank === 3) posClass = 'position-3';
        
        let trend = g.variation > 0 ? '<span class="trend-up">▲ +' + g.variation + '</span>' : 
                    (g.variation < 0 ? '<span class="trend-down">▼ ' + g.variation + '</span>' : '● 0');
        
        html += '<tr>' +
            '<td class="' + posClass + '">#' + g.currentRank + '</td>' +
            '<td><strong>' + g.emoji + ' ' + g.name + '</strong></td>' +
            '<td>' + g.category + '</td>' +
            '<td>' + g.rating + ' ★</td>' +
            '<td>' + trend + '</td>' +
        '</tr>';
    }
    html += '</tbody></table>';
    document.getElementById('rankingTable').innerHTML = html;
}

// ============ JUEGOS (con enlace clickeable) ============
function renderGames(filter = 'Todos') {
    const filtered = filter === 'Todos' ? gamesData : gamesData.filter(g => g.category === filter);
    
    document.getElementById('gamesGrid').innerHTML = filtered.map(g => `
        <div class="card" onclick="openGame('${g.page}')" style="cursor: pointer;">
            <div style="font-size: 4rem; text-align: center; margin: 0.5rem 0;">${g.emoji}</div>
            <h3 style="text-align: center;">${g.name}</h3>
            <p style="text-align: center;">🎮 ${g.category}</p>
            <p style="text-align: center;">⭐ ${g.rating} / 5</p>
            <p style="text-align: center;">🏆 Ranking #${g.rank}</p>
            <div style="text-align: center; color: #00ff88; font-size: 0.8rem; margin-top: 0.5rem;">✨ Click para jugar</div>
        </div>
    `).join('');
}

function initGameFilters() {
    document.getElementById('gameFilters').innerHTML = categories.map(c => 
        `<button class="filter-btn" onclick="renderGames('${c}')">${c}</button>`
    ).join('');
    renderGames('Todos');
}

// ============ FOROS ============
function renderForumView() {
    document.getElementById('forumView').innerHTML = `
        <div class="forum-categories" id="forumCategories"></div>
        <div id="threadsView"></div>
        ${currentUser ? '<button class="btn btn-primary" onclick="showModal(\'createThread\')">+ Nuevo Hilo</button>' : '<p style="color:#666;">🔐 Inicia sesión para crear hilos</p>'}
    `;
    document.getElementById('forumCategories').innerHTML = forumCategories.map(cat => `
        <div class="category-card" onclick="showThreadsByCategory('${cat}')">
            <h3>${cat}</h3>
            <p>📌 ${threads.filter(t => t.category === cat).length} hilos</p>
        </div>
    `).join('');
}

function showThreadsByCategory(category) {
    const filtered = threads.filter(t => t.category === category);
    const container = document.getElementById('threadsView');
    if (filtered.length === 0) {
        container.innerHTML = '<p>📭 Aún no hay publicaciones. ¡Sé el primero!</p>';
        return;
    }
    container.innerHTML = `<h3>📂 ${category}</h3><div class="threads-list">` + 
        filtered.map(t => `<div class="thread-item" onclick="showThreadDetail(${t.id})"><strong>${t.title}</strong><br><small>👤 ${t.author} | 💬 ${t.replies} respuestas | 📅 ${t.date}</small></div>`).join('') + 
        `</div>`;
}

function showThreadDetail(threadId) {
    const thread = threads.find(t => t.id === threadId);
    const threadPosts = posts.filter(p => p.threadId === threadId);
    document.getElementById('threadsView').innerHTML = `
        <button class="btn btn-outline" onclick="renderForumView()">← Volver</button>
        <div class="card" style="margin-top:1rem;">
            <h2>${thread.title}</h2>
            <small>📂 ${thread.category} | 👤 ${thread.author} | 📅 ${thread.date}</small>
            <p style="margin-top:1rem;">${thread.content}</p>
        </div>
        <h3>💬 Respuestas (${threadPosts.length})</h3>
        ${threadPosts.map(p => `<div class="thread-item"><strong>${p.author}</strong> - ${p.date}<br>${p.content}</div>`).join('')}
        ${currentUser ? `<button class="btn btn-primary" style="margin-top:1rem;" onclick="showModal('reply', {threadId:${threadId}})">✏️ Responder</button>` : '<p style="margin-top:1rem;">🔐 Inicia sesión para responder</p>'}
    `;
}

function createThread() {
    const title = document.getElementById('threadTitle').value;
    const category = document.getElementById('threadCategory').value;
    const content = document.getElementById('threadContent').value;
    if (!title || !content) { alert('Completa todos los campos'); return; }
    threads.unshift({
        id: threads.length + 1,
        title,
        category,
        author: currentUser.username,
        date: new Date().toISOString().split('T')[0],
        replies: 0,
        content
    });
    closeModal();
    renderForumView();
    alert('✅ Hilo creado');
}

function addReply(threadId) {
    const content = document.getElementById('replyContent').value;
    if (!content) { alert('Escribe tu respuesta'); return; }
    posts.push({
        id: posts.length + 1,
        threadId,
        author: currentUser.username,
        date: new Date().toISOString().split('T')[0],
        content
    });
    const thread = threads.find(t => t.id === threadId);
    thread.replies++;
    closeModal();
    showThreadDetail(threadId);
    alert('✅ Respuesta publicada');
}

// ============ ENCUESTA ============
function submitSurvey() {
    const alias = document.getElementById('surveyAlias').value.trim();
    const type = document.getElementById('surveyType').value;
    const hours = document.getElementById('surveyHours').value;
    const genre = document.getElementById('surveyGenre').value;
    const tournament = document.querySelector('input[name="tournament"]:checked');
    const community = document.querySelector('input[name="community"]:checked');
    
    if (!alias) { alert('Por favor ingresa tu alias'); return; }
    if (!type) { alert('Selecciona tu tipo de jugador'); return; }
    if (!hours) { alert('Selecciona tus horas de juego'); return; }
    if (!genre) { alert('Selecciona tu género favorito'); return; }
    if (!tournament) { alert('Selecciona si participas en torneos'); return; }
    if (!community) { alert('Selecciona qué buscas en una comunidad'); return; }
    
    let profileMessage = '';
    if (type === 'Competitivo') profileMessage = '🏆 Eres un jugador COMPETITIVO';
    else if (type === 'Casual') profileMessage = '🎮 Eres un jugador CASUAL';
    else if (type === 'Estratega') profileMessage = '🧠 Eres un ESTRATEGA';
    else if (type === 'Social') profileMessage = '💬 Eres un jugador SOCIAL';
    else if (type === 'Tryhard') profileMessage = '⚡ Eres un TRYHARD';
    
    const resultDiv = document.getElementById('surveyResult');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3 style="color:#00ff88;">📊 Resultado de tu encuesta</h3>
        <p><strong>Alias:</strong> ${alias}</p>
        <p><strong>Tipo de jugador:</strong> ${type}</p>
        <p><strong>Horas semanales:</strong> ${hours}</p>
        <p><strong>Género favorito:</strong> ${genre}</p>
        <p><strong>Participación en torneos:</strong> ${tournament.value}</p>
        <p><strong>Busca en comunidad:</strong> ${community.value}</p>
        <div style="background:#00ff88; color:#0a0a0a; padding:1rem; border-radius:5px; margin-top:1rem;">
            <strong>🎯 Tu perfil:</strong> ${profileMessage}<br>
            ¡Bienvenido a GamerZone_Beta, ${alias}!
        </div>
    `;
    
    const surveys = JSON.parse(localStorage.getItem('surveys') || '[]');
    surveys.push({ alias, type, hours, genre, tournament: tournament.value, community: community.value, date: new Date().toISOString() });
    localStorage.setItem('surveys', JSON.stringify(surveys));
}

// ============ ESTADÍSTICAS INICIO ============
function initHomeStats() {
    const totalUsers = JSON.parse(localStorage.getItem('users') || '[]').length;
    document.getElementById('statsGrid').innerHTML = `
        <div class="card"><h3>👥 Usuarios</h3><div class="stat-number">${totalUsers || 128}</div></div>
        <div class="card"><h3>🎮 Juegos</h3><div class="stat-number">${gamesData.length}</div></div>
        <div class="card"><h3>📝 Hilos</h3><div class="stat-number">${threads.length}</div></div>
    `;
    
    document.getElementById('featuredGames').innerHTML = gamesData.slice(0, 3).map(g => `
        <div class="card" onclick="openGame('${g.page}')" style="cursor: pointer;">
            <div style="font-size: 3rem; text-align: center;">${g.emoji}</div>
            <h3 style="text-align: center;">${g.name}</h3>
            <p style="text-align: center;">${g.category}</p>
            <p style="text-align: center;">⭐ ${g.rating}</p>
        </div>
    `).join('');
    
    document.getElementById('latestPosts').innerHTML = threads.slice(0, 3).map(t => `
        <div class="card"><h3>${t.title}</h3><p>👤 ${t.author} | 💬 ${t.replies}</p><small>📅 ${t.date}</small></div>
    `).join('');
}

// ============ INICIALIZACIÓN ============
const savedUser = localStorage.getItem('currentUser');
if (savedUser) currentUser = JSON.parse(savedUser);
updateAuthUI();
initGameFilters();
initHomeStats();
updateRankingDisplay();
setInterval(updateRankingDisplay, 60000);

document.getElementById('modal').addEventListener('click', (e) => {
    if (e.target.id === 'modal') closeModal();
});

// Exponer funciones globalmente
window.navigateTo = navigateTo;
window.openGame = openGame;
window.showModal = showModal;
window.login = login;
window.register = register;
window.logout = logout;
window.showProfile = showProfile;
window.renderGames = renderGames;
window.showThreadsByCategory = showThreadsByCategory;
window.showThreadDetail = showThreadDetail;
window.createThread = createThread;
window.addReply = addReply;
window.submitSurvey = submitSurvey;
