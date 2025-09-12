import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../services/authApi";
import authReducer from "../slices/authSlice";
import { profileApi } from "../services/profileApi";
import { categoryApi } from "../services/categoryApi";
import { manageServicesApi } from "../services/manageServicesApi";
import { subscriptionApi } from "../services/subscriptionApi";
import { faqApi } from "../services/faq.Api";
import { cmsApi } from "../services/cmsApi";
import { bankApi } from "../services/bankApi";
import { analyticsApi } from "../services/analyticsApi";
import { offerApi } from "../services/offersApi";
import { notificationApi } from "../services/notification.Api";

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
      subscriptionApi.middleware
    ),
});

export default store;
