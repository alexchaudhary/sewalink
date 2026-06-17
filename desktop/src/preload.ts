import { contextBridge } from "electron";

contextBridge.exposeInMainWorld("sewalinkDesktop", {
  version: process.env.npm_package_version,
});
