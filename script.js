/* ============================================================
   KISHANGANJ YOUTH CLUB — MAIN JAVASCRIPT
   Features: Navbar, Counters, Dynamic Cards, Forms,
             Scroll Animations, Firebase-ready placeholders
   ============================================================ */

'use strict';

/* ── Firebase Placeholder Functions ────────────────────────── */
/* Replace these with real Firebase calls when backend is ready */

async function loginUser(email, password) {
  // TODO: Replace with Firebase Auth
  // import { signInWithEmailAndPassword } from 'firebase/auth';
  console.log('[Firebase] loginUser called:', email);
  return new Promise(resolve => setTimeout(() => resolve({ uid: 'demo-uid', email }), 800));
}

async function registerUser(name, email, password, role) {
  // TODO: Replace with Firebase Auth + Firestore
  console.log('[Firebase] registerUser called:', name, email, role);
  return new Promise(resolve => setTimeout(() => resolve({ uid: 'new-uid', name, email }), 800));
}

async function assignTask(volunteerId, taskData) {
  // TODO: Replace with Firestore setDoc
  // import { doc, setDoc } from 'firebase/firestore';
  console.log('[Firebase] assignTask called:', volunteerId, taskData);
  return new Promise(resolve => setTimeout(() => resolve({ success: true, taskId: 'T-' + Date.now() }), 600));
}

async function fetchTasks(volunteerId) {
  // TODO: Replace with Firestore getDocs with query
  console.log('[Firebase] fetchTasks called for:', volunteerId);
  return new Promise(resolve => setTimeout(() => resolve([
    { id: 'T-001', area: 'Ward 3 – Main Market', status: 'active', due: '2025-08-10' },
    { id: 'T-002', area: 'Ward 7 – Drain Area', status: 'pending', due: '2025-08-15' },
  ]), 500));
}

async function submitComplaint(complaintData) {
  // TODO: Replace with Firestore addDoc
  // import { collection, addDoc } from 'firebase/firestore';
  console.log('[Firebase] submitComplaint called:', complaintData);
  return new Promise(resolve => setTimeout(() => resolve({
    success: true,
    complaintId: 'KYC-' + Math.floor(Math.random() * 9000 + 1000)
  }), 900));
}

async function fetchComplaints(wardId) {
  // TODO: Replace with Firestore query
  console.log('[Firebase] fetchComplaints for ward:', wardId);
  return new Promise(resolve => setTimeout(() => resolve([]), 400));
}

/* ── Activity Data ──────────────────────────────────────────── */
/* photo: real Unsplash images — free license, themed to each activity */
const activities = [
  {
    id: 1,
    tag: 'Sanitation Complaint',
    photo: '/assets/activities/W9-SANITATION.png',
    photoAlt: 'Volunteers picking up trash during a community cleanup drive',
    title: 'Ward 9 Sanitation Complaint',
    desc: 'Escalated 1 sanitation complaints through official grievance portals, resolutions within 2 hours of filing.',
    date: 'May 16, 2026',
    status: 'done'
  },
  // {
  //   id: 2,
  //   tag: 'Awareness Campaign',
  //   photo: '/assets/activities/waste-collection.png',
  //   photoAlt: 'Youth volunteers knocking on doors during an awareness campaign',
  //   title: 'Door-to-Door Waste Segregation Drive',
  //   desc: 'Team visited 200+ households educating residents on wet vs dry waste segregation with live demonstrations and printed guides.',
  //   date: 'August 5, 2026',
  //   status: 'active'
  // },
  // {
  //   id: 3,
  //   tag: 'Ward Inspection',
  //   photo: '/assets/activities/ward-inspection.png',
  //   photoAlt: 'Volunteer documenting a garbage pile in a neglected street',
  //   title: 'Ward 7 Sanitation Audit',
  //   desc: 'Documented 14 critical sanitation failure points in Ward 7 with photographic evidence and GPS coordinates for official filing.',
  //   date: 'August 12, 2026',
  //   status: 'active'
  // },
  // {
  //   id: 4,
  //   tag: 'Community Mobilization',
  //   photo: '/assets/activities/community-mobilization.png',
  //   photoAlt: 'Community members and shopkeepers gathering for a cleanliness pledge',
  //   title: 'Shopkeeper Responsibility Pledge',
  //   desc: 'Over 60 shopkeepers across 3 markets signed a cleanliness pledge, committing to daily waste disposal practices on their premises.',
  //   date: 'August 18, 2025',
  //   status: 'done'
  // },
  // {
  //   id: 5,
  //   tag: 'System Activation',
  //   photo: '/assets/activities/system-activation.png',
  //   photoAlt: 'Volunteers at a meeting escalating complaints to local authorities',
  //   title: 'Nagar Parishad Complaint Follow-Up',
  //   desc: 'Escalated 8 pending sanitation complaints through official grievance portals, resulting in 5 resolutions within 72 hours of filing.',
  //   date: 'September 1, 2025',
  //   status: 'active'
  // },
  // {
  //   id: 6,
  //   tag: 'Student Drive',
  //   photo: '/assets/activities/student-drive.png',
  //   photoAlt: 'Young students participating in a hygiene awareness session at school',
  //   title: 'School Hygiene Awareness Program',
  //   desc: 'Conducted hygiene awareness sessions in 3 local schools, engaging 400+ students and distributing waste segregation kits.',
  //   date: 'September 15, 2025',
  //   status: 'upcoming'
  // }
];

/* ── Testimonials Data ──────────────────────────────────────── */
const testimonials = [
  {
    text: 'Before KYC started working in our lane, garbage used to pile up for days. Now the situation has completely changed. The youth actually came door to door and explained why we need to separate waste. I never thought it would make such a difference.',
    name: 'Ramesh Kumar',
    role: 'Resident, Ward 3',
    initial: 'R'
  },
  {
    text: 'I was skeptical at first — many groups come, take photos, and disappear. But Kishanganj Youth Club is different. They followed up on our complaints with the Nagar Parishad three times until the drain was actually cleared.',
    name: 'Fatima Begum',
    role: 'Shopkeeper, Main Market',
    initial: 'F'
  },
  {
    text: 'As a student volunteer, joining KYC taught me what real civic responsibility looks like. We don\'t just post on social media — we get assigned real zones and track real results. It\'s serious work and it feels meaningful.',
    name: 'Aditya Singh',
    role: 'Student Volunteer',
    initial: 'A'
  }
];

/* ── Team Data ──────────────────────────────────────────────── */
const teamData = [
  { name: 'Aryan Hussain', role: 'Founder & Lead', bio: 'Driving the vision of Mission Clean City from concept to ground execution.', initial: 'A' },
  { name: 'Nisha Gupta', role: 'Field Coordinator', bio: 'Manages on-ground volunteer deployment and ward-level operations.', initial: 'N' },
  { name: 'Imran Khan', role: 'Tech & Data Lead', bio: 'Handles complaint documentation, data tracking, and portal management.', initial: 'I' },
  { name: 'Priya Sharma', role: 'Community Outreach', bio: 'Leads door-to-door awareness campaigns and community mobilization.', initial: 'P' },
  { name: 'Ravi Yadav', role: 'Volunteer Manager', bio: 'Assigns tasks, tracks accountability, and maintains volunteer records.', initial: 'R' },
  { name: 'Sana Parveen', role: 'Media & Comms', bio: 'Documents impact, manages communications, and creates awareness content.', initial: 'S' },
];

/* ── Navbar Logic ────────────────────────────────────────────── */
function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!navbar) return;

  // Scroll styling
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  });

  // Mobile toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Set active link
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link[href]').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === current || (current === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ── Animated Counters ───────────────────────────────────────── */
function animateCounter(el, target, duration = 2000, suffix = '') {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) {
      start = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(start).toLocaleString() + suffix;
  }, 16);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        const target = parseInt(entry.target.dataset.count);
        const suffix = entry.target.dataset.suffix || '';
        animateCounter(entry.target, target, 2000, suffix);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ── Scroll Fade Animations ──────────────────────────────────── */
function initScrollAnimations() {
  const faders = document.querySelectorAll('.fade-in');
  if (!faders.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  faders.forEach(el => observer.observe(el));
}

/* ── Dynamic Activity Cards ──────────────────────────────────── */
function renderActivityCards(container, data = activities, limit = null) {
  if (!container) return;
  const items = limit ? data.slice(0, limit) : data;
  container.innerHTML = items.map(a => `
    <div class="activity-card fade-in">
      <div class="activity-img">
        <span class="activity-tag-badge">${a.tag}</span>
        <img
          src="${a.photo}"
          alt="${a.photoAlt}"
          class="activity-photo"
          loading="lazy"
          onerror="this.parentNode.classList.add('activity-img--fallback')"
        />
      </div>
      <div class="activity-body">
        <h3 class="activity-title">${a.title}</h3>
        <p class="activity-desc">${a.desc}</p>
        <div class="activity-meta">
          <span class="activity-date">${a.date}</span>
          <span class="status-badge status-${a.status}">${a.status}</span>
        </div>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

/* ── Dynamic Testimonial Cards ───────────────────────────────── */
function renderTestimonials(container) {
  if (!container) return;
  container.innerHTML = testimonials.map(t => `
    <div class="testimonial-card fade-in">
      <div class="testimonial-quote">"</div>
      <p class="testimonial-text">${t.text}</p>
      <div class="testimonial-author">
        <div class="author-avatar">${t.initial}</div>
        <div>
          <div class="author-name">${t.name}</div>
          <div class="author-role">${t.role}</div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ── Dynamic Team Cards ──────────────────────────────────────── */
function renderTeamCards(container) {
  if (!container) return;
  container.innerHTML = teamData.map(m => `
    <div class="team-card fade-in">
      <div class="team-avatar">${m.initial}</div>
      <div class="team-name">${m.name}</div>
      <div class="team-role">${m.role}</div>
      <p class="team-bio">${m.bio}</p>
      <div class="team-social">
        <button class="team-social-btn" title="LinkedIn">in</button>
        <button class="team-social-btn" title="Instagram">ig</button>
        <button class="team-social-btn" title="Twitter">tw</button>
      </div>
    </div>
  `).join('');
  initScrollAnimations();
}

/* ── Toast Notification ──────────────────────────────────────── */
function showToast(message, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const icons = { success: '[DONE]', error: 'X', info: 'i', warning: '!️' };
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span class="toast-icon">${icons[type] || '[DONE]'}</span><span class="toast-msg">${message}</span>`;
  document.body.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}

/* ── Form Validation ─────────────────────────────────────────── */
function validateField(input) {
  const errEl = input.parentNode.querySelector('.form-error');
  const val = input.value.trim();
  let error = '';

  if (input.required && !val) error = 'This field is required.';
  else if (input.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val))
    error = 'Please enter a valid email address.';
  else if (input.minLength && val.length < input.minLength)
    error = `Minimum ${input.minLength} characters required.`;

  if (errEl) {
    errEl.textContent = error;
    errEl.classList.toggle('visible', !!error);
  }
  input.style.borderColor = error ? 'var(--red)' : '';
  return !error;
}

function initFormValidation(formId, onSubmit) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Live validation
  form.querySelectorAll('input, textarea, select').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.style.borderColor === 'var(--red)') validateField(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let valid = true;
    form.querySelectorAll('input[required], textarea[required], select[required]').forEach(input => {
      if (!validateField(input)) valid = false;
    });
    if (!valid) return;

    const submitBtn = form.querySelector('[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Processing...';
    submitBtn.disabled = true;

    try {
      const data = Object.fromEntries(new FormData(form));
      await onSubmit(data, form);
    } catch (err) {
      showToast('Something went wrong. Please try again.', 'error');
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });
}

/* ── Join Us Form ────────────────────────────────────────────── */
function initJoinForm() {
  initFormValidation('joinForm', async (data, form) => {
    const result = await registerUser(data.name, data.email, data.password || 'temp', data.role);
    if (result.uid) {
      form.reset();
      const successEl = document.getElementById('joinSuccess');
      if (successEl) successEl.classList.add('visible');
      showToast('Welcome to KYC! We\'ll be in touch soon.', 'success');
    }
  });
}

/* ── Complaint / Report Form ─────────────────────────────────── */
function initComplaintForm() {
  initFormValidation('complaintForm', async (data, form) => {
    const result = await submitComplaint(data);
    if (result.success) {
      form.reset();
      const idEl = document.getElementById('complaintId');
      const successEl = document.getElementById('complaintSuccess');
      if (idEl) idEl.textContent = result.complaintId;
      if (successEl) successEl.classList.add('visible');
      showToast(`Complaint filed! ID: ${result.complaintId}`, 'success');
    }
  });
}

/* ── Track Status Form ───────────────────────────────────────── */
function initTrackForm() {
  const form = document.getElementById('trackForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('trackId').value.trim();
    if (!id) return;

    const btn = form.querySelector('[type="submit"]');
    btn.textContent = 'Searching...';
    btn.disabled = true;

    await new Promise(r => setTimeout(r, 800));

    // Demo result
    const result = document.getElementById('trackResult');
    if (result) {
      result.style.display = 'block';
      document.getElementById('resultId').textContent = id;
    }

    btn.textContent = 'Track Status';
    btn.disabled = false;
  });
}

/* ── Login / Auth Form ───────────────────────────────────────── */
function initAuthForm() {
  // Tab switching
  const tabs = document.querySelectorAll('.auth-tab');
  const panels = document.querySelectorAll('.auth-panel');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      tab.classList.add('active');
      const target = document.getElementById(tab.dataset.target);
      if (target) target.style.display = 'block';
    });
  });

  // Login form
  initFormValidation('loginForm', async (data) => {
    const result = await loginUser(data.email, data.password);
    if (result.uid) {
      showToast('Welcome back! Redirecting to dashboard...', 'success');
      setTimeout(() => { window.location.href = 'admin.html'; }, 1500);
    }
  });

  // Register form
  initFormValidation('registerForm', async (data, form) => {
    const result = await registerUser(data.name, data.email, data.password, data.role);
    if (result.uid) {
      form.reset();
      showToast('Account created! Awaiting admin approval.', 'success');
    }
  });
}

/* ── Admin Panel ─────────────────────────────────────────────── */
function initAdmin() {
  // Sidebar navigation
  const sidebarLinks = document.querySelectorAll('.sidebar-link[data-panel]');
  const panels = document.querySelectorAll('.admin-panel');

  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      panels.forEach(p => p.style.display = 'none');
      link.classList.add('active');
      const target = document.getElementById(link.dataset.panel);
      if (target) target.style.display = 'block';
    });
  });

  // Assign Task
  initFormValidation('assignTaskForm', async (data) => {
    const result = await assignTask(data.volunteer, data);
    if (result.success) {
      showToast(`Task ${result.taskId} assigned successfully!`, 'success');
    }
  });

  // Load tasks
  const tasksContainer = document.getElementById('tasksList');
  if (tasksContainer) {
    fetchTasks('all').then(tasks => {
      if (tasks.length) {
        tasksContainer.innerHTML = tasks.map(t => `
          <tr>
            <td class="name">${t.id}</td>
            <td>${t.area}</td>
            <td><span class="status-badge status-${t.status}">${t.status}</span></td>
            <td>${t.due}</td>
            <td><button class="btn btn-sm btn-outline" onclick="showToast('Viewing task details', 'info')">View</button></td>
          </tr>
        `).join('');
      }
    });
  }
}

/* ── Project Filter ──────────────────────────────────────────── */
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const grid = document.getElementById('activitiesGrid');
  if (!filterBtns.length || !grid) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const filtered = filter === 'all' ? activities : activities.filter(a => a.status === filter);
      renderActivityCards(grid, filtered);
    });
  });
}

/* ── Ticker duplication for infinite scroll ──────────────────── */
function initTicker() {
  const inner = document.querySelector('.ticker-inner');
  if (!inner) return;
  // Duplicate for seamless loop
  inner.innerHTML += inner.innerHTML;
}

/* ── Initialize on DOMContentLoaded ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initCounters();
  initScrollAnimations();
  initTicker();

  // Page-specific initializations
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // Home
  const homeGrid = document.getElementById('activitiesGrid');
  if (homeGrid && page === 'index.html') renderActivityCards(homeGrid, activities, 3);
  const testimonialGrid = document.getElementById('testimonialsGrid');
  if (testimonialGrid) renderTestimonials(testimonialGrid);

  // Projects
  if (page === 'projects.html') {
    renderActivityCards(document.getElementById('activitiesGrid'));
    initProjectFilter();
  }

  // Team
  if (page === 'team.html') {
    renderTeamCards(document.getElementById('teamGrid'));
  }

  // Join
  if (page === 'join.html') initJoinForm();

  // Track
  if (page === 'track.html') initTrackForm();

  // Volunteer (auth)
  if (page === 'volunteer.html') initAuthForm();

  // Admin
  if (page === 'admin.html') initAdmin();

  // Mission page complaint form
  if (page === 'mission.html') initComplaintForm();
});


