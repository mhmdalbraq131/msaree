export type ConnectionListener = (isOnline: boolean) => void;

export class ConnectionMonitor {
  private static instance: ConnectionMonitor;
  private isOnline: boolean = typeof navigator !== 'undefined' ? navigator.onLine : true;
  private listeners: ConnectionListener[] = [];

  private constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleStatusChange(true));
      window.addEventListener('offline', () => this.handleStatusChange(false));
    }
  }

  public static getInstance(): ConnectionMonitor {
    if (!ConnectionMonitor.instance) {
      ConnectionMonitor.instance = new ConnectionMonitor();
    }
    return ConnectionMonitor.instance;
  }

  public getStatus(): boolean {
    return this.isOnline;
  }

  public subscribe(listener: ConnectionListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private handleStatusChange(status: boolean): void {
    this.isOnline = status;
    this.listeners.forEach((listener) => listener(status));
  }
}
