
export async function createTestUser(email: string, password: string) {
  const res = await fetch(`http://localhost:9099/identitytoolkit.googleapis.com/v1/accounts:signUp?key=fake-api-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      returnSecureToken: true
    })
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Failed to create user: ${JSON.stringify(err)}`);
  }

  return res.json(); // contains localId, idToken, etc.
}
