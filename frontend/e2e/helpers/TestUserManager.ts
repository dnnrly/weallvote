// helpers/TestUserManager.ts

// Get the Firebase Auth Emulator host from the environment or default to localhost
const FIREBASE_EMULATOR_HOST = process.env.FIREBASE_AUTH_EMULATOR_HOST || 'localhost:9099';
const AUTH_EMULATOR_URL = `http://${FIREBASE_EMULATOR_HOST}/identitytoolkit.googleapis.com/v1`;
const EMULATOR_ADMIN_URL = `http://${FIREBASE_EMULATOR_HOST}/emulator/v1`;
const FAKE_API_KEY = 'fake-api-key';
const PROJECT_ID = 'demo-weallvote'; // Update to match your firebase.json config

interface CreatedUser {
    localId: string;
    email: string;
    idToken: string;
}

export class TestUserManager {
    /**
     * Create a user in the Firebase Auth emulator.
     */
    async createUser(email: string, password: string): Promise<CreatedUser> {
        const res = await fetch(`${AUTH_EMULATOR_URL}/accounts:signUp?key=${FAKE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to create user: ${error}`);
        }

        const data = await res.json();
        return {
            localId: data.localId,
            email: data.email,
            idToken: data.idToken,
        };
    }

    /**
    * Create a user, sign them in, and mark their email as verified.
    */
    async createAndVerifyUser(email: string, password: string): Promise<CreatedUser> {
        const user = await this.createUser(email, password);
        await this.confirmEmail(user.idToken);
        return user;
    }

    /**
     * Sign in an existing user and return an ID token.
     */
    async signInUser(email: string, password: string): Promise<string> {
        const res = await fetch(`${AUTH_EMULATOR_URL}/accounts:signInWithPassword?key=${FAKE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, returnSecureToken: true }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to sign in: ${error}`);
        }

        const data = await res.json();
        return data.idToken;
    }

    /**
     * Delete a user by their ID token.
     */
    async deleteUser(idToken: string): Promise<void> {
        const res = await fetch(`${AUTH_EMULATOR_URL}/accounts:delete?key=${FAKE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to delete user: ${error}`);
        }
    }

    /**
     * Confirm a user's email by updating their account.
     */
    async confirmEmail(idToken: string): Promise<void> {
        const res = await fetch(`${AUTH_EMULATOR_URL}/accounts:update?key=${FAKE_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken, emailVerified: true }),
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to verify email: ${error}`);
        }
    }

    /**
     * Sign in a user and return an ID token — helpful if you already created the user.
     */
    async getIdTokenByEmail(email: string, password: string): Promise<string> {
        return this.signInUser(email, password);
    }

    /**
     * Deletes all users in the Auth emulator.
     * Only works with the Firebase emulator.
     */
    async deleteAllUsers(): Promise<void> {
        const res = await fetch(`${EMULATOR_ADMIN_URL}/projects/${PROJECT_ID}/accounts`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            const error = await res.text();
            throw new Error(`Failed to delete all users: ${error}`);
        }
    }

    async waitForFirebaseAuthEmulator(timeoutMs = 10000, intervalMs = 250): Promise<void> {
        const start = Date.now();

        console.log(`Waiting ${timeoutMs}ms for Firebase Auth emulator to be ready at ${FIREBASE_EMULATOR_HOST}...`);

        while (Date.now() - start < timeoutMs) {
            try {
                const res = await fetch(`${AUTH_EMULATOR_URL}/accounts:signUp?key=${FAKE_API_KEY}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: 'healthcheck@example.com', password: 'fakepass' }),
                });

                if (res.ok) {
                    console.log(`Firebase Auth emulator at ${FIREBASE_EMULATOR_HOST} is ready after ${Date.now() - start}ms`);
                    return; // emulator is up
                }
            } catch {
                // ignore errors; continue retrying
            }

            await new Promise((resolve) => setTimeout(resolve, intervalMs));
        }

        throw new Error(`Firebase Auth emulator at ${FIREBASE_EMULATOR_HOST} did not become ready within ${timeoutMs}ms`);
    }
}
