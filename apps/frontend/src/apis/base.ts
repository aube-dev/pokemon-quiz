import { Api } from "@/core/api/Api";

export const api = new Api<{ error: string }>({
  baseUrl: undefined, // TODO: 배포 시 실제 백엔드 주소로 연결
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
});
