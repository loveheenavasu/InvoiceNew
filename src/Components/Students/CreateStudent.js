import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Students";
import {
  ADD_PAYMENT,
  GET_COURSE_LIST,
  GET_STUDENT,
  SAVE_STUDENT,
  UPDATE_STUDENT,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
const theme = createTheme();

export default function CreateStudent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, studentCreating, student, paymentList } = useSelector(
    (state) => state.Students
  );
  const PaymentListLength = paymentList.length;
  const { duration: newCourses = {} } = useSelector((state) => state.invoices);
  const isStudentCreating = JSON.parse(localStorage.getItem("studentcreating"));

  let lastPendingAmount = paymentList[paymentList.length - 1]?.pending_amount;

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
    totalToBeDepositAmount: 0,
    newDepositValue: [],
    deposit_date: "",
  });

  const paymentMethods = [
    "Google Pay",
    "PhonePe",
    "Net Banking",
    "Credit Card",
    "Debit Card",
    "Cash",
  ];
  const durations = Object.keys(newCourses);
  const coursesList = newCourses[studentInfo?.course_duration] || [];

  const [inputList, setInputList] = useState([]);

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
    newDepositeValue: "",
    newPaymentMethod: "",
    depositDate: "",
  });

  const [pendingAmount, setPendingAmount] = useState(0);

  const validateInputList = () => {
    for (const item of inputList) {
      if (
        item.newDepositeValue.trim() === "" ||
        item.newPaymentMethod.trim() === "" ||
        item.newDepositDate.trim() === ""
      ) {
        console.error("Error: All fields must be filled");
        return true;
      }
    }
    return false;
  };
  const list = [...inputList];

  const totalPaidAmount = list.reduce(
    (accumulator, currentValue) => accumulator + +currentValue.newDepositeValue,
    0
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (id && validateInputList()) {
      toast.error("Please fill all the required fields");
      return;
    }
    if (totalPaidAmount > lastPendingAmount) {
      toast.error(
        `Deposit amount should not exceed the pending amount. Last pending amount: ${lastPendingAmount}`
      );
      return;
    }

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
    studentInfoPayload.append("deposit_date", studentInfo.deposit_date);

    if (
      !studentInfo.name ||
      !studentInfo.email ||
      !studentInfo.phone ||
      !studentInfo.address ||
      !studentInfo.course_duration ||
      !studentInfo.course ||
      !studentInfo.course_fee ||
      // (!id && !studentInfo.discount) ||
      !studentInfo.deposit_amount ||
      !studentInfo.payment_method ||
      (!id && !studentInfo.deposit_date)
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

    const paymentData = inputList.map((item) => {
      setPendingAmount((prev) => prev - item?.newDepositeValue);
      const data = {
        payment_method: item?.newPaymentMethod,
        deposit_amount: Number(item?.newDepositeValue),
        student_id: id,
        deposit_date: item?.newDepositDate,
      };
      return data;
    });

    if (id) {
      dispatch({
        type: UPDATE_STUDENT,
        payload: studentInfo,
      });
      dispatch({
        type: ADD_PAYMENT,
        payload: paymentData,
      });
      return;
    }

    dispatch({
      type: SAVE_STUDENT,
      payload: studentInfoPayload,
    });
  };

  React.useEffect(() => {
    if (id) {
      const pendingAmount =
        student?.after_discount_fee - student?.deposit_amount || 0;
      setStudentInfo({ ...student, totalToBeDepositAmount: pendingAmount });
      setPendingAmount(pendingAmount);
    }
  }, [id, student]);

  React.useEffect(() => {
    if (id) {
      setStudentInfo({});
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
      const courseFee = parseFloat(studentInfo?.course_fee);
      const afterDiscountFee = parseFloat(studentInfo?.after_discount_fee);

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
    if (e.target.name === "deposit_date") {
      const date = e.target.value;
      if (date === "") {
        setError((prevError) => ({
          ...prevError,
          depositDate: "please enter date",
        }));
      } else {
        setStudentInfo((prevStudentInfo) => ({
          ...prevStudentInfo,
          [e.target.name]: e.target.value,
        }));
      }
    } else {
      setStudentInfo((prevStudentInfo) => ({
        ...prevStudentInfo,
        [e.target.name]: e.target.value,
      }));
    }
    // else{
    //   setStudentInfo((prevStudentInfo) => ({
    //     ...prevStudentInfo,
    //     [e.target.name]: e.target.value,
    //   }));
    // }
  };

  useEffect(() => {
    dispatch({
      type: GET_COURSE_LIST,
    });
  }, [dispatch]);

  const handleCloseAppendFields = (index) => {
    const list = [...inputList];
    const removeData = list.filter((_, indexfilter) => indexfilter !== index);
    setError((prevError) => ({
      ...prevError,
      [`newDepositeValue_${index}`]: "",
    }));
    setInputList(removeData);
  };

  const handleAppendColumn = () => {
    const totalPendingAmount = inputList.reduce(function (acc, obj) {
      return acc + +obj.newDepositeValue;
    }, 0);
    const pendingAmountToBePaid =
      studentInfo?.after_discount_fee - totalPendingAmount;
    if (pendingAmountToBePaid === 0) {
    }

    setPendingAmount(pendingAmountToBePaid);
    if (pendingAmountToBePaid !== 0) {
      setInputList([
        ...inputList,
        {
          id: Date.now(),
          newDepositeValue: "",
          newPaymentMethod: "",
          newDepositDate: "",
        },
      ]);
    }
  };

  const handleInputChange = (e, index) => {
    let { name, value } = e.target;
    const list = [...inputList];
    if (name === "newDepositeValue" && value === "") {
      list[index]["depositError"] = "Deposit amount required";
    } else if (name === "newDepositeValue" && value !== "") {
      list[index]["depositError"] = "";
    }

    if (name === "newPaymentMethod") {
      if (value.trim() === "") {
        list[index]["paymentMethodError"] = "Payment Method is required";
      } else {
        list[index]["paymentMethodError"] = "";
      }
    }
    if (name === "newSelectedDate" && value === "") {
      if (value.trim() === "") {
        list[index]["newDepositDateError"] = "Deposit Date is required";
      } else {
        list[index]["newDepositDateError"] = "";
      }
    }

    list[index][name] = value;
    setInputList(list);
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container className="main_container">
          <Container component="main" maxWidth="sm" sx={{ pb: "40px" }}>
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
                      value={studentInfo?.name}
                    />
                    {error.name && (
                      <Typography className="emailError">
                        {error.name}
                      </Typography>
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
                      value={studentInfo?.email}
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
                    <Typography className="emailError">
                      {error.phone}
                    </Typography>
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
                      value={studentInfo?.address}
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
                        {coursesList?.map((course, ind) => (
                          <MenuItem value={course?.name} key={ind}>
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
                    value={studentInfo?.course_fee}
                    onChange={handleInput}
                    disabled
                  />
                </Box>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Box sx={{ width: "100%", marginTop: 2 }}>
                      <TextField
                        fullWidth
                        type="number"
                        id="discount"
                        label="Discount (%)"
                        name="discount"
                        autoComplete="name"
                        inputProps={{ sx: { height: 10, marginTop: 1 } }}
                        value={studentInfo?.discount}
                        onChange={handleInput}
                        disabled={id ? true : false}
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={6}>
                    <Box sx={{ width: "100%", marginTop: 2 }}>
                      <TextField
                        required
                        fullWidth
                        type="number"
                        id="after_discount_fee"
                        label="Fee After Discount"
                        name="after_discount_fee"
                        autoComplete="after_discount_fee"
                        inputProps={{ sx: { height: 10, marginTop: 1 } }}
                        value={studentInfo?.after_discount_fee}
                        onChange={handleInput}
                        disabled
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Grid></Grid>
                {id &&
                  paymentList.map((items, index) => {
                    return (
                      <Grid xs={12} key={items.id} sx={{ display: "flex" }}>
                        <Grid container spacing={1}>
                          <Grid
                            item
                            xs={
                              id &&
                              index === PaymentListLength - 1 &&
                              lastPendingAmount !== 0
                                ? 3.4
                                : 3.9
                            }
                            sx={{ mr: "3px" }}
                          >
                            <Box sx={{ width: "100%", marginTop: 2 }}>
                              <TextField
                                required
                                fullWidth
                                type="number"
                                name="PaymentDepositeValue"
                                id="new_deposit_amount"
                                label="Deposit Amount"
                                // name="new_deposit_amount"
                                autoComplete="new_deposit_amount"
                                disabled={id ? true : false}
                                inputProps={{
                                  sx: { height: 10, marginTop: 1 },
                                }}
                                value={items?.received_amount}
                              />
                            </Box>
                          </Grid>
                          <Grid
                            item
                            xs={
                              id &&
                              index === PaymentListLength - 1 &&
                              lastPendingAmount !== 0
                                ? 3.7
                                : 3.8
                            }
                            sx={{ mr: "9px", mt: 2 }}
                          >
                            {/* <TextField
                              required
                              fullWidth
                              type="date"
                              id="selected_date"
                              // label="Date"
                              name="deposit_date"
                              // autoComplete="course_fee"
                              inputProps={{ sx: { height: 10, marginTop: 1 } }}
                              value={studentInfo?.deposit_date}
                              onChange={handleInput}
                            /> */}
                            <TextField
                              required
                              fullWidth
                              name="date"
                              id="new_selected_date"
                              label="deposit date"
                              // name="new_deposit_amount"
                              autoComplete="new_selected_date"
                              disabled={id ? true : false}
                              inputProps={{ sx: { height: 10, marginTop: 1 } }}
                              value={items?.deposit_date}
                            />
                          </Grid>
                          <Grid
                            xs={
                              id &&
                              lastPendingAmount !== 0 &&
                              PaymentListLength - 1 === index
                                ? 3.744
                                : 4
                            }
                          >
                            <FormControl
                              sx={{ width: "100%", marginTop: 2 }}
                              required
                            >
                              <InputLabel
                                id="demo-simple-select-label"
                                sx={{
                                  height: 50,
                                  marginTop: 1,
                                }}
                              >
                                Payment Method
                              </InputLabel>
                              <Select
                                labelId="payment_method"
                                id="new_payment_method"
                                name="newPaymentMethod"
                                label="payment_type"
                                sx={{ height: 50, marginTop: 1 }}
                                value={items?.payment_method}
                                disabled={id ? true : false}
                              >
                                {paymentMethods.map((method) => (
                                  <MenuItem key={method} value={method}>
                                    {method}
                                  </MenuItem>
                                ))}
                              </Select>
                              {items?.paymentMethodError && (
                                <Typography className="paymentMethodError">
                                  {items?.paymentMethodError}
                                </Typography>
                              )}
                            </FormControl>
                          </Grid>
                          {id &&
                            lastPendingAmount !== 0 &&
                            PaymentListLength - 1 === index && (
                              <IconButton color="primary" sx={{ mt: 2 }}>
                                <AddIcon
                                  sx={{ fontSize: "26px" }}
                                  onClick={handleAppendColumn}
                                />
                              </IconButton>
                            )}
                        </Grid>
                      </Grid>
                    );
                  })}
                {!id && (
                  <Grid xs={12} sx={{ display: "flex" }}>
                    <Grid container spacing={1}>
                      <Grid
                        item
                        xs={
                          id && totalPaidAmount !== lastPendingAmount
                            ? 5.1
                            : 5.8
                        }
                        sx={{ mr: "9px" }}
                      >
                        <Box sx={{ width: "100%", marginTop: 2 }}>
                          <TextField
                            required
                            fullWidth
                            type="number"
                            id="deposit_amount"
                            label="Deposit Amount"
                            name="deposit_amount"
                            autoComplete="deposit_amount"
                            inputProps={{ sx: { height: 10, marginTop: 1 } }}
                            value={studentInfo?.deposit_amount}
                            onChange={handleInput}
                            disabled={id ? true : false}
                          />
                        </Box>
                      </Grid>
                      <Grid
                        xs={
                          id && totalPaidAmount !== lastPendingAmount ? 5.8 : 6
                        }
                      >
                        <FormControl
                          sx={{ width: "100%", marginTop: 2 }}
                          required
                        >
                          <InputLabel
                            id="demo-simple-select-label"
                            sx={{
                              height: 50,
                              marginTop: 1,
                            }}
                          >
                            Payment Method
                          </InputLabel>
                          <Select
                            labelId="payment_method"
                            id="payment_method"
                            name="payment_method"
                            value={studentInfo?.payment_method}
                            label="payment_type"
                            sx={{ height: 50, marginTop: 1 }}
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
                      </Grid>
                      {id && totalPaidAmount !== lastPendingAmount && (
                        <IconButton
                          color="primary"
                          sx={{ mt: 2 }}
                          disabled={
                            student?.pending_amount === 0 || pendingAmount === 0
                              ? true
                              : false
                          }
                        >
                          <AddIcon
                            sx={{ fontSize: "25px" }}
                            onClick={handleAppendColumn}
                          />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                )}
                {!id && (
                  <Box sx={{ width: "100%", marginTop: 2 }}>
                    <TextField
                      required
                      fullWidth
                      type="date"
                      id="selected_date"
                      // label="Date"
                      name="deposit_date"
                      // autoComplete="course_fee"
                      inputProps={{
                        sx: {
                          height: 10,
                          marginTop: 1,
                          color: "rgba(102, 102, 102, 1)",
                        },
                      }}
                      value={studentInfo?.deposit_date}
                      onChange={handleInput}
                    />
                  </Box>
                )}
                {inputList.map((items, index) => {
                  return (
                    <Grid xs={12} key={items.id} sx={{ display: "flex" }}>
                      <Grid container spacing={1}>
                        <Grid item xs={3.4} sx={{ mr: "3px" }}>
                          <Box sx={{ width: "100%", marginTop: 2 }}>
                            <TextField
                              required
                              fullWidth
                              type="number"
                              name="newDepositeValue"
                              id="new_deposit_amount"
                              label="New Deposit Amount"
                              autoComplete="new_deposit_amount"
                              inputProps={{
                                min: 1,
                                sx: { height: 10, marginTop: 1 },
                              }}
                              onInput={(e) => {
                                const inputValue = e.target.value;
                                if (
                                  inputValue.length === 1 &&
                                  inputValue.startsWith("0")
                                ) {
                                  e.target.value = "";
                                }
                              }}
                              onKeyDown={(e) => {
                                if (
                                  e.key === "e" ||
                                  e.key === "E" ||
                                  e.key === "-" ||
                                  e.key === "."
                                ) {
                                  e.preventDefault();
                                }
                              }}
                              onPaste={(e) => e.preventDefault()}
                              value={items?.newDepositeValue}
                              onChange={(e) => handleInputChange(e, index)}
                            />
                          </Box>
                          {items?.depositError && (
                            <Typography className="newDepositError">
                              {items?.depositError}
                            </Typography>
                          )}
                        </Grid>
                        <Grid item xs={3.7} sx={{ mr: "9px", mt: 2 }}>
                          <TextField
                            required
                            type="date"
                            fullWidth
                            name="newDepositDate"
                            id="new_selected_date"
                            // name="new_deposit_amount"
                            autoComplete="new_selected_date"
                            inputProps={{
                              sx: {
                                height: 10,
                                marginTop: 1,
                                color: "rgba(102, 102, 102, 1)",
                              },
                            }}
                            onChange={(e) => handleInputChange(e, index)}
                            value={items?.depositDate}
                          />
                        </Grid>
                        <Grid xs={3.744}>
                          <FormControl
                            sx={{ width: "100%", marginTop: 2 }}
                            required
                          >
                            <InputLabel
                              id="demo-simple-select-label"
                              sx={{
                                height: 50,
                                marginTop: 1,
                              }}
                            >
                              Payment Method
                            </InputLabel>
                            <Select
                              labelId="payment_method"
                              id="new_payment_method"
                              name="newPaymentMethod"
                              label="payment_type"
                              sx={{ height: 50, marginTop: 1 }}
                              onChange={(e) => handleInputChange(e, index)}
                              value={items?.payment_method}
                            >
                              {paymentMethods.map((method) => (
                                <MenuItem key={method} value={method}>
                                  {method}
                                </MenuItem>
                              ))}
                            </Select>
                            {items?.paymentMethodError && (
                              <Typography className="paymentMethodError">
                                {items?.paymentMethodError}
                              </Typography>
                            )}
                          </FormControl>
                        </Grid>
                        {id && (
                          <IconButton color="primary" sx={{ mt: 2 }}>
                            <CloseIcon
                              sx={{ fontSize: "26px" }}
                              onClick={() => {
                                setError((prev) => ({
                                  ...prev,
                                  [`newDepositeValue_${index}`]: "",
                                }));
                                handleCloseAppendFields(index);
                              }}
                            />
                          </IconButton>
                        )}
                      </Grid>
                    </Grid>
                  );
                })}

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
        </Container>
      </ThemeProvider>
      <Footer />
    </ProtectedRoute>
  );
}
