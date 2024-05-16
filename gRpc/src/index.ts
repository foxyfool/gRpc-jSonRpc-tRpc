import path from "path";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/a";
import { AddressBookServiceHandlers } from "./proto/AddressBookService";

const packageDefinition = protoLoader.loadSync(
  path.join(__dirname, "./a.proto")
);

const personProto = grpc.loadPackageDefinition(
  packageDefinition
) as unknown as ProtoGrpcType;

const PERSONS: any[] = [];

// req = call
// res = callback

const handler: AddressBookServiceHandlers = {
  AddPerson: (call, callback) => {
    let person = {
      name: call.request.name,
      age: call.request.age,
    };
    PERSONS.push(person);
    callback(null, person);
  },
  GetPersonByName: (call, callback) => {
    let person = PERSONS.find((x) => x.name === call.request.name);
    if (person) {
      callback(null, person);
    } else {
      callback(
        {
          code: grpc.status.NOT_FOUND,
          details: "not found",
        },
        null
      );
    }
  },
};

// const app = express();
const server = new grpc.Server();

/// app.use(/api/v1/person , person)

server.addService(personProto.AddressBookService.service, handler);

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
  }
);
