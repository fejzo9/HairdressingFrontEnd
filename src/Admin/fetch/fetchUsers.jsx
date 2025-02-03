export const fetchUsers = async () => {
  try {
      const token = localStorage.getItem("token"); // ✅ Dohvatanje tokena

      const response = await fetch("http://localhost:8080/users", {
          method: "GET",
          headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`, // ✅ Slanje JWT tokena
          },
      });

      if (!response.ok) {
          throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      return data;
  } catch (error) {
      console.error("Error fetching users:", error);
      return [];
  }
};
