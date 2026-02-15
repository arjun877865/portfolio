/* ===== PORTFOLIO SCRIPT ===== */
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ── Supabase client ──
// ⚠️  Replace these with your own Supabase project URL and anon key
//     from: https://supabase.com/dashboard → Project Settings → API

const SUPABASE_URL = 'https://fedecuzhxuikdpyehoco.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZGVjdXpoeHVpa2RweWVob2NvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzU5MjEsImV4cCI6MjA4NjYxMTkyMX0.CliP5e6fzZNxg3Z4Zp-82Q6fYzduCw2OEsUtLVgutmk';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ── DOM refs ──
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const typedText = document.getElementById('typedText');
const contactForm = document.getElementById('contactForm');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const sections = document.querySelectorAll('.section');
const navAnchors = document.querySelectorAll('.nav-links a');

// ── Typing animation ──
const phrases = [
  'things for the web.',
  'beautiful interfaces.',
  'scalable backends.',
  'delightful experiences.',
];
let phraseIdx = 0;
let charIdx = 0;
let isDeleting = false;
const TYPING_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_END = 1800;
const PAUSE_START = 400;

function type() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    charIdx--;
    typedText.textContent = current.substring(0, charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, PAUSE_START);
      return;
    }
    setTimeout(type, DELETE_SPEED);
  } else {
    charIdx++;
    typedText.textContent = current.substring(0, charIdx);
    if (charIdx === current.length) {
      isDeleting = true;
      setTimeout(type, PAUSE_END);
      return;
    }
    setTimeout(type, TYPING_SPEED);
  }
}
setTimeout(type, 800);

// ── Navbar scroll effect ──
let lastScroll = 0;
function handleScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}
window.addEventListener('scroll', handleScroll, { passive: true });

// ── Mobile nav toggle ──
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ── Active nav highlighting ──
function highlightNav() {
  let current = '';
  sections.forEach((sec) => {
    const top = sec.offsetTop - 120;
    if (window.scrollY >= top) {
      current = sec.getAttribute('id');
    }
  });
  navAnchors.forEach((a) => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}
window.addEventListener('scroll', highlightNav, { passive: true });

// ── Scroll reveal (IntersectionObserver) ──
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealElements.forEach((el) => revealObserver.observe(el));

// ── Project filter ──
filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach((card) => {
      if (filter === 'all' || card.dataset.category === filter) {
        card.classList.remove('hidden');
        card.style.animation = 'none';
        card.offsetHeight; // trigger reflow
        card.style.animation = '';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ── Contact form (Supabase) ──
function setSubmitState(btn, text, disabled) {
  btn.querySelector('span').textContent = text;
  btn.style.pointerEvents = disabled ? 'none' : '';
  btn.style.opacity = disabled ? '0.7' : '';
}

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('#name').value.trim();
    const email = contactForm.querySelector('#email').value.trim();
    const subject = contactForm.querySelector('#subject').value.trim();
    const message = contactForm.querySelector('#message').value.trim();
    if (!name || !email || !message) return;

    const submitBtn = contactForm.querySelector('.btn-submit');
    setSubmitState(submitBtn, 'Sending...', true);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([{ name, email, subject, message }]);

      if (error) throw error;

      setSubmitState(submitBtn, 'Sent! ✓', true);
      contactForm.reset();
      setTimeout(() => setSubmitState(submitBtn, 'Send Message', false), 3000);
    } catch (err) {
      console.error('Supabase error:', err);
      setSubmitState(submitBtn, 'Error — Try Again', false);
      setTimeout(() => setSubmitState(submitBtn, 'Send Message', false), 3000);
    }
  });
}

