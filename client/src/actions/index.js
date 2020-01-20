import gql from "graphql-tag";

const PARSE_PODCAST = gql`
  mutation ParsePodcast($rssUrl: String!) {
    parsePodcast(rssUrl: $rssUrl) {
      id
      title
      description
      rss
      email
      image
      website
      episodes {
        title
        description
        released
      }
    }
  }
`

const CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      username
      profilePic
      satoshis
      followedHashtags {
        id
        name
        followedByCurrentUser
      }
      bookmarks {
        count
      }
      reks {
        count
      }
      followers {
        count
      }
      following {
        count
      }
    }
  }
`

const CURRENT_SATS = gql`
  query CurrentSats {
    currentUser {
      satoshis
      canTweet
    }
  }
`

const UPDATE_USER = gql`
  mutation UpdateUser($email: String, $username: String, $password: String, $profilePic: Upload, $bio: String) {
    updateUser(email: $email, username: $username, password: $password, profilePic: $profilePic, bio: $bio) {
      username
      profilePic
    }
  }
`

const FEED_STREAM = gql`
  query FeedStream($n: Int!, $timePeriod: String!) {
    reks(n: $n, feed: true, timePeriod: $timePeriod) {
      more
      stream {
        id
        satoshis
        centuryValueGenerated
        weekValueGenerated
        monthValueGenerated
        user {
          id
          profilePic
          username
        }
        episode {
          title
          id
          bookmarked
          podcast {
            title
            image
            slug
          }
        }
        hashtags {
          name
          id
        }
      }
    }
  }
`

const GET_USER = gql`
  query GetUser($username: String!) {
    user(username: $username) {
      id
      profilePic
      satoshis
      username
      current
      bio
      followedByCurrentUser
      bookmarks {
        count
      }
      reks {
        count
      }
      followers {
        count
      }
      following {
        count
      }
    }
  }
`

const GET_PODCAST = gql`
  query GetPodcast($slug: String, $id: String, $token: String) {
    podcast(slug: $slug, id: $id, token: $token) {
      id
      title
      slug
      description
      rss
      email
      image
      website
      satoshis
      emailVerified
      episodes {
        id
        title
        description
        released
      }
    }
  }
`

const GET_EPISODE = gql`
  query GetEpisode($id: String!) {
    episode(id: $id) {
      title
      podcast {
        slug
        image
        title
      }
    }
  }
`

const EPISODE_SHOW = gql`
  query EpisodeShow($episodeId: String!, $rekId: String) {
    episodeShow(episodeId: $episodeId, rekId: $rekId) {
      rek {
        id
        hashtags {
          id
          name
        }
        user {
          username
          profilePic
        }
        satoshis
      }
      episode {
        id
        podcast {
          image
          slug
          title
        }
        bookmarked
        title
        released
        description
      }
    }
  }
`

const CREATE_PODCAST = gql`
  mutation CreatePodcast($title: String!, $rss: String!, $description: String, $email: String!, $website: String, $image: String!) {
    createPodcast(title: $title, rss: $rss, description: $description, email: $email, website: $website, image: $image) {
      id
      title
      description
      email
      image
      website
      slug
    }
  }
`

const CREATE_EPISODES = gql`
  mutation CreateEpisodes($episodes: [EpisodeInput], $podcastId: String!) {
    createEpisodes(episodes: $episodes, podcastId: $podcastId) {
      id
    }
  }
`

const SEARCH = gql`
  query Search($term: String!, $type: String!, $n: Int) {
    search(term: $term, type: $type, n: $n) {
      podcast {
        more
        stream {
          id
          title
          image
          slug
        }
      }
      user {
        more
        stream {
          id
          username
          profilePic
          followedByCurrentUser
        }
      }
      hashtag {
        more
        stream {
          id
          name
          followedByCurrentUser
        }
      }
    }
  }
`

const SEARCH_EPISODES = gql`
  query SearchEpisodes($term: String!) {
    search(term: $term, type: "episode") {
      episode {
        stream {
          id
          title
          podcast {
            image
          }
        }
      }
    }
  }
`

const SIGN_UP_USER = gql`
  mutation SignUp($email: String!, $username: String!, $password: String!, $passwordCopy: String!, $rekId: String) {
    createUser(email: $email, username: $username, password: $password, passwordCopy: $passwordCopy, rekId: $rekId) {
      id
      token
      username
      profilePic
      email
      hasPodcast
    }
  }
`

const LOGIN_USER = gql`
  mutation LogIn($username: String!, $password: String!) {
    logIn(username: $username, password: $password) {
      id
      token
      username
      profilePic
      email
      hasPodcast
    }
  }
`

const CREATE_REK = gql`
  mutation CreateRek($episodeId: String!, $tags: [TagInput], $walletSatoshis: Int, $invoiceSatoshis: Int) {
    createRek(episodeId: $episodeId, tags: $tags, walletSatoshis: $walletSatoshis, invoiceSatoshis: $invoiceSatoshis) {
      invoice
      satoshis
      rekId
    }
  }
`

const SUBSRIBE_INVOICE = gql`
  subscription SubscribeInvoice($invoice: String!) {
    invoicePaid(invoice: $invoice) {
      userId
      invoice
      rekId
    }
  }
`

const SUBSRIBE_HASHTAGS = gql`
  subscription SubscribeHashtags {
    hashtags {
      hashtag {
        id
        name
        followedByCurrentUser
      }
      follow
    }
  }
`

const TOGGLE_FOLLOW = gql`
  mutation ToggleFollow($followeeId: String, $hashtagId: String, $type: String!) {
    toggleFollow(followeeId: $followeeId, hashtagId: $hashtagId, type: $type)
  }
`

const CREATE_BOOKMARK = gql`
  mutation CreateBookmark($episodeId: String!, $rekId: String) {
    createBookmark(episodeId: $episodeId, rekId: $rekId) {
      bookmarkExists
    }
  }
`

const DESTROY_BOOKMARK = gql`
  mutation DestroyBookmark($episodeId: String!, $rekId: String) {
    destroyBookmark(episodeId: $episodeId, rekId: $rekId) {
      bookmarkExists
    }
  }
`

const BOOKMARKS = gql`
  query BookmarkStream($n: Int!) {
    bookmarks(n: $n) {
      more
      stream {
        id
        episode {
          id
          title
          bookmarked
          podcast {
            slug
            title
            image
            emailVerified
          }
        }
      }
    }
  }
`

const NOTIFICATIONS = gql`
  query NotificationStream($n: Int!) {
    notifications(n: $n) {
      more
      stream {
        id
        type
        satoshis
        notifier {
          username
          profilePic
        }
        rek {
          id
          episode {
            id
            title
            podcast {
              title
              slug
            }
          }
        }
      }
    }
  }
`

const DEPOSIT = gql`
  mutation Deposit($satoshis: Int!) {
    deposit(satoshis: $satoshis) {
      satoshis
      invoice
    }
  }
`

const WITHDRAW = gql`
  mutation Withdraw($invoice: String!, $podcastId: String) {
    withdraw(invoice: $invoice, podcastId: $podcastId) {
      success
      error
    }
  }
`

const FOLLOWER_STREAM = gql`
  query FollowerStream($userId: String, $n: Int!) {
    users(userId: $userId, n: $n, followers: true) {
      more
      stream {
        current
        id
        username
        profilePic
        followedByCurrentUser
      }
    }
  }
`

const FOLLOWING_STREAM = gql`
  query FollowingStream($userId: String, $n: Int!) {
    users(userId: $userId, n: $n, following: true) {
      more
      stream {
        current
        id
        username
        profilePic
        followedByCurrentUser
      }
    }
  }
`

const REK_STREAM = gql`
  query RekStream($n: Int!, $userId: String!) {
    reks(n: $n, userId: $userId) {
      more
      stream {
        id
        satoshis
        monthValueGenerated
        user {
          id
          profilePic
          username
        }
        episode {
          title
          id
          bookmarked
          podcast {
            title
            image
            slug
          }
        }
        hashtags {
          name
          id
        }
      }
    }
  }
`

const BOOKMARK_STREAM = gql`
  query BookmarkStream($userId: String, $n: Int!) {
    bookmarks(userId: $userId, n: $n) {
      more
      stream {
        id
        episode {
          id
          title
          bookmarked
          podcast {
            slug
            title
            image
          }
        }
      }
    }
  }
`

const GET_HASHTAG = gql`
  query GetHashtag($name: String!) {
    hashtag(name: $name) {
      id
      name
      followers
      followedByCurrentUser
    }
  }
`

const HASHTAG_FEED = gql`
  query HashtagFeed($name: String!, $n: Int!, $timePeriod: String!) {
    hashtagFeed(name: $name, n: $n, timePeriod: $timePeriod) {
      more
      stream {
        id
        weekValueGenerated
        monthValueGenerated
        centuryValueGenerated
        satoshis
        user {
          id
          profilePic
          username
        }
        episode {
          title
          id
          bookmarked
          podcast {
            title
            image
            slug
          }
        }
        hashtags {
          name
          id
        }
      }
    }
  }
`

const CONFIRM_EMAIL = gql`
  mutation ConfirmEmail($token: String!) {
    confirmEmail(token: $token) {
      podcast {
        id
      }
      user {
        id
      }
      loggedIn
    }
  }
`

const RESEND_USER_EMAIL = gql`
  mutation ResendUserEmail {
    resendUserEmail
  }
`

const RESEND_PODCAST_EMAIL = gql`
  mutation ResendPodcastEmail($podcastId: String!) {
    resendPodcastEmail(podcastId: $podcastId)
  }
`

const TWITTER_TOKEN = gql`
  mutation TwitterToken {
    twitterToken
  }
`

const TWITTER_ACCESS_TOKEN = gql`
  mutation TwitterAccessToken($requestToken: String!, $oathVerifier: String!) {
    twitterAccessToken(requestToken: $requestToken, oathVerifier: $oathVerifier) {
      username
      profilePic
      id
      token
      signIn
      hasPodcast
    }
  }
`

const PODCAST_DASHBOARD = gql`
  query PodcastDashboard {
    currentUser {
      podcasts {
        id
        title
        image
        description
        donationCount
        donationSum
        satoshis
        guestShare
        episodes {
          id
          title
          description
          released
          donationSum
          podcast {
            title
            image
            slug
          }
        }
      }
    }
  }
`

const GUEST_SHARE = gql`
  mutation GuestShare($percentage: Float!, $podcastId: String!) {
    guestShare(percentage: $percentage, podcastId: $podcastId)
  }
`

const TAG_GUEST = gql`
  mutation TagGuest($userIds: [String!], $episodeIds: [String!], $podcastId: String!) {
    tagGuest(userIds: $userIds, episodeIds: $episodeIds, podcastId: $podcastId)
  }
`

const EPISODE_GUESTS = gql`
  query EpisodeGuests($episodeId: String!) {
    episode(id: $episodeId) {
      guests {
        id
        username
        profilePic
      }
    }
  }
`

const RESET_PASSWORD_REQUEST = gql`
  mutation ResetPasswordRequest($email: String!) {
    resetPasswordRequest(email: $email)
  }
`
const RESET_PASSWORD = gql`
  mutation ResetPassword($token: String!, $password: String!, $passwordCopy: String!) {
    resetPassword(token: $token, password: $password, passwordCopy: $passwordCopy)
  }
`

const CREATE_REK_VIEW = gql`
  mutation CreateRekView($rekId: Int!) {
    createRekView(rekId: $rekId) {
      rek {
        id
      }
    }
  }
`

const DELETE_USER = gql`
  mutation DeleteUser {
    deleteUser
  }
`

export {
  PARSE_PODCAST,
  CURRENT_USER,
  FEED_STREAM,
  UPDATE_USER,
  CURRENT_SATS,
  GET_USER,
  GET_PODCAST,
  GET_EPISODE,
  CREATE_PODCAST,
  CREATE_EPISODES,
  SEARCH,
  SEARCH_EPISODES,
  SIGN_UP_USER,
  LOGIN_USER,
  CREATE_REK,
  SUBSRIBE_INVOICE,
  SUBSRIBE_HASHTAGS,
  TOGGLE_FOLLOW,
  CREATE_BOOKMARK,
  DESTROY_BOOKMARK,
  BOOKMARKS,
  NOTIFICATIONS,
  DEPOSIT,
  WITHDRAW,
  FOLLOWER_STREAM,
  FOLLOWING_STREAM,
  BOOKMARK_STREAM,
  REK_STREAM,
  GET_HASHTAG,
  HASHTAG_FEED,
  CONFIRM_EMAIL,
  RESEND_USER_EMAIL,
  RESEND_PODCAST_EMAIL,
  TWITTER_TOKEN,
  TWITTER_ACCESS_TOKEN,
  PODCAST_DASHBOARD,
  GUEST_SHARE,
  TAG_GUEST,
  EPISODE_GUESTS,
  EPISODE_SHOW,
  RESET_PASSWORD_REQUEST,
  RESET_PASSWORD,
  CREATE_REK_VIEW,
  DELETE_USER
};
