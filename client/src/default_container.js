import React from 'react';
import { Navigation, NoAuthNav } from "./components";

import { NotificationContainer } from 'react-notifications';
import {
  Home,
  Bookmarks,
  Notifications,
  UserProfile,
  PodcastShow,
  CreatePodcast,
  Search,
  HashtagFeed,
  EmailUnconfirmed,
  ConfirmEmail,
  PodcastDashboard,
  EpisodeShow,
  PasswordReset,
  ClaimPodcast
} from "./pages";
import { Route } from 'react-router-dom';
import { PrivateRoute } from "./auth";

import 'react-notifications/lib/notifications.css';

const token = localStorage.getItem('token');

const DefaultContainer = () => (
  <div>
    {token ? <Route exact component={Navigation} /> : <NoAuthNav />}
    <Route path="/u/:username" exact component={UserProfile} />
    <Route path="/search" exact component={Search} />
    <PrivateRoute path="/" exact component={Home} />
    <Route path="/hashtag/:name" component={HashtagFeed} />
    <Route path="/episode/:episodeId" component={EpisodeShow} />
    <PrivateRoute path="/podcast-dashboard" exact component={PodcastDashboard} />
    <div className="container">
      <NotificationContainer />
      <Route path="/claim-podcast/:token" component={ClaimPodcast} />
      <Route path="/password-reset/:token" exact component={PasswordReset} />
      <Route path="/email_unconfirmed" exact component={EmailUnconfirmed} />
      <Route path="/confirm_email/:token" component={ConfirmEmail} />
      <Route path="/podcast/:slug" component={PodcastShow} />
      <PrivateRoute path="/bookmarks" component={Bookmarks} />
      <PrivateRoute path="/notifications" exact component={Notifications} />
      <PrivateRoute path="/create-podcast" exact component={CreatePodcast} />
    </div>
  </div>
)

export default DefaultContainer;
