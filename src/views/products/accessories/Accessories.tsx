'use client';

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Modal,
  Box,
  Button,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { Delete, Edit, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';

type Product = {
  inventoryId: number; // Note: Adjusted to match usage in code
  productId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  quantityReceived: number;
  quantitySold: number;
  product: {
    productName: string;
    productDescription: string;
  };
};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const Accessories = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    productId: '',
    batchNumber: '',
    inventoryType: 'Accessory',
    quantityReceived: '',
    expiryDate: '',
  });

  // Fetch inventories from the server
  const fetchInventories = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('authToken');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/accessories-inventories`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load products data.');
      setLoading(false);
    }
  };

  // Initial fetch of inventories
  useEffect(() => {
    fetchInventories();
  }, []);

  // Fetch list of medicines from API
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/accessories`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setMedicines(data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    if (openModal) {
      fetchMedicines();
    }
  }, [openModal]);

  // Open modal
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitLoading) return;
    setSubmitLoading(true);

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/inventories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.status === 201) {
        // Refetch inventories from the server to get the latest data
        await fetchInventories();

        // Reset form
        setFormData({
          productId: '',
          quantityReceived: '',
          expiryDate: '',
          batchNumber: '',
          inventoryType: 'Accessory',
        });

        // Close modal and stop loading
        setOpenModal(false);
        setSubmitLoading(false);

        Swal.fire({
          title: 'Success!',
          text: 'Inventory added successfully!',
          icon: 'success',
          confirmButtonText: 'Okay',
        });
      } else {
        throw new Error('Failed to add product.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: 'Oops!',
        text: 'An error occurred while adding the product.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter(
      (product) =>
        product?.product?.productName?.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleView = (product: Product) => {
    setSelectedProduct(product);
    setOpenViewModal(true);
  };

  const handleDelete = async (product) => {
    setOpenViewModal(false);
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this product?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get('authToken');
          await axios.delete(
            `${process.env.NEXT_PUBLIC_APP_URL}/inventories/${product.inventoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Refetch inventories to reflect deletion
          await fetchInventories();

          Swal.fire('Deleted!', 'The product has been deleted.', 'success');
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire('Error!', 'Failed to delete the product.', 'error');
        }
      }
    });
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedProducts = filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Accessories</h3>
          <Button variant="contained" color="primary" onClick={handleOpenModal}>
            Receive New Inventory
          </Button>
        </div>
        <TextField
          placeholder="Search by name"
          value={searchQuery}
          onChange={handleSearch}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date Received</TableCell>
                <TableCell>Accessory Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Quantity Received</TableCell>
                <TableCell>Quantity Sold</TableCell>
                <TableCell>Balance</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedProducts.map((product) => (
                <TableRow key={product.inventoryId}>
                  <TableCell>{formatDate(product?.created_at)}</TableCell>
                  <TableCell>{product?.product?.productName}</TableCell>
                  <TableCell>{product?.product?.productDescription}</TableCell>
                  <TableCell>{product?.quantityReceived}</TableCell>
                  <TableCell>{product?.quantitySold}</TableCell>
                  <TableCell>{(product?.quantityReceived || 0) - (product?.quantitySold || 0)}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleView(product)} color="primary">
                      <Visibility />
                    </IconButton>
                    <IconButton onClick={() => handleEdit(product)} color="warning">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(product)} color="error">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 25, 50]}
            component="div"
            count={filteredProducts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>

        {/* Modal for New Accessory Inventory */}
        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>Add New Accessory</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Select Accessory</InputLabel>
                <Select name="productId" value={formData.productId} onChange={handleInputChange} required>
                  {medicines.map((medicine) => (
                    <MenuItem key={medicine.productId} value={medicine.productId}>
                      {medicine.productName} {medicine.productDescription}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                margin="dense"
                label="Batch Number"
                name="batchNumber"
                value={formData.batchNumber}
                onChange={handleInputChange}
              />
              <FormControl fullWidth margin="dense">
                <TextField
                  type="date"
                  name="expiryDate"
                  label="Expiry Date"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <FormControl fullWidth margin="dense">
                <TextField
                  type="number"
                  name="quantityReceived"
                  label="Quantity Received"
                  value={formData.quantityReceived}
                  onChange={handleInputChange}
                  required
                />
              </FormControl>
              <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
                  {submitLoading ? <CircularProgress size={24} color="inherit" /> : 'Submit'}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* View Modal */}
        <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom>
              Product Details
            </Typography>
            {selectedProduct && (
              <>
                <Typography variant="body1">
                  <strong>Product Name:</strong> {selectedProduct?.product?.productName}
                </Typography>
                <Typography variant="body1">
                  <strong>Description:</strong> {selectedProduct?.product?.productDescription}
                </Typography>
                <Typography variant="body1">
                  <strong>Quantity Received:</strong> {selectedProduct?.quantityReceived}
                </Typography>
                <Typography variant="body1">
                  <strong>Quantity Sold:</strong> {selectedProduct?.quantitySold}
                </Typography>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Accessories;