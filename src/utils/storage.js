// src/utils/storage.js — LocalStorage helpers

const S = {
  get: (k)    => { try { return JSON.parse(localStorage.getItem("az_" + k)); } catch { return null; } },
  set: (k, v) => { try { localStorage.setItem("az_" + k, JSON.stringify(v)); } catch {} },
  del: (k)    => { try { localStorage.removeItem("az_" + k); } catch {} },
};

export default S;