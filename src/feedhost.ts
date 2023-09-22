import {
  Feed,
  FeedRequest,
  FeedResponse,
  ListFeedsRequest,
  ListFeedsResponse,
  ListSingleFeedRequest
} from "./pcdtypes";

export interface HostedFeed {
  feed: Feed;
  handleRequest(request: FeedRequest): Promise<FeedResponse>;
}

export class FeedHost {
  private readonly hostedFeed: HostedFeed[];
  private readonly providerUrl: string;
  private readonly providerName: string;

  public constructor(
    feeds: HostedFeed[],
    providerUrl: string,
    providerName: string
  ) {
    this.hostedFeed = feeds;
    this.providerUrl = providerUrl;
    this.providerName = providerName;
  }

  public getProviderUrl(): string {
    return this.providerUrl;
  }

  public getProviderName(): string {
    return this.providerName;
  }

  public async handleFeedRequest(request: FeedRequest): Promise<FeedResponse> {
    const feed = this.hostedFeed.find((f) => f.feed.id === request.feedId);
    if (!feed) {
      throw new Error(`couldn't find feed with id ${request.feedId}`);
    }
    const response = await feed.handleRequest(request);
    return response;
  }

  public async handleListFeedsRequest(
    _request: ListFeedsRequest
  ): Promise<ListFeedsResponse> {
    return {
      providerName: this.providerName,
      providerUrl: this.providerUrl,
      feeds: this.hostedFeed.map((f) => f.feed)
    };
  }

  public hasFeedWithId(feedId: string): boolean {
    return this.hostedFeed.filter((f) => f.feed.id === feedId).length > 0;
  }

  public async handleListSingleFeedRequest(
    _request: ListSingleFeedRequest
  ): Promise<ListFeedsResponse> {
    return {
      providerUrl: this.providerUrl,
      providerName: this.providerName,
      feeds: this.hostedFeed
        .filter((f) => f.feed.id === _request.feedId)
        .map((f) => f.feed)
    };
  }
}
