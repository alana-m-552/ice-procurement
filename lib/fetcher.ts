export const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body?.error || "Request failed") as Error & {
      status?: number;
    };
    error.status = res.status;
    throw error;
  }
  return res.json();
};
