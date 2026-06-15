if (!requireAdmin()) {
    exit;
}

// ========================
// USER
// ========================
const user = getUser();

// ========================
// MODALS
// ========================
let statusModal;
let roleModal;

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('username').textContent = user.username;

    statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
    roleModal = new bootstrap.Modal(document.getElementById('roleModal'));

    // Load all features (UNCHANGED)
    loadAdminDashboard();
    loadAllReports();
    loadAllUsers();

    initMap();
});


// ========================
// MAP
// ========================
function initMap() {
    const mapEl = document.getElementById('adminMap');
    if (!mapEl) return;

    const map = L.map('adminMap').setView([26.8206, 30.8025], 6);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    loadMapReports(map);
}

async function loadMapReports(map) {
    try {

        const data = await apiCall('/reports/all');

        console.log("ALL REPORTS:", data);

        if (!data?.success) return;

        data.data.forEach(report => {

            if (!report.lat || !report.lng) return;

            let color = "red";

            if (report.status === "pending") color = "orange";
            else if (report.status === "in_progress") color = "blue";
            else if (report.status === "resolved") color = "green";

            const latOffset = (Math.random() - 0.5) * 0.01;
            const lngOffset = (Math.random() - 0.5) * 0.01;

            L.circleMarker([report.lat + latOffset, report.lng + lngOffset], {
                radius: 8,
                color: color,
                fillColor: color,
                fillOpacity: 0.8
            })
            .addTo(map)
            .bindPopup(`
                <b>${report.location}</b><br>
                Status: ${report.status}
            `);
        });

    } catch (err) {
        console.error(err);
    }
}


// ========================
// DASHBOARD
// ========================
async function loadAdminDashboard() {
    try {
        const data = await apiCall('/admin/dashboard');

        if (data?.success) {
            document.getElementById('totalUsers').textContent = data.data.totalUsers || 0;
            document.getElementById('totalReports').textContent = data.data.totalReports || 0;
            document.getElementById('pendingReports').textContent = data.data.stats.pending || 0;
            document.getElementById('resolvedReports').textContent = data.data.stats.resolved || 0;
        }

    } catch (e) {
        console.error(e);
    }
}


// ========================
// REPORTS TABLE (UNCHANGED UI)
// ========================
async function loadAllReports() {
    try {
        const data = await apiCall('/reports/all');
        if (!data?.success) return;

        const tbody = document.getElementById('reportsTable');
        tbody.innerHTML = '';

        data.data.forEach(report => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${report.id}</td>
                <td>${report.username}</td>
                <td>${report.location}</td>

                <td>
                    <span class="badge severity-${report.severity}">
                        ${report.severity}
                    </span>
                </td>

                <td>${report.outage_type.replace('_',' ')}</td>

                <td>
                    <span class="badge status-${report.status}">
                        ${report.status}
                    </span>
                </td>

                <td>${new Date(report.created_at).toLocaleString()}</td>

                <td>
                    <button class="btn btn-sm btn-primary"
                        onclick="openStatusModal(${report.id}, '${report.status}')">
                        Update Status
                    </button>
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (e) {
        console.error(e);
    }
}


// ========================
// USERS TABLE (RESTORED ACTIONS)
// ========================
async function loadAllUsers() {
    try {
        const data = await apiCall('/admin/users');
        if (!data?.success) return;

        const tbody = document.getElementById('usersTable');
        tbody.innerHTML = '';

        data.data.forEach(u => {

            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${u.id}</td>
                <td>${u.username}</td>
                <td>${u.email}</td>

                <td>
                    <span class="badge ${u.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">
                        ${u.role}
                    </span>
                </td>

                <td>${new Date(u.created_at).toLocaleString()}</td>

                <td>
                    <button class="btn btn-sm btn-primary"
                        onclick="openRoleModal(${u.id}, '${u.role}')">
                        Update Role
                    </button>

                    ${u.id !== user.id ? `
                        <button class="btn btn-sm btn-danger"
                            onclick="deleteUser(${u.id})">
                            Delete
                        </button>
                    ` : ''}
                </td>
            `;

            tbody.appendChild(row);
        });

    } catch (e) {
        console.error(e);
    }
}


// ========================
// MODALS ACTIONS
// ========================
function openStatusModal(id, status) {
    document.getElementById('reportId').value = id;
    document.getElementById('status').value = status;
    statusModal.show();
}

function openRoleModal(id, role) {
    document.getElementById('userId').value = id;
    document.getElementById('userRole').value = role;
    roleModal.show();
}