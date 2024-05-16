import {
  createTRPCProxyClient,
  createWSClient,
  httpBatchLink,
  splitLink,
  loggerLink,
  wsLink,
} from "@trpc/client";
import { AppRouter } from "../../server/src/api";

const wsClient = createWSClient({
  url: "ws://localhost:3000/trpc",
});
const client = createTRPCProxyClient<AppRouter>({
  links: [
    splitLink({
      condition: (op) => {
        return op.type === "subscription";
      },
      true: wsLink({
        client: wsClient,
      }),
      false: httpBatchLink({
        url: "http://localhost:3000/trpc",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 1234",
        },
      }),
    }),

    // endipoint for trpc server is httpbatchlink
  ],
});

document.addEventListener("click", () => {
  const connection = client.users.update.mutate({
    userId: "12",
    name: "Rahul",
  });
});

async function main4() {
  client.users.onUpdate.subscribe(undefined, {
    onData: (id) => {
      console.log("User updated: ", id);
    },
  });
  wsClient.close();
}

main4();

async function main() {
  // multiple request at once given result

  const result = await client.users.update.mutate({
    userId: "1111",
    name: "Rahul Mighty",
  });
  console.log(result);
}
async function main3() {
  // multiple request at once given result

  const result = await client.secretData.query();
  console.log(result);
}

async function main2() {
  // multiple request at once given result
  const res = await client.logHiToserver.mutate("Hello from calient");
  console.log(res);
}

main();
main2();
main3();
