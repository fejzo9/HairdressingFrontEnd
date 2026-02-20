import API_BASE_URL from '../../config/api';
export const fetchAdmins = async () => {
    try {
        const token = localStorage.getItem("token"); // ✅ Dohvatanje tokena
  
        const response = await fetch(`${API_BASE_URL}/admins`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`, // ✅ Slanje JWT tokena
            },
        });
  
        if (!response.ok) {
            throw new Error("Failed to fetch admins");
        }
  
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching admins:", error);
        return [];
    }
  };
  