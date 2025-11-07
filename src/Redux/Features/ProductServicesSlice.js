import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ProductService } from "../Services/ProductApi";

export const GetAllProductdata = createAsyncThunk(
  "Product/Getall",
  async (
    {
      page = 1,
      limit = 12,
      main = null,
      sub = null,
      child = null,
      search = null,
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const res = await ProductService.GetAllProduct(
        page,
        limit,
        main,
        sub,
        child,
        search
      );

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const GetProductdatabyId = createAsyncThunk(
  "Product/Get/id",
  async ({ id }, { rejectWithValue }) => {
    try {
      const res = await ProductService.GetProductByID(id);

      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  Products: [],
  Product: null,
  total: 0,
  page: 1,
  limit: 12,
  PersonalProductdata: null,
  Pagination: null,
  productloadings: false,
  producterror: null,
};
export const ProductServices = createSlice({
  name: "ProductOpration",
  initialState,
  reducers: {
    resetProducts: (state) => {
      state.Products = [];
      state.page = 1;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(GetAllProductdata.pending, (state) => {
        state.loading = true;
        state.producterror = null;
      })
      .addCase(GetAllProductdata.fulfilled, (state, action) => {
        state.loading = false;
        state.producterror = null;
        state.Products = [...state.Products, ...action.payload.data];
        state.total = action.payload.total;
        state.page += 1;
      })
      .addCase(GetAllProductdata.rejected, (state, action) => {
        state.loading = false;

        state.producterror = action.payload;
      })
      .addCase(GetProductdatabyId.pending, (state) => {
        state.loading = true;
        state.producterror = null;
      })
      .addCase(GetProductdatabyId.fulfilled, (state, action) => {
        state.loading = false;
        state.producterror = null;
        state.PersonalProductdata = action.payload.data;
      })
      .addCase(GetProductdatabyId.rejected, (state, action) => {
        state.loading = false;
        state.producterror = action.payload;
      });
  },
});
export const { resetProducts } = ProductServices.actions;
