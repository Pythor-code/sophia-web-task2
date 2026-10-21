'use strict';

// Product records contain only the choices shown on this classroom website.
const products = [
  { id: 'signature-loaf', name: 'Signature Loaf' },
  { id: 'morning-pastry', name: 'Morning Pastry' },
  { id: 'celebration-cake', name: 'Celebration Cake' }
];
const storageKey = 'northStarBakery.favorites.v1';
let storageAvailable = true;
let favorites = loadFavorites();

function loadFavorites() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
    if (!Array.isArray(saved)) return [];
    return products.filter(product => saved.includes(product.id))
      .map(product => product.id);
  } catch (error) {
    // Invalid saved data or blocked storage must not break the rest of the site.
    storageAvailable = false;
    return [];
  }
}

function saveFavorites() {
  try {
    if (favorites.length === 0) localStorage.removeItem(storageKey);
    else localStorage.setItem(storageKey, JSON.stringify(favorites));
    storageAvailable = true;
  } catch (error) {
    storageAvailable = false;
  }
}

function setStatus(message) {
  const status = document.getElementById('favorite-status');
  if (status) status.textContent = message;
}

function updateFavoritesView(message) {
  document.querySelectorAll('[data-favorite-id]').forEach(button => {
    const selected = favorites.includes(button.dataset.favoriteId);
    button.setAttribute('aria-pressed', String(selected));
    const product = products.find(item => item.id === button.dataset.favoriteId);
    button.textContent = `${selected ? 'Saved' : 'Save'}: ${product.name}`;
  });
  const summary = document.getElementById('favorite-summary');
  if (summary) {
    summary.replaceChildren();
    if (favorites.length === 0) {
      const empty = document.createElement('p');
      empty.textContent = 'No favorites yet. Choose a product to start your list.';
      summary.append(empty);
    } else {
      const list = document.createElement('ul');
      products.filter(product => favorites.includes(product.id)).forEach(product => {
        const item = document.createElement('li');
        item.textContent = product.name;
        list.append(item);
      });
      summary.append(list);
    }
  }
  const clear = document.getElementById('clear-favorites');
  if (clear) clear.hidden = favorites.length === 0;
  const note = document.getElementById('storage-note');
  if (note) note.textContent = storageAvailable
    ? 'Favorites are remembered in this browser, including after a refresh. Contact details are not saved.'
    : 'Browser storage is unavailable. Your choices work on this page but may not be remembered.';
  setStatus(message);
}

function toggleFavorite(id) {
  if (!products.some(product => product.id === id)) return;
  const wasSaved = favorites.includes(id);
  favorites = wasSaved ? favorites.filter(savedId => savedId !== id) : [...favorites, id];
  saveFavorites();
  const name = products.find(product => product.id === id).name;
  updateFavoritesView(`${name} ${wasSaved ? 'removed' : 'saved'}. ${favorites.length} favorite${favorites.length === 1 ? '' : 's'} selected.`);
}

function initializeFavorites() {
  const controls = document.getElementById('favorite-controls');
  if (controls) {
    products.forEach(product => {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.favoriteId = product.id;
      button.addEventListener('click', () => toggleFavorite(product.id));
      controls.append(button);
    });
  }
  const clear = document.getElementById('clear-favorites');
  if (clear) clear.addEventListener('click', () => {
    favorites = [];
    saveFavorites();
    updateFavoritesView('All favorites cleared from this browser.');
    // The clear button is now hidden; put focus on a visible control.
    document.querySelector('[data-favorite-id]')?.focus();
  });
  updateFavoritesView(favorites.length
    ? `${favorites.length} saved favorite${favorites.length === 1 ? '' : 's'} restored from this browser.`
    : 'Save a favorite for your next visit.');
}

// Each rule pairs a form field with a small, specific validation function.
const validationRules = [
  { id: 'customer-name', check: field => {
    const value = field.value.trim();
    if (!value) return 'Enter your name.';
    if (value.length < 2 || value.length > 80) return 'Use 2 to 80 characters for your name.';
    return '';
  } },
  { id: 'email', check: field => {
    if (!field.value.trim()) return 'Enter your email address.';
    if (field.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()))
      return 'Enter a valid email, such as alex@example.com.';
    if (field.value.length > 120) return 'Keep your email address under 121 characters.';
    return '';
  } },
  { id: 'request-type', check: field => ['preorder', 'question'].includes(field.value)
    ? '' : 'Choose a request type.' },
  { id: 'details', check: field => {
    const length = field.value.trim().length;
    return length < 10 || length > 1000
      ? 'Enter 10 to 1,000 characters describing your request.' : '';
  } },
  { id: 'allergies', check: field => field.value.length > 500
    ? 'Keep allergy notes within 500 characters.' : '' }
];

function validateField(rule) {
  const field = document.getElementById(rule.id);
  const error = document.getElementById(`${rule.id}-error`);
  const message = rule.check(field);
  error.textContent = message;
  if (message) field.setAttribute('aria-invalid', 'true');
  else field.removeAttribute('aria-invalid');
  return !message;
}

function initializeForm() {
  const form = document.getElementById('inquiry-form');
  if (!form) return;
  // Native constraints stay in the HTML as a fallback; JS supplies nearby messages.
  form.noValidate = true;
  let submitted = false;
  validationRules.forEach(rule => {
    const field = document.getElementById(rule.id);
    field.addEventListener('input', () => {
      if (submitted || field.getAttribute('aria-invalid') === 'true') validateField(rule);
      document.getElementById('form-status').textContent = '';
    });
    field.addEventListener('change', () => {
      if (submitted) validateField(rule);
      document.getElementById('form-status').textContent = '';
    });
  });
  form.addEventListener('submit', event => {
    // This is a classroom preview, so even valid entries never leave the page.
    event.preventDefault();
    submitted = true;
    const invalidRules = validationRules.filter(rule => !validateField(rule));
    const status = document.getElementById('form-status');
    if (invalidRules.length) {
      status.textContent = 'Please correct the marked fields. Your entries are still here.';
      document.getElementById(invalidRules[0].id).focus();
    } else {
      status.textContent = 'Your details passed the checks. This classroom preview has not sent an inquiry or placed an order.';
      status.focus();
    }
  });
}

initializeFavorites();
initializeForm();
