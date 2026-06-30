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

    if (!name || !age || !disease) {

        alert("Please fill all fields.");

        return;

    }

    try {

        const response = await fetch("/books", {

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

            alert("✅ Patient Registered Successfully");

            document.getElementById("patientForm").reset();

            fetchPatients();

        } else {

            alert(result.message);

        }

    } catch (error) {

        console.log(error);

        alert("Server Error");

    }

}

// ==========================
// Fetch Patients
// ==========================

async function fetchPatients() {

    try {

        const response = await fetch("/Book");

        const patients = await response.json();

        const tbody = document.getElementById("patientTableBody");

        tbody.innerHTML = "";

        if (patients.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td colspan="6" style="text-align:center;padding:20px;">

                        No Patient Records Found

                    </td>

                </tr>

            `;

            return;

        }

        patients.forEach(patient => {

            const row = document.createElement("tr");

            row.innerHTML = `

                <td>${patient._id}</td>

                <td>${patient.name}</td>

                <td>${patient.age}</td>

                <td>${patient.disease}</td>

                <td>${new Date(patient.date).toLocaleDateString()}</td>

                <td>

                    <button class="btn-delete"

                    onclick="deletePatient('${patient._id}')">

                    Delete

                    </button>

                </td>

            `;

            tbody.appendChild(row);

        });

    } catch (error) {

        console.log(error);

    }

}

// ==========================
// Delete Patient
// ==========================

async function deletePatient(id) {

    const confirmDelete = confirm("Are you sure you want to delete this patient?");

    if (!confirmDelete) return;

    try {

        const response = await fetch(`/books/${id}`, {

            method: "DELETE"

        });

        const result = await response.json();

        alert(result.message);

        fetchPatients();

    } catch (error) {

        console.log(error);

    }

}
