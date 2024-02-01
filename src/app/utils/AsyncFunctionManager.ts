export class AsyncFunctionManager {
  private controller: AbortController | null = null;

  async runAsyncFunction(func: () => void) {
    // 現在実行中の非同期処理があればキャンセルする
    if (this.controller) {
      this.controller.abort();
    }

    // 新しいAbortControllerを作成
    this.controller = new AbortController();
    const signal = this.controller.signal;
    func();
  }

  async cancelAll() {
    if (this.controller) {
      this.controller.abort();
    }
  }
}
