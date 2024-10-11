import React from 'react';
import barcodeImg from "../../assets/img/brcd.png"

const Denim = () => {
  return (
    <div style={styles.label}>
      <div style={styles.barcode}>
        <img src={barcodeImg} alt="Barcode" style={styles.barcodeImg} />
      </div>
      <div style={styles.info}>
        <div style={styles.infoColumn}>
          <span>Product:</span>
          <span>Packed MM/YY:</span>
          <span>Style Code:</span>
          <span>Color:</span>
          <span>Size:</span>
          <span>Inseam Length:</span>
          <span>Waist Size:</span>
          <span>Net Qty:</span>
        </div>
        <div style={styles.infoColumn}>
          <span>DENIM PANTS</span>
          <span>5/24</span>
          <span>3YYA33D562</span>
          <span>HIDDEN UPTOWN</span>
          <span>34</span>
          <span>29 INC</span>
          <span>87-90 CM</span>
          <span>1 N</span>
        </div>
      </div>

      <div style={styles.price}>
        Maximum Retail Price:
        <br />
        <strong> Rs. 13490.00 </strong>
        <br />
        (inclusive of all taxes)
      </div>

      <div style={styles.contactInfo}>
        <div><strong>Country of Origin:</strong> TURKEY</div>
        <span>Guess? India Private Limited,</span>
        <span>Registered Office: 672 Clo Regus, Level 9,</span>
        <span>Tower A-1 Spaze I-Tech Park, Sector 49,</span>
        <span>Gurgaon, Haryana - 122018</span>
        <br />
        <strong>For customer complaints:</strong>
        <span>Tel: +91 124-4637860 / 61 / 62</span>
        <span>Email: customercare.india@guess.eu</span>
      </div>
    </div>
  );
};

const styles = {
  label: {
    border: '1px solid #000',
    padding: '10px',
    width: '300px',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  },
  barcode: {
    textAlign: 'center',
    marginBottom: '10px',
    padding: '0px 40px',
  },
  barcodeImg: {
    width: '100%',
    height: '60px',
  },
  info: {
    marginBottom: '10px',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  infoColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  price: {
    textAlign: 'center',
  },
  contactInfo: {
    fontSize: '12px',
    marginTop: '10px',
  },
};

export default Denim;
