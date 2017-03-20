export const fetchAllTweets = (lastId) => { //REVISE ADD LAST ID
  const lastIdQuery = lastId ? `?lastId=${lastId}` : "";
  return $.ajax({
    method: 'GET',
    url: `/api/feed_tweets${lastIdQuery}`,
  });
};

export const fetchAllUserProfileTweets = (userId, lastId) => { //REVISE ADD LAST ID
  const lastIdQuery = lastId ? `&lastId=${lastId}` : "";
  return $.ajax({
    method: 'GET',
    url: `/api/user_tweets?userId=${userId}${lastIdQuery}`,
  });
};

export const fetchNonReplyProfileTweets = (userId, lastId) => { //REVISE ADD LAST ID
  const lastIdQuery = lastId ? `&lastId=${lastId}` : "";
  return $.ajax({
    method: 'GET',
    url: `/api/user_tweets_without_replies?userId=${userId}${lastIdQuery}`,
  });
};

export const fetchTweetsUserLikes = (userId, lastId) => { //REVISE ADD LAST ID
  const lastIdQuery = lastId ? `&lastId=${lastId}` : "";
  return $.ajax({
    method: 'GET',
    url: `/api/tweets_user_likes?userId=${userId}${lastIdQuery}`,
  });
};

export const postTweet = (content) => { //REVISE ADD LAST ID
  return $.ajax({
    method: 'POST',
    url: '/api/tweet',
    data: {content}
  });
};

export const replyTweet = (original, content) => {
  return $.ajax({
    method: 'POST',
    url: '/api/tweet_reply',
    data: {content, original}
  });
};

export const postRetweet = (originalTweetId) => {
    return $.ajax({
    method: 'POST',
    url: '/api/retweet',
    data: {originalTweetId}
  });
}

export const deleteRetweet = (retweetId) => {
    return $.ajax({
    method: 'DELETE',
    url: '/api/retweet',
    data: {retweetId}
  });
}

export const fetchReplies = (replyId, lastId) => {
  let query = `?replyId=${replyId}`
  query += lastId ? `&lastId=${lastId}` : "";
  return $.ajax({
    method: 'GET',
    url: `/api/replies${query}`,
  });
};




