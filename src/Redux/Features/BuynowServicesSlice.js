import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BuynowService } from "../Services/BuynowAPI";

export const BuyNow = createAsyncThunk(
    "Buy/Now",
    async ({ product_id, variant_id, address_id, payment_id, razor_payment_id }, { rejectWithValue }) => {
        try {
        const res = await BuynowService.BuyNow(product_id, variant_id, address_id, payment_id, razor_payment_id);
            return res;
        } catch (err) {
        return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const initialState = {
    BuynowData: null,
    total: 0,
    BuynowLoading: false,
    BuynowError: false,
};

export const BuynowServices = createSlice({
    name: "BuynowOpration",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(BuyNow.pending, (state) => {
            state.BuynowLoading = true;
            state.BuynowError = null;
        })
        .addCase(BuyNow.fulfilled, (state, action) => {
            state.BuynowData = action.payload.data;
            state.BuynowLoading = false;
        })
        .addCase(BuyNow.rejected, (state, action) => {
            state.BuynowLoading = false;
            state.BuynowError = action.payload;
        });
    },
});