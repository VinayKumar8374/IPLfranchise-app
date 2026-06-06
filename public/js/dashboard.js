let currentTeamData = null;

document.addEventListener('DOMContentLoaded', () => {
    loadFranchiseDirectory();
});

// Fetch short summaries for the sidebar navigation directory
async function loadFranchiseDirectory() {
    try {
        const response = await fetch('/api/teams');
        const teams = await response.json();
        const container = document.getElementById('team-list-container');
        
        container.innerHTML = teams.map(team => `
            <li class="team-item" id="nav-${team.id}" onclick="exploreTeam('${team.id}')">
                <div style="width: 12px; height: 12px; border-radius: 50%; background: ${team.primaryColor}"></div>
                <span>${team.name} (${team.shortName})</span>
            </li>
        `).join('');
    } catch (err) {
        console.error('Error fetching directory:', err);
    }
}

// Fetch complete record details for a specific chosen team
async function exploreTeam(teamId) {
    // UI state active styling switch
    document.querySelectorAll('.team-item').forEach(el => el.classList.remove('active'));
    document.getElementById(`nav-${teamId}`).classList.add('active');

    try {
        const response = await fetch(`/api/teams/${teamId}`);
        currentTeamData = await response.json();

        // Reveal content windows
        document.getElementById('empty-state').style.display = 'none';
        document.getElementById('dashboard-content').style.display = 'block';

        // Apply dynamic brand styling injection based on team accent guidelines
        const banner = document.getElementById('hero-banner');
        banner.style.background = `linear-gradient(135deg, ${currentTeamData.primaryColor}, ${currentTeamData.secondaryColor || '#0f172a'})`;

        // Load Header Core Identifiers
        document.getElementById('team-logo').src = currentTeamData.logo;
        document.getElementById('team-title').innerText = currentTeamData.name;
        document.getElementById('team-meta').innerText = `Established: ${currentTeamData.established} | Venue: ${currentTeamData.homeGround}`;

        // Populate tabs
        renderOverviewTab();
        renderSquadTab();
        renderFinancialsTab();
        switchTab('overview'); // Reset look back to summary view default

    } catch (err) {
        console.error('Error resolving profile details:', err);
    }
}

function renderOverviewTab() {
    document.getElementById('info-owners').innerText = currentTeamData.owners;
    
    // Trophies Array UI mapping 
    const rack = document.getElementById('info-trophies');
    if (currentTeamData.trophies.length > 0) {
        rack.innerHTML = currentTeamData.trophies.map(yr => `<span class="trophy-tag">🏆 ${yr} Champion</span>`).join('');
    } else {
        rack.innerHTML = `<span style="color: #9ca3af; font-size: 14px;">No championship trophies recorded</span>`;
    }

    // Management Table layout
    const managementBody = document.getElementById('table-leadership');
    const mgr = currentTeamData.management;
    managementBody.innerHTML = `
        <tr><td><strong>Chief Executive Officer (CEO)</strong></td><td>${mgr.ceo}</td></tr>
        <tr><td><strong>Head Coach</strong></td><td>${mgr.headCoach}</td></tr>
        <tr><td><strong>Team Captain</strong></td><td>${mgr.captain}</td></tr>
    `;
}

function renderSquadTab() {
    const squadTable = document.getElementById('table-roster');
    squadTable.innerHTML = currentTeamData.players.map(player => `
        <tr>
            <td><strong>${player.name}</strong></td>
            <td>${player.role}</td>
            <td>${player.nationality}</td>
            <td><code style="background: #f1f5f9; padding: 2px 6px; border-radius:4px;">${player.stats}</code></td>
        </tr>
    `).join('');
}

function renderFinancialsTab() {
    document.getElementById('metric-val').innerText = currentTeamData.valuation;
    document.getElementById('metric-rev').innerText = currentTeamData.revenue;
}

// Controller logic switches
function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));

    const activeIndexMap = { 'overview': 0, 'squad': 1, 'financials': 2 };
    const targetButton = document.querySelectorAll('.tab-btn')[activeIndexMap[tabName]];
    
    if (targetButton) targetButton.classList.add('active');
    document.getElementById(`tab-${tabName}`).classList.add('active');
}
