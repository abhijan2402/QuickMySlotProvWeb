import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../slices/authSlice";
import { profileApi } from "../services/profileApi";
import { categoryApi } from "../services/categoryApi";
import { manageServicesApi } from "../services/manageServicesApi";
import { subscriptionApi } from "../services/subscriptionApi";
import { cmsApi } from "../services/cmsApi";
import { bankApi } from "../services/bankApi";
import { analyticsApi } from "../services/analyticsApi";
import { offerApi } from "../services/offersApi";
import { walletApi } from "../services/walletApi";
import { vendorTransactionApi } from "../services/vendorTransactionListApi";
import { notificationApi } from "../services/notificationApi";
import { faqApi } from "../services/faqApi";
import { supportApi } from "../services/supportApi";
import { bannerApi } from "../services/bannerApi";
import { bidApi } from "../services/bidApi";

const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
    [manageServicesApi.reducerPath]: manageServicesApi.reducer,
    [subscriptionApi.reducerPath]: subscriptionApi.reducer,
    [cmsApi.reducerPath]: cmsApi.reducer,
    [faqApi.reducerPath]: faqApi.reducer,
    [bankApi.reducerPath]: bankApi.reducer,
    [analyticsApi.reducerPath]: analyticsApi.reducer,
    [offerApi.reducerPath]: offerApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    [walletApi.reducerPath]: walletApi.reducer,
    [vendorTransactionApi.reducerPath]: vendorTransactionApi.reducer,
    [supportApi.reducerPath]: supportApi.reducer,
    [bannerApi.reducerPath]: bannerApi.reducer,
    [bidApi.reducerPath]: bidApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      profileApi.middleware,
      categoryApi.middleware,
      manageServicesApi.middleware,
      faqApi.middleware,
      cmsApi.middleware,
      bankApi.middleware,
      analyticsApi.middleware,
      offerApi.middleware,
      notificationApi.middleware,
      walletApi.middleware,
      vendorTransactionApi.middleware,
      supportApi.middleware,
      bannerApi.middleware,
      bidApi.middleware,
      subscriptionApi.middleware
    ),
});

export default store;
