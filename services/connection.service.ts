/** Provides API operations for sending and managing connection requests, connections, and network suggestions. */
import api from "@/lib/api";
/** Sends a connection request to the receiver, optionally including a message. */
export const sendRequest = (receiverId: number, message?: string) =>
  api.post("/connections/request", {
    receiverId,
    message,
  });

/** Accepts a received connection request. */
export const acceptRequest = (requestId: number) =>
  api.put(`/connections/request/${requestId}/accept`);

/** Rejects a received connection request. */
export const rejectRequest = (requestId: number) =>
  api.put(`/connections/request/${requestId}/reject`);

/** Cancels a connection request sent by the current user. */
export const cancelRequest = (requestId: number) =>
  api.put(`/connections/request/${requestId}/cancel`);

/** Retrieves the current user's accepted connections. */
export const getConnections = () =>
  api.get("/connections");

/** Retrieves connection requests awaiting the current user's response. */
export const getReceivedRequests = () =>
  api.get("/connections/requests/received");

/** Retrieves connection requests sent by the current user. */
export const getSentRequests = () =>
  api.get("/connections/requests/sent");

/** Retrieves suggested users for the current user's network. */
export const getSuggestions = () =>
  api.get("/connections/suggestions");

/** Retrieves the current user's connection status with the specified user. */
export const getStatus = (userId: number) =>
  api.get(`/connections/status/${userId}`);

/** Removes the connection between the current user and the specified user. */
export const removeConnection = (userId: number) =>
  api.delete(`/connections/${userId}`);

/** Retrieves users connected to both the current user and the specified user. */
export const getMutualConnections = (userId: number) =>
  api.get(`/connections/mutual/${userId}`);