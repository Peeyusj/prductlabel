/*eslint-disable*/
import React, { useState, useEffect, useRef } from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid/";
import Textfield from "@material-ui/core/TextField";
import {
  MenuItem,
  Select,
  Slider,
  TextField,
  Typography,
} from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Barcode from "react-barcode";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import FormatAlignLeftIcon from "@material-ui/icons/FormatAlignLeft";
import FormatAlignCenterIcon from "@material-ui/icons/FormatAlignCenter";
import FormatAlignRightIcon from "@material-ui/icons/FormatAlignRight";
import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatColorFillIcon from "@material-ui/icons/FormatColorFill";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import VerticalAlignTopIcon from "@material-ui/icons/VerticalAlignTop";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Menu from "@material-ui/core/Menu";
import SettingsIcon from "@material-ui/icons/Settings";
import TextFormatIcon from "@material-ui/icons/TextFormat";
import html2canvas from "html2canvas";
import Papa from "papaparse";

import "./label-creator.styles.css";
import { Label } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    "& .MuiTextField-root": {
      margin: theme.spacing(2),
      width: "25h",
    },
  },
  header: {
    fontSize: "24px",
  },
}));

const codeFormats = [
  { value: "CODE128A", label: "Code 128A" },
  { value: "CODE128B", label: "Code 128B" },
  { value: "CODE128C", label: "Code 128C" },
  { value: "CODE39", label: "Code 39" },
  { value: "UPC", label: "UPC" },
  { value: "MSI", label: "MSI" },
  { value: "IFT14", label: "ITF-14" },
  { value: "EAN13", label: "EAN-13" },
  { value: "EAN8", label: "EAN-8" },
  { value: "EAN5", label: "EAN-5" },
];

const colors = [
  { value: "#ffffff", label: "White" },
  { value: "#000000", label: "Black" },
  { value: "#0000ff", label: "Blue" },
  { value: "#ff0000", label: "Red" },
  { value: "#808080", label: "Gray" },
  { value: "#008000", label: "Green" },
];

const settingsMenuItems = [
  { value: "value", label: "Setting1" },
  { value: "value2", label: "Setting2" },
  { value: "value3", label: "Setting3" },
];

const fontFaces = [
  { value: "monospace", label: "Monospace" },
  { value: "arial", label: "Arial" },
  { value: "calibri", label: "Calibri" },
  { value: "consolas", label: "Consolas" },
  { value: "tahoma", label: "Tahoma" },
  { value: "verdana", label: "Verdana" },
];
const labelSizes = [
  { value: "4 6", label: "4 x 6" },
  { value: "4 2", label: "4 x 2" },
  { value: "3 3", label: "3 x 3" },
  { value: "2 3", label: "2 x 3" },
  { value: "2 2", label: "2 x 2" },
  { value: "2.63 1", label: "2 5/8 x 1" },
];

const labelTypes = [
  { value: "product", label: "Product" },
  { value: "package", label: "Package" },
];

function LabelCreator() {
  const classes = useStyles();
  const [fontStyle, setFontStyle] = useState([]);
  const [anchorEl, setAnchorEl] = useState({
    lineColor: null,
    settings: null,
    font: null,
  });

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

  //This handler is used for textfields
  const handleChange = (name) => (e) => {
    setSettings((settings) => ({ ...settings, [name]: e?.target?.value }));
  };
  // This event handler will change all other items such as sliders and material-ui buttons.
  const handleChangeOther = (name) => (e, value) => {
    setSettings((settings) => ({ ...settings, [name]: value }));
  };
  //Font formatting needs to be separate because the information is stored as an array and will not be passed to the settings with a ... (spread) when calling the barcode component.
  const handleFormat = (event, newFormats) => {
    setFontStyle(newFormats);
  };

  const handleClick = (selection) => (event) => {
    setAnchorEl((anchorEl) => ({
      ...anchorEl,
      [selection]: event.currentTarget,
    }));
  };

  const handleClickMenuItem = (selection, option) => {
    //Pass the "selection" as a string and then alter the state of AnchorEl
    setSettings((settings) => ({ ...settings, [selection]: option.value }));
    setAnchorEl((anchorEl) => ({ ...anchorEl, [selection]: null }));
  };

  const toggleTextVisibility = (e) => {
    setSettings((displayValue) => ({
      ...settings,
      displayValue: !settings.displayValue,
    }));
  };

  useEffect(() => {
    //This useEffect is checked every time the fontStyle state changes.
    //If the state has an array of items in it such as, ["bold", "italics"]
    //it will join those together into one string and insert into the Settings state.
    if (fontStyle.length > 1) {
      setSettings((settings) => ({
        ...settings,
        fontOptions: fontStyle.join(" "),
      }));
    } else
      setSettings((settings) => ({
        ...settings,
        fontOptions: fontStyle.toString(),
      }));
  }, [fontStyle]);

  const [dimensions, setDimensions] = useState({ width: 108, height: 166 });
  // const [fontSize, setFontSize] = useState(8); // Initial font size
  const [barcodeSize, setBarcodeSize] = useState("Medium"); // Added barcode size state
  const wrapper_ref = React.useRef();
  const sizeOptions = [
    { label: "Small", width: 54, height: 96, fontSize: 4 },
    { label: "Medium", width: 108, height: 166, fontSize: 8 },
    { label: "Large", width: 168, height: 298, fontSize: 16 },
  ];

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
    }); //Example
  };

  // const onClick = (e) => {
  //   const opt = {
  //     scale: 4,
  //   };
  //   const elem = wrapper_ref.current;
  //   html2canvas(elem, opt).then((canvas) => {
  //     const iframe = document.createElement("iframe");
  //     iframe.name = "printf";
  //     iframe.id = "printf";
  //     iframe.height = 0;
  //     iframe.width = 0;
  //     document.body.appendChild(iframe);

  //     const imgUrl = canvas.toDataURL({
  //       format: "jpeg",
  //       quality: "1.0",
  //     });

  //     const style = `
  //           width: ${dimensions.width}px;
  //     height: ${dimensions.height}px;
  //           position:absolute;
  //           left:0:
  //           top:0;
  //       `;

  //     const url = `<img style="${style}" src="${imgUrl}"/>`;
  //     var newWin = window.frames["printf"];
  //     newWin.document.write(`<body onload="window.print()">${url}</body>`);
  //     newWin.document.close();
  //   });
  // };

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
  const [productTitle,setProductTitle]=useState("")

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        complete: (results) => {
          // console.log("results-=-=-=>>", results?.data);
          // console.log("results-=-=-=>>", results?.data?.shift());
          let brandName=results?.data?.shift()
          setProductTitle(brandName?.value)
          const parsedData = results.data.map((item) => {
            return {
              label: item?.label?.trim(),
              value: item?.value?.trim(),
            };
          });
          // console.log("parsedData",parsedData)
          setLabelsAndValues(parsedData.filter(item => item.label));
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
                        <Menu
                          id="settings"
                          anchorEl={anchorEl.settings}
                          keepMounted
                          open={open.settings}
                          onClose={handleClickMenuItem}
                        >
                          {settingsMenuItems.map((option) => (
                            <MenuItem
                              key={option.value}
                              onClick={(event) =>
                                handleClickMenuItem("settings", option, event)
                              }
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </ToggleButtonGroup>
                      <ToggleButtonGroup
                        value={fontStyle}
                        onChange={handleFormat}
                        aria-label="text formatting"
                      >
                        {/* Bold and Italic buttons */}
                        <ToggleButton
                          value="bold"
                          aria-label="bold"
                          style={{ border: "none" }}
                        >
                          <FormatBoldIcon />
                        </ToggleButton>
                        <ToggleButton
                          value="italic"
                          aria-label="italic"
                          style={{ border: "none" }}
                        >
                          <FormatItalicIcon />
                        </ToggleButton>

                        {/* Font style menu item button */}
                      </ToggleButtonGroup>
                      <ToggleButtonGroup>
                        <ToggleButton
                          style={{ border: "none" }}
                          aria-label="font-faces"
                          aria-controls="long-menu"
                          aria-haspopup="true"
                          onClick={handleClick("font")}
                        >
                          <TextFormatIcon />
                        </ToggleButton>
                        <Menu
                          name="font"
                          aria-label="font"
                          defaultValue="monospace"
                          anchorEl={anchorEl.font}
                          keepMounted
                          open={open.font}
                          onClose={handleClickMenuItem}
                        >
                          {fontFaces.map((option) => (
                            <MenuItem
                              key={option.value}
                              onClick={(event) =>
                                handleClickMenuItem("font", option, event)
                              }
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Menu>
                      </ToggleButtonGroup>

                      {/* Text alignment buttons */}
                      <ToggleButtonGroup
                        style={{ marginLeft: 1 }}
                        value={settings.textAlign}
                        exclusive
                        onChange={handleChangeOther("textAlign")}
                        aria-label="text alignment"
                      >
                        <ToggleButton
                          value="left"
                          aria-label="left aligned"
                          style={{ border: "none" }}
                        >
                          <FormatAlignLeftIcon />
                        </ToggleButton>
                        <ToggleButton
                          value="center"
                          aria-label="centered"
                          style={{ border: "none" }}
                        >
                          <FormatAlignCenterIcon />
                        </ToggleButton>
                        <ToggleButton
                          value="right"
                          aria-label="right aligned"
                          style={{ border: "none" }}
                        >
                          <FormatAlignRightIcon />
                        </ToggleButton>
                      </ToggleButtonGroup>

                      {/* Text position button (above or below barcode) */}
                      <ToggleButtonGroup
                        style={{ marginLeft: 1 }}
                        value={settings.textPosition}
                        exclusive
                        onChange={handleChangeOther("textPosition")}
                        aria-label="text alignment"
                      >
                        <ToggleButton
                          value="top"
                          aria-label="left aligned"
                          style={{ border: "none" }}
                        >
                          <VerticalAlignTopIcon />
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

                      <ToggleButtonGroup value={settings.displayValue}>
                        <ToggleButton
                          style={{ border: "none" }}
                          value="showHide"
                        >
                          {settings.displayValue ? (
                            <VisibilityOffIcon onClick={toggleTextVisibility} />
                          ) : (
                            <VisibilityIcon onClick={toggleTextVisibility} />
                          )}
                        </ToggleButton>
                      </ToggleButtonGroup>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>

              <Grid
                container
                direction="row"
                spacing={1}
                justify="space-around"
              >
                <Grid item>
                  {/* Left Mini Panel */}
                  <Grid container direction="column" spacing={3}>
                    <Grid item>
                      <Textfield
                        size="small"
                        style={{ width: "100%" }}
                        variant="outlined"
                        value={settings.value}
                        name="value"
                        label="Barcode value"
                        onChange={handleChange("value")}
                      />
                    </Grid>
                    <Grid item>
                      <Textfield
                        style={{ width: "100%" }}
                        size="small"
                        variant="outlined"
                        select
                        name="format"
                        label="Format"
                        value={settings.format}
                        onChange={handleChange("format")}
                      >
                        {codeFormats.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </Textfield>
                    </Grid>
                    {/* Put additional rows in the left mini column here
                      <Grid item> information </Grid>
                    */}
                  </Grid>
                </Grid>
                <Grid item>
                  {/* Right Mini Panel */}
                  <Grid container direction="column">
                    <Grid item>
                      <Typography id="width-label" gutterBottom>
                        Barcode Width
                      </Typography>
                      <Slider
                        id="width"
                        aria-labelledby="width-label"
                        defaultValue={settings.width}
                        marks={true}
                        min={1}
                        max={5}
                        step={1}
                        valueLabelDisplay="auto"
                        onChange={handleChangeOther("width")}
                        style={{ width: "175px" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography id="height-label" gutterBottom>
                        Barcode Height
                      </Typography>
                      <Slider
                        id="height"
                        aria-labelledby="height-label"
                        defaultValue={50}
                        step={10}
                        marks={true}
                        valueLabelDisplay="auto"
                        max={120}
                        min={10}
                        value={settings.height}
                        onChange={handleChangeOther("height")}
                        style={{ width: "175px" }}
                      />
                    </Grid>
                    <Grid item>
                      <Typography id="font-size-label" gutterBottom>
                        Font Size
                      </Typography>
                      <Slider
                        id="fontSize"
                        aria-labelledby="font-size-label"
                        defaultValue={18}
                        step={2}
                        marks={true}
                        valueLabelDisplay="auto"
                        value={settings.size}
                        max={24}
                        min={10}
                        style={{ width: "175px" }}
                        onChange={handleChangeOther("fontSize")}
                      />
                    </Grid>
                    <Grid item>
                      <Typography id="text-margin-label" gutterBottom>
                        Text Margin
                      </Typography>
                      <Slider
                        id="textMargin"
                        aria-labelledby="text-margin-label"
                        defaultValue={2}
                        step={1}
                        marks={true}
                        valueLabelDisplay="auto"
                        max={10}
                        min={0}
                        value={settings.textMargin}
                        style={{ width: "175px" }}
                        onChange={handleChangeOther("textMargin")}
                      />
                    </Grid>
                    <Grid item>
                      <Typography id="margin-label" gutterBottom>
                        Margin Size
                      </Typography>
                      <Slider
                        id="margin"
                        aria-labelledby="margin-label"
                        defaultValue={10}
                        step={5}
                        marks={true}
                        valueLabelDisplay="auto"
                        max={25}
                        min={5}
                        value={settings.margin}
                        style={{ width: "175px" }}
                        onChange={handleChangeOther("margin")}
                      />
                    </Grid>
                    {/* Put additional rows in the right mini column here
                      <Grid item> information </Grid>
                    */}
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item>
          <div className="App">
            {/* Input fields for dimensions */}
            {/* Select for size */}
            <Label>Select Size</Label>
            <Select
              value={barcodeSize}
              onChange={handleSizeChange}
              style={{
                marginBottom: "1rem",
              }}
            >
              {sizeOptions.map((option) => (
                <MenuItem key={option.label} value={option.label}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>

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
                  {/* <p>Product: DENIM PANTS</p>
                  <p>Packed MM/YY: 5/24</p>
                  <p>Style Code: 3YYA33D5264</p>
                  <p>
                    MRP:
                    <strong>Rs. 13490.00</strong>
                  </p> */}
                  {labelsAndValues.map((item, index) => (
                    <p key={index}>
                      <strong>
                      {item.label}
                      </strong>{" "}
                      : {item.value}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <button
              onClick={onClick}
              style={{
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Print Barcode
            </button>
          </div>
        </Grid>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
      </Grid>
    </Container>
  );
}

export default LabelCreator;
