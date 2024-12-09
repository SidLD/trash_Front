import axios from "axios";;
import { dataHeader } from "./helper";
import { RegisterUserType, LoginType, FoodWasteType } from "./interface";
console.log(import.meta.env.VITE_API_URL)
export const login = (data:LoginType) => {
    return new Promise((resolve, reject) => {
      axios
        .post(`${import.meta.env.VITE_API_URL}/login`, data)
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
      .post(`${import.meta.env.VITE_API_URL}/register`, data, dataHeader())
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
      .put(`${import.meta.env.VITE_API_URL}/user/status`, data, dataHeader())
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
        .get(`${import.meta.env.VITE_API_URL}/users`, {
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
        .delete(`${import.meta.env.VITE_API_URL}/user`, {
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


//Food Waste
export const createRecord = (data:FoodWasteType) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`${import.meta.env.VITE_API_URL}/food-waste`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

  
export const getRecords = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/food-waste`, {
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

export const updateRecordStatus = (id: string, data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/food-waste/${id}/status`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const deleteRecord = (data:{recordId: string}) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(`${import.meta.env.VITE_API_URL}/food-waste`, {
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

//Stat
export const getStat = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/stat`, {
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

export const getContributorStat = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/contributor/stat`, {
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

//Setting
export const getUserSetting = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/user/setting`, {
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

export const updateUserSetting = (data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/user/setting`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

//Notification
export const getContriNotification = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/notifications`, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};

export const updateNotification = (id:string, data:any) => {
  return new Promise((resolve, reject) => {
    axios
      .put(`${import.meta.env.VITE_API_URL}/notifications/${id}`, data, dataHeader())
      .then((res:any) => {
        resolve(res);
      })
      .catch((err:any) => {
        reject(err);
      });
  });
};