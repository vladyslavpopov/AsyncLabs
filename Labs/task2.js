const asyncMapPromise = (array, changeElement, concurrency) => {
  const minExecutionTime = 100;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    if (!Array.isArray(array)) {
      return reject(new Error("Data type must be an array"));
    }

    let index = 0;
    const result = [];
    let activePromises = 0;

    function handleNextElement() {
      while (activePromises < concurrency && index < array.length) {
        const currentIndex = index++;
        activePromises++;

        const start = Date.now();
        console.log(`Starting task for element ${array[currentIndex]}`);

        Promise.resolve(changeElement(array[currentIndex]))
          .then((mappedElement) => {
            const end = Date.now();
            console.log(
              `Finished task for element ${array[currentIndex]}, took ${end - start}ms`);

            result[currentIndex] = mappedElement;
            activePromises--;
            handleNextElement();
          })
          .catch((error) => {
            console.error("Error during mapping:", error);
            reject(error);
          });
      }

      if (index >= array.length && activePromises === 0) {
        const endTime = Date.now();
        const totalTime = endTime - startTime;

        if (totalTime < minExecutionTime) {
          return setTimeout(
            () => resolve(result),
            minExecutionTime - totalTime
          );
        }
        resolve(result);
      }
    }

    handleNextElement();
  });
};

asyncMapPromise(
  [1, 2, 3, 4, 5, 6],
  (element) =>
    new Promise((resolve) => setTimeout(() => resolve(element * 2), 10000)), 2)
  .then((result) => console.log("Promise-based result:", result))
  .catch((error) => console.error(error));

async function example1() {
  try {
    const data = [6, 7, 8, 9, 10];
    const result = await asyncMapPromise(
      data,
      (element) =>
        new Promise((resolve) => setTimeout(() => resolve(element * 2), 10000)), 2);
    console.log("Async-await result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

example1();
