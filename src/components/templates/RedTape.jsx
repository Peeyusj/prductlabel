import React from 'react';
import barcodeImg from "../../assets/img/brcd.png"

const RedTape = () => {
  return (
    <div style={styles.container}>
      <div style={styles.labelContainer}>
        <div style={styles.header}>
          <img src="logo.png" alt="RedTape Logo" style={styles.logo} />
          <h1 style={styles.title}><em>REDTAPE</em></h1>
        </div>
        <p><span style={styles.bold}>Name of Commodity:</span> Mens T Shirt</p>
        <div><span style={styles.bold}>Style:</span> RHP1215</div>
        <div><span style={styles.bold}>Color:</span> WHITE</div>
        <div><span style={styles.bold}>Size:</span> 1.14 m (44)</div>
        <p><span style={styles.bold}>Quantity:</span> 1 Number</p>
        <div><span style={styles.bold}>MRP ₹:</span> 3,599.00 (Incl. of All Taxes)</div>
        <div><span>Month and Year of Manufacture:</span> DECEMBER 2023</div>
        <div><span style={styles.bold}>Country of Origin:</span> Bangladesh</div>
        <div style={styles.barcode}>
          <img src={barcodeImg} alt="Barcode" style={styles.barcodeImage} />
          <p>8903144970777</p>
        </div>
        <div style={styles.footer}>
          <div><span style={styles.bold}>Imported by:</span> REDTAPE LIMITED</div>
          <div>Plot No.8, Sector 90, Noida - 201301, Uttar Pradesh</div>
          <div><span style={styles.bold}>Address:</span> 'Same as above'</div>
          <div><span style={styles.bold}>Telephone:</span> +91 7836850082</div>
          <div><span style={styles.bold}>Email:</span> <span>customercare@redtapeindia.com</span></div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    margin: '20px',
  },
  labelContainer: {
    border: '1px solid #000',
    padding: '15px',
    width: '300px',
  },
  header: {
    borderBottom: '3px solid #000',
    margin: '0 6px',
  },
  logo: {
    width: '50px',
  },
  title: {
    display: 'inline',
    verticalAlign: 'middle',
    fontFamily: "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
    color: 'red',
  },
  bold: {
    fontWeight: 'bold',
  },
  barcode: {
    textAlign: 'center',
    marginTop: '10px',
  },
  barcodeImage: {
    height: '50px',
    width: '260px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '0.8em',
  },
};

export default RedTape;
