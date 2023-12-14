export default function useAuth() {
  const authToken = localStorage.getItem("token");
  console.log("auth token", authToken)
  const isAuthenticated = authToken && authToken !== "";

  return {
    isAuthenticated,
  };
}
