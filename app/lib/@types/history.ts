import { ObjectId } from "mongodb";

export interface DocHistoryEntry {
  _id?: ObjectId;
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
  createdAt: Date;
}
export interface DocHistoryEntryClient {
  _id?: string;
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
  createdAt: string;
}

export interface HistoryEntry {
  _id: string;
  userId: string;
  title: string;
  docType: string;
  version: number;
  changeDescription?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HistoryEntryClient {
  _id?: string;
  docId: string;
  userId: string;
  title: string;
  documentType: string;
  content: string;
  version: number;
  changeDescription?: string;
  createdAt: string;
}

export interface HistoryResponse {
  data: {
    documents: HistoryEntry[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface HistoryClientProps {
  initialData: DocHistoryEntryClient[];
  initialPagination: Pagination;
  initialPage: number;
  initialSearch: string;
  userId: string;
}
