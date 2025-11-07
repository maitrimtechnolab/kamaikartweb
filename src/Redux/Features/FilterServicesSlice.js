import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { FilterService } from "../Services/FilterAPI";

export const HomepageFilterData = createAsyncThunk(
  "Homepage/filter/post",
  async (_, { rejectWithValue }) => {
    try {
      const res = await FilterService.HomepageFilter();

      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

export const AfterFilterAppliedFilterData = createAsyncThunk(
  "Homepage/filter/get",
  async (category_id, { rejectWithValue }) => {
    // Accept filterParams
    try {
      const res = await FilterService.HomepageFilterAppliedData(category_id);
      return res;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const initialState = {
  HomePageFilterAPIdata: null,
  FilterLoading: false,
  Filtererror: null,
};

export const FilterServices = createSlice({
  name: "FilterOpration",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(HomepageFilterData.pending, (state) => {
        state.FilterLoading = true;
        state.Filtererror = null;
      })
      .addCase(HomepageFilterData.fulfilled, (state, action) => {
        state.FilterLoading = false;
        state.HomePageFilterAPIdata = action.payload.data;
      })
      .addCase(HomepageFilterData.rejected, (state, action) => {
        state.FilterLoading = false;
        state.Filtererror = action.payload;
      })

      .addCase(AfterFilterAppliedFilterData.pending, (state) => {
        state.FilterLoading = true;
      })
      .addCase(AfterFilterAppliedFilterData.fulfilled, (state, action) => {
        state.FilterLoading = false;
        state.HomePageFilterAPIdata = action.payload.data; // filtered product list
      })
      .addCase(AfterFilterAppliedFilterData.rejected, (state, action) => {
        state.FilterLoading = false;
        state.Filtererror = action.payload;
      });
  },
});
