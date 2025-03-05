import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, FormControl } from 'react-bootstrap';
import { fetchData, updateData } from '../API/ApiService';

const TicketManagement = () => {
  const [accounts, setAccounts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await fetchData('accounts');
        setAccounts(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tài khoản:', error);
      }
    };
    loadAccounts();
  }, []);
  

  const filterTickets = (ticket) => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      ticket.id.toLowerCase().includes(lowerSearchTerm) ||
      ticket.movie.toLowerCase().includes(lowerSearchTerm) ||
      ticket.cinema.toLowerCase().includes(lowerSearchTerm) ||
      ticket.seats.toLowerCase().includes(lowerSearchTerm) ||
      ticket.date.toLowerCase().includes(lowerSearchTerm) ||
      ticket.startTime.toLowerCase().includes(lowerSearchTerm) ||
      ticket.endTime.toLowerCase().includes(lowerSearchTerm)
    );
  };


  const togglePaymentStatus = async (accountId, ticketId, status) => {
    try {
      await updateData('accounts', accountId, { 
        tickets: accounts.find(account => account.id === accountId).tickets.map(ticket => 
          ticket.id === ticketId ? { ...ticket, status: status === 'active' ? 'inactive' : 'active' } : ticket
        )
      });
      
    
      setAccounts(accounts.map(account => 
        account.id === accountId 
          ? { ...account, tickets: account.tickets.map(ticket => 
              ticket.id === ticketId ? { ...ticket, status: status === 'active' ? 'inactive' : 'active' } : ticket
            ) } 
          : account
      ));
    } catch (error) {
      console.error('Lỗi khi thay đổi trạng thái thanh toán:', error);
    }
  };


  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', padding: '20px' }}>
      <h2 style={{ color: '#343a40' }}>Quản Lý Vé</h2>
      
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Tìm kiếm theo ID vé, Tên phim, Rạp, Ghế, Ngày"
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>
      <Table striped bordered hover responsive>
        <thead className="table-dark">
          <tr>
            <th>ID Tài Khoản</th>
            <th>Tên đầy đủ</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Mã Vé</th>
            <th>Phim</th>
            <th>Rạp</th>
            <th>Ghế</th>
            <th>Ngày</th>
            <th>Thời gian</th>
            <th>Tổng giá</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            account.tickets && account.tickets.length > 0 && account.tickets.filter(filterTickets).map(ticket => (
              <tr key={ticket.id}>
                <td>{account.id}</td>
                <td>{account.full_name}</td>
                <td>{account.email}</td>
                <td>{account.phone}</td>
                <td>{ticket.id}</td>
                <td>{ticket.movie}</td>
                <td>{ticket.cinema}</td>
                <td>{ticket.seats.join(", ")}</td>
                <td>{ticket.date}</td>
                <td>{ticket.startTime} - {ticket.endTime}</td>
                <td>{formatCurrency(ticket.totalPrice)}</td>
                <td>
                  <span className={`badge ${ticket.status === 'active' ? 'bg-success' : 'bg-danger'}`}>
                    {ticket.status === 'active' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </td>
                <td>
                  <Button
                    variant={ticket.status === 'active' ? 'outline-danger' : 'outline-success'}
                    onClick={() => togglePaymentStatus(account.id, ticket.id, ticket.status)}
                  >
                    Chuyển trạng thái thanh toán
                  </Button>
                </td>
              </tr>
            ))
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TicketManagement;
