export type User = {
  id: number,
  first_name: string,
  last_name: string,
  mobile_number: string,
  about: string,
  profile_picture: string | undefined,
}


export type Event = {
  id: number,
  title: string,
  created_date: string,
  event_date: string,
  description: string,
  attendees: Array<User>,
  max_attendees: number | null,
  organiser: User | null,
}

export type FeedPost = {
  id: number,
  url: string,
  user: User,
  posted: string,
  text: string,
  comments: Array<Comment>,
}

export type Comment = {
  id: number,
  post_id: string,
  user: User,
  posted: string,
  text: string,
}