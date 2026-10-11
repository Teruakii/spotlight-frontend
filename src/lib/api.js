const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

async function request(path, { method = "GET", body, token } = {}) {
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    console.warn(`[API Error] Failed to fetch: ${BASE_URL}${path}`, err);
    throw new ApiError(`Cannot reach the server (${BASE_URL}). Check your connection and try again.`, 0);
  }

  const data = res.status === 204 ? null : await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(data?.message || "Request failed", res.status, data?.details);
  }
  return data;
}

export function registerUser(input) {
  return request("/auth/register", { method: "POST", body: input });
}

export function loginUser(input) {
  return request("/auth/login", { method: "POST", body: input });
}

export function checkEmailAvailability(email) {
  return request(`/auth/check-email?email=${encodeURIComponent(email)}`);
}

export function getMe(token) {
  return request("/users/me", { token });
}

export function listPlaces(filters = {}, token) {
  const params = new URLSearchParams(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== null && v !== "")
  );
  const qs = params.toString();
  return request(`/places${qs ? `?${qs}` : ""}`, { token });
}

export function listPendingPlaces(token) {
  return request("/places/pending", { token });
}

function queryString(params) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "")
  ).toString();
  return qs ? `?${qs}` : "";
}

export function listNearbyPlaces({ lat, lng, radiusKm, categoryId, limit } = {}) {
  return request(`/places/nearby${queryString({ lat, lng, radiusKm, categoryId, limit })}`);
}

export function listPlacesNear(placeId, { radiusKm, categoryId, limit } = {}) {
  return request(`/places/${placeId}/nearby${queryString({ radiusKm, categoryId, limit })}`);
}

export function listRecommendations(token, limit) {
  return request(`/users/me/recommendations${queryString({ limit })}`, { token });
}

export function getPlace(id, token) {
  return request(`/places/${id}`, { token });
}

export function createPlace(input, token) {
  return request("/places", { method: "POST", body: input, token });
}

export function updatePlace(id, input, token) {
  return request(`/places/${id}`, { method: "PATCH", body: input, token });
}

export function deletePlace(id, token) {
  return request(`/places/${id}`, { method: "DELETE", token });
}

export function approvePlace(id, token) {
  return request(`/places/${id}/approve`, { method: "POST", token });
}

export function rejectPlace(id, token) {
  return request(`/places/${id}/reject`, { method: "POST", token });
}

export function addPlaceImage(placeId, imageUrl, token) {
  return request(`/places/${placeId}/images`, { method: "POST", body: { imageUrl }, token });
}

export function deletePlaceImage(placeId, imageId, token) {
  return request(`/places/${placeId}/images/${imageId}`, { method: "DELETE", token });
}

export function addPlaceTransport(placeId, input, token) {
  return request(`/places/${placeId}/transports`, { method: "POST", body: input, token });
}

export function listReviews(placeId) {
  return request(`/places/${placeId}/reviews`);
}

export function createReview(placeId, input, token) {
  return request(`/places/${placeId}/reviews`, { method: "POST", body: input, token });
}

export function listDetailedReviews(placeId, token) {
  return request(`/places/${placeId}/reviews/detailed`, { token });
}

export function createDetailedReview(placeId, input, token) {
  return request(`/places/${placeId}/reviews/detailed`, { method: "POST", body: input, token });
}

export function markReviewHelpful(id, token) {
  return request(`/reviews/${id}/helpful`, { method: "PUT", token });
}

export function unmarkReviewHelpful(id, token) {
  return request(`/reviews/${id}/helpful`, { method: "DELETE", token });
}

export function deleteReview(id, token) {
  return request(`/reviews/${id}`, { method: "DELETE", token });
}

export function getMyProfile(token) {
  return request("/users/me/profile", { token });
}

export function updateMyProfile(input, token) {
  return request("/users/me/profile", { method: "PATCH", body: input, token });
}

export function listMyReviews(token) {
  return request("/users/me/reviews", { token });
}

export function changePassword(input, token) {
  return request("/users/me/password", { method: "POST", body: input, token });
}

export function deleteAccount(password, token) {
  return request("/users/me", { method: "DELETE", body: { password }, token });
}

export function listSavedPlaces(token) {
  return request("/users/me/saved-places", { token });
}

export function savePlace(placeId, token) {
  return request(`/places/${placeId}/save`, { method: "PUT", token });
}

export function unsavePlace(placeId, token) {
  return request(`/places/${placeId}/save`, { method: "DELETE", token });
}

export function listMyCollections(token) {
  return request("/collections", { token });
}

export function createCollection(input, token) {
  return request("/collections", { method: "POST", body: input, token });
}

export function getCollection(id, token) {
  return request(`/collections/${id}`, { token });
}

export function updateCollection(id, input, token) {
  return request(`/collections/${id}`, { method: "PATCH", body: input, token });
}

export function deleteCollection(id, token) {
  return request(`/collections/${id}`, { method: "DELETE", token });
}

export function addCollectionItem(id, input, token) {
  return request(`/collections/${id}/items`, { method: "POST", body: input, token });
}

export function removeCollectionItem(id, itemId, token) {
  return request(`/collections/${id}/items/${itemId}`, { method: "DELETE", token });
}

export function setCollectionLayout(id, items, token) {
  return request(`/collections/${id}/layout`, { method: "PUT", body: { items }, token });
}

export function getAdminStats(period, token) {
  return request(`/admin/stats?period=${encodeURIComponent(period)}`, { token });
}

export function recordPlaceView(placeId, token) {
  return request(`/places/${placeId}/views`, { method: "POST", token });
}

export function reportReview(id, input, token) {
  return request(`/reviews/${id}/report`, { method: "POST", body: input, token });
}

export function listReportedReviews(token) {
  return request("/admin/reports", { token });
}

export function moderateReview(id, action, token) {
  return request(`/admin/reviews/${id}/moderation`, { method: "POST", body: { action }, token });
}

export function listAdminUsers({ search, status } = {}, token) {
  return request(`/admin/users${queryString({ search, status })}`, { token });
}

export function setUserSuspension(id, suspended, token) {
  return request(`/admin/users/${id}/suspension`, { method: "PATCH", body: { suspended }, token });
}

export function listCategories() {
  return request("/categories");
}

export function createCategory(name, token) {
  return request("/categories", { method: "POST", body: { name }, token });
}

export function updateCategory(id, name, token) {
  return request(`/categories/${id}`, { method: "PATCH", body: { name }, token });
}

export function deleteCategory(id, token) {
  return request(`/categories/${id}`, { method: "DELETE", token });
}

export { ApiError, BASE_URL };
