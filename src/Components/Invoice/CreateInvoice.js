import { Autocomplete, Button, Container, TextField } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import Spinner from "../Spinner/Spinner";
import React, { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Invoice";
import {
  ADD_INVOICE,
  GET_COURSE_FEE,
  GET_STUDENTS,
  GET_COURSE_LIST,
  UPDATE_INVOICE,
  GET_COURSES,
} from "../../Store/Action_Constants";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { toast } from "react-toastify";
import { viewInvoice } from "../../Services/Invoice_Services";
const theme = createTheme();

export const CreateInvoice = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { invoice_Id } = useParams();
  const Coursefee = useSelector((state) => state.invoices.fee);
  const courseDuration = useSelector((state) => state.invoices.duration);
  const { courses } = useSelector((state) => state.Courses) || {};
  const { loading, students } = useSelector((state) => state.Students);
  const { invoiceCreating } =
    useSelector((state) => state.invoices) || {} || [];
  const [updated, setUpdated] = useState();
  const [formData, setFormData] = React.useState({
    selectedStudent: "",
    selectedDuration: "",
    selectedCourse: "",
    selectedCourseFee: "",
    depositeAmount: "",
    pendingAmount: "",
    paymentMethod: "",
    otherPaymentMethod: "",
  });
  const paymentMethods = [
    "Google Pay",
    "Phone Pay",
    "Net Banking",
    "Credit Card",
    "Debit Card",
    "Other",
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;

    setError((prevError) => ({
      ...prevError,
      [name]: "",
    }));

    if (name === "selectedDuration") {
      if (!value) {
        setError((prevError) => ({
          ...prevError,
          selectedDuration: "Duration is required",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));

        try {
          dispatch({
            type: GET_COURSE_LIST,
            payload: { course_duration: value },
          });
        } catch (error) {
          console.error("Error dispatching action for course list:", error);
        }
      }
    } else if (name === "selectedCourse") {
      if (!value) {
        setError((prevError) => ({
          ...prevError,
          selectedCourse: "Course is required",
        }));
      } else {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));

        try {
          dispatch(setLoading(true));
          dispatch({
            type: GET_COURSE_FEE,
            payload: value,
          });
        } catch (error) {
          console.error("Error dispatching action for course fee:", error);
        }
      }
    } else if (name === "paymentMethod" && value === "Other") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    } else if (name === "depositeAmount") {
      if (!value) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: "",
          pendingAmount: 0,
        }));
        setError((prevError) => ({
          ...prevError,
          depositeAmount: "",
        }));
      } else {
        const courseFee = parseFloat(formData.selectedCourseFee) || 0;
        const depositAmount = parseFloat(value) || 0;

        if (depositAmount <= courseFee) {
          setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value,
            pendingAmount: courseFee - depositAmount,
          }));
        } else {
          toast.error("Deposit amount cannot exceed course fee");
          setError((prevError) => ({
            ...prevError,
            depositeAmount: "Deposit amount cannot exceed course fee",
          }));
        }
      }
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const [error, setError] = React.useState({
    selectedStudent: "",
    selectedDuration: "",
    selectedCourse: "",
    selectedCourseFee: "",
    depositeAmount: "",
    pendingAmount: "",
    paymentMethod: "",
    otherPaymentMethod: "",
  });

  const isInvoiceCreating = JSON.parse(localStorage.getItem("invoicecreating"));

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_STUDENTS, dropdown: 1 });
    dispatch({ type: GET_COURSES });
  }, [dispatch]);

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({
      type: GET_COURSE_LIST,
      payload: { course_duration: formData.selectedDuration },
    });
    dispatch({ type: GET_COURSE_FEE, payload: formData.selectedCourse });
  }, [dispatch, formData.selectedDuration, formData.selectedCourse]);

  // const renderStudents = useMemo(
  //   () =>
  //     students.map((student, ind) => (
  //       <MenuItem value={student.id} key={ind}>
  //         {student?.name}
  //       </MenuItem>
  //     )),
  //   [students]
  // );
  const renderStudents = students.map((student) => ({
    value: student.id,
    label: student.name,
  }));

  const renderDuration = useMemo(() => {
    const uniqueDurations = new Set();

    courses.forEach((course) => {
      if (course?.duration) {
        uniqueDurations.add(course.duration);
      }
    });

    return Array.from(uniqueDurations).map((duration, ind) => (
      <MenuItem value={duration} key={ind}>
        {duration}
      </MenuItem>
    ));
  }, [courses]);

  const renderCourse = useMemo(() => {
    const courseId = courseDuration?.[0]?.course_id;
    return (
      courseId &&
      courseDuration[0]?.course_name?.map((course, i) => (
        <MenuItem value={courseId[i]} key={courseId[i]}>
          {course}
        </MenuItem>
      ))
    );
  }, [courseDuration]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !formData.selectedStudent ||
      !formData.selectedDuration ||
      !formData.selectedCourse ||
      !formData.selectedCourseFee ||
      !formData.depositeAmount ||
      !formData.paymentMethod
    ) {
      toast.error("Please fill all the required fields", {
        toastId: "sender_form",
      });
      return;
    }
    const { selectedStudent, selectedCourse, depositeAmount, paymentMethod } =
      formData;
    const data = {
      id: invoice_Id,
      student_id: selectedStudent,
      course_id: selectedCourse,
      // deposited_amount: depositeAmount,
      // payment_method: paymentMethod,
    };
    dispatch(setLoading(true));

    const formDataPayload = new FormData();
    formDataPayload.append("student_id", selectedStudent);
    formDataPayload.append("course_id", selectedCourse);
    formDataPayload.append("deposited_amount", depositeAmount);
    formDataPayload.append("payment_method", paymentMethod);

    if (invoice_Id) {
      formDataPayload.append("id", invoice_Id);
      dispatch({
        type: UPDATE_INVOICE,
        payload: data,
      });
      return;
    }

    dispatch({
      type: ADD_INVOICE,
      payload: formDataPayload,
    });
  };

  React.useEffect(() => {
    if (
      !invoiceCreating &&
      (!isInvoiceCreating || isInvoiceCreating === "false")
    ) {
      navigate("/invoices");
    }
  }, [invoiceCreating, isInvoiceCreating, navigate]);

  React.useEffect(() => {
    const fetchViewInvoiceData = async () => {
      try {
        const invoiceData = await viewInvoice(invoice_Id);
        setUpdated(invoiceData?.data?.data);
      } catch (error) {
        console.error("Error fetching invoice data", error);
      }
    };

    fetchViewInvoiceData();
  }, [invoice_Id]);

  React.useEffect(() => {
    if (updated && invoice_Id) {
      setFormData({
        selectedStudent: JSON.parse(updated?.student_data)?.id || "",
        selectedDuration: JSON.parse(updated?.course_data)?.duration || "",
        selectedCourse: JSON.parse(updated?.course_data)?.id || "",
        selectedCourseFee: JSON.parse(updated?.course_data)?.fee || "",
        depositeAmount: updated?.deposited_amount || "",
        pendingAmount: updated?.pending_amount || "",
        paymentMethod: updated.payment_method || "",
      });
    }
  }, [updated, invoice_Id]);

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
                <Grid item xs={6}>
                  {/* <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Select Student
                    </InputLabel>
                    <Select
                      name="selectedStudent"
                      labelId="selected_student"
                      id="selected_student"
                      value={formData.selectedStudent}
                      label="selected_student"
                      onChange={handleChange}
                    >
                      {loading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        renderStudents
                      )}
                    </Select>
                  </FormControl> */}
                    <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <Autocomplete
                      id="selected_student"
                      options={renderStudents}
                      getOptionLabel={(option) => option.label}
                      value={
                        renderStudents.find(
                          (student) =>
                            student.value === formData.selectedStudent
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        handleChange({
                          target: {
                            name: "selectedStudent",
                            value: newValue ? newValue.value : "",
                          },
                        });
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="Select Student" />
                      )}
                    />
                    {loading && <div>Loading...</div>}
                  </FormControl>
                  {error.selectedStudent && (
                    <Typography className="emailError">
                      {error.selectedStudent}
                    </Typography>
                  )}
                </Grid>

                <Grid item xs={6}>
                  <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                    <InputLabel id="demo-simple-select-label">
                      Course Duration
                    </InputLabel>
                    <Select
                      name="selectedDuration"
                      labelId="duration"
                      id="duration"
                      value={formData?.selectedDuration}
                      label="duration_type"
                      onChange={handleChange}
                    >
                      {loading ? (
                        <MenuItem disabled>Loading...</MenuItem>
                      ) : (
                        renderDuration
                      )}
                    </Select>
                  </FormControl>
                  {error.selectedDuration && (
                    <Typography className="emailError">
                      {error.selectedDuration}
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>

            <FormControl sx={{ width: "100%", marginTop: 2 }} required>
              <InputLabel id="demo-simple-select-label">Course</InputLabel>
              <Select
                name="selectedCourse"
                labelId="course_type"
                id="course_type"
                value={formData?.selectedCourse}
                label="course_type"
                onChange={handleChange}
              >
                {renderCourse}
              </Select>
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: 2 }} required>
              <InputLabel id="demo-simple-select-label">Course Fee</InputLabel>
              <Select
                labelId="coursefee_type"
                id="coursefee_type"
                name="selectedCourseFee"
                value={formData.selectedCourseFee}
                label="coursefee_type"
                onChange={handleChange}
              >
                <MenuItem value={Coursefee.fee}>{Coursefee.fee}</MenuItem>
              </Select>
            </FormControl>              {!invoice_Id && (

            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Box sx={{ width: "100%", marginTop: 2 }}>
                  <TextField
                    required
                    fullWidth
                    type="number"
                    id="name"
                    label="Deposit Amount"
                    name="depositeAmount"
                    autoComplete="name"
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleChange}
                    value={formData.depositeAmount}
                    disabled={invoice_Id ? true : false}
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
                    name="pendingAmount"
                    autoComplete="name"
                    disabled={true}
                    inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleChange}
                    value={formData.pendingAmount}
                  />
                </Box>
              </Grid>
            </Grid>
              )}
            {!invoice_Id && (
              <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                <InputLabel id="demo-simple-select-label">
                  Payment Method
                </InputLabel>
                <Select
                  labelId="payment_type"
                  id="payment_type"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  label="payment_type"
                  onChange={handleChange}
                >
                  {paymentMethods.map((method) => (
                    <MenuItem key={method} value={method}>
                      {method}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            {formData.paymentMethod === "Other" && (
              <FormControl sx={{ width: "100%", marginTop: 2 }} required>
                <TextField
                  required
                  type="text"
                  fullWidth
                  id="otherPaymentMethod"
                  label="Other Payment Method"
                  name="otherPaymentMethod"
                  autoComplete="otherPaymentMethod"
                  inputProps={{ sx: { height: 10, marginTop: 1 } }}
                  value={formData.otherPaymentMethod}
                  onChange={handleChange}
                />
              </FormControl>
            )}
            <Box className="task_form" component="form" onSubmit={handleSubmit}>
              <Box mt={2} sx={{ width: "100%" }}>
                <Button
                  fullWidth
                  type="submit"
                  sx={{ width: "100%", marginBottom: 1.5 }}
                  variant="contained"
                >
                  {invoice_Id ? "Update Invoice" : "Create Invoice"}
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
