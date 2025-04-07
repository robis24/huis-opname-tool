<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useAuth } from "~/composables/useAuth";

const { user, loginWithGoogle } = useAuth();

onMounted(() => {
  if (user.value) {
    console.log("User already logged in:", user.value);
  }
});
</script>

<template>
  <main>
    <div v-if="!user" class="auth-container">
      <div class="login-form">
        <div class="login-form__content">
          <h2>Welkom in de Huis Opname Tool</h2>
          <Image src="/hot.svg" alt="Image" width="250" />

          <Button
            icon="pi pi-sign-in"
            label="Login met Google"
            @click="loginWithGoogle"
          />
        </div>
        <div class="light"></div>
      </div>
    </div>

    <template v-else>
      <MainMenu />
      <slot />
    </template>
    <ClientOnly>
      <div
        v-if="$pwa?.offlineReady || $pwa?.needRefresh"
        class="pwa-toast"
        role="alert"
        aria-labelledby="toast-message"
      >
        <div class="message">
          <span id="toast-message">
            {{
              $pwa.offlineReady
                ? "App ready to work offline"
                : "New content available, click on reload button to update"
            }}
          </span>
        </div>
        <div class="buttons">
          <button v-if="$pwa.needRefresh" @click="$pwa.updateServiceWorker()">
            Reload
          </button>
          <button @click="$pwa.cancelPrompt()">Close</button>
        </div>
      </div>
      <div
        v-if="
          $pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh
        "
        class="pwa-toast"
        role="alert"
        aria-labelledby="install-pwa"
      >
        <div class="message">
          <span id="install-pwa"> Install PWA </span>
        </div>
        <button @click="$pwa.install()">Install</button>
        <button @click="$pwa.cancelInstall()">Cancel</button>
      </div>
    </ClientOnly>
  </main>
</template>

<style>
.pwa-toast {
  position: fixed;
  right: 0;
  bottom: 0;
  margin: 16px;
  padding: 12px;
  border: 1px solid #8885;
  border-radius: 4px;
  z-index: 1;
  text-align: left;
  box-shadow: 3px 4px 5px 0 #8885;
  background-color: white;
}
.pwa-toast .message {
  margin-bottom: 8px;
}
.pwa-toast button {
  border: 1px solid #8885;
  outline: none;
  margin-right: 5px;
  border-radius: 2px;
  padding: 3px 10px;
}

.auth-container {
  position: fixed;
  top: 10px;
  right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.profile-pic {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.login-form {
  display: grid;
  place-items: center;
  width: 100vw;
  height: 100vh;
  position: relative;
}

.login-form__content {
  margin-top: -2em;
  align-items: center;
  display: flex;
  flex-direction: column;
  gap: 2em;
}

.light {
  position: absolute;
  width: 8em;
  border-radius: 50%;
  aspect-ratio: 1;
  background-color: white;
  filter: blur(10px);
  transform: translateY(-2em);
  animation: flikker 1s infinite alternate;
  z-index: -1;
}

@keyframes flikker {
  to {
    scale: 2;
  }
}
</style>
