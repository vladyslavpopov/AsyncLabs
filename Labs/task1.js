const asyncMap = (array, callback, onComplete) => {
  const minExecutionTime = 100;
  const delay = 3000;
  const startTime = Date.now();
  const result = [];
  let index = 0;

  const errorHandler = (message) => {
    const error = new Error(message);
    console.error('Error during mapping:', error);
  };

  if (!Array.isArray(array)) {
    return errorHandler('Data type must be an array');
  }

  const handleNextElement = () => {
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
    callback(element, (err, changedElement) => {
      if (err) {
        errorHandler(err);
        return;
      }

      result.push(changedElement);
      index++;
      handleNextElement();
    });
  };

  handleNextElement();
};

const asyncMapExample = () => {
  const data = [1, 2, "NaN", 4, 5];

  asyncMap(
    data,
    (element, done) => {
      setTimeout(() => {
        if (typeof element !== "number") {
          return done(new Error(`"${element}" is not a number!`), null);
        }

        const changedElement = element * 2;
        done(null, changedElement);
      }, 10);
    },
    (result) => {
      console.log("asyncMap - result:", result);
    }
  );
};

asyncMapExample();
