import { ImageBrowserViewModel } from "../models/ImageBrowserViewModel";

export abstract class ImageBrowserDataReader {
  uid: number;
  abstract next: (count: number) => Promise<Array<ImageBrowserViewModel>>;

  constructor() {
    this.uid = Date.now();
  }
}
