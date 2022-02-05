export default abstract class Resource<T> {
  protected data: T | undefined;
  protected promise: Promise<T> | undefined;

  public async get(): Promise<T> {
    if (this.promise === undefined) {
      this.promise = this.fetch();
    }
    if (this.data === undefined) {
      this.data = await this.promise;
    }
    return this.data;
  }

  protected abstract fetch(): Promise<T>;
}
