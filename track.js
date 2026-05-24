import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

window.trackComplaint = async function() {
  const id = document.getElementById("complaintId").value.trim();
  const errorMsg = document.getElementById("errorMsg");
  const resultBox = document.getElementById("resultBox");

  if (!id) {
    alert("Kripya Complaint ID darj karein.");
    return;
  }

  try {
    const docRef = doc(db, "complaints", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      if (errorMsg) errorMsg.style.display = "none";
      if (resultBox) resultBox.style.display = "block";

      // HTML UI fill karna
      if (document.getElementById("rId")) document.getElementById("rId").innerText = id;
      if (document.getElementById("rStatus")) document.getElementById("rStatus").innerText = data.status.toUpperCase();
      if (document.getElementById("rLocation")) document.getElementById("rLocation").innerText = data.location;
      if (document.getElementById("rIssue")) document.getElementById("rIssue").innerText = data.issue;
      if (document.getElementById("rDate")) document.getElementById("rDate").innerText = data.date;
      if (document.getElementById("rRemarks")) document.getElementById("rRemarks").innerText = data.remarks || "No remarks";

      // Timeline update karna
      updateTimeline(data.status.toLowerCase());
    } else {
      if (resultBox) resultBox.style.display = "none";
      if (errorMsg) {
        errorMsg.style.display = "block";
        errorMsg.innerText = "Invalid Complaint ID. Please check again.";
      }
    }
  } catch (error) {
    console.error("Tracking Error:", error);
    alert("Database connection error.");
  }
};

function updateTimeline(status) {
  const steps = ["received", "verification", "verified", "escalated", "resolved"];
  
  steps.forEach((_, i) => {
    const stepEl = document.getElementById("step" + (i + 1));
    if (stepEl) stepEl.classList.remove("active", "rejected");
  });

  if (status === "rejected") {
    const step2 = document.getElementById("step2");
    if (step2) step2.classList.add("rejected");
    return;
  }

  const statusIndex = steps.indexOf(status);
  steps.forEach((_, index) => {
    const el = document.getElementById("step" + (index + 1));
    if (el && index <= statusIndex) {
      el.classList.add("active");
    }
  });
}