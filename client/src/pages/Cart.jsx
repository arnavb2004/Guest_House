import React, { useState } from "react";
import styles from "./BookDining.module.css";
import { menuItems1 } from "../fooddata";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../redux/cartSlice";
import { PDFDocument, rgb} from "pdf-lib"; // Import pdf-lib
import fontkit from "@pdf-lib/fontkit";
import pdfFont from "../forms/Ubuntu-R.ttf";


const Cart = () => {
  const cartSlice = useSelector((state) => state.cart);
  const cart = cartSlice.cartItems;
  const totalAmount = cartSlice.totalAmount;
  const dispatch = useDispatch();

  const isCartEmpty = Object.keys(cart).length === 0;

  const handleOrder = () => {
    alert(`Total Amount: ₹${totalAmount.toFixed(2)}`);
    // Further actions like sending the order to a server or resetting the cart can be performed here.
  };
  
  const handleGetReceipt = async () => {
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage();
      const { width, height } = page.getSize();
  
      const fontBytes = await fetch(pdfFont).then((res) => res.arrayBuffer());
      pdfDoc.registerFontkit(fontkit);
      const ubuntuFont = await pdfDoc.embedFont(fontBytes, { subset: true });
  
      const logoUrl = `${process.env.PUBLIC_URL}/pdf-images/IIT-logo.png`;
      const logoImageBytes = await fetch(logoUrl).then(res => res.arrayBuffer());
      const logoImage = await pdfDoc.embedPng(logoImageBytes);
      const logoHeight = 50;
      const logoWidth = (logoImage.width / logoImage.height) * logoHeight;
  
      // Add logo to the top-left corner of the page
      page.drawImage(logoImage, {
        x: 50,
        y: height - logoHeight - 30,
        width: logoWidth,
        height: logoHeight,
      });
  
      // Add institution name to the top-right corner
      page.drawText("IIT Ropar", {
        x: width - 150,
        y: height - 50,
        size: 20,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
      });
      
      // Add food receipt text in bold
      const receiptText = "Food Receipt";
      page.drawText(receiptText, {
        x: width / 2 - 70,
        y: height - logoHeight - 30 - 20, // Adjust position as needed
        size: 24,
        font: ubuntuFont,
        color: rgb(0, 0, 0),
        bold: true,
      });
      
      // Table setup
      const tableTop = height - 150;
      const columnPositions = [50, 200, 300, 400, 500]; // Adjust based on your needs
      const rowHeight = 20;
  
      // Draw table headers
      page.drawText("Item Name", { x: columnPositions[0], y: tableTop, size: 12, font: ubuntuFont });
      page.drawText("Quantity", { x: columnPositions[1], y: tableTop, size: 12, font: ubuntuFont });
      page.drawText("Price", { x: columnPositions[2], y: tableTop, size: 12, font: ubuntuFont });
      page.drawText("Total", { x: columnPositions[3], y: tableTop, size: 12, font: ubuntuFont });
  
      // Draw line under headers
      page.drawLine({
        start: { x: 50, y: tableTop - 15 },
        end: { x: width - 50, y: tableTop - 15 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
  
      let currentRowY = tableTop - 15 - rowHeight;
  
      // List items in table
      Object.keys(cart).forEach(itemId => {
        const item = menuItems1.find(item => item.id === parseInt(itemId));
        const itemTotal = (item.price * cart[item.id]).toFixed(2);
  
        page.drawText(item.name, { x: columnPositions[0], y: currentRowY, size: 10, font: ubuntuFont });
        page.drawText(cart[item.id].toString(), { x: columnPositions[1], y: currentRowY, size: 10, font: ubuntuFont });
        page.drawText(`₹${item.price.toFixed(2)}`, { x: columnPositions[2], y: currentRowY, size: 10, font: ubuntuFont });
        page.drawText(`₹${itemTotal}`, { x: columnPositions[3], y: currentRowY, size: 10, font: ubuntuFont });
  
        // Draw a line after each item row (optional, for better separation)
        currentRowY -= rowHeight; // Move to next row position
      });
  
      // Total Amount
      currentRowY -= rowHeight; // Extra space before total
      page.drawText(`Total Amount: ₹${totalAmount.toFixed(2)}`, {
        x: columnPositions[0],
        y: currentRowY,
        size: 12,
        font: ubuntuFont,
        color: rgb(0.95, 0.1, 0.1), // Using a different color for emphasis
      });
  
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (error) {
      console.error("Error generating receipt:", error);
      alert("Error generating receipt. Please try again later.");
    }
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
              <button onClick={handleGetReceipt} className={styles.button + " "}>
                Get Receipt
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
