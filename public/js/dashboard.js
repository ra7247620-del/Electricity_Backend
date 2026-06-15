window.addEventListener("DOMContentLoaded", function () {

    if (!requireAuth()) {
        return;
    }

    const user = getUser();
    document.getElementById('username').textContent = user.username;

    // -----------------------------
    // INIT MAP
    // -----------------------------
    const map = L.map('map').setView([30.0444, 31.2357], 10);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // -----------------------------
    // SELECT LOCATION ON MAP
    // -----------------------------
    let selectedLat = null;
    let selectedLng = null;

    map.on('click', function (e) {

        selectedLat = e.latlng.lat;
        selectedLng = e.latlng.lng;

        if (window.tempMarker) {
            map.removeLayer(window.tempMarker);
        }

        window.tempMarker = L.marker([selectedLat, selectedLng])
            .addTo(map)
            .bindPopup("Selected Location")
            .openPopup();

        console.log("Selected:", selectedLat, selectedLng);
    });

    // -----------------------------
    // COLORS HELPERS
    // -----------------------------
    function getStatusColor(status) {
        if (status === "pending") return "orange";
        if (status === "in_progress") return "blue";
        if (status === "resolved") return "green";
        return "gray";
    }

    function getSeverityColor(severity) {
        if (severity === "low") return "green";
        if (severity === "medium") return "orange";
        if (severity === "high") return "red";
        return "gray";
    }

    // -----------------------------
    // DASHBOARD STATS
    // -----------------------------
    async function loadDashboard() {
        try {
            const data = await apiCall('/reports/dashboard-stats');

            if (data && data.success) {
                document.getElementById('totalReports').textContent =
                    data.data.stats.total || 0;

                document.getElementById('pendingReports').textContent =
                    data.data.stats.pending || 0;

                document.getElementById('inProgressReports').textContent =
                    data.data.stats.in_progress || 0;

                document.getElementById('resolvedReports').textContent =
                    data.data.stats.resolved || 0;
            }

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    // -----------------------------
    // LOAD REPORTS (TABLE + MAP)
    // -----------------------------
    async function loadMyReports() {
        try {
            const res = await apiCall('/reports/my-reports');

            if (!res || !res.success) return;

            const tbody = document.getElementById('reportsTable');
            tbody.innerHTML = '';

            res.data.forEach(report => {
                

                // ---------------- TABLE ----------------
                const row = document.createElement('tr');

                row.innerHTML = `
                    <td>${report.id}</td>
                    <td>${report.location}</td>

                    <td>
                        <span class="badge" style="background:${getSeverityColor(report.severity)}; color:white;">
                            ${report.severity}
                        </span>
                    </td>

                    <td>${report.outage_type}</td>

                    <td>
                        <span class="badge" style="background:${getStatusColor(report.status)}; color:white;">
                            ${report.status}
                        </span>
                    </td>

                    <td>${new Date(report.created_at).toLocaleString()}</td>
                `;

                tbody.appendChild(row);

                // ---------------- MAP MARKERS ----------------
                if (report.lat && report.lng) {

                    const color = getStatusColor(report.status);

                    const marker = L.circleMarker([report.lat, report.lng], {
                        radius: 8,
                        color: color,
                        fillColor: color,
                        fillOpacity: 0.8
                    }).addTo(map);

                    marker.bindPopup(`
                        <b>${report.location}</b><br>
                        Status: ${report.status}<br>
                        Severity: ${report.severity}
                    `);
                }
            });

        } catch (error) {
            console.error("Error loading reports:", error);
        }
    }

    // -----------------------------
    // SUBMIT REPORT
    // -----------------------------
    document.getElementById('reportForm').addEventListener('submit', async function (e) {

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
                    description,
                    lat: selectedLat,
                    lng: selectedLng
                })
            });

            if (data && data.success) {

                alert("Report submitted successfully!");

                document.getElementById('reportForm').reset();

                selectedLat = null;
                selectedLng = null;

                loadDashboard();
                loadMyReports();
            }

        } catch (error) {
            console.error("Submit error:", error);
            alert("Failed to submit report");
        }
    });

    // -----------------------------
    // INITIAL LOAD
    // -----------------------------
    loadDashboard();
    loadMyReports();

});