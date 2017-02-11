import express from 'express';
import merge from 'lodash/merge';
import SessionRoutesConfig from './routes/session_routes'
import FollowerRoutesConfig from './routes/follower_routes';
import TweetRoutesConfig from './routes/tweet_routes';
import LikeRoutesConfig from './routes/like_routes';

let router = express.Router();
SessionRoutesConfig(router);
FollowerRoutesConfig(router);
TweetRoutesConfig(router);
LikeRoutesConfig(router);




module.exports = router;