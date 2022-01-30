export const retry = (fn, retriesLeft = 4, interval = 1000) =>{
    return new Promise((resolve, reject) => {
      fn()
        .then(resolve)
        .catch((error) => {
          setTimeout(() => {
            if (retriesLeft === 1) {
              // reject('maximum retries exceeded');
              reject(error);
              alert("Failed to load due to a network error. Please check your internet connection and try again. If the problem still occurs, then use a VPN.");
              return;
            }
  
            // Passing on "reject" is the important part
            retry(fn, retriesLeft - 1, interval).then(resolve, reject);
          }, interval);
        });
    });
  }