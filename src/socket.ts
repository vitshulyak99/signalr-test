import * as signalR from '@microsoft/signalr'
import { HttpTransportType, LogLevel } from '@microsoft/signalr'

export enum SocketEvent {
  send = 'newMessage',
  join = 'joinChat',
  leave = 'leaveChat',
  recive = 'recieveMessage',
  notification = 'notification',
}

export class SocketService {
  private static instance: SocketService
  private connection: signalR.HubConnection | null = null

  private constructor() {}

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService()
    }
    return SocketService.instance
  }

  public connect(url: string): Promise<void> {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(url)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Debug)
      .build()

    return this.connection.start()
  }

  public disconnect(): Promise<void> {
    if (this.connection) {
      return this.connection.stop()
    }
    return Promise.resolve()
  }

  public invoke(methodName: string, ...args: any[]): Promise<any> {
    if (this.connection) {
      return this.connection.invoke(methodName, ...args)
    }
    return Promise.reject('No connection established')
  }

  public on(methodName: string, newMethod: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.on(methodName, newMethod)
    }
  }

  public off(methodName: string, method: (...args: any[]) => void): void {
    if (this.connection) {
      this.connection.off(methodName, method)
    }
  }
}

export default SocketService.getInstance()
