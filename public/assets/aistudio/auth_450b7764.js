const signInForm = document.getElementById('signInForm');
const signUpForm = document.getElementById('signUpForm');

function showAuthMessage(message) {
  const status = document.getElementById('authMessage');
  status.textContent = message;
  status.classList.remove('hidden');
}

if (signInForm) {
  signInForm.addEventListener('submit', event => {
    event.preventDefault();
    showAuthMessage('Sign-in is a front-end demo. Connect an authentication service to access real accounts.');
    signInForm.reset();
  });
}

if (signUpForm) {
  const password = document.getElementById('password');
  const passwordConfirm = document.getElementById('passwordConfirm');

  function validatePasswordMatch() {
    passwordConfirm.setCustomValidity(password.value === passwordConfirm.value ? '' : 'Passwords do not match.');
  }

  password.addEventListener('input', validatePasswordMatch);
  passwordConfirm.addEventListener('input', validatePasswordMatch);

  signUpForm.addEventListener('submit', event => {
    event.preventDefault();
    validatePasswordMatch();
    if (!signUpForm.reportValidity()) return;

    const role = new FormData(signUpForm).get('role');
    if (!['youth', 'mentor', 'facilitator', 'administrator'].includes(role)) {
      showAuthMessage('Please choose a valid dashboard role.');
      return;
    }

    window.location.href = `law.html?role=${encodeURIComponent(role)}#app`;
  });
}
