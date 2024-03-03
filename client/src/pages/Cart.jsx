import React, { useState } from "react";
import styles from "./BookDining.module.css";
import { menuItems1 } from "../fooddata";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";

const Cart = () => {

  const cartSlice = useSelector((state) => state.cart);
  console.log(cartSlice);
  const cart = cartSlice.cartItems;
  const totalAmount = cartSlice.totalAmount;
  const dispatch = useDispatch();

  const isCartEmpty = Object.keys(cart).length === 0;

  const handleOrder = () => {
    alert(`Total Amount: ₹${totalAmount.toFixed(2)}`);
    // Further actions like sending the order to a server or resetting the cart can be performed here.
  };

  return (
    <div>
      <div className={styles.cart + ' font-["Dosis"]'}>
        <h2 className='text-3xl font-["Dosis"] text-center pb-2'>CART</h2>
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
            <p className={styles.noResult }>Cart is empty.</p>
          </>
        ) : (
          <div className="">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(cart).map((itemId, index) => {
                  const item = menuItems1.find(
                    (item) => item.id === parseInt(itemId)
                  );
                  return (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>₹{(item.price * cart[item.id]).toFixed(2)}</td>
                      <td className="">{cart[item.id]}</td>
                      <td className="w-1/4">
                        <button
                          className={styles.add + " mr-16"}
                          onClick={() => dispatch(addToCart(item.id))}
                        >
                          Add
                        </button>
                        <button
                          className={styles.remove}
                          onClick={() => dispatch(removeFromCart(item.id))}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className={styles.total + ' font-["Dosis"] text-xl'}>AMOUNT : ₹{totalAmount.toFixed(2)}</p>
            <div className="flex justify-center ">
              <button onClick={handleOrder} className={styles.button + " "}>
                Order
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
