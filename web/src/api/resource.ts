export default abstract class Resource<T> {
  protected data: T | undefined;

  constructor() {
    this.data = undefined;
  }

  public async get(): Promise<T> {
    if (this.data === undefined) {
      this.data = await this.fetch();
    }
    return this.data;
  }

  protected abstract fetch(): Promise<T>;
}
