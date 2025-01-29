import React from "react";

const PrivateRoute = ({ role, allowedRoles, children }) => {
  if (!allowedRoles.includes(role)) {
    return (
      <div style={styles.container}>
        <h1 style={styles.message}>Nemate pristup ovoj stranici!</h1>
      </div>
    );
  }

  return children;
};

// Definisanje stilova kao JavaScript objekat
const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "50vh", // Visina kontejnera da poruka bude vertikalno centrirana

  },
  message: {
    textAlign: "center",
    color: "red",
    marginTop: "20px", // Povećava marginu iznad poruke
    padding: "20px",
    borderRadius: "10px",
    backgroundColor: "rgba(0, 0, 0, 0.8)", // Tamnija crna pozadina sa većom transparentnošću
    display: "inline-block",
  },
};

export default PrivateRoute;
