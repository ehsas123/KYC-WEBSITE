import { db } from './firebase-config.js';
import { doc, setDoc, getDocs, collection } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { auth } from './firebase-config.js';

// Saved list of complaints
let complaintsCache = [];

// ================= CHECK LOGIN & THEME STATUS ON START =================
document.addEventListener("DOMContentLoaded", () => {
    // Apply layout theme preference on launch
    if (localStorage.getItem("kycAdminThemeStyle") === "light-day-mode") {
        document.body.classList.add("light-mode-active");
        const toggleBtn = document.getElementById("theme-toggle-btn");
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fas fa-moon"></i> <span>Night / Dark Mode</span>`;
        }
    }

    // Firebase Auth state listener — single source of truth for login state
    onAuthStateChanged(auth, (user) => {
        if (user) {
            showMainDashboard(user);
        } else {
            document.getElementById("adminAuthGate").style.display = "flex";
            document.getElementById("adminMainSystem").style.display = "none";
        }
    });
});

// ================= PASSWORD EYE TOGGLE =================
window.togglePasswordView = function() {
    const pwInput = document.getElementById("authPassword");
    const eyeIcon = document.getElementById("pwEyeIcon");
    if (pwInput.type === "password") {
        pwInput.type = "text";
        eyeIcon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        pwInput.type = "password";
        eyeIcon.classList.replace("fa-eye-slash", "fa-eye");
    }
};

// ================= DYNAMIC THEME TOGGLE CONTROLLER =================
window.toggleInterfaceTheme = function() {
    const toggleBtn = document.getElementById("theme-toggle-btn");
    
    if (document.body.classList.contains("light-mode-active")) {
        document.body.classList.remove("light-mode-active");
        localStorage.setItem("kycAdminThemeStyle", "dark-space-mode");
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fas fa-sun"></i> <span>Day / Light Mode</span>`;
        }
        showToast("Switched to Night Mode");
    } else {
        document.body.classList.add("light-mode-active");
        localStorage.setItem("kycAdminThemeStyle", "light-day-mode");
        if (toggleBtn) {
            toggleBtn.innerHTML = `<i class="fas fa-moon"></i> <span>Night / Dark Mode</span>`;
        }
        showToast("Switched to Day Light Mode");
    }
};

// ================= FIREBASE AUTH LOGIN =================
window.handleAdminLogin = async function(event) {
    event.preventDefault();

    const emailInput    = document.getElementById("authUsername").value.trim();
    const passwordInput = document.getElementById("authPassword").value.trim();
    const errorDisplay  = document.getElementById("authError");
    const submitBtn     = document.getElementById("loginSubmitBtn");
    const btnText       = document.getElementById("loginBtnText");
    const btnLoader     = document.getElementById("loginBtnLoader");

    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display  = "none";
    btnLoader.style.display = "inline-flex";
    errorDisplay.innerText = "";

    try {
        await signInWithEmailAndPassword(auth, emailInput, passwordInput);
        // onAuthStateChanged will handle the rest automatically
        showToast("Login Successful! Opening Admin Panel...");
    } catch (error) {
        // Map Firebase error codes to friendly messages
        let friendlyMsg = "Invalid email or password. Please try again.";
        if (error.code === "auth/user-not-found")       friendlyMsg = "No account found with this email.";
        if (error.code === "auth/wrong-password")       friendlyMsg = "Incorrect password. Please try again.";
        if (error.code === "auth/invalid-email")        friendlyMsg = "Please enter a valid email address.";
        if (error.code === "auth/too-many-requests")    friendlyMsg = "Too many failed attempts. Please try later.";
        if (error.code === "auth/network-request-failed") friendlyMsg = "Network error. Check your connection.";

        errorDisplay.innerText = "⚠ " + friendlyMsg;
        errorDisplay.style.color = "#ef4444";
    } finally {
        // Restore button state
        submitBtn.disabled = false;
        btnText.style.display  = "inline-flex";
        btnLoader.style.display = "none";
    }
};

// ================= FIREBASE AUTH LOGOUT =================
window.handleAdminLogout = async function() {
    try {
        await signOut(auth);
        showToast("Logged out successfully.");
        // onAuthStateChanged will redirect to auth gate automatically
    } catch (error) {
        console.error("Logout error:", error);
    }
};

function showMainDashboard(user) {
    document.getElementById("adminAuthGate").style.display = "none";
    document.getElementById("adminMainSystem").style.display = "flex";

    // Show the logged-in admin's email in the sidebar chip
    const emailDisplay = document.getElementById("adminEmailDisplay");
    if (emailDisplay && user) {
        emailDisplay.innerText = user.email;
    }

    loadAllComplaints();
}

// ================= GENERATE UNIQUE ID =================
window.generateId = function() {
    const randomFourDigits = Math.floor(Math.random() * 9000 + 1000);
    document.getElementById("adminComplaintId").value = "KYC-W1-" + randomFourDigits;
};

// ================= TAB NAVIGATION ENGINE =================
window.switchView = function(viewName) {
    document.querySelectorAll('.admin-view').forEach(view => view.style.display = 'none');
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    
    const targetView    = document.getElementById(`view-${viewName}`);
    const targetNavLink = document.getElementById(`link-${viewName}`);
    
    if (targetView) targetView.style.display = 'block';
    if (targetNavLink) targetNavLink.classList.add('active');

    if (viewName === 'dashboard') {
        loadAllComplaints();
    }
};

// ================= LOAD DATA FROM FIREBASE =================
async function loadAllComplaints() {
    const monitorTable = document.getElementById("previewTableBody");
    if (!monitorTable) return;

    try {
        const querySnapshot = await getDocs(collection(db, "complaints"));
        complaintsCache = [];
        monitorTable.innerHTML = "";

        if (querySnapshot.empty) {
            monitorTable.innerHTML = `<tr><td colspan="5" class="placeholder">No complaints found in the database.</td></tr>`;
            updateNumbersDisplay();
            return;
        }

        querySnapshot.forEach((docSnap) => {
            const data = docSnap.data();
            const complaintObject = {
                id:      docSnap.id,
                status:  data.status ? data.status.toLowerCase() : 'received',
                location:data.location || 'Not Provided',
                issue:   data.issue    || 'General Issue',
                remarks: data.remarks  || 'No remarks added yet',
                date:    data.date     || new Date().toLocaleDateString('en-GB')
            };
            complaintsCache.push(complaintObject);
        });

        complaintsCache.forEach(item => {
            const tableRow = `
                <tr>
                    <td><strong class="complaint-id-label">${item.id}</strong></td>
                    <td><span class="badge ${item.status}">${item.status.toUpperCase()}</span></td>
                    <td>${item.location}</td>
                    <td>${item.issue}</td>
                    <td>
                        <button class="btn-action-modify" onclick="sendToEditForm('${item.id}', '${item.status}', \`${escapeText(item.location)}\`, \`${escapeText(item.issue)}\`, \`${escapeText(item.remarks)}\`)">
                            <i class="fas fa-edit"></i> Edit Status
                        </button>
                    </td>
                </tr>`;
            monitorTable.innerHTML += tableRow;
        });

        updateNumbersDisplay();
        renderActivityLogTable(complaintsCache);

    } catch (error) {
        console.error("Database loading error:", error);
        monitorTable.innerHTML = `<tr><td colspan="5" class="placeholder" style="color: var(--state-escalated);">Failed to connect to the database.</td></tr>`;
    }
}

window.sendToEditForm = function(id, status, loc, iss, rem) {
    switchView('modify');
    document.getElementById("adminComplaintId").value = id;
    document.getElementById("adminStatus").value      = status;
    document.getElementById("adminLocation").value    = loc;
    document.getElementById("adminIssue").value       = iss;
    document.getElementById("adminRemarks").value     = rem;
};

// ================= CREATE OR UPDATE MANUAL DATA =================
window.updateManualData = async function() {
    const complaintId   = document.getElementById("adminComplaintId").value.trim();
    const currentStatus = document.getElementById("adminStatus").value;
    const itemLocation  = document.getElementById("adminLocation").value;
    const itemIssue     = document.getElementById("adminIssue").value;
    const adminRemarks  = document.getElementById("adminRemarks").value.trim();
    const feedbackMessage = document.getElementById("updateMsg");

    if (!complaintId) {
        alert("Please enter or generate a Complaint ID first!");
        return;
    }

    const simpleDataObj = {
        status:   currentStatus,
        location: itemLocation || "Kishanganj Hub",
        issue:    itemIssue    || "General Civic Complaint",
        remarks:  adminRemarks || "Status updated by Admin.",
        date:     new Date().toLocaleDateString('en-GB')
    };

    try {
        feedbackMessage.style.color = "var(--accent-primary)";
        feedbackMessage.innerText   = "Saving data to your database...";

        await setDoc(doc(db, "complaints", complaintId), simpleDataObj, { merge: true });
        
        showToast(`Complaint ${complaintId} successfully saved!`);
        
        document.getElementById("adminComplaintId").value = "";
        document.getElementById("adminLocation").value    = "";
        document.getElementById("adminIssue").value       = "";
        document.getElementById("adminRemarks").value     = "";
        feedbackMessage.innerText = "";

        switchView('dashboard');

    } catch (error) {
        console.error("Database save error:", error);
        feedbackMessage.style.color = "var(--state-escalated)";
        feedbackMessage.innerText   = "Error saving data. Check your connection.";
    }
};

// ================= CALCULATE ACTUAL NUMBERS =================
function updateNumbersDisplay() {
    let totalCount    = complaintsCache.length;
    let activeCount   = 0;
    let resolvedCount = 0;

    complaintsCache.forEach(item => {
        if (item.status === 'resolved') {
            resolvedCount++;
        } else if (item.status !== 'rejected') {
            activeCount++;
        }
    });

    document.getElementById("statTotal").innerText    = totalCount;
    document.getElementById("statActive").innerText   = activeCount;
    document.getElementById("statResolved").innerText = resolvedCount;
}

// ================= RECENT ACTIVITY LOG DRAW =================
function renderActivityLogTable(dataList) {
    const logTableBody = document.getElementById("activityLogTableBody");
    if (!logTableBody) return;

    if (dataList.length === 0) {
        logTableBody.innerHTML = `<tr><td colspan="4" class="placeholder">No search matches found.</td></tr>`;
        return;
    }

    logTableBody.innerHTML = "";
    dataList.forEach(item => {
        const itemRow = `
            <tr>
                <td><small class="activity-date-text">${item.date}</small></td>
                <td><span class="activity-id-text">${item.id}</span></td>
                <td>Moved to status ➔ <span class="badge ${item.status}" style="font-size:0.68rem; padding:0.12rem 0.4rem;">${item.status}</span></td>
                <td><span style="color: var(--text-muted); font-size:0.85rem;">${item.remarks}</span></td>
            </tr>`;
        logTableBody.innerHTML += itemRow;
    });
}

// ================= SEARCH AND FILTER LOGIC =================
window.filterActivityLog = function() {
    const searchText      = document.getElementById("logSearch").value.toLowerCase();
    const dropdownFilter  = document.getElementById("logFilterStatus").value;

    const finalFilteredList = complaintsCache.filter(item => {
        const matchesSearch = item.id.toLowerCase().includes(searchText) || 
                              item.location.toLowerCase().includes(searchText) || 
                              item.issue.toLowerCase().includes(searchText) ||
                              item.remarks.toLowerCase().includes(searchText);
        const matchesDropdownStatus = (dropdownFilter === 'all') || (item.status === dropdownFilter);
        return matchesSearch && matchesDropdownStatus;
    });

    renderActivityLogTable(finalFilteredList);
};

window.showToast = function(message) {
    const toastBox = document.getElementById("toast");
    if (!toastBox) return;
    toastBox.innerText = message;
    toastBox.style.right = "2.5rem";
    setTimeout(() => { toastBox.style.right = "-450px"; }, 4000);
};

function escapeText(str) {
    return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/'/g, "\\'").replace(/"/g, '\\"');
}