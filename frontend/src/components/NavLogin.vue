<template>
    <div>
      <div v-if="user" class="flex items-center gap-2">
        <span class="text-sm text-gray-800">
          {{ user.displayName || user.email }}
        </span>
        <button @click="logout" class="text-sm text-red-600 hover:underline">
          Logout
        </button>
      </div>
  
      <button
        v-else
        @click="isModalOpen = true"
        data-testid="nav-login-button"
        class="text-white bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
      >
        Login
      </button>
  
      <!-- Modal -->
      <div
        v-if="isModalOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      >
        <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm relative">
          <h2 class="text-xl font-semibold mb-4 text-center">
            {{ isRegister ? 'Register' : 'Login' }}
          </h2>
  
          <input
            v-model="email"
            type="email"
            placeholder="Email"
            class="w-full mb-3 p-2 border rounded"
          />
          <input
            v-model="password"
            type="password"
            placeholder="Password"
            class="w-full mb-3 p-2 border rounded"
          />
  
          <button
            @click="isRegister ? register() : login()"
            data-testid="modal-submit-button"
            class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {{ isRegister ? 'Create Account' : 'Login' }}
          </button>
  
          <button
            @click="loginWithGoogle"
            class="w-full mt-3 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Sign in with Google
          </button>
  
          <p v-if="error" class="text-red-600 text-sm mt-2 text-center">{{ error }}</p>
  
          <p class="text-sm mt-4 text-center">
            {{ isRegister ? 'Already have an account?' : "Don't have an account?" }}
            <a href="#" @click.prevent="isRegister = !isRegister" class="text-blue-600 ml-1">
              {{ isRegister ? 'Login' : 'Register' }}
            </a>
          </p>
  
          <button
            @click="isModalOpen = false"
            data-testid="modal-close-button"
            class="absolute top-2 right-2 text-gray-500 hover:text-black"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { auth } from '@/firebase';
  import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    onAuthStateChanged,
    type User
  } from '@firebase/auth';
  
  const isModalOpen = ref(false);
  const isRegister = ref(false);
  const email = ref('');
  const password = ref('');
  const error = ref('');
  const user = ref<User | null>(null);
  
  onMounted(() => {
    onAuthStateChanged(auth, (currentUser) => {
      user.value = currentUser;
    });
  });
  
  const login = async () => {
    error.value = '';
    try {
      await signInWithEmailAndPassword(auth, email.value, password.value);
      isModalOpen.value = false;
    } catch (err: any) {
      error.value = err.message;
    }
  };
  
  const register = async () => {
    error.value = '';
    try {
      await createUserWithEmailAndPassword(auth, email.value, password.value);
      isModalOpen.value = false;
    } catch (err: any) {
      error.value = err.message;
    }
  };
  
  const loginWithGoogle = async () => {
    error.value = '';
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      isModalOpen.value = false;
    } catch (err: any) {
      error.value = err.message;
    }
  };
  
  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  </script>
  