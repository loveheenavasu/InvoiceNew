import React, { useEffect, useState } from "react";
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
import { viewInvoice } from "../../Services/Students_Services";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import { setLoading } from "../../Store/Slices/Invoice";
import { useDispatch, useSelector } from "react-redux";
import { DOWNLOAD_PDF } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { fetchSenderCompany } from "../../Services/Sender_Company_Info";
import { toast } from "react-toastify";

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
  const [data, setData] = useState();
  const [companyData, setCompanyData] = useState();
  const dispatch = useDispatch();
  const {loading} = useSelector((state) => state.invoices);
  console.log("loading",loading)
  
  useEffect(() => {
    const fetchViewInvoiceData = async () => {
      try {
        const invoiceData = await viewInvoice(location.state.invoice_id);
        setData(invoiceData?.data?.data);
      } catch (error) {
        toast.error(error.message);
        console.error("Error fetching invoice data", error);
      }
    };

    fetchViewInvoiceData();
  }, [location.state.invoice_id]);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const companyData = await fetchSenderCompany();
        setCompanyData(companyData?.data?.data);
      } catch (error) {
        console.error("Error fetching invoice data", error);
      }
    };

    fetchCompanyData();
  }, []);

  const downloadInvoice = () => {
    const invoice_id = location.state.invoice_id;
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };

  const columns = [
    { id: "course", label: "Course Name", name: "fffff" },
    { id: "duration", label: "Duration", name: "cccc" },
    { id: "course fee", label: "Course Fee (Rs)", name: "ggggg" },
    { id: "discount", label: "Discount (%)", name: "ggggg" },
    { id: "total", label: "Total (Rs)", name: "ggggg" },
  ];

  return (
    <ProtectedRoute>
      <Navbar />

      {data && companyData ? (
        <Container className="invoice-container">
          <Divider
            sx={{
              borderBottomWidth: 20,
              bgcolor: "#0632a7",
              marginLeft: 14,
              marginRight: 8,
            }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 500,
              marginLeft: 14,
              marginRight: 8,
              textAlign: "center",
              color: "#000000",
              backgroundColor: "#cccccc",
            }}
            className="heading"
          >
            Invoice
          </Typography>

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
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              +91 {companyData[0]?.phone}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              marginRight: "4rem",
            }}
          >
            <Typography
              sx={{ marginLeft: 18, color: "#EF7CB5", fontWeight: 900 }}
            >
              Invoice Date:- {new Date(data.created_at).toLocaleString()}
            </Typography>
            <div>
              <Tooltip title="Download Invoice">
                <DownloadIcon
                  onClick={() => downloadInvoice()}
                  className="cursor_pointer"
                />
              </Tooltip>
            </div>
          </Box>
          <Grid container spacing={2} sx={{ marginTop: 1.5, ml: 0.2 }}>
            <Grid item xs={8}>
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
                  {data?.datainvoice?.[0]?.client_detail?.pin}
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
                  {data?.datainvoice?.[0]?.client_detail?.pan}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                Invoice #
              </Typography>
              <Typography variant="h6" sx={{ color: "gray", marginTop: 1 }}>
                {`ZSPL/${new Date(data.created_at).toLocaleDateString("en-US", {
                  year: "2-digit",
                  month: "numeric",
                })}/${data.id}`}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#585555", marginTop: 2 }}
              ></Typography>
              <Typography
                variant="h6"
                sx={{ color: "gray", marginTop: 1 }}
              ></Typography>
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
                <>
                  <StyledTableRow>
                    <TableCell>{data?.course}</TableCell>
                    <TableCell>{data?.course_duration}</TableCell>
                    <TableCell>{data?.course_fee}</TableCell>
                    <TableCell>{data?.discount}</TableCell>
                    <TableCell>{data?.after_discount_fee}</TableCell>
                  </StyledTableRow>
                </>
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
                      marginTop: 1,
                      color: "#EF7CB5",
                      // marginRight: 0,
                    }}
                  >
                    Total Amount Received:- INR {data.deposit_amount}
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
          >
            <Box p={2} maxWidth="700px">
              <Typography sx={{ fontSize: "15px" }} gutterBottom>
                If you have any questions or concerns about this invoice, please
                contact us at +91 {companyData[0]?.phone}.
              </Typography>

              <hr />

              <Typography
                variant="body2"
                style={{
                  fontStyle: "italic",
                  marginTop: "16px",
                  color: "#555",
                }}
              >
                [<b>Note:</b> This is a computer-generated invoice, there is no
                need for a signature.]
              </Typography>

              <Typography
                variant="body1"
                style={{
                  fontStyle: "italic",
                  marginTop: "16px",
                  color: "#007BFF",
                }}
              >
                Thank you for choosing {companyData[0]?.name}!
              </Typography>
            </Box>
          </Box>
        </Container>
      ) : (
        <Spinner loading={true} />
      )}
      <Footer />
    </ProtectedRoute>
  );
};
