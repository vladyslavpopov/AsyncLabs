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

        Promise.resolve(changeElement(array[currentIndex], signal))
          .then((mappedElement) => {
            if (signal && signal.aborted) {
              return reject(new Error("Operation was aborted"));
            }

            const durationTime = Date.now() - start;
            if (logDurationTime) {
              console.log(`Finished task for element ${array[currentIndex]}, took ${durationTime}ms`);
            }

            result[currentIndex] = mappedElement;
            activePromises--;
            handleNextElement();
          })
          .catch((error) => {
            if (signal && signal.aborted) {
              reject(new Error("Operation was aborted"));
            } else {
              console.error("Error during mapping:", error);
              reject(error);
            }
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

asyncMapPromise(
  [1, 2, 3, 4, 5, 6],
  (element, signal) =>
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (signal.aborted) {
          clearTimeout(timeout);
          return reject(new Error("Task was aborted"));
        }
        resolve(element * 2);
      }, 1000);
    }), 2, signal
)
  .then((result) => console.log("result:", result))
  .catch((error) => console.error("Error:", error.message));

setTimeout(() => {
  controller.abort();
  console.log("Operation aborted by the user");
}, 3000);
