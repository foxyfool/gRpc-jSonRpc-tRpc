const express = require("express");
const bodyParser = require("body-parser");
const { JsonRpcServer } = require("json-rpc-2.0");

const app = express();
const port = 3000;

// Parse JSON bodies
app.use(bodyParser.json());

// Define a sample method
function add(a, b) {
  return a + b;
}

// Handle JSON-RPC requests
app.post("/rpc", (req, res) => {
  const { jsonrpc, method, params, id } = req.body;

  if (jsonrpc !== "2.0" || !method || !Array.isArray(params)) {
    res
      .status(400)
      .json({
        jsonrpc: "2.0",
        error: { code: -32600, message: "Invalid Request" },
        id,
      });
    return;
  }

  // Execute the method
  let result;
  switch (method) {
    case "add":
      result = add(params[0], params[1]);
      break;
    default:
      res
        .status(404)
        .json({
          jsonrpc: "2.0",
          error: { code: -32601, message: "Method not found" },
          id,
        });
      return;
  }

  // Send back the response
  res.json({ jsonrpc: "2.0", result, id });
});

// Start the server
app.listen(port, () => {
  console.log(`JSON-RPC server listening at http://localhost:${port}`);
});



// // Create a new JSON-RPC server
// const server = new JsonRpcServer();

// // Define a sample method
// server.addMethod("add", (params) => {
//   const [a, b] = params;
//   return a + b;
// });

// // Handle JSON-RPC requests
// app.post("/rpc", (req, res) => {
//   const { jsonrpc, method, params, id } = req.body;

//   if (jsonrpc !== "2.0" || !method || !Array.isArray(params)) {
//     res
//       .status(400)
//       .json({
//         jsonrpc: "2.0",
//         error: { code: -32600, message: "Invalid Request" },
//         id,
//       });
//     return;
//   }

//   // Execute the method
//   server
//     .handle(req.body)
//     .then((result) => {
//       // Send back the response
//       res.json({ jsonrpc: "2.0", result, id });
//     })
//     .catch((error) => {
//       res
//         .status(500)
//         .json({
//           jsonrpc: "2.0",
//           error: { code: -32603, message: "Internal error" },
//           id,
//         });
//     });
// });

// // Start the server
// app.listen(port, () => {
//   console.log(`JSON-RPC server listening at http://localhost:${port}`);
// });
