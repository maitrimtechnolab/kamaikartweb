import { configureStore } from "@reduxjs/toolkit";
import { RoleService } from "../Features/RoleServicesSlice";
import { AuthService } from "../Features/AuthenticationServicesSlice";
import { WhychooseServices } from "../Features/WhyChooseServicesSlice";
import { CategoryServices } from "../Features/CategoryServicesSlice";
import { BannerServices } from "../Features/BannerServicesSlice";
import { Tranding_nd_TopratedServices } from "../Features/Tranding_ND_TopratedServicesSlice";
import { ProductServices } from "../Features/ProductServicesSlice";
import { WishlistServices } from "../Features/WishlistServicesSlice";
import { CartServices } from "../Features/CartServicesSlice";
import { UserAddressServices } from "../Features/AddressServicesSlice";
import { OrderServices } from "../Features/OrderServicesSlice";
import { PaymentServices } from "../Features/PaymentServicesSlice";
import { PromoCodeServices } from "../Features/PromoCodeServicesSlice";
import { FilterServices } from "../Features/FilterServicesSlice";

export const Store = configureStore({
  reducer: {
    RoleOpration: RoleService.reducer,
    AuthOpration: AuthService.reducer,
    WhychooseOpration: WhychooseServices.reducer,
    CategoryOpration: CategoryServices.reducer,
    BannerOpration: BannerServices.reducer,
    Tranding_nd_TopratedOpration: Tranding_nd_TopratedServices.reducer,
    ProductOpration: ProductServices.reducer,
    WishlistOpration: WishlistServices.reducer,
    CartOpration: CartServices.reducer,
    PromocodeOpration: PromoCodeServices.reducer,
    UserAddressOpration: UserAddressServices.reducer,
    OrderOpration: OrderServices.reducer,
    PaymentOpration: PaymentServices.reducer,
    FilterOpration: FilterServices.reducer,
  },
});
