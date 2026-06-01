const baseUrl = 'http://localhost:4000/api/auth';
const email = 'testuser123@example.com';
const password = 'OldPassword123!';
const newPassword = 'NewPassword456!';

async function run() {
  try {
    console.log('1. Registering user...');
    let res = await fetch(`${baseUrl}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name: 'Test User' })
    });
    if (res.status === 409) {
      console.log('   -> User already exists, skipping registration.');
    } else if (!res.ok) {
      throw new Error('Register failed: ' + await res.text());
    } else {
      console.log('   -> Registered successfully.');
    }

    console.log('2. Requesting password reset...');
    res = await fetch(`${baseUrl}/_dev/send-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    if (!res.ok) throw new Error('Send reset failed: ' + await res.text());
    const data = await res.json();
    const token = data.data.token;
    console.log('   -> Reset token received:', token.substring(0, 20) + '...');

    console.log('3. Resetting password...');
    res = await fetch(`${baseUrl}/dat-lai-mat-khau`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword })
    });
    if (!res.ok) throw new Error('Reset password failed: ' + await res.text());
    console.log('   -> Password reset successfully!');

    console.log('4. Verifying login with new password...');
    res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: newPassword })
    });
    if (!res.ok) throw new Error('Login with new password failed: ' + await res.text());
    console.log('   -> Login successful! Scenario 1 completed flawlessly. 🎉');
  } catch(err) {
    console.error('ERROR:', err.message);
  }
}

run();
