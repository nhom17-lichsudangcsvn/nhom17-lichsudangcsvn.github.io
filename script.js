document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const studentIdInput = document.getElementById('studentIdInput');
    const studentInfoDiv = document.getElementById('studentInfo');

    let studentData = [];
    let headers = [];
    let dataRows = [];

    // Fetch and parse the CSV data
    fetch('ThongTinSinhVien.csv')
        .then(response => response.text())
        .then(csvText => {
            const rows = csvText.trim().split('\n');
            // Find the header row
            const headerRowIndex = rows.findIndex(row => row.startsWith('Số thứ tự,Mã SV,Họ lót,Tên'));

            if (headerRowIndex === -1) {
                studentInfoDiv.innerHTML = `<div class="alert alert-danger">Không tìm thấy dòng tiêu đề trong file CSV.</div>`;
                return;
            }

            headers = rows[headerRowIndex].split(',');
            dataRows = rows.slice(headerRowIndex + 1);

            studentData = dataRows.map(row => {
                const cleanedRow = row.trim();
                const values = cleanedRow.split(',');
                const student = {};
                headers.forEach((header, index) => {
                    student[header.trim()] = values[index] ? values[index].trim() : '';
                });
                return student;
            }).filter(s => s['Mã SV']); // Filter out empty rows
        })
        .catch(error => {
            console.error('Error fetching or parsing CSV:', error);
            studentInfoDiv.innerHTML = `<div class="alert alert-danger">Không thể tải dữ liệu sinh viên.</div>`;
        });

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const studentId = studentIdInput.value.trim();

        if (!studentId) {
            studentInfoDiv.style.display = 'none';
            studentInfoDiv.innerHTML = '';
            return;
        }

        const student = studentData.find(s => s['Mã SV'] === studentId);

        studentInfoDiv.style.display = 'block'; // Show the container
        if (student) {
            let html = '<div class="card"><div class="card-body">';
            html += `<h5 class="card-title">${student['Họ lót']} ${student['Tên']}</h5>`;
            headers.forEach(header => {
                 const trimmedHeader = header.trim();
                 if(trimmedHeader !== 'Họ lót' && trimmedHeader !== 'Tên') { // Avoid duplicating name
                    html += `<p class="card-text mb-1"><strong>${trimmedHeader}:</strong> ${student[trimmedHeader]}</p>`;
                 }
            });
            html += '</div></div>';
            studentInfoDiv.innerHTML = html;
        } else {
            studentInfoDiv.innerHTML = `<div class="alert alert-warning">Không tìm thấy sinh viên với mã số này.</div>`;
        }
    });
});