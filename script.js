alert('script file loaded');
// --- STATE MANAGEMENT ---
let students = JSON.parse(localStorage.getItem('studentData')) || [];
let myChart = null;

// --- AUTHENTICATION LOGIC ---
const loginForm = document.getElementById('login-form');
const logoutBtn = document.getElementById('logout-btn');
const loginSection = document.getElementById('login-section');
const dashboardSection = document.getElementById('dashboard-section');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('login function triggered');
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;

    // Hardcoded check
    if (user === 'admin' && pass === 'admin123') {
        showDashboard();
    } else {
        alert('Invalid credentials! Try admin / admin123');
    }
});

logoutBtn.addEventListener('click', () => {
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
});

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    renderApp();
}

// --- DATA PROCESSING ---
const studentForm = document.getElementById('student-form');

studentForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('student-name').value;
    const marks = {
        math: parseFloat(document.getElementById('math').value),
        science: parseFloat(document.getElementById('science').value),
        english: parseFloat(document.getElementById('english').value),
        history: parseFloat(document.getElementById('history').value),
        geography: parseFloat(document.getElementById('geography').value),
    };

    const total = Object.values(marks).reduce((a, b) => a + b, 0);
    const average = total / 5;

    const newStudent = {
        id: Date.now(),
        name,
        marks,
        total,
        average
    };

    students.push(newStudent);
    saveAndRefresh();
    studentForm.reset();
});

function deleteStudent(id) {
    students = students.filter(s => s.id !== id);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('studentData', JSON.stringify(students));
    renderApp();
}

// --- RENDERING & ANALYSIS ---
function renderApp() {
    const reportBody = document.getElementById('report-body');
    const classAvgDisplay = document.getElementById('class-avg-display');
    const topPerformerDisplay = document.getElementById('top-performer-display');
    const countDisplay = document.getElementById('student-count-display');

    // 1. Ranking Logic
    students.sort((a, b) => b.total - a.total);

    // 2. Clear Table
    reportBody.innerHTML = '';

    // 3. Populate Table & Calculate Stats
    let classTotalAvg = 0;

    students.forEach((s, index) => {
        classTotalAvg += s.average;
        const row = document.createElement('tr');
        row.className = `border-b hover:bg-gray-50 ${index === 0 ? 'student-rank-1' : ''}`;
        row.innerHTML = `
        function updateTable(students) {
    const tableBody = document.querySelector('#results-table tbody');
    tableBody.innerHTML = '';

    students.forEach((s, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${s.name}</td>
            <td>${s.marks.math}</td>
            <td>${s.marks.science}</td>
            <td>${s.marks.english}</td>
            <td>${s.marks.history}</td>
            <td>${s.marks.geography}</td>
            <td>${s.total}</td>
            <td>${s.average}%</td>
            <td>
                <button class="print-btn" onclick="printStudentReport(${index})">Print Report</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

            <td class="p-4 font-bold text-blue-600">#${index + 1}</td>
            <td class="p-4 font-medium">${s.name}</td>
            <td class="p-4">${s.total} / 500</td>
            <td class="p-4">${s.average.toFixed(1)}%</td>
            <td class="p-4">
                <button onclick="deleteStudent(${s.id})" class="text-red-500 hover:underline">Delete</button>
            </td>
        `;
        reportBody.appendChild(row);
    });

    // 4. Update Stats Cards
    const studentCount = students.length;
    const overallAvg = studentCount > 0 ? (classTotalAvg / studentCount).toFixed(1) : 0;
    
    countDisplay.innerText = studentCount;
    classAvgDisplay.innerText = `${overallAvg}%`;
    topPerformerDisplay.innerText = studentCount > 0 ? students[0].name : 'N/A';

    updateChart();
}

// --- CHARTING ---
function updateChart() {
    const ctx = document.getElementById('performanceChart').getContext('2d');
    
    // Destroy existing chart to prevent memory leaks/glitches
    if (myChart) myChart.destroy();

    const names = students.map(s => s.name);
    const averages = students.map(s => s.average);

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: names,
            datasets: [{
                label: 'Student Average (%)',
                data: averages,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true, max: 100 }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

