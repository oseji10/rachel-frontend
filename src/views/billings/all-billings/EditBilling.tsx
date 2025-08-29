import { useEffect, useState } from "react";
import axios from "axios";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import api from "@/app/utils/api";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const EditBillingModal = ({ open, handleClose, billingData, refreshBillings }) => {
  const [updatedBilling, setUpdatedBilling] = useState(billingData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (billingData) {
      setUpdatedBilling(billingData);
    }
  }, [billingData]);

  const handleChange = (e) => {
    setUpdatedBilling({ ...updatedBilling, [e.target.name]: e.target.value });
  };

  const handleUpdateBilling = async () => {
    setLoading(true);
    const token = Cookies.get("authToken");

    try {
      const response = await api.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/billings/${billingData.id}`,
        updatedBilling,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire("Success", "Billing updated successfully!", "success");
        refreshBillings();
        handleClose();
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update billing!",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" gutterBottom>
          Edit Billing
        </Typography>

        <TextField
          fullWidth
          margin="normal"
          label="Transaction ID"
          name="transactionId"
          value={updatedBilling.transactionId}
          disabled
        />

        <TextField
          fullWidth
          margin="normal"
          label="Patient Name"
          value={`${billingData?.patient?.firstName} ${billingData?.patient?.lastName}`}
          disabled
        />

        <TextField
          fullWidth
          margin="normal"
          label="Total Cost (₦)"
          name="total_cost"
          type="number"
          value={updatedBilling.total_cost || ""}
          onChange={handleChange}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Method</InputLabel>
          <Select
            name="paymentMethod"
            value={updatedBilling.paymentMethod || ""}
            onChange={handleChange}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Payment Status</InputLabel>
          <Select
            name="paymentStatus"
            value={updatedBilling.paymentStatus || ""}
            onChange={handleChange}
          >
            <MenuItem value="Paid">Paid</MenuItem>
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Box mt={2} display="flex" justifyContent="space-between">
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleUpdateBilling} variant="contained" color="primary" disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Update"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditBillingModal;
