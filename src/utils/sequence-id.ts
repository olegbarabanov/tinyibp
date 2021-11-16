export default class SequenceId {
  protected static currentKey = 0;

  static getNew(prefix = ''): string {
    return prefix + ++this.currentKey;
  }
}
