import { Server } from "socket.io";
import { Document, Model, Query } from "mongoose";
import { PluginName } from "./pluginName";
import { Express } from "express";

export abstract class BasePlugin<N> {
  protected abstract pluginName: N;
}

export abstract class BaseSocketIOPlugin extends BasePlugin<string> {
  /**
   * Start a SocketIO server.
   * @param server
   *
   * @return an indicator indicates the status of the socket io.
   * If return undefined, then this plugin doesn't have websocket functionality
   */
  abstract startSocketIOServer(server: Express): Promise<boolean | undefined>;
}

export abstract class DatabasePlugin<
  T extends Document
> extends BasePlugin<PluginName> {
  protected abstract model: Model<T>;

  protected performGet(id: string): Query<T, T> {
    //@ts-ignore
    return this.model.findOne({ _id: id });
  }

  async get(id: string): Promise<T | undefined> {
    let result = await this.performGet(id).exec();
    if (result) {
      return result;
    } else {
      return undefined;
    }
  }

  protected performList(): Query<T[], T[]> {
    //@ts-ignore
    return this.model.find({});
  }

  async list(pageNumber: number, pageSize: number): Promise<T[] | undefined> {
    let results = this.performList();
    let pageResults = this.doPagination(results, pageNumber, pageSize);

    return await pageResults.exec();
  }

  async performCreate(data: T): Promise<T> {
    return await this.model.create(data);
  }

  async create(
    data: T,
    { upsert }: { upsert: boolean }
  ): Promise<T | undefined> {
    if (upsert) {
      return await this.performPatch(data);
    } else {
      return await this.performCreate(data);
    }
  }

  async performPatch(data: T): Promise<T> {
    let result = await this.model.findOneAndUpdate(
      { _id: data._id },
      //@ts-ignore
      data,
      { upsert: true }
    );

    return result;
  }

  async patch(data: T) {
    return await this.performPatch(data);
  }

  protected doPagination(
    model: Query<T[], T[]>,
    pageNumber: number,
    pageSize: number
  ): Query<T[], T[]> {
    let skip = Math.max(0, (pageNumber ?? 0 - 1) * (pageSize ?? 20));
    let limit = pageSize ?? 20;

    return model.skip(skip).limit(limit);
  }
}