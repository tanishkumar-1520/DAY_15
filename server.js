const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");


const app = express();
app.use(express.static("public"));
const PORT = 3000;

// =========================
// MongoDB Atlas Connection
// =========================
// Replace USERNAME, PASSWORD and CLUSTER with your own values

mongoose.connect(
    "mongodb+srv://USERNAME:PASSWORD@cluster0.fgcgb6v.mongodb.net/NotesDB?retryWrites=true&w=majority&appName=Cluster0"
)
    .then(() => {
        console.log("✅ MongoDB Atlas Connected Successfully");
    })
    .catch((err) => {
        console.log("❌ Connection Error:", err);
    });

// =========================
// Middleware
// =========================

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

// =========================
// Patient Schema
// =========================

const patientSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true
    },

    disease: {
        type: String,
        required: true,
        trim: true
    },

    date: {
        type: Date,
        default: Date.now
    }

});

const Patient = mongoose.model("Patient", patientSchema);

// =========================
// Home Route
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

// =========================
// Get All Patients
// =========================

app.get("/Book", async (req, res) => {

    try {

        const patients = await Patient.find().sort({ date: -1 });

        res.status(200).json(patients);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching patients",
            error: error.message
        });

    }

});

// =========================
// Get Single Patient
// =========================

app.get("/Book/:id", async (req, res) => {

    try {

        const patient = await Patient.findById(req.params.id);

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        res.json(patient);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

// =========================
// Add Patient
// =========================

app.post("/books", async (req, res) => {

    try {

        const { name, age, disease } = req.body;

        if (!name || !age || !disease) {

            return res.status(400).json({
                message: "All fields are required"
            });

        }

        const patient = new Patient({

            name,
            age,
            disease

        });

        await patient.save();

        res.status(201).json({

            message: "Patient Added Successfully",

            patient

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// =========================
// Update Patient
// =========================

app.put("/books/:id", async (req, res) => {

    try {

        const { name, age, disease } = req.body;

        const patient = await Patient.findByIdAndUpdate(

            req.params.id,

            {
                name,
                age,
                disease
            },

            {
                new: true
            }

        );

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        res.json({

            message: "Patient Updated Successfully",

            patient

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// =========================
// Delete Patient
// =========================

app.delete("/books/:id", async (req, res) => {

    try {

        const patient = await Patient.findByIdAndDelete(req.params.id);

        if (!patient) {

            return res.status(404).json({
                message: "Patient not found"
            });

        }

        res.json({

            message: "Patient Deleted Successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});

// =========================
// Server
// =========================

app.listen(PORT, () => {

    console.log(`🚀 Server running on http://localhost:${PORT}`);

});
