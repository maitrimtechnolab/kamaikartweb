import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { PromocodeService } from "../Services/PromocodeAPI";

export const GetAllPromocodedata = createAsyncThunk(
  "get/promoCodes",
  async (_, { rejectWithValue }) => {
    try {
      const res = await PromocodeService.GetAllPromocode();
      return res.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const ApplyPromoCode = createAsyncThunk(
  "web/checkout",
  async (promo_code_id, { rejectWithValue }) => {
    try {
      const res = await PromocodeService.applyPromoCode({promo_code_id});
      return res;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  Promocodeitem: [],
  Promocodeloading: false,
  Promocodeerror: null,
  appliedPromoResult: null, // add this
};

export const PromoCodeServices = createSlice({
  name: "PromocodeOpration",
  initialState,
  reducers: {
    setPromocode: (state, action) => {        
      state.Promocodeitem = action.payload.data;
    },
  },
  extraReducers: (builder) => {
    builder
      // GET Main
      .addCase(GetAllPromocodedata.pending, (state) => {
        state.Promocodeloading = true;
        state.Promocodeerror = null;
      })
      .addCase(GetAllPromocodedata.fulfilled, (state, action) => {
        state.Promocodeloading = false;
        state.Promocodeitem = action.payload?.data || action.payload || [];
      })
      .addCase(GetAllPromocodedata.rejected, (state, action) => {
        state.Promocodeloading = false;
        state.Promocodeerror = action.payload;
      })
      .addCase(ApplyPromoCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ApplyPromoCode.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedPromoResult = action.payload.data;
      })
      .addCase(ApplyPromoCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    },
});

export const { setPromocode } = PromoCodeServices.actions;