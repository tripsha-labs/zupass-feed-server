import { PCDPackage, SerializedPCD, PCDOf, ArgsOf } from "@pcd/pcd-types";

/**
 * From a future version of @pcd/pcd-types
 */
export type PCDTypeNameOf<T> = T extends PCDPackage<any, any, any, any>
  ? T["name"]
  : T;

/**
 * From a future version of @pcd/passport-interface
 */

export interface Feed<T extends PCDPackage = PCDPackage> {
  id: string;
  name: string;
  description: string;
  inputPCDType?: PCDTypeNameOf<T>;
  partialArgs?: ArgsOf<T>;
  permissions: PCDPermission[];
  credentialType?: "email-pcd" | "semaphore-signature-pcd";
}

export interface ListFeedsRequest {}

export interface ListSingleFeedRequest {
  feedId: string;
}

export interface ListFeedsResponse {
  providerUrl: string;
  providerName: string;
  feeds: Feed[];
}

export interface FeedRequest<T extends PCDPackage = PCDPackage> {
  feedId: string;
  pcd?: SerializedPCD<PCDOf<T>>;
}

export interface FeedResponse {
  actions: PCDAction[];
}

/**
 * From a future version of @pcd/pcd-collection
 */

export enum PCDActionType {
  ReplaceInFolder = "ReplaceInFolder_action",
  AppendToFolder = "AppendToFolder_action"
}

export interface PCDAction {
  type: PCDActionType;
}

export interface ReplaceInFolderAction {
  type: PCDActionType.ReplaceInFolder;
  folder: string;
  pcds: SerializedPCD[];
}

export function isReplaceInFolderAction(
  action: PCDAction
): action is ReplaceInFolderAction {
  return action.type === PCDActionType.ReplaceInFolder;
}

export interface AppendToFolderAction {
  type: PCDActionType.AppendToFolder;
  folder: string;
  pcds: SerializedPCD[];
}

export function isAppendToFolderAction(
  action: PCDAction
): action is AppendToFolderAction {
  return action.type === PCDActionType.AppendToFolder;
}


export enum PCDPermissionType {
  ReplaceInFolder = "ReplaceInFolder_permission",
  AppendToFolder = "AppendToFolder_permission"
}

export interface PCDPermission {
  type: PCDPermissionType;
}

export interface PCDFolderPermission extends PCDPermission {
  type: PCDPermissionType.AppendToFolder | PCDPermissionType.ReplaceInFolder;
  folder: string;
}

export interface AppendToFolderPermission extends PCDPermission {
  type: PCDPermissionType.AppendToFolder;
  folder: string;
}

export interface ReplaceInFolderPermission extends PCDPermission {
  type: PCDPermissionType.ReplaceInFolder;
  folder: string;
}

export function isPCDFolderPermission(
  permission: PCDPermission
): permission is PCDFolderPermission {
  return [
    PCDPermissionType.AppendToFolder,
    PCDPermissionType.ReplaceInFolder
  ].includes(permission.type);
}

export function isAppendToFolderPermission(
  permission: PCDPermission
): permission is AppendToFolderPermission {
  return permission.type === PCDPermissionType.AppendToFolder;
}

export function isReplaceInFolderPermission(
  permission: PCDPermission
): permission is ReplaceInFolderPermission {
  return permission.type === PCDPermissionType.ReplaceInFolder;
}
