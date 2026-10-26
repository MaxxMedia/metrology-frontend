/** Data contracts for user profiles, connection requests, and network relationship status. */
/** Enumerates the relationship from the current user's perspective: self, connected, sent or received request, or no connection. */
export type ConnectionStatus =
  | "SELF"
  | "CONNECTED"
  | "PENDING_SENT"
  | "PENDING_RECEIVED"
  | "NOT_CONNECTED";

/** The user details exposed in network and connection-request views. */
export interface User {
  id: number;
  fullName: string;
  username?: string;
  email?: string;
  profileImage?: string | null;
  headline?: string | null;
  location?: string | null;
}

/** A connection invitation and its lifecycle, including participants, response state, and timestamps. */
export interface ConnectionRequest {
  id: number;
  senderId: number;
  receiverId: number;
  status: "PENDING" | "ACCEPTED" | "REJECTED" | "CANCELLED";
  message?: string | null;
  createdAt: string;
  updatedAt?: string;
  acceptedAt?: string | null;
  respondedAt?: string | null;

  sender?: User;
  receiver?: User;
}

/** The current relationship state with an optional request ID for pending actions. */
export interface ConnectionStatusResponse {
  status: ConnectionStatus;
  requestId?: number;
}