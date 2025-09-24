import axios, { AxiosRequestConfig, AxiosError } from "axios";
import type { Store } from "@reduxjs/toolkit";
import { start, stop } from "@/app/loadingSlice";
import { extractAccessToken, extractRefreshToken } from "@/auth/headerToken";
import Toast from "react-native-toast-message";
import { getCrashlytics, log as clxLog, recordError as clxRecordError } from "@react-native-firebase/crashlytics";

import { resetToAuth } from "@/navigation";

type ApiErrorBody = {
  message: string;
  data: any | null;
  status: "SUCCESS" | "FAIL";
};

const cr = getCrashlytics();

export const baseURL = "http://127.0.0.1:8080";
const REFRESH_URL = "/api/auth/refresh";

export const api = axios.create({
  baseURL: baseURL,
  timeout: 60_000,
});

const refreshClient = axios.create({
  baseURL,
  timeout: 30_000,
});

let accessToken: string | null = null;
let refreshToken: string | null = null;

let isRefreshing = false;
let refreshQueue: Array<{
  resolve: (v: any) => void;
  reject: (e: any) => void;
  original: AxiosRequestConfig & { _retry?: boolean };
}> = [];

function setAuthHeader(cfg: AxiosRequestConfig, token: string) {
  cfg.headers = cfg.headers ?? {};
  (cfg.headers as any)["Authorization"] = `Bearer ${token}`;
}

function enqueue(original: AxiosRequestConfig & { _retry?: boolean }) {
  return new Promise((resolve, reject) => {
    refreshQueue.push({ resolve, reject, original });
  });
}

function flushQueueSuccess(newAccess: string) {
  refreshQueue.forEach(({ resolve, original }) => {
    setAuthHeader(original, newAccess);
    resolve(api(original));
  });
  refreshQueue = [];
}

function flushQueueFail(err: any) {
  refreshQueue.forEach(({ reject }) => reject(err));
  refreshQueue = [];
}

async function refreshTokens(): Promise<string | null> {
  if (!refreshToken) return null;

  try {
    clxLog(cr, "[AUTH] try refresh tokens");

    const res = await refreshClient.post(
      REFRESH_URL,
      {},
      {
        headers: {
          "Refresh-Token": refreshToken,
        },
      }
    );

    const newAccess = extractAccessToken(res.headers);
    const newRefresh = extractRefreshToken(res.headers);
    accessToken = newAccess ?? null;
    refreshToken = newRefresh ?? null;

    if (accessToken) {
      clxLog(cr, "[AUTH] tokens refreshed");
      return accessToken;
    }

    clxRecordError(cr, new Error("Refresh succeeded but no tokens returned"));
    return null;
  } catch (e) {
    clxRecordError(cr, e instanceof Error ? e : new Error("Refresh failed (unknown)"));
    return null;
  }
}

export function setupAxiosInterceptors(store: Store) {
  api.interceptors.request.use(
    (config) => {
      store.dispatch(start());
      clxLog(cr, `REQ [HTTP] ${config.method?.toUpperCase()} ${config.url}`);
      console.debug(config.url);

      if (accessToken && config.url !== "/api/auth/login") setAuthHeader(config, accessToken);

      return config;
    },
    (error) => {
      store.dispatch(stop());
      clxRecordError(cr, error);
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (res) => {
      store.dispatch(stop());
      clxLog(cr, `RES [HTTP] ${res.config.method?.toUpperCase()} ${res.config.url}`);

      const newAccess = extractAccessToken(res.headers);
      const newRefresh = extractRefreshToken(res.headers);
      if (newAccess || newRefresh) {
        accessToken = newAccess ?? accessToken;
        refreshToken = newRefresh ?? refreshToken;
      }

      if (res.data.status === "FAIL") {
        Toast.show({
          type: "error",
          text1: res.data.message ?? "서버 오류",
          position: "top",
          visibilityTime: 5000,
        });
      }

      return res.data;
    },
    async (error: AxiosError<ApiErrorBody>) => {
      store.dispatch(stop());
      clxRecordError(cr, error);

      const original = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;
      if (!original) {
        Toast.show({
          type: "error",
          text1: "서버 오류",
          position: "top",
          visibilityTime: 5000,
        });
        return Promise.reject(error);
      }
      const status = error.response?.status;
      const message = error.response?.data?.message;

      const isAccessExpired = status === 401 && message === "TOKEN_EXPIRED";

      if (isAccessExpired && original.url !== "/api/auth/login") {
        if (isRefreshing) {
          return enqueue(original);
        }
        isRefreshing = true;
        const newToken = await refreshTokens();
        isRefreshing = false;
        if (newToken) {
          flushQueueSuccess(newToken);
          setAuthHeader(original, newToken);
          try {
            return await api(original);
          } catch (e) {
            clxRecordError(cr, e instanceof Error ? e : new Error("Retry after refresh failed"));
          }
        } else {
          const err = new Error("Refresh token expired or refresh failed");
          flushQueueFail(err);

          accessToken = null;
          refreshToken = null;
          refreshQueue = [];
          resetToAuth();
          return Promise.reject(err);
        }
      }
      refreshQueue = [];
      Toast.show({
        type: "error",
        text1: "네크워크 오류",
        position: "top",
        visibilityTime: 5000,
      });
      return Promise.reject(error);
    }
  );
}
