import axios from "axios";;
import { dataHeader } from "./helper";
import { RegisterUserType, LoginType } from "./interface";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:LoginType) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}login`, data)
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const register = (data:RegisterUserType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}register`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const updateUser = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}user/status`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const getUsers = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .get(`${import.meta.env.VITE_API_URL}users`, {
            data, ...dataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
};

export const deleteUser = (data:any) => {
    return new Promise((resolve, reject) => {
      axios
        .delete(`${import.meta.env.VITE_API_URL}user`, {
            data,
            ...dataHeader()
        })
        .then((res:any) => {
          resolve(res);
        })
        .catch((err:any) => {
          reject(err);
        });
    });
  };
  