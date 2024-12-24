# Documentation for tasks

## **Task 1 - Asynchronous Array Mapping**

**File:** [`task1.js`](./Labs/task1.js)

This task involves creating an asynchronous counterpart for the `Array.map` method, allowing callbacks to handle asynchronous operations on array elements.

### **Features**

- Supports delayed execution if the processing time is below a defined minimum threshold.

### **Key Functions**

- `asyncMap(array, callback, onComplete)`: Processes the array asynchronously.
- `asyncMapExample()`: Demonstrates the usage of `asyncMap` with an example.

### **Usage**

```javascript
asyncMap(
  [1, 2, 3],
  (element, handleMappedElement) => {
    setTimeout(() => handleMappedElement(element * 2), 10);
  },
  (result) => {
    console.log("Mapped Result:", result);
  }
);
```

## **Task 2 - Promise-Based Array Mapping Alternative**

**File:** [`task2.js`](./Labs/task2.js)

This task offers a promise-based alternative to the asynchronous mapping function with concurrency control.

### **Features**

- Allows setting a concurrency limit for simultaneous processing.
- Demonstrates both Promise-based and async/await usage.

### **Key Functions**

- `asyncMapPromise(array, changeElement, concurrency)`: Processes array elements with promises.

### **Usage**

#### **Using Promises**

```javascript
asyncMapPromise(
  [1, 2, 3],
  (element) =>
    new Promise((resolve) => setTimeout(() => resolve(element * 2), 1000)),
  2
)
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error(error));
```

#### **Using Async/Await**

```javascript
async function example1() {
  try {
    const result = await asyncMapPromise(
      [1, 2, 3],
      (element) =>
        new Promise((resolve) => setTimeout(() => resolve(element * 2), 1000)),
      2
    );
    console.log("Async-Await Result:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}
example1();
```

## **Task 3 - Abortable Async Mapping**

**File:** [`task3.js`](./Labs/task3.js)

This task extends the promise-based solution with `AbortController` integration to enable cancelable operations.

### **Features**

- Supports aborting ongoing tasks using `AbortController`.

### **Key Functions**

- `asyncMapPromise(array, changeElement, concurrency, signal)`: Processes array elements with support for abort signals.

### **Usage**

```javascript
const controller = new AbortController();
const { signal } = controller;

asyncMapPromise(
  [1, 2, 3],
  (element, signal) =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (signal.aborted) reject(new Error("Task aborted"));
        else resolve(element * 2);
      }, 1000);
    }),
  2,
  signal
)
  .then((result) => console.log("Result:", result))
  .catch((error) => console.error("Error:", error.message));

// Aborts the operation after 5 seconds
setTimeout(() => controller.abort(), 5000);
```

## **Task 4 - Large Dataset Processing**

**File:** [`task4.js`](./Labs/task4.js)

This task demonstrates processing large datasets using `Streams` and `AsyncIterator`, avoiding memory constraints.

### **Features**

- Reads large files line by line.
- Identifies lines containing specific keywords.
- Efficiently processes files without loading the entire dataset into memory.

### **Key Functions**

- `analyzeFile(filePath)`: Reads a file and processes lines asynchronously.

### **Before executing**

Before running `task4.js`, you need to generate a large dataset. Use the `createLargeFile.js` script to create a test file for processing.

**File:** [`createLargeFile.js`](./Labs/createLargeFile.js)

This script generates a large text file for testing purposes.

#### **Usage**

```javascript
node createLargeFile.js
```

This will create a file named large_data.txt with 1,000,000 lines. You can adjust the number of lines by modifying the `createLargeFile` function call in the script.

#### **Usage of `task4.js`**

```javascript
analyzeFile("./large_data.txt")
  .then(() => console.log("Processing completed"))
  .catch((err) => console.error("Error:", err));
```

## **Task 5 - Reactive Message Communication**

**File:** [`task5.js`](./Labs/task5.js)

This task demonstrates reactive communication using `EventEmitter` for message handling between entities.

### **Features**

- Reactive message broadcasting and handling.

### **Key Components**

- `MessageHub`: Centralized event emitter.
- `Notifier, Logger, ErrorHandler`: Classes to handle specific message types.

### **Usage**

```javascript
sendMessage("notification", "Task completed successfully.");
sendMessage("error", "Unable to connect to the database.");
```
