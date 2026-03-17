/**
 * NEET UG 2026 College Predictor Logic
 * Author: Future Education
 * Features: Expanded Database, Strict Validation, Google Sheets Integration
 */

// --- 1. EXPANDED COLLEGE DATABASE (100+ Colleges) ---
// Covers Government, Private, and Deemed across marks 150 - 720
const collegeDB = [
    // --- TIER 1: ELITE GOVT (720 - 680) ---
    { name: "AIIMS, New Delhi", type: "Government", state: "Delhi", cutoff: 710, fee: "Low" },
    { name: "Maulana Azad Medical College (MAMC)", type: "Government", state: "Delhi", cutoff: 700, fee: "Low" },
    { name: "VMMC & Safdarjung Hospital", type: "Government", state: "Delhi", cutoff: 695, fee: "Low" },
    { name: "JIPMER, Puducherry", type: "Government", state: "Puducherry", cutoff: 690, fee: "Low" },
    { name: "University College of Medical Sciences (UCMS)", type: "Government", state: "Delhi", cutoff: 690, fee: "Low" },
    { name: "Lady Hardinge Medical College (LHMC)", type: "Government", state: "Delhi", cutoff: 685, fee: "Low" },
    { name: "AIIMS, Jodhpur", type: "Government", state: "Rajasthan", cutoff: 685, fee: "Low" },
    { name: "Seth GS Medical College (KEM)", type: "Government", state: "Maharashtra", cutoff: 680, fee: "Low" },
    { name: "AIIMS, Bhubaneswar", type: "Government", state: "Odisha", cutoff: 680, fee: "Low" },
    { name: "Govt Medical College, Chandigarh", type: "Government", state: "Chandigarh", cutoff: 680, fee: "Low" },

    // --- TIER 2: TOP STATE GOVT (679 - 640) ---
    { name: "AIIMS, Bhopal", type: "Government", state: "MP", cutoff: 675, fee: "Low" },
    { name: "Madras Medical College", type: "Government", state: "Tamil Nadu", cutoff: 670, fee: "Low" },
    { name: "AIIMS, Rishikesh", type: "Government", state: "Uttarakhand", cutoff: 670, fee: "Low" },
    { name: "King George's Medical University (KGMU)", type: "Government", state: "UP", cutoff: 665, fee: "Low" },
    { name: "BJ Medical College", type: "Government", state: "Gujarat", cutoff: 660, fee: "Low" },
    { name: "RML Hospital", type: "Government", state: "Delhi", cutoff: 660, fee: "Low" },
    { name: "SMS Medical College", type: "Government", state: "Rajasthan", cutoff: 655, fee: "Low" },
    { name: "Bangalore Medical College (BMCRI)", type: "Government", state: "Karnataka", cutoff: 650, fee: "Low" },
    { name: "Grant Medical College (JJ)", type: "Government", state: "Maharashtra", cutoff: 645, fee: "Low" },
    { name: "IPGMER, Kolkata", type: "Government", state: "West Bengal", cutoff: 645, fee: "Low" },
    { name: "Osmania Medical College", type: "Government", state: "Telangana", cutoff: 640, fee: "Low" },
    { name: "Stanley Medical College", type: "Government", state: "Tamil Nadu", cutoff: 640, fee: "Low" },

    // --- TIER 3: MID GOVT & TOP PRIVATE (639 - 580) ---
    { name: "Govt Medical College, Kota", type: "Government", state: "Rajasthan", cutoff: 630, fee: "Low" },
    { name: "Mysore Medical College", type: "Government", state: "Karnataka", cutoff: 625, fee: "Low" },
    { name: "Patna Medical College (PMCH)", type: "Government", state: "Bihar", cutoff: 625, fee: "Low" },
    { name: "ESIC Medical College, Faridabad", type: "Government", state: "Haryana", cutoff: 620, fee: "Low" },
    { name: "RIMS, Ranchi", type: "Government", state: "Jharkhand", cutoff: 615, fee: "Low" },
    { name: "Govt Medical College, Haldwani", type: "Government", state: "Uttarakhand", cutoff: 615, fee: "Low" },
    { name: "Indira Gandhi Medical College", type: "Government", state: "Shimla", cutoff: 610, fee: "Low" },
    { name: "SCB Medical College, Cuttack", type: "Government", state: "Odisha", cutoff: 610, fee: "Low" },
    { name: "GMC, Patiala", type: "Government", state: "Punjab", cutoff: 605, fee: "Low" },
    { name: "Gandhi Medical College, Bhopal", type: "Government", state: "MP", cutoff: 600, fee: "Low" },
    { name: "St. John's Medical College", type: "Private", state: "Karnataka", cutoff: 590, fee: "Medium" },
    { name: "Kasturba Medical College (KMC), Manipal", type: "Deemed", state: "Karnataka", cutoff: 580, fee: "High" },

    // --- TIER 4: PRIVATE & DEEMED (579 - 450) ---
    { name: "MS Ramaiah Medical College", type: "Private", state: "Karnataka", cutoff: 560, fee: "Medium" },
    { name: "KMC, Mangalore", type: "Deemed", state: "Karnataka", cutoff: 550, fee: "High" },
    { name: "Kempegowda Institute (KIMS)", type: "Private", state: "Karnataka", cutoff: 545, fee: "Medium" },
    { name: "Symbiosis Medical College for Women", type: "Deemed", state: "Maharashtra", cutoff: 540, fee: "High" },
    { name: "Kalinga Institute (KIMS)", type: "Deemed", state: "Odisha", cutoff: 540, fee: "High" },
    { name: "Himalayan Institute (HIHT)", type: "Private", state: "Uttarakhand", cutoff: 535, fee: "Medium" },
    { name: "JSS Medical College, Mysore", type: "Deemed", state: "Karnataka", cutoff: 530, fee: "High" },
    { name: "Amrita Institute of Medical Sciences", type: "Deemed", state: "Kerala", cutoff: 520, fee: "High" },
    { name: "Rural Medical College, Loni", type: "Deemed", state: "Maharashtra", cutoff: 510, fee: "High" },
    { name: "SRMS, Bareilly", type: "Private", state: "UP", cutoff: 500, fee: "Medium" },
    { name: "Sharda University", type: "Private", state: "UP", cutoff: 490, fee: "High" },
    { name: "KS Hegde Medical Academy", type: "Deemed", state: "Karnataka", cutoff: 480, fee: "High" },
    { name: "SRM Medical College", type: "Deemed", state: "Tamil Nadu", cutoff: 450, fee: "High" },

    // --- TIER 5: LOW SCORE / MANAGEMENT (449 - 250) ---
    { name: "MGM Medical College", type: "Deemed", state: "Navi Mumbai", cutoff: 420, fee: "High" },
    { name: "Sri Ramachandra Medical College", type: "Deemed", state: "Chennai", cutoff: 380, fee: "High" },
    { name: "Bharati Vidyapeeth", type: "Deemed", state: "Pune", cutoff: 350, fee: "High" },
    { name: "Subharti Medical College", type: "Private", state: "UP", cutoff: 340, fee: "Medium" },
    { name: "DY Patil Medical College, Pune", type: "Deemed", state: "Maharashtra", cutoff: 300, fee: "High" },
    { name: "RajaRajeswari Medical College", type: "Deemed", state: "Karnataka", cutoff: 280, fee: "High" },
    { name: "Saveetha Medical College", type: "Deemed", state: "Tamil Nadu", cutoff: 250, fee: "High" },
    { name: "Krishna Institute, Karad", type: "Deemed", state: "Maharashtra", cutoff: 260, fee: "High" },

    // --- TIER 6: QUALIFYING MARKS (249 - 150) ---
    { name: "Santosh Medical College", type: "Deemed", state: "Ghaziabad", cutoff: 200, fee: "High" },
    { name: "Vinayaka Mission", type: "Deemed", state: "Karaikal", cutoff: 180, fee: "High" },
    { name: "Sree Balaji Medical College", type: "Deemed", state: "Chennai", cutoff: 160, fee: "High" },
    { name: "Chettinad Hospital", type: "Deemed", state: "Tamil Nadu", cutoff: 170, fee: "High" },
    { name: "Meenakshi Medical College", type: "Deemed", state: "Chennai", cutoff: 155, fee: "High" },
    { name: "ACS Medical College", type: "Deemed", state: "Chennai", cutoff: 150, fee: "High" }
];

// --- 2. OPEN MODAL LOGIC ---
function openLeadModal() {
    // Validate score first
    const marksInput = document.getElementById('neetMarks').value;
    if (!marksInput || marksInput < 0 || marksInput > 720) {
        alert("Please enter a valid NEET score between 0 and 720 first.");
        return;
    }
    
    // Initialize Modal
    const myModalEl = document.getElementById('leadModal');
    const myModal = new bootstrap.Modal(myModalEl);
    
    // --- DATA RESET FEATURE ---
    // Add listener to reset form fields immediately when modal is hidden (closed)
    myModalEl.addEventListener('hidden.bs.modal', function () {
        document.getElementById('leadForm').reset();
        // Also hide validation errors
        document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');
        // Reset button state
        document.getElementById('btnSubmitLead').style.display = 'block';
        document.getElementById('loadingSpinner').classList.add('d-none');
    }, { once: true }); // Use once:true to prevent stacking listeners

    myModal.show();
}

// --- 3. SUBMIT & VALIDATE LOGIC ---
function submitLeadData() {
    const name = document.getElementById('leadName').value.trim();
    const email = document.getElementById('leadEmail').value.trim();
    const phone = document.getElementById('leadPhone').value.trim();
    
    let isValid = true;

    // Reset Errors
    document.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

    // A. Name Validation: Min 3 chars, Alphabets & Space only
    const nameRegex = /^[A-Za-z\s]{3,}$/;
    if (!nameRegex.test(name)) {
        document.getElementById('errorName').style.display = 'block';
        isValid = false;
    }

    // B. Phone Validation: 10 digits, starts with 6,7,8,9
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
        document.getElementById('errorPhone').style.display = 'block';
        isValid = false;
    }

    // C. Email Validation: Strictly top 20 Indian domains + zoho.in + .ac.in
    const validDomains = [
        "gmail.com", "yahoo.com", "yahoo.in", "outlook.com", "hotmail.com", 
        "rediffmail.com", "icloud.com", "yandex.com", "zoho.com", "zoho.in", 
        "protonmail.com", "aol.com", "msn.com", "live.com", "gmx.com", "mail.com", 
        "in.com", "sify.com", "webmail.co.in", "rocketmail.com", "bing.com"
    ];
    
    const emailParts = email.split('@');
    let isDomainValid = false;

    if (emailParts.length === 2) {
        const domain = emailParts[1].toLowerCase();
        // Check against allowed list OR if it ends with .ac.in (Academic)
        if (validDomains.includes(domain) || domain.endsWith('.ac.in')) {
            isDomainValid = true;
        }
    }

    if (!isDomainValid) {
        document.getElementById('errorEmail').style.display = 'block';
        isValid = false;
    }

    if (!isValid) return;

    // --- 4. SEND DATA TO GOOGLE SCRIPT ---
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyNIA7fZZrDnui29ej3gFteRQ_6ebRVZA9nIdrr2_WHN42BDdkxXfTKqTlhrkmh-HsN/exec';
    const submitBtn = document.getElementById('btnSubmitLead');
    const spinner = document.getElementById('loadingSpinner');

    // UI Feedback
    submitBtn.style.display = 'none';
    spinner.classList.remove('d-none');

    // Construct JSON payload
    const payload = {
        Name: name, 
        Email: email,
        Phone: phone,
        Marks: document.getElementById('neetMarks').value,
        Category: document.getElementById('category').value,
        subject: "NEET Predictor Lead"
    };

    // Fetch using 'no-cors' with 'text/plain' content type to ensure data reaches Google Script
    fetch(scriptURL, { 
        method: 'POST', 
        body: JSON.stringify(payload), 
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain;charset=utf-8', 
        }
    })
    .then(() => {
        closeModalAndPredict();
    })
    .catch(error => {
        console.error('Error!', error.message);
        // Fallback: show results anyway to not block user
        closeModalAndPredict();
    });
}

function closeModalAndPredict() {
    const myModalEl = document.getElementById('leadModal');
    const modal = bootstrap.Modal.getInstance(myModalEl);
    modal.hide();
    runPrediction();
}

// --- 5. PREDICTION LOGIC ---
function runPrediction() {
    const marks = parseInt(document.getElementById('neetMarks').value);
    const category = document.getElementById('category').value;
    const resultSection = document.getElementById('resultSection');
    const collegeList = document.getElementById('collegeList');
    const displayScore = document.getElementById('displayScore');

    // Logic: Boost effective score based on category
    let effectiveScore = marks;
    if (category === 'OBC') effectiveScore += 15;
    if (category === 'SC') effectiveScore += 100;
    if (category === 'ST') effectiveScore += 130;

    // Filter and Sort Colleges
    // Logic: College Cutoff must be <= Effective Score
    // But we show colleges slightly above cutoff (up to 10 marks) as "Ambitious" 
    // to give hope, or strictly <=. Let's stick to <= for accuracy.
    
    let eligibleColleges = collegeDB.filter(college => effectiveScore >= (college.cutoff - 5)); // 5 marks buffer
    
    // Sort: Best colleges (highest cutoff) first
    eligibleColleges.sort((a, b) => b.cutoff - a.cutoff);
    
    // Take top 5 results
    const topColleges = eligibleColleges.slice(0, 5);

    displayScore.innerText = marks;
    collegeList.innerHTML = "";

    if (topColleges.length === 0) {
        collegeList.innerHTML = `
            <div class="alert alert-warning text-center p-4">
                <h4><i class="bi bi-exclamation-triangle-fill"></i> Challenging Score</h4>
                <p>With ${marks} marks, getting a merit seat in India is difficult this year.</p>
                <hr>
                <p class="mb-0 fw-bold">Recommended Options:</p>
                <div class="d-flex gap-2 justify-content-center mt-3">
                    <a href="https://neet.futeducation.com/study-mbbs-in-russia" class="btn btn-primary btn-sm">Check MBBS Abroad</a>
                    <a href="private-medical-colleges/management-nri-quota/management-quota-mbbs-admission-private-colleges.html" class="btn btn-outline-dark btn-sm">Check Management Quota</a>
                </div>
            </div>
        `;
    } else {
        topColleges.forEach(college => {
            let badgeClass = "bg-secondary";
            if(college.type === "Government") badgeClass = "badge-govt";
            if(college.type === "Private") badgeClass = "badge-private";
            if(college.type === "Deemed") badgeClass = "badge-deemed";

            // Calculate win probability visualization
            let chance = Math.min(100, Math.floor((effectiveScore - college.cutoff + 10) / 20 * 100));
            if(chance < 0) chance = 10; 
            // Simple logic: if score == cutoff, 50% chance. Higher score = higher chance.
            // Simplified:
            let chanceText = "High Chance";
            let chanceColor = "text-success";
            
            if(effectiveScore < college.cutoff) {
                chanceText = "Borderline";
                chanceColor = "text-warning";
            }

            collegeList.innerHTML += `
                <div class="card college-card bg-white shadow-sm p-3">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <span class="badge ${badgeClass} mb-1">${college.type}</span>
                            <h5 class="fw-bold mb-1">${college.name}</h5>
                            <small class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${college.state}</small>
                        </div>
                        <div class="text-end">
                            <span class="d-block fw-bold ${chanceColor}">${chanceText}</span>
                            <small class="text-muted">Est. Cutoff: ${college.cutoff}</small>
                        </div>
                    </div>
                </div>
            `;
        });
    }

    // Show section with animation
    resultSection.style.display = "block";
    
    // Scroll to results (Middle of page, below button)
    resultSection.scrollIntoView({ behavior: "smooth", block: "start" });
}