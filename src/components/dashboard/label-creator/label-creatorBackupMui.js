/*eslint-disable*/
import React, { useState } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid/";
import { Button, MenuItem, Typography } from "@material-ui/core";
import Barcode from "react-barcode";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import Menu from "@material-ui/core/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import html2canvas from "html2canvas";
import Papa from "papaparse";
import "./label-creator.styles.css";
import { CloudUpload } from "@material-ui/icons";
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@material-ui/core";
import { pxToCm } from "../../../libs/utils";

const colors = [
  { value: "#000000", label: "Black" },
  { value: "#0000ff", label: "Blue" },
  { value: "#ff0000", label: "Red" },
  { value: "#808080", label: "Gray" },
  { value: "#008000", label: "Green" },
];

function LabelCreator() {
  const [anchorEl, setAnchorEl] = useState({
    lineColor: null,
    settings: null,
    font: null,
  });
  const [dimensions, setDimensions] = useState({ width: 108, height: 166 });
  const [barcodeSize, setBarcodeSize] = useState("Medium"); // Added barcode size state
  const wrapper_ref = React.useRef();
  const sizeOptions = [
    { label: "Small", width: 54, height: 96, fontSize: 4 },
    { label: "Medium", width: 108, height: 166, fontSize: 8 },
    { label: "Large", width: 168, height: 298, fontSize: 16 },
  ];

  const open = {
    color: Boolean(anchorEl.lineColor),
    settings: Boolean(anchorEl.settings),
    font: Boolean(anchorEl.font),
  };
  const [fontSize, setFontSize] = useState(8); // Initial font size

  const [settings, setSettings] = useState({
    value: Math.floor(Math.random() * 100000000).toString(),
    format: "CODE128A",
    renderer: "svg",
    width: 108 * 0.005,
    height: 166 * 0.1,
    displayValue: true,
    fontOptions: "",
    font: "monospace",
    textAlign: "center",
    textPosition: "bottom",
    textMargin: 2,
    fontSize: `${fontSize}px`,
    background: "#ffffff",
    lineColor: "#000000",
    margin: 6,
  });

  //This handler is used for textFields
  const handleClick = (selection) => (event) => {
    setAnchorEl((anchorEl) => ({
      ...anchorEl,
      [selection]: event.currentTarget,
    }));
  };

  const handleClickMenuItem = (selection, option) => {
    setSettings((settings) => ({ ...settings, [selection]: option.value }));
    setAnchorEl((anchorEl) => ({ ...anchorEl, [selection]: null }));
  };

  const handleSizeChange = (event) => {
    const selectedSize = event.target.value;
    const selectedOption = sizeOptions.find(
      (option) => option.label === selectedSize
    );
    setDimensions({
      width: selectedOption.width,
      height: selectedOption.height,
    });
    setFontSize(selectedOption.fontSize);
    setBarcodeSize(selectedSize);
    // Update settings based on selected size (adjust as needed)
    setSettings({
      ...settings,
      height: selectedOption.height * 0.1,
      width: selectedOption.width * 0.005,
      // fontSize:8
    });
  };

  const onClick = (e) => {
    const opt = {
      scale: 4,
    };
    const elem = wrapper_ref.current;

    html2canvas(elem, opt).then((canvas) => {
      const iframe = document.createElement("iframe");
      iframe.name = "printf";
      iframe.id = "printf";
      iframe.style.visibility = "hidden";
      document.body.appendChild(iframe);

      const imgUrl = canvas.toDataURL("image/jpeg", 1.0);

      const printStyle = `
        @page {
            size: ${dimensions.width}px ${dimensions.height}px;
            margin: 0;
        }
        body, html {
            margin: 0;
            padding: 0;
        }
      `;

      const style = `
        width: ${dimensions.width}px;
        height: ${dimensions.height}px;
        position: absolute;
        left: 0;
        top: 0;
      `;

      const url = `
        <html>
          <head>
            <style>${printStyle}</style>
          </head>
          <body>
            <img style="${style}" src="${imgUrl}" onload="window.print(); window.onafterprint = () => { document.body.removeChild(window.frameElement); }" />
          </body>
        </html>
      `;

      const newWin = window.frames["printf"];
      newWin.document.open();
      newWin.document.write(url);
      newWin.document.close();
    });
  };

  const [labelsAndValues, setLabelsAndValues] = useState([]);
  const [productTitle, setProductTitle] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // console.log("results-=-=-=>>", results?.data);
          // console.log("results-=-=-=>>", results?.data?.shift());
          let brandName = results?.data?.shift();
          setProductTitle(brandName?.value);
          const parsedData = results.data.map((item) => {
            return {
              label: item?.label?.trim(),
              value: item?.value?.trim(),
            };
          });
          // console.log("parsedData",parsedData)
          setLabelsAndValues(parsedData.filter((item) => item.label));
        },
      });
    }
  };

  return (
    <Container
    // style={{
    //   backgroundColor: "rgb(34 0 156 / 26%)",
    // }}
    >
      <Typography variant="h3" gutterBottom>
        Barcode Label Generator
      </Typography>

      <Grid container direction="row" spacing={2}>
        <Grid item sm={12} md={6}>
          {/* The first panel of information goes here and will at most ever take up half the screen*/}
          <Paper elevation={3}>
            <Grid container direction="row" spacing={1} style={{ padding: 8 }}>
              <Grid item xs={12}>
                <Typography variant="h5">Settings</Typography>
                <Divider />
              </Grid>
              {/* Adding toolbar for small buttons */}
              <Grid item>
                <Grid container direction="row" spacing={1}>
                  <Grid item xs={12}>
                    <Paper>
                      <ToggleButtonGroup>
                        {/* Presets button and menu */}
                        <ToggleButton
                          style={{ border: "none" }}
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          value="settings"
                          onClick={handleClick("settings")}
                        >
                          <SettingsIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>
                      {/* Barcode color button and menu */}
                      <ToggleButtonGroup>
                        <ToggleButton
                          value={settings.lineColor}
                          style={{ border: "none" }}
                          aria-label="more"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={handleClick("lineColor")}
                        >
                          <FormatColorFillIcon />
                        </ToggleButton>
                        <Menu
                          id="lineColor"
                          name="lineColor"
                          anchorEl={anchorEl.lineColor}
                          keepMounted
                          open={open.color}
                          onClose={handleClickMenuItem}
                        >
                          {colors.map((option) => (
                            <MenuItem
                              key={option.value}
                              onClick={(event) =>
                                handleClickMenuItem("lineColor", option, event)
                              }
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </ToggleButtonGroup>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
                {/* // JSX for Radio Buttons */}
                <FormControl
                  component="fieldset"
                  style={{ marginBottom: "1rem",
                    marginTop: "1rem"
                   }}
                >
                  <FormLabel component="legend">Select Size (cm)</FormLabel>
                  <RadioGroup
                    value={barcodeSize}
                    onChange={handleSizeChange}
                    row // optional, to display horizontally
                  >
                    {sizeOptions.map((option) => (
                      <FormControlLabel
                        key={option.label}
                        value={option.label}
                        control={<Radio />}
                        label={`${option.label} ${pxToCm(
                          option?.width,
                          option?.height
                        )}`}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                style={{
                  display: "flex",
                  gap: "4px",
                  justifyContent: "center",
                }}
              >
                <label htmlFor="csv-upload">
                  <input
                    style={{ display: "none" }}
                    id="csv-upload"
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    startIcon={<CloudUpload />}
                  >
                    Upload CSV
                  </Button>
                </label>
                <Button onClick={onClick} variant="contained" color="primary">
                  Print Barcode
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <div className="App">
            {/* This wrapper is important */}
            <div ref={wrapper_ref}>
              <div
                style={{
                  maxWidth: `${dimensions.width}px`,
                  maxHeight: `${dimensions.height}px`,
                  border: "1px solid #000",
                  padding: 4,
                  boxSizing: "border-box",
                  // backgroundColor: "#8278",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1px",
                }}
              >
                <span
                  style={{
                    fontWeight: "bolder",
                    fontSize: "12px",
                  }}
                >
                  {productTitle}
                </span>
                <Divider />
                <Barcode {...settings} />
                <div
                  style={{
                    fontSize: `${fontSize}px`,
                    lineHeight: "1",
                    maxWidth: `${dimensions.width - 10}px`,
                    maxHeight: `${dimensions.height - 10}px`,
                    // backgroundColor: "#982",
                  }}
                >
                  {labelsAndValues.map((item, index) => (
                    <p key={index}>
                      <strong>{item.label}</strong> : {item.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
}

export default LabelCreator;
