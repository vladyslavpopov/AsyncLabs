const asyncMapPromise = (array, changeElement) => {
  const minExecutionTime = 100;
  const delay = 3000;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    if (!Array.isArray(array)) {
      return reject(new Error("Data type must be an array"));
    }

    let index = 0;
    const result = [];

    function handleNextElement() {
      if (index >= array.length) {
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        if (totalTime < minExecutionTime) {
          return setTimeout(() => resolve(result), delay);
        }
        return resolve(result);
      }

      Promise.resolve(changeElement(array[index]))
        .then((mappedElement) => {
          result.push(mappedElement);
          index++;
          handleNextElement();
        })
        .catch((error) => {
          console.error("Error during mapping:", error);
          reject(error);
        });
    }

    handleNextElement();
  });
};

asyncMapPromise([1, 2, 3, 4, 5], element => element * 2)
    .then(result => console.log('promise based result:', result))
    .catch(error => console.error(error));

async function example1() {
    try {
        const data = [6, 7, 8, 9, 10];
        const result = await asyncMapPromise(data, element => element * 2);
        console.log('async-await result:', result);
    } catch (error) {
        console.error('Error:', error);
    }
}

example1();