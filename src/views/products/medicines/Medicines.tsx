'use client';

import React, { useEffect, useState } from 'react';
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
import { Delete, Edit } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import api from '@/app/utils/api';

type Product = {
  inventoryId: number;
  product: {
    productId: number;
    productName: string;
    productDescription: string;
  };
  status: number;
  created_at: string;
  updatedAt: string;
  deletedAt?: string | null;
  quantityReceived: number;
  quantitySold: number;
  batchNumber: string;
  expiryDate: string;
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

const Medicines = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const router = useRouter();

  const [formData, setFormData] = useState({
    productId: "",
    batchNumber: "",
    inventoryType: 'Medicine',
    quantityReceived: "",
    expiryDate: "",
  });

  // Fetch products from the server
  const fetchInventories = async () => {
    try {
      const token = Cookies.get('authToken');
      const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicine-inventories`, {
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

  useEffect(() => {
    fetchInventories();
  }, []);

  // Fetch medicines for the dropdown
  // useEffect(() => {
  //   const fetchMedicines = async () => {
  //     try {
  //       const token = Cookies.get('authToken');
  //       // const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`, {
  //       //   headers: {
  //       //     Authorization: `Bearer ${token}`,
  //       //   },
  //       // });
  //       // const data = await response.json();
  //       const res = api.get(`${process.env.NEXT_PUBLIC_APP_URL}/medicines`);
  //       setMedicines(res);
  //     } catch (error) {
  //       console.error("Error fetching medicines:", error);
  //     }
  //   };

     useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const res = await api.get("/medicines");
        setMedicines(res.data);
      } catch (error) {
        console.error("Error fetching mdicines:", error);
      }
    };
  //   fetchMedicines();
  // }, []);

    if (openModal || openEditModal) {
      fetchMedicines();
    }
  }, [openModal, openEditModal]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

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





  const handleSubmit = async (event) => {
     event.preventDefault();
 

    try {
      if (submitLoading) return;
      setSubmitLoading(true);
      await api.post("/inventories", formData);

      await fetchInventories();
      setFormData({
          productId: "",
          quantityReceived: "",
          expiryDate: "",
          batchNumber: "",
          inventoryType: "Medicine",
        });

         setOpenModal(false);
        setSubmitLoading(false);

        Swal.fire({
          title: "Success!",
          text: "Inventory added successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });

    } catch (error) {
       console.error("Error submitting form:", error);
      Swal.fire({
        title: "Oops!",
        text: "An error occurred while adding the product.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = personally.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = products.filter((product) =>
      product?.product?.productName.toLowerCase().includes(query)
    );
    setFilteredProducts(filtered);
    setPage(0);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleDelete = async (product) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get("authToken");
          await api.delete(
            `${process.env.NEXT_PUBLIC_APP_URL}/inventories/${product.inventoryId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          setProducts((prevProducts) => prevProducts.filter((p) => p.inventoryId !== product.inventoryId));
          setFilteredProducts((prevFilteredProducts) => prevFilteredProducts.filter((p) => p.inventoryId !== product.inventoryId));

          Swal.fire("Deleted!", "The product has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the product.", "error");
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedProduct || updateLoading) return;
    setUpdateLoading(true);

    try {
      const token = Cookies.get("authToken");
      const updatedData = {
        productId: selectedProduct.product.productId,
        quantityReceived: selectedProduct.quantityReceived,
        batchNumber: selectedProduct.batchNumber,
        expiryDate: selectedProduct.expiryDate,
      };

      const response = await api.put(
        `${process.env.NEXT_PUBLIC_APP_URL}/inventories/${selectedProduct.inventoryId}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 201) {
        await fetchInventories(); // Refresh the table with updated data

        setOpenEditModal(false);
        setUpdateLoading(false);

        Swal.fire({
          title: "Success!",
          text: "Inventory updated successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        throw new Error("Failed to update inventory.");
      }
    } catch (error) {
      console.error("Error updating inventory:", error);
      Swal.fire({
        title: "Oops!",
        text: "An error occurred while updating the inventory.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    } finally {
      setUpdateLoading(false);
    }
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3>Medicines</h3>
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
                <TableCell>Medicine Name</TableCell>
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

        {/* Modal for New Medicine Inventory */}
        <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
          <DialogTitle>Add New Medicine</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <FormControl fullWidth margin="dense">
                <InputLabel>Select Medicine</InputLabel>
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
              <TextField
                fullWidth
                margin="dense"
                type="date"
                name="expiryDate"
                label="Expiry Date"
                value={formData.expiryDate}
                onChange={handleInputChange}
                required
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="dense"
                type="number"
                name="quantityReceived"
                label="Quantity Received"
                value={formData.quantityReceived}
                onChange={handleInputChange}
                required
              />
              <DialogActions>
                <Button onClick={handleCloseModal} color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary" disabled={submitLoading}>
                  {submitLoading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
                </Button>
              </DialogActions>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Modal */}
        <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
          <Box sx={modalStyle}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center" }}>
              Edit Inventory
            </Typography>
            {selectedProduct && (
              <form onSubmit={handleEditSubmit}>
                <FormControl fullWidth margin="dense">
                  <InputLabel>Select Medicine</InputLabel>
                  <Select
                    value={selectedProduct.product.productId}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        product: {
                          ...selectedProduct.product,
                          productId: e.target.value as number,
                        },
                      })
                    }
                    required
                  >
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
                  value={selectedProduct.batchNumber}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      batchNumber: e.target.value,
                    })
                  }
                />
                <TextField
                  fullWidth
                  margin="dense"
                  type="date"
                  label="Expiry Date"
                  value={selectedProduct.expiryDate}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      expiryDate: e.target.value,
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  fullWidth
                  margin="dense"
                  type="number"
                  label="Quantity Received"
                  value={selectedProduct.quantityReceived}
                  onChange={(e) =>
                    setSelectedProduct({
                      ...selectedProduct,
                      quantityReceived: parseInt(e.target.value, 10),
                    })
                  }
                  required
                />
                <DialogActions>
                  <Button onClick={() => setOpenEditModal(false)} color="secondary">
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary" disabled={updateLoading}>
                    {updateLoading ? <CircularProgress size={24} color="inherit" /> : "Update"}
                  </Button>
                </DialogActions>
              </form>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default Medicines;