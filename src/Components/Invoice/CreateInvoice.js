import { Button, Container, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import InputLabel from "@mui/material/InputLabel";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import Spinner from "../Spinner/Spinner";
import { CreateInvoiceRight } from "./CreateInvoiceRight";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Invoice";
import { GET_CLIENTS, GET_INVOICE } from "../../Store/Action_Constants";
import { useNavigate, useParams } from "react-router-dom";
import swal from "sweetalert";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import moment from "moment";
import { toast } from "react-toastify";
const theme = createTheme();
export const CreateInvoice = () => {
  let currentDate = moment(new Date()).format("MMM DD YYYY");
  const dispatch = useDispatch();
  const [invoiceDate, setInvoiceDate] = React.useState(currentDate);
  const [dueDate, setDueDate] = React.useState("");
  const [isTaskToUpdate, setIsTaskToUpdate] = useState(false);
  const [shareInvoiceWith, setShareInvoiceWith] = useState("");
  const [indexOfTaskToUpdate, setIndexOfTaskToUpdate] = useState();
  const [show_sender_bank_details, set_show_sender_bank_details] =
    useState(true);
  const [isInvalidDate, setIsInvalidDate] = useState(true);

  const [error, setError] = React.useState({
    studentname: "",
    duration: "",
  });

  const { clients } = useSelector((state) => state.clients);
  const { invoiceCreating, invoiceToUpdate } = useSelector(
    (state) => state.invoices
  );
  const [selectedClient, setSelectedClient] = React.useState({
    id: "",
    index: "",
    name: "",
    companyName: "",
  });

  const [selectedValues, setSelectedValues] = useState({
    studentname: "",
    duration: "",
  });

  const [taskInfo, setTaskInfo] = React.useState({
    taskName: "",
    hourly_units_worked: "",
    totalPrice: "",
    type: "",
    number_of_hours: "",
  });

  const [tasks, setTasks] = React.useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [currencyType, setCurrencyType] = useState("");
  const [currency_symbol, set_currency_symbol] = useState("");
  const navigate = useNavigate();

  const handleDateChange = (newValue) => {
    setInvoiceDate(newValue);
    if (newValue.diff(dueDate, "hour") >= 0) {
      setDueDate(null);
      setIsInvalidDate(true);
    }
  };

  const { invoiceId } = useParams();
  const handleDueDateChange = (newValue) => {
    setDueDate(newValue);
    setIsInvalidDate(false);
  };

  const isInvoiceCreating = JSON.parse(localStorage.getItem("invoicecreating"));
  React.useEffect(() => {
    if (invoiceId) {
      dispatch(setLoading(true));
      dispatch({ type: GET_INVOICE, payload: invoiceId });
    }
  }, []);
  React.useEffect(() => {
    if (invoiceToUpdate && invoiceId) {
      setShareInvoiceWith(invoiceToUpdate.shareInvoiceWithEmail);
      setTasks(invoiceToUpdate.task_detail);
      setTotalAmount(Number(invoiceToUpdate.invoicetotalvalue));
      setInvoiceDate(invoiceToUpdate.invoicedate);
      setIsInvalidDate && setDueDate(invoiceToUpdate.duedate);
      setSelectedClient({
        id: invoiceToUpdate?.client_detail?.id,
        index: invoiceToUpdate?.client_detail?.id,
        name: invoiceToUpdate?.client_detail?.name,
        companyName: invoiceToUpdate?.client_detail?.companyname,
      });

      set_show_sender_bank_details(
        invoiceToUpdate.show_sender_bank_details === "0" ? false : true
      );
      setCurrencyType(
        invoiceToUpdate.currency_type + " " + invoiceToUpdate.currency_symbol
      );
      set_currency_symbol(invoiceToUpdate.currency_symbol);
    }
  }, [invoiceToUpdate]);

  React.useEffect(() => {
    if (
      !invoiceCreating &&
      (!isInvoiceCreating || isInvoiceCreating === "false")
    ) {
      navigate("/invoices");
    }
  }, [invoiceCreating]);

  React.useEffect(() => {
    dispatch({ type: GET_CLIENTS, dropdown: 1 });
  }, []);

  const validateField = (fieldName, value) => {
    if (fieldName === "studentname" && value === "") {
      return "Student Name is required";
    }
    if (fieldName === "duration" && value === "") {
      return "Duration is required";
    }
    return "";
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log("name, value", name, value);
    setSelectedValues({
      ...selectedValues,
      [name]: value,
    });
    setError({
      ...error,
      [name]: validateField(name, value),
    });

    // const sel_client = clients.find(
    //   (client) => client.id === event.target.value
    // );

    // setSelectedClient({
    //   id: sel_client.id,
    //   name: sel_client.name,
    //   index: event.target.value,
    //   companyName: sel_client.companyname,
    // });
  };
  console.log(clients, "884848448484848");
  const renderClients = () => {
    return clients.map((client, ind) => {
      return (
        <MenuItem value={client.id} key={ind}>
          {client.name}
        </MenuItem>
      );
    });
  };

  const handleInput = (event) => {
    const re = /[0-9]+/g;
    if (
      event.target.name === "totalPrice" ||
      event.target.name === "hourly_units_worked"
    ) {
      if (re.test(event.target.value)) {
        setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
      } else {
        if (!event.target.value) {
          setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
        }
        return;
      }
    } else {
      setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
    }
  };

  // const handleInputPrice = (event) => {
  //   setTaskInfo({ ...taskInfo, [event.target.name]: event.target.value });
  // };

  // const handleTaskType = (event) => {
  //   setTaskInfo({ ...taskInfo, type: event.target.value, totalPrice: "" });
  // };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Validate all fields before submitting
    const newFormErrors = {};
    Object.keys(selectedValues).forEach((fieldName) => {
      newFormErrors[fieldName] = validateField(
        fieldName,
        selectedValues[fieldName]
      );
    });

    setError(newFormErrors);

    if (Object.values(newFormErrors).every((error) => error === "")) {
      // form submission logic goes here
    }

    // if (!shareInvoiceWith) {
    //   toast.error("Please Enter Email");
    //   return;
    // }
    // if (!isTaskToUpdate) {
    //   let taskInfoCopy = { ...taskInfo };
    //   if (taskInfo?.type === "hourly") {
    //     taskInfoCopy.totalPrice =
    //       Number(taskInfoCopy?.hourly_units_worked) *
    //       Number(taskInfoCopy?.number_of_hours);
    //   }
    //   if (taskInfo?.type === "Fixed") {
    //     taskInfoCopy.hourly_units_worked = "NA";
    //     taskInfoCopy.number_of_hours = "NA";
    //   }

    //   setTasks([...tasks, taskInfoCopy]);
    //   let amount = totalAmount;
    //   amount += Number(taskInfoCopy.totalPrice);
    //   setTotalAmount(amount);
    // } else {
    //   const all_tasks = [...tasks];
    //   const taskToUpdate = all_tasks[indexOfTaskToUpdate];
    //   taskInfo.totalPrice =
    //     taskInfo.type == "hourly"
    //       ? taskInfo.hourly_units_worked * taskInfo.number_of_hours
    //       : taskInfo.totalPrice;
    //   all_tasks[indexOfTaskToUpdate] = taskInfo;
    //   if (taskInfo?.type === "Fixed") {
    //     taskInfo.hourly_units_worked = "NA";
    //     taskInfo.number_of_hours = "NA";
    //   }

    //   let amount = totalAmount;
    //   amount += Number(taskInfo.totalPrice) - Number(taskToUpdate.totalPrice);
    //   setTotalAmount(amount);
    //   setIsTaskToUpdate(false);
    //   setTasks(all_tasks);
    // }
    // setTaskInfo({
    //   taskName: "",
    //   number_of_hours: "",
    //   hourly_units_worked: "",
    //   totalPrice: "",
    //   type: "",
    // });
  };

  const editTask = (index) => {
    const taskToUpdate = tasks[index];
    setTaskInfo(taskToUpdate);
    setIsTaskToUpdate(true);
    setIndexOfTaskToUpdate(index);
  };

  const deleteTask = async (index) => {
    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this task?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (willDelete) {
      setTaskInfo({
        taskName: "",
        number_of_hours: "",
        hourly_units_worked: "",
        totalPrice: "",
        type: "",
      });
      setIsTaskToUpdate(false);
    }
    if (!willDelete) return;
    const allTasks = [...tasks];
    const taskToDelete = tasks[index];
    const total_amount = Number(totalAmount) - Number(taskToDelete.totalPrice);
    allTasks.splice(index, 1);
    setTasks(allTasks);
    setTotalAmount(total_amount);
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleCurrencyType = (event) => {
    set_currency_symbol(event.target.value.slice(4));
    setCurrencyType(event.target.value);
  };

  const handle_show_sender_bank_details = () => {
    set_show_sender_bank_details(!show_sender_bank_details);
  };

  const handleEmail = (event) => {
    if (event.target.value !== "" && !isValidEmail(event.target.value)) {
      setError({ ...error, email: "Email is invalid" });
    } else {
      setError({ ...error, email: "" });
    }

    setShareInvoiceWith(event.target.value);
  };
  const preventMinus = (evt) => {
    if (
      (evt.which != 8 && evt.which != 0 && evt.which < 48) ||
      evt.which > 57
    ) {
      evt.preventDefault();
    }
  };
  React.useEffect(() => {
    if (dueDate) {
      setIsInvalidDate("");
    }
  });

  console.log(typeof dueDate, "dueDate");

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={false} />
      <ThemeProvider theme={theme}>
        <Container
          component="main"
          sx={{ marginTop: 8, display: "flex", justifyContent: "center" }}
          className="min_height create_invoice"
        >
          <Box
            sx={{
              marginTop: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "40%",
            }}
          >
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Grid container spacing={1}>
                {/* First column */}
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Select Student
                    </InputLabel>
                    <Select
                      name="studentname"
                      labelId="selected_student"
                      id="selected_student"
                      value={selectedValues.studentname}
                      label="selected_student"
                      onChange={handleChange}
                    >
                      {/* {renderClients()} */}
                      <MenuItem value="">Select an option</MenuItem>
                      <MenuItem value={"IND ₹"}>IND</MenuItem>
                      <MenuItem value={"USD $"}>USD</MenuItem>
                    </Select>
                  </FormControl>
                  {error.studentname && (
                    <Typography className="emailError">
                      {error.studentname}
                    </Typography>
                  )}
                </Grid>

                {/* Second column */}
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Course Duration
                    </InputLabel>
                    <Select
                      name="duration"
                      labelId="duration"
                      id="duration"
                      value={selectedValues.duration}
                      label="duration_type"
                      onChange={handleChange}
                    >
                      <MenuItem value={"IND ₹"}>IND</MenuItem>
                      <MenuItem value={"USD $"}>USD</MenuItem>
                      <MenuItem value={"EUR €"}>EUR</MenuItem>
                      <MenuItem value={"GBP R"}>GBP</MenuItem>
                      <MenuItem value={"ZAR £"}>ZAR</MenuItem>
                    </Select>
                  </FormControl>
                  {error.duration && (
                    <Typography className="emailError">
                      {error.duration}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>

            <FormControl sx={{ width: "100%", marginTop: 2 }} required>
              <InputLabel id="demo-simple-select-label">Course</InputLabel>
              <Select
                labelId="currency_type"
                id="currency_type"
                value={currencyType}
                label="currency_type"
                onChange={handleCurrencyType}
              >
                <MenuItem value={"IND ₹"}>IND</MenuItem>
                <MenuItem value={"USD $"}>USD</MenuItem>
                <MenuItem value={"EUR €"}>EUR</MenuItem>
                <MenuItem value={"GBP R"}>GBP</MenuItem>
                <MenuItem value={"ZAR £"}>ZAR</MenuItem>
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: 2 }} required>
              <InputLabel id="demo-simple-select-label">Course Fee</InputLabel>
              <Select
                labelId="currency_type"
                id="currency_type"
                value={currencyType}
                label="currency_type"
                onChange={handleCurrencyType}
              >
                <MenuItem value={"IND ₹"}>IND</MenuItem>
                <MenuItem value={"USD $"}>USD</MenuItem>
                <MenuItem value={"EUR €"}>EUR</MenuItem>
                <MenuItem value={"GBP R"}>GBP</MenuItem>
                <MenuItem value={"ZAR £"}>ZAR</MenuItem>
              </Select>
            </FormControl>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ width: "100%", marginTop: 2 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="name"
                    label="Deposite Amount"
                    name="name"
                    autoComplete="name"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    // value={clientInfo.name}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box sx={{ width: "100%", marginTop: 2 }}>
                  <TextField
                    required
                    type="number"
                    fullWidth
                    id="name"
                    label="Pending Amount"
                    name="name"
                    autoComplete="name"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    // value={clientInfo.name}
                  />
                </Box>
              </Grid>
            </Grid>
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <TextField
                required
                fullWidth
                type="number"
                id="name"
                label="Payment Method"
                name="name"
                autoComplete="name"
                inputProps={{ sx: { height: 10, marginTop: 1 } }}
                onChange={handleInput}
                // value={clientInfo.name}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                width: "87%",
                justifyContent: "space-between",
              }}
              mt={1}
            >
              <Typography sx={{ fontWeight: 500 }}>
                Add Sender Bank Details on Invoice
              </Typography>
              <Checkbox
                checked={show_sender_bank_details}
                onChange={handle_show_sender_bank_details}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ padding: 0 }}
              />
            </Box>
            <Box className="task_form" component="form" onSubmit={handleSubmit}>
              {/* <Typography
                component="h1"
                variant="h5"
                sx={{ fontWeight: 600 }}
                mt={1}
              >
                {isTaskToUpdate ? "Update Task " : "Add Task"}
              </Typography>
              <TextField
                required
                id="taskName"
                label="Task Name"
                name="taskName"
                autoComplete="taskName"
                sx={{ width: "87%", marginTop: 2 }}
                inputProps={{ sx: { height: 15, marginTop: 1 } }}
                onChange={handleInput}
                value={taskInfo.taskName}
              />
              <FormControl sx={{ width: "87%", marginTop: 2 }}>
                <InputLabel id="demo-simple-select-label">Task Type</InputLabel>
                <Select
                  labelId="selected_client"
                  id="selected_client"
                  value={taskInfo.type}
                  label="selected_client"
                  onChange={handleTaskType}
                >
                  <MenuItem value="Fixed">Fixed</MenuItem>
                  <MenuItem value="hourly">Hourly</MenuItem>
                </Select>
              </FormControl>

              {taskInfo.type === "hourly" && (
                <>
                  <Box className="date_picker" mt={3}>
                    <TextField
                      required
                      id="number_of_hours"
                      label="Hours"
                      type="number"
                      onKeyPress={preventMinus}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      onWheel={(e) => e.target.blur()}
                      name="number_of_hours"
                      autoComplete="number_of_hours"
                      sx={{ width: "90%", marginRight: 1 }}
                      onChange={handleInput}
                      value={taskInfo.number_of_hours}
                    />

                    <TextField
                      required
                      id="hourly_units_worked"
                      label="Per Hour Price"
                      type="number"
                      onKeyPress={preventMinus}
                      InputProps={{
                        inputProps: { min: 0 },
                      }}
                      name="hourly_units_worked"
                      autoComplete="hourly_units_worked"
                      sx={{ width: "90%", marginLeft: 1 }}
                      onChange={handleInput}
                      onWheel={(e) => e.target.blur()}
                      value={taskInfo.hourly_units_worked}
                    />
                  </Box>
                </>
              )}
              <Box
                sx={{
                  width: "87%",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {taskInfo.type === "hourly" ? (
                  <TextField
                    required
                    id="totalPrice"
                    label="Total Price"
                    name="totalPrice"
                    autoComplete="totalPrice"
                    sx={{ width: "100%", marginTop: 2 }}
                    value={
                      isNaN(
                        taskInfo.hourly_units_worked * taskInfo.number_of_hours
                      )
                        ? 0
                        : taskInfo.hourly_units_worked *
                          taskInfo.number_of_hours
                    }
                    onChange={handleInputPrice}
                  />
                ) : (
                  <TextField
                    required
                    id="totalPrice"
                    label="Total Price"
                    name="totalPrice"
                    autoComplete="totalPrice"
                    sx={{ width: "100%", marginTop: 2 }}
                    onChange={handleInput}
                    value={taskInfo.totalPrice}
                  />
                )}
              </Box> */}
              <Box mt={2} sx={{ width: "87%" }}>
                <Button
                  type="submit"
                  sx={{ width: "100%", marginBottom: 1.5 }}
                  variant="contained"
                >
                  Add task
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  );
};
