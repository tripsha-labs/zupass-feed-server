import { FeedRequest, ListFeedsRequest } from "@pcd/passport-interface";
import { Router } from "express";
import { feedHost } from "./feeds";

const routes = Router();

routes.get("/", (req, res) => {
  return res.json({ message: "Hello World" });
});

routes.get("/feeds", async (req, res) => {
  const request = req.body as ListFeedsRequest;

  return res.json(await feedHost.handleListFeedsRequest(request));
});

routes.post("/feeds", async (req, res) => {
  const request = req.body as FeedRequest;

  return res.json(await feedHost.handleFeedRequest(request));
});

routes.get("/feeds/:feedId", async (req, res) => {
  const feedId = req.params.feedId;
  if (feedHost.hasFeedWithId(feedId)) {
    const request = { feedId };
    return res.json(await feedHost.handleListSingleFeedRequest(request));
  } else {
    return res.status(404).send("not found");
  }
});

export default routes;
