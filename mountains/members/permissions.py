from rest_framework import permissions

class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return request.method in permissions.SAFE_METHODS

class IsCommittee(permissions.BasePermission):
    def has_permissions(self, request, view) -> bool:
        return request.user.is_committee

class IsWalkCo(permissions.BasePermission):
    def has_permission(self, request, view) -> bool:
        return request.user.is_walk_coordinator