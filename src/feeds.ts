import { EdDSAPCDPackage } from "@pcd/eddsa-pcd";
import { EdDSATicketPCD, EdDSATicketPCDPackage } from "@pcd/eddsa-ticket-pcd";
import { EmailPCDPackage, EmailPCDTypeName } from "@pcd/email-pcd";
import { FeedHost, FeedRequest, FeedResponse } from "@pcd/passport-interface";
import {
  PCDActionType,
  PCDPermissionType,
  ReplaceInFolderAction,
  ReplaceInFolderPermission
} from "@pcd/pcd-collection";
import { ArgumentTypeName, SerializedPCD } from "@pcd/pcd-types";
import { v4 as uuid } from "uuid";

EdDSAPCDPackage.init?.({});
EdDSATicketPCDPackage.init?.({});

export const feedHost = new FeedHost(
  [
    {
      feed: {
        id: "1",
        name: "First feed",
        description: "First test feed",
        permissions: [
          {
            folder: "Testing",
            type: PCDPermissionType.ReplaceInFolder
          } as ReplaceInFolderPermission
        ],
        credentialType: EmailPCDTypeName
      },
      handleRequest: async (
        req: FeedRequest<typeof EmailPCDPackage>
      ): Promise<FeedResponse> => {
        if (req.pcd) {
          const pcd = await EmailPCDPackage.deserialize(req.pcd.pcd);
          const verified = await EmailPCDPackage.verify(pcd);
          if (verified) {
            return {
              actions: [
                {
                  pcds: [
                    await issueTestPCD(
                      pcd.claim.emailAddress,
                      pcd.claim.semaphoreId
                    )
                  ],
                  folder: "Testing",
                  type: PCDActionType.ReplaceInFolder
                } as ReplaceInFolderAction
              ]
            };
          }
        }
        return { actions: [] };
      }
    }
  ],
  "http://localhost:3100/feeds",
  "Test Feed Server"
);

async function issueTestPCD(
  emailAddress: string,
  semaphoreId: string
): Promise<SerializedPCD<EdDSATicketPCD>> {
  const ticketData = {
    attendeeName: "test name",
    attendeeEmail: emailAddress,
    eventName: "event",
    ticketName: "ticket",
    checkerEmail: "checker@test.com",
    ticketId: uuid(),
    eventId: uuid(),
    productId: uuid(),
    timestampConsumed: Date.now(),
    timestampSigned: Date.now(),
    attendeeSemaphoreId: semaphoreId,
    isConsumed: false,
    isRevoked: false
  };

  const pcd = await EdDSATicketPCDPackage.prove({
    ticket: {
      value: ticketData,
      argumentType: ArgumentTypeName.Object
    },
    privateKey: {
      value: process.env.SERVER_PRIVATE_KEY,
      argumentType: ArgumentTypeName.String
    },
    id: {
      value: undefined,
      argumentType: ArgumentTypeName.String
    }
  });

  return EdDSATicketPCDPackage.serialize(pcd);
}
