import React, { useState } from 'react';
import styles from './BookDining.module.css';
import { menuItems1 } from "../fooddata";

const BookDining = () => {
  const [cart, setCart] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');


  const handleAddToCart = (itemId) => {
    const updatedCart = { ...cart };
    updatedCart[itemId] = (updatedCart[itemId] || 0) + 1;
    setCart(updatedCart);

    const item = menuItems1.find((item) => item.id === itemId);
    setTotalAmount((prevTotal) => prevTotal + item.price);
  };

  const handleRemoveFromCart = (itemId) => {
    if (cart[itemId] > 0) {
      const updatedCart = { ...cart };
      updatedCart[itemId] -= 1;
      if (updatedCart[itemId] === 0) {
        delete updatedCart[itemId];
      }
      setCart(updatedCart);

      const item = menuItems1.find((item) => item.id === itemId);
      setTotalAmount((prevTotal) => prevTotal - item.price);
    }
  };

  const handleOrder = () => {
    alert(`Total Amount: $${totalAmount.toFixed(2)}`);
    // Further actions like sending the order to a server or resetting the cart can be performed here.
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMenuItems = menuItems1.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isCartEmpty = Object.keys(cart).length === 0;

  return (
    <div className={styles.container}>
      <h1>Book Dining</h1>
      <div className={styles.options}>
        <h2>Breakfast</h2>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {filteredMenuItems.length === 0 && <p className={styles.noResult}>No items found.</p>}
        <div className={styles.menuItems}>
          {filteredMenuItems.map((item) => (
            <div key={item.id} className={styles.menuItem}>
              <img src={item.image} alt={item.name} onClick={() => handleAddToCart(item.id)} />
              <div className={styles.itemInfo}>
                <p className={styles.price}>Price: ${item.price.toFixed(2)}</p>
                <p className={styles.count}>Count: {cart[item.id] || 0}</p>
                <button className={styles.remove} onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.cart}>
        <h2>Cart</h2>
        {isCartEmpty ? (
          <>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
          </table>
          <p className={styles.noResult}>Cart is empty.</p>
        </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cart).map((itemId, index) => {
                  const item = menuItems1.find((item) => item.id === parseInt(itemId));
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${(item.price * cart[item.id]).toFixed(2)}</td>
                      <td>{cart[item.id]}</td>
                      <td><button className={styles.remove} onClick={() => handleRemoveFromCart(item.id)}>Remove</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.total}>Total: ${totalAmount.toFixed(2)}</p>
            <button onClick={handleOrder} className={styles.button}>Order</button>
          </>
        )}
      </div>
    </div>
  );
};

export default BookDining;
