function asyncMap(array, callback, onComplete) {
  const minExecutionTime = 100;
  const delay = 3000;
  const startTime = Date.now();
  const result = [];
  let index = 0;

  function errorHandler(message) {
    const error = new Error(message);
    console.error('Error during mapping:', error);
    return;
  }
    
  if (!Array.isArray(array)) {
    return errorHandler('Data type must be an array');
  }
  
  function handleNextElement() {
    if (index >= array.length) {
      const endTime = Date.now();
      const totalTime = endTime - startTime;

      if (totalTime < minExecutionTime) {
        return setTimeout(() => {
          onComplete(result);
        }, delay);
      }

      return onComplete(result);
    }

    const element = array[index];
    callback(element, (changedElement) => {
      result.push(changedElement);
      index++;
      handleNextElement();
    });
  }
  
  handleNextElement();
  }
  
  function asyncMapExample() {
    const data = [1, 2, 3, 4, 5];
    asyncMap(
      data,
      (element, handleMappedElement) => {
        setTimeout(() => {
          const change = element * 2;
          handleMappedElement(change);
        }, 10);
      },
      (result) => {
        console.log("asyncMap - result:", result);
      }
    );
  }
  
  asyncMapExample();
