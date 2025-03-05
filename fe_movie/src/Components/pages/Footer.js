import React, { useEffect, useState } from "react";

function Footer() {
  const [cinema, setCinema] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/cinema/1")
      .then((response) => response.json())
      .then((data) => {
        setCinema(data);
      })
      .catch((error) => console.error("Lỗi khi gọi API:", error));
  }, []);

  if (!cinema) {
    return <footer>Đang tải thông tin...</footer>;
  }

  return (
    <footer
      style={{ backgroundColor: "#222", color: "#fff", padding: "20px 0" }}
    >
      <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <h2>{cinema.name}</h2>
        <p>{cinema.address}</p>
        <p>
          Điện thoại:{" "}
          <a href={`tel:${cinema.contact.phone}`} style={{ color: "#ffc107" }}>
            {cinema.contact.phone}
          </a>
        </p>
        <p>
          Email:{" "}
          <a
            href={`mailto:${cinema.contact.email}`}
            style={{ color: "#ffc107" }}
          >
            {cinema.contact.email}
          </a>
        </p>
        <p>
          &copy; {new Date().getFullYear()} {cinema.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
