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
import { getCoursePayload } from "../../CommonComponents/coursePayload";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "../../Store/Slices/Courses";
import {
  GET_COURSE,
  SAVE_COURSE,
  UPDATE_COURSE,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { useNavigate, useParams } from "react-router-dom";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
const theme = createTheme();

export default function CreateCourse() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { loading, courseCreating, course } = useSelector(
    (state) => state.Courses
  );
  const navigate = useNavigate();
  const isCourseCreating = JSON.parse(localStorage.getItem("coursecreating"));
  const [courseInfo, setCourseInfo] = React.useState({
    name: "",
    duration: "",
    fee: "",
  });
  const [error, setError] = React.useState({ name: "", duration: "", fee: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const payload = getCoursePayload(data);
    if (!payload.name || !payload.duration || !payload.fee) {
      toast.error("Please fill all the required fields", {
        toastId: "sender_form",
      });
      return;
    }
    if (error.name) {
      toast.error("Please Enter valid Course Name");
      return;
    }
    if (error.duration) {
      toast.error("Phone Number must have 3 digits");
      return;
    }
    if (error.fee) {
      toast.error("fee Number must have 3 digits");
      return;
    }
    dispatch(setLoading(true));
    if (id) {
      payload.id = courseInfo.id;
      dispatch({
        type: UPDATE_COURSE,
        payload: payload,
      });
      return;
    }

    dispatch({
      type: SAVE_COURSE,
      payload: payload,
    });
  };

  React.useEffect(() => {
    if (id) setCourseInfo(course);
  }, [course, id]);

  React.useEffect(() => {
    if (id) {
      dispatch(setLoading(true));
      dispatch({ type: GET_COURSE, payload: id });
    }
  }, [dispatch, id]);



  React.useEffect(() => {
    if (
      !courseCreating &&
      (!isCourseCreating || isCourseCreating === "false")
    ) {
      navigate("/course");
    }
  }, [courseCreating, isCourseCreating, navigate]);

  const handleInput = (e) => {
    if (e.target.name === "name") {
      if (e.target.value === "") {
        setError({ ...error, name: "Course Name is required" });
      } else {
        setError({ ...error, name: "" });
      }
    }
    if (e.target.name === "duration") {
      if (e.target.value === "") {
        setError({
          ...error,
          duration: "Duration is required",
        });
      } else {
        setError({ ...error, duration: "" });
      }
    }
    if (e.target.name === "fee") {
      if (e.target.value === "") {
        setError({
          ...error,
          fee: "Fee is required",
        });
      } else {
        setError({ ...error, fee: "" });
      }
    }

    setCourseInfo({ ...courseInfo, [e.target.name]: e.target.value });
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Spinner loading={loading} />
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="" className="main-container">
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
              {id ? "Update Course" : "Create Course"}
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 3 }}
              width={"400px"}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="coursename"
                    label="Course Name"
                    name="name"
                    autoComplete="coursename"
                    // inputProps={{ sx: { height: 10, marginTop: 1 } }}
                    onChange={handleInput}
                    value={courseInfo.name}
                  />
                  {error.name && (
                    <Typography className="emailError">{error.name}</Typography>
                  )}
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel id="demo-simple-select-label">
                      Course Duration
                    </InputLabel>
                    <Select
                      labelId="Courseduration"
                      id="Courseduration"
                      name="duration"
                      value={courseInfo.duration}
                      label="Courseduration"
                      onChange={handleInput}
                    >
                      <MenuItem value="3-4 Months">3-4 Months</MenuItem>
                      <MenuItem value="6 Months">6 Months</MenuItem>
                    </Select>
                  </FormControl>
                  {error.duration && (
                    <Typography className="emailError">
                      {error.duration}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    type="number"
                    required
                    fullWidth
                    id="Coursefee"
                    label="Course Fee"
                    name="fee"
                    autoComplete="Coursefee"
                    value={courseInfo.fee}
                    onChange={handleInput}
                  />
                  {error.fee && (
                    <Typography className="emailError">{error.fee}</Typography>
                  )}
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
                  {id ? "Update Course" : "Create Course"}
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
