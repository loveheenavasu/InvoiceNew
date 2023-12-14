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
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { DOWNLOAD_PDF } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "rgb(243 243 243);",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
export const ViewInvoice = (props) => {
  const { invoices } = useSelector((state) => state.invoices);
  const location = useLocation();
  const [data, setData] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    getViewInvoiceData();
    _getViewInvoiceData();
  }, []);
  const [newTasks, setTasks] = useState([]);

  const showHoursCol = newTasks?.every((task) => {
    if (task?.type == "Fixed") {
      return true;
    } else {
      return false;
    }
  });
  const getViewInvoiceData = async () => {
    const invoiceData = await viewInvoice(location.state.invoice_id);

    setTasks(invoiceData?.data?.data?.invoice?.[0].task_detail);

    // setData(invoiceData?.data?.data);
  };
  const _getViewInvoiceData = async () => {
    const invoiceData = await viewInvoice(location.state.invoice_id);

    setData(invoiceData?.data?.data);
  };

  const downloadInvoice = () => {
    const invoice_id = location.state.invoice_id;
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };

  const bankDetail = [
    {
      name: "Account Holder Name:",
      val: data?.sender?.bank_account_holder_name,
    },
    { name: "Account Number:", val: data?.sender?.bank_account_no },
    { name: "Bank name:", val: data?.sender?.bank_name },
    { name: "IFSC:", val: data?.sender?.bank_ifsc_code },
  ];

  const columns = [
    { id: "Description ", label: "Description  ", name: "ddddd" },
    { id: "Payment Type", label: "Payment Type", name: "eeee" },
    ...(!showHoursCol
      ? [{ id: "number_of_hours", label: "No Of Hours", name: "cccc" }]
      : []),
    ...(!showHoursCol ? [{ id: "Hours", label: "Hours", name: "fffff" }] : []),
    { id: "Total price", label: "Total price ", name: "ggggg" },
  ];
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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "end",
              marginRight: "4rem",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: 500, marginTop: 4, marginLeft: 16 }}
              className="heading"
            >
              Zestgeek
            </Typography>
            <Tooltip title="Download Invoice">
              <DownloadIcon
                className="cursor_pointer"
                onClick={() => downloadInvoice()}
              />
            </Tooltip>
          </Box>
          <Typography variant="h6" sx={{ marginLeft: 16, color: "gray" }}>
            {data?.sender?.location}
          </Typography>
          <Typography variant="h6" sx={{ marginLeft: 16, color: "gray" }}>
            {data?.sender?.phone}
          </Typography>
          <Typography
            variant="h2"
            sx={{
              marginLeft: 16,
              color: "#0632a7",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            Invoice
          </Typography>
          <Typography
            variant="h6"
            sx={{ marginLeft: 16, color: "#f04da5", fontWeight: 900 }}
          >
            Submitted On : {data?.datainvoice[0]?.invoicedate}
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
                    {data?.datainvoice?.[0]?.client_detail?.name}
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
                ZSPL/
                {data?.datainvoice?.[0]?.duedate.slice(-2) +
                  "-" +
                  data?.datainvoice?.[0].duedate.slice(3, 5)}
                /000{data?.datainvoice?.[0].id}
              </Typography>
              <Typography
                variant="h5"
                sx={{ fontWeight: 600, color: "#585555", marginTop: 2 }}
              >
                Due Date :{data?.datainvoice?.[0]?.duedate}
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
              marginTop: 3,
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
                  {columns.map((column) => (
                    <TableCell key={column.id} align={column.align}>
                      <b style={{ color: "#00008d", fontSize: 17 }}>
                        {column.label}
                      </b>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.datainvoice?.map((column) => {
                  return column?.task_detail.map((data, index) => {
                    return (
                      <>
                        <StyledTableRow>
                          <TableCell marginLeft={"30"}>
                            {data.taskName}
                          </TableCell>
                          <TableCell>{data.type}</TableCell>
                          {!showHoursCol && (
                            <TableCell>{data.number_of_hours}</TableCell>
                          )}
                          {!showHoursCol && (
                            <TableCell>{data.hourly_units_worked}</TableCell>
                          )}
                          <TableCell>
                            {column?.currency_symbol}
                            {data.totalPrice}
                          </TableCell>
                        </StyledTableRow>
                      </>
                    );
                  });
                })}
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
                    {data?.datainvoice?.[0]?.currency_symbol}
                    {data?.datainvoice?.[0]?.invoicetotalvalue}
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
                    {data?.invoicetotalvalue?.[0]?.currency_symbol}
                    {data?.datainvoice?.[0]?.invoicetotalvalue}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Box>

          <Box sx={{ display: "flex" }}>
            <>
              <Box sx={{ display: "flex", width: "50%" }}>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 500,
                    marginTop: 4,
                    marginLeft: 16,
                    marginRight: "2rem",
                    color: "#66666C",
                  }}
                >
                  PAN
                </Typography>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, marginTop: 4, color: "#9B9494" }}
                >
                  {data?.sender?.pan}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 500, marginTop: 4, marginBottom: 4 }}
                >
                  Bank Details
                </Typography>
                {(bankDetail || []).map((detail) => {
                  return (
                    <Box sx={{ display: "flex" }}>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 400,
                          width: "200px",
                          fontSize: "18px",
                          marginTop: 1,
                          color: "#66666C",
                        }}
                      >
                        {detail.name}
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 500,
                          fontSize: "18px",
                          marginTop: 1,
                          marginLeft: "2rem",
                          color: "#9B9494",
                        }}
                      >
                        {detail.val}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </>
          </Box>
        </Container>
      ) : (
        <Spinner loading={true} />
      )}
      <Footer />
    </ProtectedRoute>
  );
};
