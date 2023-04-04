import { ImageBrowserViewModel } from "../models/ImageBrowserViewModel";

export interface IImageBrowserDataReader {
  uid: number;
  next: (count: number) => Promise<Array<ImageBrowserViewModel>>;
}
