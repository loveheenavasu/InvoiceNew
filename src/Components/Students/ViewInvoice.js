import React, { useEffect } from "react";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { Container, Divider, Typography, Box, Grid } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import { setLoading } from "../../Store/Slices/Students";
import { useDispatch, useSelector } from "react-redux";
import {
  DOWNLOAD_PDF,
  GET_SENDER_COMPANY,
  GET_STUDENT,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";


const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    // backgroundColor: "rgb(243 243 243);",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const ViewInvoice = (props) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { senderCompany: companyData } = useSelector(
    (state) => state.senderCompanyInfo
  );

  const { loading, student: data, paymentList } = useSelector((state) => state.Students);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_STUDENT, payload: location?.state.invoice_id });

  }, [dispatch, location.state.invoice_id]);

  useEffect(() => {
    dispatch({ type: GET_SENDER_COMPANY });
  }, [dispatch]);

  const downloadInvoice = () => {
    const invoice_id = location.state.invoice_id;
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };


  const columns = [
    { id: "date", label: "Date", name: "fffff" },
    { id: "payment_mode", label: "Payment Mode", name: "cccc" },
    { id: "received_amount", label: "Received", name: "ggggg" },
    { id: "pending_amount", label: "Pending", name: "ggggg" },
    // { id: "total", label: "Total (Rs)", name: "ggggg" },
  ];

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedMonth = String(date.getUTCMonth() + 1).padStart(2, '0');
    const formattedYear = String(date.getUTCFullYear()).slice(-2);
    return `${formattedMonth}-${formattedYear}`;
  }
  const currentDate = new Date();
const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

  function fullDate(dateString) {
    const dateObject = new Date(dateString);
    const year = dateObject.getFullYear();
    // const month = dateObject.getMonth() + 1; // Months are 0-indexed, so add 1
    const month = monthNames[dateObject.getMonth()]
    const day = dateObject.getDate();
    return `${month} ${day}, ${year}`
  }

  let totalReceivedAmount = 0;

  const totalRecieved = paymentList.map((data) => {
    totalReceivedAmount += data?.received_amount;
    return data?.received_amount;
  }

  )

  return (
    <ProtectedRoute>
      <Navbar />
      {loading ? (
        <Spinner loading={true} />
      ) : (
        <Container className="invoice-container">
          <Divider
            sx={{
              borderBottomWidth: 20,
              bgcolor: "#0632a7",
              marginLeft: 14,
              marginRight: 8,
            }}
          />

          <Box
            sx={{
              marginLeft: 14,
              marginRight: 8,
              textAlign: "center",
              color: "#000000",
              fontWeight: 700,
              backgroundColor: "#efefef",
            }}
            className="heading"
          >
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {companyData[0]?.name}
            </Typography>
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              {companyData[0]?.address}
            </Typography>
            {/* <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              +91 {companyData[0]?.phone}
            </Typography> */}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              marginRight: "4rem",
            }}
          >
            <Grid>
              <Typography
                sx={{ marginLeft: 18, color: "#EF7CB5", fontWeight: 900 }}
              >
                Invoice Number:- {`ZT/${formatDate(data?.created_at)}/00${data?.id}`}
              </Typography>
            </Grid>

            <div style={{ display: "flex", gap: "150px" }}>
              <Typography
                sx={{ color: "#EF7CB5", fontWeight: 900 }}
              >
                Invoice Date:- {formattedDate}
                {/* Invoice Date:- {fullDate(data?.created_at)} */}
              </Typography>
              <Tooltip title="Download Invoice">
                <DownloadIcon
                  onClick={downloadInvoice}
                  className="cursor_pointer"
                />
              </Tooltip>
            </div>
          </Box>

          <Grid container spacing={2} sx={{ marginTop: 1.5, ml: 0.2 }}>
            <Grid item xs={6}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, marginLeft: 16 }}
                >
                  Invoice for
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 500,
                      fontSize: "18px",
                      marginTop: 1,
                      marginLeft: "8rem",
                      color: "#66666C",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        display: "inline",
                        fontSize: "18px",
                        color: "black",
                      }}
                    >
                      Name: {""}
                    </Typography>
                    {data?.name}
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginTop: 1,
                    marginLeft: "8rem",
                    color: "#66666C",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "inline",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Phone: {""}
                  </Typography>
                  +91 {data?.phone}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginTop: 1,
                    marginLeft: "8rem",
                    color: "#66666C",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "inline",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Email: {""}
                  </Typography>
                  {data?.email}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={5} sx={{ ml: "-10px" }}>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 600, marginLeft: 16 }}
                >
                  Course Details
                </Typography>
                <Box sx={{ display: "flex" }}>
                  <Typography
                    variant="h5"
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      fontWeight: 500,
                      fontSize: "18px",
                      marginTop: 1,
                      marginLeft: "8rem",
                      color: "#66666C",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 500,
                        display: "inline",
                        fontSize: "18px",
                        color: "black",
                      }}
                    >
                      Name: {""}
                    </Typography>
                    {data?.course}
                  </Typography>
                </Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginTop: 1,
                    marginLeft: "8rem",
                    color: "#66666C",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "inline",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Course Duration: {""}
                  </Typography>
                  {data?.course_duration}
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginTop: 1,
                    marginLeft: "8rem",
                    color: "#66666C",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "inline",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Fees: {""}
                  </Typography>
                  {data?.course_fee} {" "} {data?.discount !== 0 && `(Dis-  ${data?.discount}%)`
                  }
                </Typography>
                {data?.discount !== 0 && <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    fontSize: "18px",
                    marginTop: 1,
                    marginLeft: "8rem",
                    color: "#66666C",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 500,
                      display: "inline",
                      fontSize: "18px",
                      color: "black",
                    }}
                  >
                    Fees After Discount: {""}
                  </Typography>
                  {data?.after_discount_fee}
                </Typography>}
              </Box>
            </Grid>

          </Grid>
          <Typography
            variant="h5"
            sx={{ fontWeight: 500, marginTop: 5, marginLeft: 8, color: "gray" }}
          ></Typography>
          <Divider
            sx={{
              borderBottomWidth: 2,
              bgcolor: "#d4d4d4",
              marginLeft: 16,
              marginRight: 8,
            }}
          />
          <TableContainer
            sx={{
              marginTop: 2,
              marginLeft: 16,
              overflow: "auto",
              width: "94%",
              display: "flex",
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              className="invoice-table"
            >
              <TableHead>
                <TableRow>
                  {columns?.map((column) => (
                    <TableCell key={column?.id} align={column?.align}>
                      <b style={{ color: "#00008d", fontSize: 17 }}>
                        {column?.label}
                      </b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>


              <TableBody>

                {paymentList?.map((payment, index) => (
                  <StyledTableRow key={index}>
                    <TableCell>{payment?.deposit_date}</TableCell>
                    <TableCell>{payment?.payment_method}</TableCell>
                    <TableCell>{payment?.received_amount}</TableCell>
                    <TableCell>{payment?.pending_amount !== 0 ? payment?.pending_amount : "-" }</TableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider
            sx={{
              borderBottomWidth: 2,
              bgcolor: "#d4d4d4",
              marginLeft: 16,
              marginRight: 8,
            }}
          />
          <Box className="invoice-view-total">
            <Box className="invoice-total">
              <Grid container spacing={2}>
                <Grid item>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      fontSize: "22px",
                      marginTop: 4,
                      color: "#EF7CB5",
                      // marginRight: 0,
                    }}
                  >
                    Total Amount Received:- INR {totalReceivedAmount}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            mt={5}
          >
            <Box p={2} maxWidth="700px">
              <Typography
                sx={{ fontSize: "12px", textAlign: "center" }}
                gutterBottom
              >
                If you have any questions or concerns about this invoice, please
                contact us at +91 {companyData[0]?.phone}.
              </Typography>

              <hr />

              <Typography
                variant="body2"
                style={{
                  fontStyle: "italic",
                  marginTop: "10px",
                  color: "#555",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                [<b>Note:</b> This is a computer-generated invoice, there is no
                need for a signature.]
              </Typography>

              <Typography
                variant="body1"
                style={{
                  fontStyle: "italic",
                  marginTop: "10px",
                  color: "#007BFF",
                  textAlign: "center",
                  fontSize: "12px",
                }}
              >
                Thank you for choosing {companyData[0]?.name}!
              </Typography>
            </Box>
          </Box>
        </Container >
      )}

      <Footer />
    </ProtectedRoute >
  );
};
