import { BaseSocketIOPlugin, SocketHandler } from "../../basePlugin";
import { Server, Socket } from "socket.io";
import { NodePlugin } from "./nodePlugin";
import Logger from "../../../logger";
import { AppPlugin } from "./appPlugin";
import { BrowserClient } from "../../../client/browserClient";
import { ClientInterface } from "../../../client/nodeClient";

/**
 * Web Browser socket io plugin
 */
export class ClientPlugin extends AppPlugin {
  protected pluginName: string = "client";

  browserClients: {
    [key: string]: BrowserClient;
  } = {};

  constructor() {
    super();
    this.handlers = [
      this.joinRoomHandler,
      this.leaveRoomHandler,
      this.rpcCommandHandler,
      this.handleDisconnect,
      this.handlePageChange,
    ];
  }

  auth(password: string): boolean {
    // return process.env.NEXT_PUBLIC_CLIENT_PASSWORD === password;
    return true;
  }

  protected onAuthenticated(socket: Socket): void {
    let plugin = this.otherPlugins["node"] as NodePlugin;
    let client = new BrowserClient();
    this.browserClients[socket.id] = client;
    this.sendDataToClient(
      client,
      socket.id,
      Object.values(plugin.nodeClients).map((c) => c.toJSON())
    );
  }

  protected onUnAuthenticated(socket: Socket): void {}

  async startSocketIOServer(server: Server): Promise<boolean | undefined> {
    this.server = server.of("/clients");
    this.connectServer();
    return true;
  }

  handleDisconnect: SocketHandler = (socket) => {
    socket.on("disconnect", () => {
      delete this.browserClients[socket.id];
    });
  };

  /**
   * Change page
   * @param socket
   */
  handlePageChange: SocketHandler = (socket) => {
    let plugin = this.otherPlugins["node"] as NodePlugin;
    socket.on("page-change", (pageNum: number) => {
      let client = this.browserClients[socket.id];
      if (client) {
        client.currentPage = pageNum;
        this.sendDataToClient(
          client,
          socket.id,
          Object.values(plugin.nodeClients).map((c) => c.toJSON())
        );
      }
    });
  };

  /**
   * Send data to all browser clients
   * @param devices
   */
  sendDataToAllClients = (devices: ClientInterface[]) => {
    for (let [socketID, client] of Object.entries(this.browserClients)) {
      // Send pagination data to all browser clients
      this.server
        ?.to(socketID)
        .emit("realtime-info", client.generatePaginationResult(devices));
    }
  };

  private sendDataToClient = (
    client: BrowserClient,
    socketID: string,
    devices: ClientInterface[]
  ) => {
    this.server
      ?.to(socketID)
      .emit("realtime-info", client.generatePaginationResult(devices));
  };
}