import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

function TicketPricing() {
  const [ticketPricing, setTicketPricing] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/ticketPricing')
      .then(response => response.json())
      .then(data => setTicketPricing(data))
      .catch(error => console.error('Lỗi khi tải dữ liệu giá vé:', error));
  }, []);

  return (
    <Container className="my-5">
      <Row>
        <Col md={8} className="mx-auto">
          <Card className="shadow-lg">
            <Card.Body>
              <Card.Title className="text-center">Giá Vé Rạp Chiếu Phim</Card.Title>
              <Card.Subtitle className="mb-4 text-center text-muted">
                Chọn loại vé phù hợp với bạn
              </Card.Subtitle>

              <Row>
                {ticketPricing.map(ticket => (
                  <Col md={4} key={ticket.id}>
                    <Card className="mb-4">
                      <Card.Body>
                        <Card.Title>{ticket.type}</Card.Title>
                        <Card.Text>
                          <strong>Giá:</strong> {ticket.price.toLocaleString()} VNĐ
                        </Card.Text>
                        <ListGroup variant="flush">
                          <ListGroup.Item>
                            <strong>Quy định:</strong>
                          </ListGroup.Item>
                          <ul>
                            {ticket.rules.map((rule, index) => (
                              <li key={index}>{rule}</li>
                            ))}
                          </ul>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <Card className="mt-5">
                <Card.Body>
                  <Card.Title className="text-center">Quy Định Về Phim</Card.Title>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Phim cho Người Lớn (18+):</strong> Những bộ phim có yếu tố bạo lực, kinh dị hoặc chủ đề nhạy cảm. Không phù hợp cho trẻ em và thanh thiếu niên.
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phim cho Trẻ Em:</strong> Các bộ phim hoạt hình, gia đình. Chỉ dành cho trẻ em dưới 12 tuổi.
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <strong>Phim Sinh Viên / Học Sinh:</strong> Các bộ phim nhẹ nhàng, phù hợp cho học sinh và sinh viên. Những bộ phim này thường có tính giáo dục cao.
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default TicketPricing;
