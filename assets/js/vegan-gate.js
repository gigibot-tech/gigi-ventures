(() => {
  const PASSWORD = 'ichhabeschmerzundguckenichtauslangweile';
  const form = document.querySelector('[data-vegan-gate]');
  if (!form) return;

  const input = form.querySelector('input[name="password"]');
  const error = form.querySelector('[data-vegan-gate-error]');

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (input.value !== PASSWORD) {
      error.hidden = false;
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }

    try {
      sessionStorage.setItem('gigi-vegan-unlocked', 'true');
    } catch {}
    document.documentElement.classList.remove('vegan-locked');
  });

  input.addEventListener('input', () => {
    error.hidden = true;
    input.removeAttribute('aria-invalid');
  });
})();
