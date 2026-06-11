// import "./emailWorker.js";
// import "./imageWorker.js";
// import "./reportWorker.js";

// console.log("All Workers Started");





import "./emailWorker.js";
import "./imageWorker.js";
import "./reportWorker.js";

console.log("=================================");
console.log("Distributed Task Queue Started");
console.log(`Master PID: ${process.pid}`);
console.log("Email Worker Started");
console.log("Image Worker Started");
console.log("Report Worker Started");
console.log("=================================");


// ======================
// UNCAUGHT EXCEPTIONS
// ======================

process.on("uncaughtException", (error) => {

    console.error(
        "UNCAUGHT EXCEPTION"
    );

    console.error(error);

});


// ======================
// UNHANDLED PROMISES
// ======================

process.on(
    "unhandledRejection",
    (reason, promise) => {

        console.error(
            "UNHANDLED PROMISE REJECTION"
        );

        console.error(reason);

    }
);


// ======================
// SHUTDOWN HANDLERS
// ======================

process.on(
    "SIGINT",
    () => {

        console.log(
            "Stopping all workers..."
        );

        process.exit(0);
    }
);

process.on(
    "SIGTERM",
    () => {

        console.log(
            "Stopping all workers..."
        );

        process.exit(0);
    }
);