function map(arr, callback, done) {
  const result = [];
  let i = 0;

  function errorHandler(message) {
    const error = new Error(message);
    console.error('Error during mapping:', error);
    return;
  }
    
  if (!Array.isArray(arr)) {
    return errorHandler('Data type must be an array');
  }
  
  function processNext() {
    if (i >= arr.length) {
      return done(result);
    }

    const item = arr[i];
    callback(item, (transformedItem) => {
      result.push(transformedItem);
      i++;
      processNext();
    });
  }
  
  processNext();
  }
  
  function demoMap() {
    const data = [1, 2, 3, 4, 5];
    map(
      data,
      (item, next) => {
        setTimeout(() => {
          const transformed = item * 2;
          next(transformed);
        }, 10);
      },
      (result) => {
        console.log("map - result:", result);
      }
    );
  }
  
  demoMap();
  
  