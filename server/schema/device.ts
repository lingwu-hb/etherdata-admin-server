/**
 * Create a user object for mongoose ORM.
 *
 * This file contains the device schema for mongodb device collection
 */
import { Schema, model, connect, Document } from "mongoose";
import { Web3DataInfo } from "../client/node_data";
import mongoose from "mongoose";

export interface IDevice extends Document {
  lastSeen?: Date;
  id: string;
  name: string;
  user: string | null;
  data?: Web3DataInfo;
}

export const deviceSchema = new Schema<IDevice>({
  name: { type: String, required: true },
  id: { type: String, required: true },
  user: { type: String, required: false },
  lastSeen: { type: Date, required: false },
  data: { type: Object, required: false },
});

/**
 * A device model. Mongoose will use this model to do CRUD operations.
 */

export const DeviceModel = mongoose.models.device
  ? mongoose.models.device
  : model<IDevice>("device", deviceSchema);
