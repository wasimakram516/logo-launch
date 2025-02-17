export const fetchLogos = async () => {
    const res = await fetch("/api/logos");
    const data = await res.json();
    return data.success ? data.data : [];
  };
  
  export const addLogo = async (logoData) => {
    const res = await fetch("/api/logos", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(logoData),
    });
    return res.json();
  };
  
  export const updateLogo = async (id, logoData) => {
    const res = await fetch(`/api/logos/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify(logoData),
    });
    return res.json();
  };
  
  export const deleteLogo = async (id) => {
    const res = await fetch(`/api/logos/${id}`, { 
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });
    return res.json();
  };
  