import axios from "axios";
import { useEffect } from "react";

const URL = "http://54.180.107.216:8080/api";

const ACCESS_TOKEN =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJwcmVzc2VydmVyIiwic3ViIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTc2MTQ2Njc1NSwiZXhwIjoxNzcxODM0NzU1LCJpZCI6MX0.VFgcUkV-Npo58I85H9A1iDIbzkBndTma-D7TZZfS5FU";

const api = axios.create({
  baseURL: URL,
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`,
  },
});

export default api;
