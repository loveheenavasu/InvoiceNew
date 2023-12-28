import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { getStudentPayload } from "../../CommonComponents/studentPayload";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Students";
import {
  GET_STUDENT,
  SAVE_STUDENT,
  UPDATE_STUDENT,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
const theme = createTheme();


export default function CreateStudent() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, studentCreating, student } = useSelector(
    (state) => state.Students
  );
  const navigate = useNavigate();
  const isStudentCreating = JSON.parse(localStorage.getItem("studentcreating"));
  const [studentInfo, setStudentInfo] = React.useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [error, setError] = React.useState({ name: "", email: "", phone: "", address:"" });
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = getStudentPayload(data);

    if (!payload.name || !payload.email || !payload.phone || !payload.address) {
      toast.error("Please fill all the required fields", {
        toastId: "sender_form",
      });
      return;
    }
    if (error.name) {
      toast.error("Please Enter valid Name");
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

      payload.id = studentInfo.id;
      dispatch({
        type: UPDATE_STUDENT,
        payload: studentInfo,
      });
      return;
    }
    
    dispatch({
      type: SAVE_STUDENT,
      payload: payload,
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
    if (e.target.name === "name") {
      if (e.target.value === "" ) {
        setError({ ...error, name: "Name is required" });
      } else {
        setError({ ...error, name: "" });
      }
    }
    if (e.target.name === "email") {
      if (e.target.value !== "" && !isValidEmail(e.target.value)) {
        setError({ ...error, email: "Email is invalid" });
      } else {
        setError({ ...error, email: "" });
      }
    }
  
    if (e.target.name === "phone") {
      if (
        e.target.value !== "" &&
        (e.target.value.length > 10 || e.target.value.length < 10)
      ) {
        setError({
          ...error,
          phone: "Phone number must be atleast 10 numbers",
        });
      } else {
        setError({ ...error, phone: "" });
      }
    }
    if (e.target.name === "address") {
      if (
        e.target.value === "" ) {
        setError({
          ...error,
          address: "Address is required",
        });
      } else {
        setError({ ...error, address: "" });
      }
    }

      
    setStudentInfo({ ...studentInfo, [e.target.name]: e.target.value });
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="sm" className="main-container">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 16,
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
              sx={{ mt: 3 }}

            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
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
                {error.name && <Typography className="emailError">{error.name}</Typography>}
                </Grid>
                <Grid item xs={12}>
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
                {error.email &&  <Typography className="emailError">{error.email}</Typography>}
                </Grid>
                <Grid item xs={12}>
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
                <Grid item xs={12}>
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
                  />
                  <Typography className="emailError">{error.address}</Typography>

                </Grid>
              </Grid>
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
