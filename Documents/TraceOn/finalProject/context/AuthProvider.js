import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

// Supabase messages are technical; map the common ones to something a student
// can act on.
function friendlyError(message = "") {
  const text = message.toLowerCase();

  if (text.includes("database error saving new user")) {
    return "TraceOn only accepts @cvsu.edu.ph email addresses.";
  }
  if (text.includes("already registered") || text.includes("already exists")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (text.includes("invalid login credentials")) {
    return "Wrong email or password.";
  }
  if (text.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (text.includes("password should be at least")) {
    return "Password must be at least 8 characters.";
  }
  if (text.includes("rate limit") || text.includes("too many")) {
    return "Too many attempts. Wait a minute and try again.";
  }
  return message || "Something went wrong. Please try again.";
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the saved session on launch, then follow sign-in/sign-out events.
  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data ? data.session ?? null : null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession ?? null);
      },
    );

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const userId = session?.user?.id;

  // Profile row is created by a database trigger on signup.
  // If it doesn't exist, create it automatically.
  useEffect(() => {
    if (!userId) {
      setProfile(null);
      return;
    }

    let active = true;

    async function ensureProfile() {
      // First try to fetch existing profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (active && data) {
        setProfile(data);
        return;
      }

      // If profile doesn't exist, create it
      const { data: sessionData } = await supabase.auth.getSession();
      const userMeta = sessionData?.session?.user?.user_metadata || {};
      const email = sessionData?.session?.user?.email || "";

      const { data: newProfile, error: insertError } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          full_name: userMeta.full_name || email.split("@")[0] || "User",
          email: email,
          program: userMeta.program || null,
          role: "student",
        })
        .select()
        .single();

      if (active && newProfile) {
        setProfile(newProfile);
      }
    }

    ensureProfile();

    return () => {
      active = false;
    };
  }, [userId]);

  const signIn = useCallback(async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    if (error) throw new Error(friendlyError(error.message));
  }, []);

  const signUp = useCallback(async ({ fullName, email, program, password }) => {
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith("@cvsu.edu.ph")) {
      throw new Error("Use your @cvsu.edu.ph email address.");
    }
    if (fullName.trim().length < 2) {
      throw new Error("Enter your full name.");
    }
    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          program: program.trim() || null,
        },
      },
    });

    if (error) throw new Error(friendlyError(error.message));

    // With email confirmation disabled Supabase signs the user in right away.
    // If it is enabled, data.session is null and the app waits for a click.
    const sessionExists = data && data.session ? true : false;
    return { needsConfirmation: !sessionExists };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({ session, profile, loading, signIn, signUp, signOut }),
    [session, profile, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return context;
}
