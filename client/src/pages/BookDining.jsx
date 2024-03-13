import React, { useState } from "react";
import styles from "./BookDining.module.css";
import { menuItems1 } from "../fooddata";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import BasicTabs from "../components/Tabs";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom"; // Import Link for navigation

export const DiningCard = ({ items }) => {
  const cartSlice = useSelector((state) => state.cart);
  const cart = cartSlice.cartItems;
  const dispatch = useDispatch();
  return (
    <div className={styles.menuItems}>
      {items.length === 0 && <p className={styles.noResult}>No items found.</p>}
      {items.map((item) => (
        <div key={item.id} className={styles.menuItem + " pb-2 h-full"}>
          <img
            src={item.image}
            alt={item.name}
            onClick={() => dispatch(addToCart(item.id))}
          />
          <div className={"p-5 flex items-start flex-col font-['Dosis']"}>
            <div className={' text-xl font-semibold font-["Dosis"] '}>
              {item.name}
            </div>
            <div className="flex justify-between w-full items-center">
              <div className="text-lg font-semibold">
              ₹{item.price.toFixed(2)}
              </div>
              {cart[item.id] ? (
                <div className=" text-2xl flex gap-2 font-semibold border-2 p-1 rounded-lg border-black">
                  <div
                    onClick={() => dispatch(removeFromCart(item.id))}
                    className="w-5"
                  >
                    -
                  </div>
                  <div>{cart[item.id] || 0}</div>
                  <div
                    className="w-5"
                    onClick={() => dispatch(addToCart(item.id))}
                  >
                    +
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => dispatch(addToCart(item.id))}
                  className="text-lg px-4 flex gap-2 font-semibold border-2 p-2 rounded-lg border-black"
                >
                  ADD
                </div>
              )}
            </div>
            {/* <button
              className={styles.remove}
              onClick={() => dispatch(removeFromCart(item.id))}
            >
              Remove
            </button> */}
          </div>
        </div>
      ))}
    </div>
  );
};

const BookDining = () => {
  const cartSlice = useSelector((state) => state.cart);
  const cart = cartSlice.cartItems;
  const totalAmount = cartSlice.totalAmount;
  console.log(cart);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  let filteredMenuItems = menuItems1.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tabs = ["Breakfast", "Lunch", "Dinner", "Dessert", "Drinks"];

  const tabItems = tabs.map((tab) =>
    filteredMenuItems.filter((item) => item.category === tab)
  );

  // const tabItems = [
  //   <DiningCard items={filteredMenuItems} />,

  // ]
  console.log(tabItems);

  return (
    <div className={styles.container}>
      <h1 className="text-3xl font-semibold pb-5 uppercase font-['Dosis']">
        Book Dining
      </h1>
      <div className={styles.options}>
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />

        <BasicTabs tabs={tabs} tabItems={tabItems} />
      </div>
      <div className="flex justify-center mt-5">
        <Link to="/dining/cart" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Go to Cart
        </Link>
      </div>
    </div>
  );
};

export default BookDining;
