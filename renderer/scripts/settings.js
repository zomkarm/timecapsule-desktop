const { updateUserSettings } = window.api;

document.getElementById('settings-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !password) return;

  const result = await updateUserSettings({ username, password });

  const messageEl = document.getElementById('message');
  if (result.success) {
    messageEl.textContent = 'Settings updated successfully!';
    messageEl.style.color = 'green';
  } else {
    messageEl.textContent = 'Failed to update settings.';
    messageEl.style.color = 'red';
  }
});
