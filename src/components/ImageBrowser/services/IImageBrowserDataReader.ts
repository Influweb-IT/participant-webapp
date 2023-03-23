import { ImageBrowserViewModel } from "../models/ImageBrowserViewModel";

export interface IImageBrowserDataReader {
  next: (count: number) => Promise<Array<ImageBrowserViewModel>>;
}
