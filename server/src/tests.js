/*

- set user with 400 sats
- create podcast from rss feed
- confirm podcaster email (?)
- set guest share to 20%
- tag 2 guests for episode 1
- create 800 sat for that episode
- ensure guests get right amount
- ensure podcaster gets right amount
- have another user create a similar rek after viewing the first
- ensure first user gets appropriate influencer award
- ensure valueGenerated gets allocated right










- signUp:
  - username validation
  - twitter sign up
    - twitter sign up with username taken

- createPodcast
  - creates a podcast
  - create episodes
  - starts rss feed cron job
  - throws error if itunes rss isn't found
  - throws error if already exists

- createBookmark
  - creates a bookmark
  - create a notification


- createRek
  - if wallet funds are sufficient automatically
    creates rek and deducts from wallet
  - if wallet funds are insufficient deducts any
    wallet funds from wallet and invoice amount and
    wait for invoice before creating rek
  - invoice expires after 5 minutes
  - adds hashtags to rek (creates hashtags if they don't exist)
  - refunds invoice if something goes wrong after invoice is paid
  - if episode was seen before create parent reks
  - appropriately allocate reward to influencers (10% / # of influencers)
  - traverse rek tree to allocate valueGenerated and
    monthlyValueGenerated recurvisely
  - kick off monthlyValueGenerated cron job to deduct value in 1 month
  - if guestSharing is on allocate what ever satoshis
    are left AFTER the affiliate reward and the Rekr fee
    appropriately (guestSharing / # of guests)
  - give remaining sats to podcast creator
  - ensure affiliate rewards + guestSharing amounts
    - podcaster reward + rekr fee = original rek satoshis

- tagGuests
  - updates episode guests (deleting and creating)
  - only podcast creator can edit guestSharing

- auth
  - sensitive user information can only be seen by currentUser
  - users can only edit themselves
  - sensitive podcast information can only be seen the podcast creator


*/
