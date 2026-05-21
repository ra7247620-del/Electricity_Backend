if (!requireAdmin()) {
    exit;
}

const user = getUser();
document.getElementById('username').textContent = user.username;

let statusModal;
let roleModal;

// Initialize modals
document.addEventListener('DOMContentLoaded', () => {
    statusModal = new bootstrap.Modal(document.getElementById('statusModal'));
    roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
});

// Load admin dashboard data
async function loadAdminDashboard() {
    try {
        const data = await apiCall('/admin/dashboard');
        if (data && data.success) {
            document.getElementById('totalUsers').textContent = data.data.totalUsers || 0;
            document.getElementById('totalReports').textContent = data.data.totalReports || 0;
            document.getElementById('pendingReports').textContent = data.data.stats.pending || 0;
            document.getElementById('resolvedReports').textContent = data.data.stats.resolved || 0;
        }
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// Load all reports
async function loadAllReports() {
    try {
        const data = await apiCall('/reports/all');
        if (data && data.success) {
            const tbody = document.getElementById('reportsTable');
            tbody.innerHTML = '';
            
            if (data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">No reports found</td></tr>';
                return;
            }

            data.data.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.id}</td>
                    <td>${report.username}</td>
                    <td>${report.location}</td>
                    <td><span class="badge severity-${report.severity}">${report.severity}</span></td>
                    <td>${report.outage_type.replace('_', ' ')}</td>
                    <td><span class="badge status-${report.status}">${report.status.replace('_', ' ')}</span></td>
                    <td>${new Date(report.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openStatusModal(${report.id}, '${report.status}')">Update Status</button>
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Load all users
async function loadAllUsers() {
    try {
        const data = await apiCall('/admin/users');
        if (data && data.success) {
            const tbody = document.getElementById('usersTable');
            tbody.innerHTML = '';
            
            if (data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
                return;
            }

            data.data.forEach(userItem => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${userItem.id}</td>
                    <td>${userItem.username}</td>
                    <td>${userItem.email}</td>
                    <td><span class="badge ${userItem.role === 'admin' ? 'bg-primary' : 'bg-secondary'}">${userItem.role}</span></td>
                    <td>${new Date(userItem.created_at).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="openRoleModal(${userItem.id}, '${userItem.role}')">Update Role</button>
                        ${userItem.id !== user.id ? `<button class="btn btn-sm btn-danger" onclick="deleteUser(${userItem.id})">Delete</button>` : ''}
                    </td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Open status modal
function openStatusModal(reportId, currentStatus) {
    document.getElementById('reportId').value = reportId;
    document.getElementById('status').value = currentStatus;
    statusModal.show();
}

// Open role modal
function openRoleModal(userId, currentRole) {
    document.getElementById('userId').value = userId;
    document.getElementById('userRole').value = currentRole;
    roleModal.show();
}

// Update report status
document.getElementById('statusForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const reportId = document.getElementById('reportId').value;
    const status = document.getElementById('status').value;

    try {
        const data = await apiCall(`/reports/${reportId}/status`, {
            method: 'PUT',
            body: JSON.stringify({ status })
        });

        if (data && data.success) {
            alert('Status updated successfully!');
            statusModal.hide();
            loadAllReports();
            loadAdminDashboard();
        } else {
            alert(data ? data.message : 'Failed to update status');
        }
    } catch (error) {
        console.error('Error updating status:', error);
        alert('Failed to update status. Please try again.');
    }
});

// Update user role
document.getElementById('roleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const userId = document.getElementById('userId').value;
    const role = document.getElementById('userRole').value;

    try {
        const data = await apiCall(`/admin/users/${userId}/role`, {
            method: 'PUT',
            body: JSON.stringify({ role })
        });

        if (data && data.success) {
            alert('Role updated successfully!');
            roleModal.hide();
            loadAllUsers();
        } else {
            alert(data ? data.message : 'Failed to update role');
        }
    } catch (error) {
        console.error('Error updating role:', error);
        alert('Failed to update role. Please try again.');
    }
});

// Delete user
async function deleteUser(userId) {
    if (!confirm('Are you sure you want to delete this user?')) {
        return;
    }

    try {
        const data = await apiCall(`/admin/users/${userId}`, {
            method: 'DELETE'
        });

        if (data && data.success) {
            alert('User deleted successfully!');
            loadAllUsers();
            loadAdminDashboard();
        } else {
            alert(data ? data.message : 'Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user. Please try again.');
    }
}

// Initial load
loadAdminDashboard();
loadAllReports();
loadAllUsers();
