import React, { useEffect, useState } from "react";
import "../../CSS/Footer.css";

function CinemaInfo() {
  const [cinema, setCinema] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/cinema/1')
      .then((response) => response.json())
      .then((data) => setCinema(data))
      .catch((error) => console.error("Lỗi khi tải dữ liệu rạp:", error));
  }, []);

  if (!cinema) {
    return <div>Đang tải thông tin rạp...</div>;
  }

  return (
    <div className="cinema-info">
      <h1>{cinema.name}</h1>
      <p>
        <strong>Địa chỉ:</strong> {cinema.address}
      </p>
      <p>
        <strong>Số điện thoại:</strong>
        <a href={`tel:${cinema.contact.phone}`}>{cinema.contact.phone}</a>
      </p>
      <p>
        <strong>Email:</strong>
        <a href={`mailto:${cinema.contact.email}`}>{cinema.contact.email}</a>
      </p>
      <p>
        <strong>Mô tả:</strong> {cinema.description}
      </p>
    </div>
  );
}

export default CinemaInfo;
