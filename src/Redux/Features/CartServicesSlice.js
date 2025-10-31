import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CartService } from "../Services/CartAPI";

export const AddTOCart = createAsyncThunk(
  "Add/Cart",
  async ({ product_id, variant_id }, { rejectWithValue }) => {
    try {
      console.log(variant_id);

      const res = await CartService.ADDCart(product_id, variant_id);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const UpdateQuentity = createAsyncThunk(
  "update/Cart",
  async ({ product_id, quantity }, { rejectWithValue }) => {
    try {
      const res = await CartService.UpdateCartQuentity(product_id, quantity);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const DeleteTOCart = createAsyncThunk(
  "delete/Cart",
  async (product_index, { rejectWithValue }) => {
    try {
      const res = await CartService.DeleteCart(product_index);
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const GetCartData = createAsyncThunk(
  "Cart/Get",
  async (_, { rejectWithValue }) => {
    try {
      const res = await CartService.GetCart();
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);
const initialState = {
  CartData: [],
  total: 0,
  CartLoading: false,
  CartError: false,
};

export const CartServices = createSlice({
  name: "CartOpration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(AddTOCart.pending, (state) => {
        state.CartLoading = true;
        state.CartError = null;
      })
      .addCase(AddTOCart.fulfilled, (state, action) => {
        state.CartData = action.payload.data;

        state.CartLoading = false;
      })
      .addCase(AddTOCart.rejected, (state, action) => {
        state.loading = false;
        state.CartError = action.payload;
      });
    builder
      .addCase(DeleteTOCart.pending, (state) => {
        state.CartLoading = true;
        state.CartError = null;
      })
      .addCase(DeleteTOCart.fulfilled, (state, action) => {
        state.CartLoading = false;
        const deletedIndex = action.meta.arg;
        state.CartData = state.CartData.filter(
          (item) => item.id !== deletedIndex
        );
      })
      .addCase(DeleteTOCart.rejected, (state, action) => {
        state.CartLoading = false;
        state.CartError = action.payload;
      })
      .addCase(GetCartData.pending, (state) => {
        state.CartLoading = true;
        state.CartError = null;
      })
      .addCase(GetCartData.fulfilled, (state, action) => {
        state.CartData = action.payload.data;
        state.total = action.payload.total;

        console.log(action.payload.data);

        state.CartLoading = false;
      })
      .addCase(GetCartData.rejected, (state, action) => {
        state.CartLoading = false;
        state.CartError = action.payload;
      })
      .addCase(UpdateQuentity.pending, (state) => {
        state.CartLoading = true;
        state.CartError = null;
      })
      .addCase(UpdateQuentity.fulfilled, (state, action) => {
        state.CartLoading = false;
        // Optimistically update the UI immediately
        const { product_id, quantity } = action.meta.arg;
        const item = state.CartData.find((item) => item.id === product_id);
        if (item) {
          item.quantity = quantity;
        }
      })
      .addCase(UpdateQuentity.rejected, (state, action) => {
        state.CartLoading = false;
        state.CartError = action.payload;
      });
  },
});
