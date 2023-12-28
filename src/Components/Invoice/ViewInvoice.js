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
import { viewInvoice } from "../../Services/Invoice_Services";
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import DownloadIcon from "@mui/icons-material/Download";
import { setLoading } from "../../Store/Slices/Invoice";
import { useDispatch, useSelector } from "react-redux";
import { DOWNLOAD_PDF } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { fetchSenderCompany } from "../../Services/Sender_Company_Info";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgb(243 243 243);",
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
  // const paymentListdata = useSelector((state) => state.Payment.paymentList);

  console.log("sfd", data);
  useEffect(() => {
    const fetchViewInvoiceData = async () => {
      try {
        const invoiceData = await viewInvoice(location.state.invoice_id);
        setData(invoiceData?.data?.data);
      } catch (error) {
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
    // { id: "name", label: "Student Name", name: "ddddd" },
    { id: "course", label: "Course Name", name: "fffff" },
    { id: "duration", label: "Duration", name: "cccc" },
    // { id: "Payment Type", label: "Payment Type", name: "eeee" },
    { id: "Total price", label: "Total Fee", name: "ggggg" },
  ];

  // const paidAmountColumn = [
  //   { id: "data", label: "Data" },
  //   { id: "amount", label: "Amount" },
  // ];
  return (
    <ProtectedRoute>
      <Navbar />

      {data ? (
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
              // fontWeight: 600,
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
              {companyData[0]?.phone}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: "4%",
              marginTop: "12px",
            }}
            className="heading"
          >
            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              CIN: {companyData[0]?.cin}
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
              }}
            >
              GSTIN: {companyData[0]?.gstin}
            </Typography>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              marginRight: "4rem",
            }}
          >
           
            <Tooltip title="Download Invoice">
              <DownloadIcon
                className="cursor_pointer"
                onClick={() => downloadInvoice()}
              />
            </Tooltip>
          </Box>
        
          <Typography
            variant="h6"
            sx={{ marginLeft: 16, color: "#f04da5", fontWeight: 900 }}
          >
            {/* Submitted On : {data?.datainvoice[0]?.invoicedate} */}
          </Typography>
          <Grid container spacing={2} marginTop={2}>
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
                    {JSON.parse(data?.student_data)?.name}
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
                  {data?.datainvoice?.[0]?.client_detail?.address}
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
                {/* {data?.data.invoice_number} */}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#585555", marginTop: 2 }}
              >
                {/* Due Date :{data?.datainvoice?.[0]?.duedate} */}
              </Typography>
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
                      <b style={{ color: "#00008d",fontSize: 17 }}>
                        {column?.label}
                      </b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <>
                  <StyledTableRow>
                  
                    <TableCell>{JSON.parse(data?.course_data)?.name}</TableCell>
                    <TableCell>
                      {JSON.parse(data?.course_data)?.duration}
                    </TableCell>
                    <TableCell>
                      {JSON.parse(data?.course_data)?.fee}
                      {data?.totalPrice}
                    </TableCell>
                  </StyledTableRow>
                </>
              </TableBody>
            </Table>
          </TableContainer>
          <Typography  sx={{ marginLeft: 18, marginTop: 3, color:'#EF7CB5', fontWeight:'bold' }}>
            Total Fee Paid:-
          </Typography>
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
                <Grid item sm={4.7}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      fontSize: "18px",
                      // marginLeft: 9,
                      marginTop: 1,
                      color: "#37429A",
                    }}
                  >
                    Subtotal
                  </Typography>
                </Grid>

                <Grid item sm={6}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontSize: "18px",
                      fontWeight: 400,
                      marginTop: 1,
                      width: 103,
                    }}
                  >
                    {JSON.parse(data?.course_data)?.fee}
                  </Typography>
                </Grid>

                <Grid item sm={4.6}>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 400,
                      fontSize: "18px",
                      marginTop: 1,
                      color: "#37429A",
                      // marginLeft: 9,
                    }}
                  >
                    Final Total
                  </Typography>
                </Grid>
                <Grid item sm={6}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 600,
                      color: "rgb(240 0 122)",
                    }}
                  >
                    {JSON.parse(data?.course_data)?.fee}
                  </Typography>
                </Grid>
              </Grid>
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
