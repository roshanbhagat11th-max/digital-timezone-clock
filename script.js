// List of timezones with emoji and city names
const timezones = [
  { name: 'New York', emoji: '🗽', tz: 'America/New_York' },
  { name: 'Los Angeles', emoji: '🌴', tz: 'America/Los_Angeles' },
  { name: 'London', emoji: '🇬🇧', tz: 'Europe/London' },
  { name: 'Paris', emoji: '🗼', tz: 'Europe/Paris' },
  { name: 'Tokyo', emoji: '🗾', tz: 'Asia/Tokyo' },
  { name: 'Sydney', emoji: '🦘', tz: 'Australia/Sydney' },
  { name: 'Dubai', emoji: '🏜️', tz: 'Asia/Dubai' },
  { name: 'Singapore', emoji: '🇸🇬', tz: 'Asia/Singapore' },
  { name: 'Hong Kong', emoji: '🇭🇰', tz: 'Asia/Hong_Kong' },
  { name: 'Bangkok', emoji: '🇹🇭', tz: 'Asia/Bangkok' },
  { name: 'Mumbai', emoji: '🇮🇳', tz: 'Asia/Kolkata' },
  { name: 'Berlin', emoji: '🇩🇪', tz: 'Europe/Berlin' },
  { name: 'Moscow', emoji: '🇷🇺', tz: 'Europe/Moscow' },
  { name: 'São Paulo', emoji: '🇧🇷', tz: 'America/Sao_Paulo' },
  { name: 'Mexico City', emoji: '����🇽', tz: 'America/Mexico_City' },
  { name: 'Toronto', emoji: '🇨🇦', tz: 'America/Toronto' },
  { name: 'Istanbul', emoji: '🇹🇷', tz: 'Europe/Istanbul' },
  { name: 'Cairo', emoji: '🇪🇬', tz: 'Africa/Cairo' },
  { name: 'Johannesburg', emoji: '🇿🇦', tz: 'Africa/Johannesburg' },
  { name: 'Auckland', emoji: '🇳🇿', tz: 'Pacific/Auckland' },
];

// Default timezones to display
const defaultTimezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo'];

// DOM Elements
const clockGrid = document.getElementById('clockGrid');
const addClockBtn = document.getElementById('addClockBtn');
const resetBtn = document.getElementById('resetBtn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');
const timezoneSelect = document.getElementById('timezoneSelect');
const confirmBtn = document.getElementById('confirmBtn');

// State
let activeTimezones = [];

// Initialize
function init() {
  loadActiveTimezones();
  populateTimezoneSelect();
  setupEventListeners();
  renderClocks();
  setInterval(updateClocks, 1000);
}

// Load active timezones from localStorage
function loadActiveTimezones() {
  const saved = localStorage.getItem('activeTimezones');
  activeTimezones = saved ? JSON.parse(saved) : defaultTimezones;
}

// Save active timezones to localStorage
function saveActiveTimezones() {
  localStorage.setItem('activeTimezones', JSON.stringify(activeTimezones));
}

// Populate timezone select dropdown
function populateTimezoneSelect() {
  timezoneSelect.innerHTML = '';
  timezones.forEach((tz) => {
    const option = document.createElement('option');
    option.value = tz.tz;
    option.textContent = `${tz.emoji} ${tz.name}`;
    timezoneSelect.appendChild(option);
  });
}

// Setup event listeners
function setupEventListeners() {
  addClockBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  confirmBtn.addEventListener('click', addTimezone);
  resetBtn.addEventListener('click', resetClocks);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
}

// Open modal
function openModal() {
  modal.style.display = 'block';
  timezoneSelect.focus();
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
}

// Add timezone to active list
function addTimezone() {
  const selectedTz = timezoneSelect.value;
  if (selectedTz && !activeTimezones.includes(selectedTz)) {
    activeTimezones.push(selectedTz);
    saveActiveTimezones();
    renderClocks();
    closeModal();
  }
}

// Remove timezone from active list
function removeTimezone(tz) {
  activeTimezones = activeTimezones.filter((t) => t !== tz);
  saveActiveTimezones();
  renderClocks();
}

// Reset to default timezones
function resetClocks() {
  activeTimezones = [...defaultTimezones];
  saveActiveTimezones();
  renderClocks();
}

// Get timezone display info
function getTimezoneInfo(tz) {
  return timezones.find((t) => t.tz === tz);
}

// Format time for timezone
function formatTime(date) {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

// Format date for timezone
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Render all clocks
function renderClocks() {
  clockGrid.innerHTML = '';

  if (activeTimezones.length === 0) {
    clockGrid.innerHTML = '<div class="empty-state">No time zones added. Click "Add Time Zone" to get started! 🌍</div>';
    return;
  }

  activeTimezones.forEach((tz) => {
    const info = getTimezoneInfo(tz);
    if (!info) return;

    const now = new Date();
    const timeInTz = new Date(
      now.toLocaleString('en-US', { timeZone: tz })
    );

    const card = document.createElement('div');
    card.className = 'clock-card';
    card.innerHTML = `
      <div class="timezone-name">${info.emoji} ${info.name}</div>
      <div class="timezone-info">${tz}</div>
      <div class="digital-clock" data-tz="${tz}">
        ${formatTime(timeInTz)}
      </div>
      <div class="date-display">${formatDate(timeInTz)}</div>
      <button class="delete-btn" onclick="removeTimezone('${tz}')">Remove</button>
    `;
    clockGrid.appendChild(card);
  });
}

// Update all clocks
function updateClocks() {
  activeTimezones.forEach((tz) => {
    const clockElement = document.querySelector(`[data-tz="${tz}"]`);
    if (!clockElement) return;

    const now = new Date();
    const timeInTz = new Date(
      now.toLocaleString('en-US', { timeZone: tz })
    );

    clockElement.textContent = formatTime(timeInTz);
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', init);
