import React from "react";

export default function NotFound() {
  function handleRedirect(event) {
    event.preventDefault();
    location.href = "/chat";
  }

  return (
    <div className="not-found">
      <div>404. Pagina non trovata 😕</div>
      <div className="container-redirect-home">
        <div className="small-404">Tornare alla chat Principale?</div>
        <button onClick={handleRedirect}> Home </button>
      </div>
    </div>
  );
}
