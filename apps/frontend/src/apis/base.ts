import { Api } from "@/core/api/Api";
import { toast } from "sonner";

export const api = new Api<{ error: string }>({
  baseUrl: import.meta.env.PROD
    ? "https://pokemon-quiz-gbkq.onrender.com"
    : undefined,
  hooks: {
    beforeServerError: (error) => {
      if (error.serverError) {
        error.message = error.serverError?.error;
      }
      return error;
    },
  },
  fetchOptions: {
    credentials: "include",
  },
  mutationOptions: {
    onError: (error) => {
      toast.error(error.message);
    },
  },
});
