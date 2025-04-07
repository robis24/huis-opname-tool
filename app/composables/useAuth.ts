import { ref } from "vue";
import { useRouter } from "nuxt/app";
import { auth, signInWithPopup, signOut } from "~/firebase";
import {
  onAuthStateChanged,
  type User,
  GoogleAuthProvider,
} from "firebase/auth";

const user = ref<User | null>(null);
const error = ref<string | null>(null);

export function useAuth() {
  const router = useRouter();

  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    prompt: "select_account",
  });

  onAuthStateChanged(auth, (currentUser) => {
    user.value = currentUser;
    console.log("User state changed:", currentUser);
  });

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      user.value = result.user;
      console.log("Logged in user:", user.value);
      router.push("/");
    } catch (err: any) {
      error.value = err.message;
      console.error("Login failed:", err);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      user.value = null;
      console.log("User logged out");
      router.push("/");
    } catch (err: any) {
      error.value = err.message;
      console.error("Logout failed:", err);
    }
  };

  return {
    user,
    error,
    loginWithGoogle,
    logout,
  };
}
