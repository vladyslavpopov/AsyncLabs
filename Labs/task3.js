const asyncMapPromise = (array, changeElement, concurrency, signal) => {
  const minExecutionTime = 100;
  const startTime = Date.now();
  const logDurationTime = false;

  return new Promise((resolve, reject) => {
    if (!Array.isArray(array)) {
      return reject(new Error("Data type must be an array"));
    }

    let index = 0;
    const result = [];
    let activePromises = 0;

    if (signal && signal.aborted) {
      return reject(new Error("Operation was aborted"));
    }

    const handleNextElement = () => {
      if (signal && signal.aborted) {
        return reject(new Error("Operation was aborted"));
      }

      while (activePromises < concurrency && index < array.length) {
        const currentIndex = index++;
        activePromises++;

        const start = Date.now();
        if (logDurationTime) {
          console.log(`Starting task for element ${array[currentIndex]}`);
        }

        Promise.resolve(changeElement(array[currentIndex]))
          .then((mappedElement) => {
            const durationTime = Date.now() - start;
            if (logDurationTime) {
              console.log(
                `Finished task for element ${array[currentIndex]}, took ${durationTime}ms`
              );
            }

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
    };

    handleNextElement();

    if (signal) {
      signal.addEventListener("abort", () => {
        reject(new Error("Operation was aborted"));
      });
    }
  });
};

const controller = new AbortController();
const { signal } = controller;

asyncMapPromise(
  [1, 2, 3, 4, 5, 6],
  (element) =>
    new Promise((resolve) => setTimeout(() => resolve(element * 2), 1000)),
  2
)
  .then((result) => console.log("Promise-based result:", result))
  .catch((error) => console.error(error));

async function example1() {
  try {
    const data = [6, 7, 8, 9, 10];
    const result = await asyncMapPromise(
      data,
      (element) =>
        new Promise((resolve) => setTimeout(() => resolve(element * 2), 1000)),
      2
    );
    console.log("Async-await result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

example1();
