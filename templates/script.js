// Overlay open/close
const menuBtn = document.querySelector('.menu-btn');
const menuOverlay = document.getElementById('menuOverlay');
const closeBtn = document.getElementById('closeMenu');

menuBtn.addEventListener('click', () => {
  menuOverlay.classList.add('active');
});

closeBtn.addEventListener('click', () => {
  menuOverlay.classList.remove('active');
});

menuOverlay.addEventListener('click', (e) => {
  if (e.target === menuOverlay) {
    menuOverlay.classList.remove('active');
  }
});

// Toggle Login <-> Signup
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const loginCard = document.getElementById('loginCard');
const signupCard = document.getElementById('signupCard');

showSignup.addEventListener('click', (e) => {
  e.preventDefault();
  loginCard.classList.add('hidden');
  signupCard.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
  e.preventDefault();
  signupCard.classList.add('hidden');
  loginCard.classList.remove('hidden');
});