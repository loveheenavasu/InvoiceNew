import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { toast } from "react-toastify";

import { useDispatch} from "react-redux";
import { PAYMENT_LIST, PENDING_AMOUNT } from "../../Store/Action_Constants";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const paymentMethods = [
  "Google Pay",
  "Phone Pay",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Other",
];

const PaymentModal = ({ isOpen, onClose, onPayment, invoiceData }) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    Payment_method: "",
    pay_amount: "",
    otherPaymentMethod: "",
  });

  React.useEffect(() => {
    if (invoiceData && invoiceData.Pending_amount) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        pay_amount: invoiceData.Pending_amount,
      }));
    }
  }, [invoiceData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name === "pay_amount" &&
      Number(value) > Number(invoiceData.Pending_amount)
    ) {
      toast.error("Entered value cannot be greater than Pending Amount");
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: invoiceData.Pending_amount,
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handlePayment = async(e) => {
    e.preventDefault();
    if (!formData.Payment_method || !formData.pay_amount) {
      toast.error("Please fill all the required fields", {
        toastId: "sender_form",
      });
      return;
    }
    const apiFormData = new FormData();
    apiFormData.append("invoice_id", invoiceData.Invoice_Number);
    apiFormData.append("pay_amount", formData.pay_amount);
    apiFormData.append("payment_method", formData.Payment_method);
    dispatch({ type: PENDING_AMOUNT, payload: apiFormData });
    await new Promise(resolve => setTimeout(resolve, 300));
    dispatch({type: PAYMENT_LIST, payload: {"id":invoiceData.Invoice_Number}})
    onPayment(); 
  };


  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="payment-modal-title"
      aria-describedby="payment-modal-description"
    >
      <Box sx={style}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{ position: "absolute", top: 0, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <h2 id="deposited-amounts-modal-title">Pay Pending Amount</h2>

        <FormControl sx={{ width: "100%", marginTop: 3 }} required>
          <InputLabel id="demo-simple-select-label">Payment Method</InputLabel>
          <Select
            labelId="payment_type"
            id="payment_type"
            name="Payment_method"
            label="payment_type"
            value={formData.Payment_method}
            onChange={handleChange}
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {formData.Payment_method === "Other" && (
          <Grid item xs={12}>
            <Box sx={{ width: "100%", marginTop: 2 }}>
              <TextField
                fullWidth
                id="otherPaymentMethod"
                label="Other Payment Method"
                name="otherPaymentMethod"
                autoComplete="otherPaymentMethod"
                inputProps={{ sx: { height: 10, marginTop: 1 } }}
                value={formData.otherPaymentMethod}
                onChange={handleChange}
              />
            </Box>
          </Grid>
        )}
        <Grid item xs={12}>
          <Box sx={{ width: "100%", marginTop: 2 }}>
            <TextField
              required
              type="number"
              fullWidth
              id="pay_amount"
              label="Deposit Amount"
              name="pay_amount"
              autoComplete="pay_amount"
              inputProps={{ sx: { height: 10, marginTop: 1 } }}
              value={formData.pay_amount}
              onChange={handleChange}
            />
          </Box>
        </Grid>

        <Box className="task_form" component="form" onSubmit={handlePayment}>
          <Box mt={2} sx={{ width: "100%" }}>
            <Button
              type="submit"
              sx={{ width: "100%", marginBottom: 1.5 }}
              variant="contained"
            >
              Pay
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default PaymentModal;
