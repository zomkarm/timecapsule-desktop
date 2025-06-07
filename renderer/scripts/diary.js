const dateInput = document.getElementById('entry-date');
const loadBtn = document.getElementById('load-entry');
const createTodayBtn = document.getElementById('create-today');
const saveBtn = document.getElementById('save-entry');
const textArea = document.getElementById('diary-text');
const statusMsg = document.getElementById('status-msg');

// Helper to get today's date as YYYY-MM-DD
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Load entry from DB
async function loadEntry(date) {
  const content = await window.api.loadDiaryEntry(date);
  textArea.value = content || '';
  statusMsg.textContent = content ? 'Loaded entry.' : 'No entry found. You can write one.';
}

// Save entry to DB
async function saveEntry() {
  const date = dateInput.value;
  const content = textArea.value.trim();

  if (!date) {
    statusMsg.textContent = 'Please select a date first.';
    return;
  }

  await window.api.saveDiaryEntry(date, content);
  statusMsg.textContent = 'Entry saved successfully.';
}

// Events
loadBtn.addEventListener('click', () => {
  const date = dateInput.value;
  if (!date) {
    statusMsg.textContent = 'Please select a date.';
    return;
  }
  loadEntry(date);
});

createTodayBtn.addEventListener('click', () => {
  const today = getTodayDate();
  dateInput.value = today;
  loadEntry(today);
});

saveBtn.addEventListener('click', saveEntry);
