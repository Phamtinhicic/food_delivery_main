import React, { useEffect, useState, useContext } from 'react';
import './Users.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { StoreContext } from '../../context/StoreContext';

const Users = ({ url }) => {
  const [users, setUsers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user'
  });

  const { token } = useContext(StoreContext);

  const fetchAllUsers = async () => {
    if (!token) {
      console.log('No token available for fetching users');
      return;
    }
    try {
      const response = await axios.get(url + '/api/user/all', {
        headers: { token }
      });
      if (response.data.success) {
        setUsers(response.data.data);
      } else {
        console.error('Failed to fetch users:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setNewUser(data => ({ ...data, [name]: value }));
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Vui lòng đăng nhập trước khi tạo tài khoản');
      return;
    }
    
    if (newUser.password.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    try {
      console.log('Creating user with token:', token ? 'Token exists' : 'No token');
      const response = await axios.post(url + '/api/user/create-by-admin', newUser, {
        headers: { token }
      });
      
      console.log('Response:', response.data);
      
      if (response.data.success) {
        toast.success(`Đã tạo tài khoản ${newUser.role} thành công!`);
        setShowAddModal(false);
        setNewUser({ name: '', email: '', password: '', role: 'user' });
        fetchAllUsers();
      } else {
        toast.error(response.data.message || 'Lỗi khi tạo tài khoản');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tạo tài khoản');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!token) {
      toast.error('Vui lòng đăng nhập trước');
      return;
    }
    
    if (!window.confirm(`Bạn có chắc muốn xóa user "${userName}"?`)) {
      return;
    }

    try {
      const response = await axios.post(url + '/api/user/delete', { id: userId }, {
        headers: { token }
      });
      if (response.data.success) {
        toast.success('Đã xóa user thành công');
        fetchAllUsers();
      } else {
        toast.error(response.data.message || 'Không thể xóa user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi xóa user');
    }
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'admin': return 'role-admin';
      case 'restaurant': return 'role-restaurant';
      default: return 'role-user';
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'admin': return '👑';
      case 'restaurant': return '🍽️';
      default: return '👤';
    }
  };

  return (
    <div className='users add'>
      <div className="users-header">
        <h2>👥 Quản lý Users</h2>
        <button className='btn-add-user' onClick={() => setShowAddModal(true)}>
          ➕ Tạo tài khoản mới
        </button>
      </div>

      <div className="users-stats">
        <div className="stat-card">
          <div className="stat-icon">👑</div>
          <div className="stat-info">
            <div className="stat-label">Admin</div>
            <div className="stat-value">{users.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-info">
            <div className="stat-label">Restaurant</div>
            <div className="stat-value">{users.filter(u => u.role === 'restaurant').length}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">👤</div>
          <div className="stat-info">
            <div className="stat-label">Customer</div>
            <div className="stat-value">{users.filter(u => u.role === 'user').length}</div>
          </div>
        </div>
      </div>

      <div className="users-list-table">
        <div className="users-table-header">
          <b>Icon</b>
          <b>Name</b>
          <b>Email</b>
          <b>Role</b>
          <b>Created</b>
          <b>Action</b>
        </div>
        {users.map((user, index) => (
          <div key={index} className='users-table-row'>
            <p className="user-icon">{getRoleIcon(user.role)}</p>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <p>
              <span className={`role-badge ${getRoleBadgeClass(user.role)}`}>
                {user.role}
              </span>
            </p>
            <p>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
            <p 
              onClick={() => handleDeleteUser(user._id, user.name)} 
              className='cursor-pointer delete-btn'
            >
              🗑️ Xóa
            </p>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>➕ Tạo tài khoản mới</h3>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddUser} className="modal-form">
              <div className="form-group">
                <label>Tên người dùng *</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Nhập tên"
                  value={newUser.name}
                  onChange={onChangeHandler}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={newUser.email}
                  onChange={onChangeHandler}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Mật khẩu * (tối thiểu 8 ký tự)</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Nhập mật khẩu"
                  value={newUser.password}
                  onChange={onChangeHandler}
                  required
                  minLength={8}
                />
              </div>
              
              <div className="form-group">
                <label>Vai trò *</label>
                <select
                  name="role"
                  value={newUser.role}
                  onChange={onChangeHandler}
                  required
                >
                  <option value="user">👤 Customer (Khách hàng)</option>
                  <option value="restaurant">🍽️ Restaurant (Nhà hàng)</option>
                  <option value="admin">👑 Admin (Quản trị viên)</option>
                </select>
              </div>
              
              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={() => setShowAddModal(false)}>
                  Hủy
                </button>
                <button type="submit" className="btn-submit">
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
