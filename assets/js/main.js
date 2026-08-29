// Threads of Love Foundation — shared site behavior (mockup only, no backend)

document.addEventListener('DOMContentLoaded', () => {

  // ---- mobile nav toggle ----
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // ---- scroll reveal ----
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  // ---- donation amount picker (donate.html) ----
  const amountPills = document.querySelectorAll('.amount-pill');
  const customAmount = document.getElementById('custom-amount');
  amountPills.forEach(pill => {
    pill.addEventListener('click', () => {
      amountPills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
      if (customAmount) customAmount.value = pill.dataset.amount || '';
    });
  });
  if (customAmount) {
    customAmount.addEventListener('input', () => amountPills.forEach(p => p.classList.remove('selected')));
  }

  // ---- one-time / monthly toggle (donate.html) ----
  const freqButtons = document.querySelectorAll('.toggle-pair button');
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // ---- mock form submissions (no backend attached yet) ----
  document.querySelectorAll('form[data-mock-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const success = form.parentElement.querySelector('.form-success') || form.querySelector('.form-success');
      form.querySelectorAll('input, textarea, select').forEach(f => { if (f.type !== 'submit') f.value = ''; });
      const successEl = document.getElementById(form.dataset.mockForm);
      if (successEl) {
        successEl.style.display = 'block';
        setTimeout(() => { successEl.style.display = 'none'; }, 6000);
      }
    });
  });

});
