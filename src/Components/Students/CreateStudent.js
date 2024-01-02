import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Students";
import {
  GET_COURSE_LIST,
  GET_STUDENT,
  SAVE_STUDENT,
  UPDATE_STUDENT,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const theme = createTheme();

export default function CreateStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, studentCreating, student } = useSelector(
    (state) => state.Students
  );
  const { duration: newCourses = {} } = useSelector((state) => state.invoices);
  const isStudentCreating = JSON.parse(localStorage.getItem("studentcreating"));

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    course_duration: "",
    course: "",
    course_fee: "",
    payment_method: "",
    discount: "",
    deposit_amount: "",
    after_discount_fee: "",
  });

  const paymentMethods = [
    "Google Pay",
    "Phone Pay",
    "Net Banking",
    "Credit Card",
    "Debit Card",
    "Cash",
  ];
  const durations = Object.keys(newCourses);
  const coursesList = newCourses[studentInfo?.course_duration] || [];

  const [error, setError] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    course_duration: "",
    course: "",
    discount: "",
    discountedFee: "",
    course_fee: "",
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    const studentInfoPayload = new FormData();
    studentInfoPayload.append("name", studentInfo.name);
    studentInfoPayload.append("email", studentInfo.email);
    studentInfoPayload.append("phone", studentInfo.phone);
    studentInfoPayload.append("address", studentInfo.address);
    studentInfoPayload.append("course_duration", studentInfo.course_duration);
    studentInfoPayload.append("course", studentInfo.course);
    studentInfoPayload.append("course_fee", studentInfo.course_fee);
    studentInfoPayload.append("discount", studentInfo.discount);
    studentInfoPayload.append("deposit_amount", studentInfo.deposit_amount);
    studentInfoPayload.append("payment_method", studentInfo.payment_method);

    if (
      !studentInfo.name ||
      !studentInfo.email ||
      !studentInfo.phone ||
      !studentInfo.address ||
      !studentInfo.course_duration ||
      !studentInfo.course ||
      !studentInfo.course_fee ||
      !studentInfo.discount ||
      !studentInfo.deposit_amount ||
      !studentInfo.payment_method
    ) {
      toast.error("Please fill all the required fields", {
        toastId: "sender_form",
      });
      return;
    }
    if (error.email) {
      toast.error("Please Enter valid Email");
      return;
    }
    if (error.phone) {
      toast.error("Phone Number must have 10 digits");
      return;
    }
    dispatch(setLoading(true));

    if (id) {
      dispatch({
        type: UPDATE_STUDENT,
        payload: studentInfo,
      });
      return;
    }

    dispatch({
      type: SAVE_STUDENT,
      payload: studentInfoPayload,
    });
  };

  React.useEffect(() => {
    if (id) setStudentInfo(student);
  }, [id, student]);

  React.useEffect(() => {
    if (id) {
      dispatch(setLoading(true));
      dispatch({ type: GET_STUDENT, payload: id });
    }
  }, [dispatch, id]);

  React.useEffect(() => {
    if (
      !studentCreating &&
      (!isStudentCreating || isStudentCreating === "false")
    ) {
      navigate("/student");
    }
  }, [isStudentCreating, navigate, studentCreating]);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleInput = (e) => {
    switch (e.target.name) {
      case "name":
        setError((prevError) => ({
          ...prevError,
          name: e.target.value ? "" : "Name is required",
        }));
        break;
      case "email":
        setError((prevError) => ({
          ...prevError,
          email:
            e.target.value && !isValidEmail(e.target.value)
              ? "Email is invalid"
              : "",
        }));
        break;
      case "phone":
        setError((prevError) => ({
          ...prevError,
          phone:
            e.target.value && e.target.value.length !== 10
              ? "Phone number must be exactly 10 numbers"
              : "",
        }));
        break;
      case "address":
        setError((prevError) => ({
          ...prevError,
          address: e.target.value ? "" : "Address is required",
        }));
        break;
      case "course_duration":
        setError((prevError) => ({
          ...prevError,
          course_duration: e.target.value ? "" : "Duration is required",
        }));
        break;
      default:
        break;
    }

    if (e.target.name === "course") {
      const selectedCourse = coursesList.find(
        (course) => course.name === e.target.value
      );
      setStudentInfo((prevStudentInfo) => ({
        ...prevStudentInfo,
        course_fee: selectedCourse ? selectedCourse.fee : "",
        [e.target.name]: e.target.value,
      }));
    }
    if (e.target.name === "discount") {
      const discountValue = parseFloat(e.target.value) || 0;
      const cappedDiscount = Math.min(Math.max(discountValue, 0), 100);
      const originalFee = parseFloat(studentInfo.course_fee) || 0;
      const discountedFee = Math.max(
        originalFee * (1 - cappedDiscount / 100),
        0
      );
      setStudentInfo((prevStudentInfo) => ({
        ...prevStudentInfo,
        [e.target.name]: cappedDiscount,
        after_discount_fee: discountedFee.toFixed(2),
      }));
      e.target.value = cappedDiscount;
    }

    if (e.target.name === "deposit_amount") {
      const depositAmount = parseFloat(e.target.value);
      const courseFee = parseFloat(studentInfo.course_fee);
      const afterDiscountFee = parseFloat(studentInfo.after_discount_fee);

      if (depositAmount > courseFee) {
        setError((prevError) => ({
          ...prevError,
          deposit_amount: toast.error(
            "Deposit amount cannot be greater than course fee"
          ),
        }));
      } else if (depositAmount > afterDiscountFee) {
        setError((prevError) => ({
          ...prevError,
          deposit_amount: toast.error(
            "Deposit amount cannot be greater than after discount fee"
          ),
        }));
      } else {
        setError((prevError) => ({
          ...prevError,
          deposit_amount: "",
        }));

        setStudentInfo((prevStudentInfo) => ({
          ...prevStudentInfo,
          [e.target.name]: depositAmount,
        }));
      }
    } else {
      setStudentInfo((prevStudentInfo) => ({
        ...prevStudentInfo,
        [e.target.name]: e.target.value,
      }));
    }
  };

  useEffect(() => {
    dispatch({
      type: GET_COURSE_LIST,
    });
  }, [dispatch]);

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" className="main-container">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 9,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography component="h1" variant="h5">
              {id ? "Update Student" : "Add Student"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 2 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    name="name"
                    autoComplete="name"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={studentInfo.name}
                  />
                  {error.name && (
                    <Typography className="emailError">{error.name}</Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={studentInfo.email}
                  />
                  {error.email && (
                    <Typography className="emailError">
                      {error.email}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    type="number"
                    required
                    fullWidth
                    id="phone"
                    label="Phone"
                    name="phone"
                    autoComplete="phone"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={studentInfo.phone}
                  />
                  <Typography className="emailError">{error.phone}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    required
                    fullWidth
                    id="address"
                    label="Address"
                    name="address"
                    autoComplete="address"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={studentInfo.address}
                    disabled={id ? true : false}
                  />
                  <Typography className="emailError">
                    {error.address}
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Course Duration
                    </InputLabel>
                    <Select
                      name="course_duration"
                      labelId="course_duration"
                      id="course_duration"
                      value={studentInfo?.course_duration}
                      label="duration_type"
                      onChange={handleInput}
                      disabled={id ? true : false}
                    >
                      {durations.map((duration, ind) => (
                        <MenuItem value={duration} key={ind}>
                          {duration}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Course
                    </InputLabel>
                    <Select
                      name="course"
                      labelId="course"
                      id="course"
                      value={studentInfo?.course}
                      label="course_type"
                      onChange={handleInput}
                      disabled={id ? true : false}
                    >
                      {coursesList.map((course, ind) => (
                        <MenuItem value={course.name} key={ind}>
                          {course.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {error.selectedDuration && (
                    <Typography className="emailError">
                      {error.selectedDuration}
                    </Typography>
                  )}
                </Grid>
              </Grid>

              <Box sx={{ width: "100%", marginTop: 2 }}>
                <TextField
                  required
                  fullWidth
                  id="selectedCourseFee"
                  label="Course Fee"
                  name="course_fee"
                  autoComplete="course_fee"
                  inputProps={{ sx: { height: 10, marginTop: 1 } }}
                  value={studentInfo.course_fee}
                  onChange={handleInput}
                  disabled
                />
              </Box>

              <Grid container spacing={1}>
                <Grid item xs={4}>
                  <Box sx={{ width: "100%", marginTop: 2 }}>
                    <TextField
                      required
                      fullWidth
                      // type="number"
                      id="discount"
                      label="Discount (%)"
                      name="discount"
                      autoComplete="name"
                      inputProps={{ sx: { height: 10, marginTop: 1 } }}
                      value={studentInfo.discount}
                      onChange={handleInput}
                    />
                  </Box>
                </Grid>

                <Grid item xs={4}>
                  <Box sx={{ width: "100%", marginTop: 2 }}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="after_discount_fee"
                      label="After Discount Fee"
                      name="after_discount_fee"
                      autoComplete="after_discount_fee"
                      inputProps={{ sx: { height: 10, marginTop: 1 } }}
                      value={studentInfo.after_discount_fee}
                      onChange={handleInput}
                      disabled
                    />
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ width: "100%", marginTop: 2 }}>
                    <TextField
                      required
                      fullWidth
                      type="number"
                      id="deposit_amount"
                      label="Deposit Amount"
                      name="deposit_amount"
                      autoComplete="name"
                      inputProps={{ sx: { height: 10, marginTop: 1 } }}
                      value={studentInfo.deposit_amount}
                      onChange={handleInput}
                      disabled={id ? true : false}
                    />
                  </Box>
                </Grid>
              </Grid>

              <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                <InputLabel id="demo-simple-select-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment_method"
                  id="payment_method"
                  name="payment_method"
                  value={studentInfo.payment_method}
                  label="payment_type"
                  onChange={handleInput}
                  disabled={id ? true : false}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Box mt={3}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  onSubmit={handleSubmit}
                  sx={{ mb: 2, backgroundColor: "#1976d2" }}
                >
                  {id ? "Update Student" : "Add Student"}
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  );
}
