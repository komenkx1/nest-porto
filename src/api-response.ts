/* eslint-disable prettier/prettier */
export class ApiResponse<T> {
    private success: boolean;
    private message: string;
    private data: T;
    private code: number;
  
    constructor(success: boolean, message: string, data: T) {
      this.success = success;
      this.message = message;
      this.data = data;
      this.code = success ? 200 : 400;
    }
  
    static success<T>(data: T): ApiResponse<T> {
      return new ApiResponse<T>(true, 'Success', data);
    }
  
    static error<T>(message: string): ApiResponse<T> {
      return new ApiResponse<T>(false, message, null);
    }
  
    toJson(): string {
      return JSON.stringify(this);
    }
  }
  