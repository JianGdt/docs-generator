import { DocType, InputMethod } from "./common";

export interface GenerateRequest {
  method: InputMethod;
  data: string;
  docType: DocType;
}

export interface GenerateResponse {
  success: boolean;
  documentation?: string;
  error?: string;
}

export interface RestoreHistoryRequest {
  historyId: string;
}

export interface CleanupHistoryRequest {
  keepVersions?: number;
}

export interface UpdateDocRequest {
  title?: string;
  documentType?: string;
  content?: string;
  changeDescription?: string;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ApiError;
  timestamp?: string;
}
