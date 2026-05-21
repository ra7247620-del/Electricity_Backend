if (!requireAuth()) {
    exit;
}

const user = getUser();
document.getElementById('username').textContent = user.username;

// Load dashboard data
async function loadDashboard() {
    try {
        const data = await apiCall('/reports/dashboard-stats');
        if (data && data.success) {
            document.getElementById('totalReports').textContent = data.data.stats.total || 0;
            document.getElementById('pendingReports').textContent = data.data.stats.pending || 0;
            document.getElementById('inProgressReports').textContent = data.data.stats.in_progress || 0;
            document.getElementById('resolvedReports').textContent = data.data.stats.resolved || 0;
        }
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Load user's reports
async function loadMyReports() {
    try {
        const data = await apiCall('/reports/my-reports');
        if (data && data.success) {
            const tbody = document.getElementById('reportsTable');
            tbody.innerHTML = '';
            
            if (data.data.length === 0) {
                tbody.innerHTML = '<tr><td colspan="6" class="text-center">No reports found</td></tr>';
                return;
            }

            data.data.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.id}</td>
                    <td>${report.location}</td>
                    <td><span class="badge severity-${report.severity}">${report.severity}</span></td>
                    <td>${report.outage_type.replace('_', ' ')}</td>
                    <td><span class="badge status-${report.status}">${report.status.replace('_', ' ')}</span></td>
                    <td>${new Date(report.created_at).toLocaleString()}</td>
                `;
                tbody.appendChild(row);
            });
        }
    } catch (error) {
        console.error('Error loading reports:', error);
    }
}

// Submit new report
document.getElementById('reportForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const location = document.getElementById('location').value;
    const severity = document.getElementById('severity').value;
    const outageType = document.getElementById('outageType').value;
    const description = document.getElementById('description').value;

    try {
        const data = await apiCall('/reports', {
            method: 'POST',
            body: JSON.stringify({
                location,
                severity,
                outage_type: outageType,
                description
            })
        });

        if (data && data.success) {
            alert('Report submitted successfully!');
            document.getElementById('reportForm').reset();
            loadDashboard();
            loadMyReports();
        } else {
            alert(data ? data.message : 'Failed to submit report');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        alert('Failed to submit report. Please try again.');
    }
});

// Initial load
loadDashboard();
loadMyReports();
