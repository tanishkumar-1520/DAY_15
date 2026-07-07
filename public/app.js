document.addEventListener("DOMContentLoaded", () => {

    fetchPatients();

    const form = document.getElementById("patientForm");

    form.addEventListener("submit", addPatient);

});

// ==========================
// Add Patient
// ==========================

async function addPatient(e) {

    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const disease = document.getElementById("disease").value.trim();

    // Minor modification: enhanced confirmation
    if (!name || !age || !disease) {

        alert("⚠️ Please fill all fields.");

        return;

    }

    try {

        const response = await fetch("/books", { // Corrected: Match with Server /books route

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                age,
                disease

            })

        });

        const result = await response.json();

        if (response.ok) {

            alert("✅ Patient Registered Successfully!");

            document.getElementById("patientForm").reset();

            fetchPatients();

        } else {

            alert(`❌ Error: ${result.message}`);

        }

    } catch (error) {

        console.log(error);

        alert("❌ Server Error, please try again later.");

    }

}

// ==========================
// Fetch Patients
// ==========================

async function fetchPatients() {

    try {

        const response = await fetch("/Book"); // Corrected: Match with Server /Book route

        const patients = await response.json();

        const tbody = document.getElementById("patientTableBody");

        tbody.innerHTML = "";

        if (patients.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6" style="text-align:center;padding:30px;color:#64748b;">
                        <i class="fa-solid fa-folder-open" style="font-size:30px;margin-bottom:10px;display:block;"></i>
                        No Patient Records Found
                    </td>

                </tr>

            `;

            return;

        }

        patients.forEach(patient => {

            const row = document.createElement("tr");

            // Format date slightly better
            const regDate = patient.date ? new Date(patient.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }) : "N/A";

            row.innerHTML = `

                <td>${patient._id.substring(0, 6)}...</td> <!-- Display truncated ID for cleaner look -->

                <td>${patient.name}</td>

                <td>${patient.age}</td>

                <td>${patient.disease}</td>

                <td>${regDate}</td>

                <td>

                    <button class="btn-delete"

                    onclick="deletePatient('${patient._id}', '${patient.name}')"> <!-- Minor mod: Pass name -->

                    Delete

                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });

    } catch (error) {
        console.error("Fetch Patients Error:", error);
    }

}

// ==========================
// Delete Patient
// ==========================

// Minor mod: Added patientName parameter
async function deletePatient(id, patientName) {

    const confirmDelete = confirm(`Are you sure you want to delete patient "${patientName}"?`);

    if (!confirmDelete) return;

    try {

        const response = await fetch(`/books/${id}`, { // Match Server /books/:id route

            method: "DELETE"

        });

        const result = await response.json();

        if (response.ok) {
            alert(`✅ Patient "${patientName}" deleted.`);
            fetchPatients();
        } else {
            alert(`❌ Error: ${result.message}`);
        }

    } catch (error) {

        console.error("Delete Error:", error);
        alert("❌ Server Error, deletion failed.");

    }

}

// Nav links scroll and toggle functionality
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Active class switch karne ke liye
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Smooth scroll karne ke liye
        if (link.textContent.includes('Registration')) {
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } else if (link.textContent.includes('Records')) {
            document.querySelector('.table-section').scrollIntoView({ behavior: 'smooth' });
        }
    });
});