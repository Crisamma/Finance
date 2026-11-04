import { createBrowserClient } from "@supabase/ssr";

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

console.log(
  "URL:",
  process.env.NEXT_PUBLIC_SUPABASE_URL
);

console.log(
  "KEY:",
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ? "Presente" : "Assente"
);