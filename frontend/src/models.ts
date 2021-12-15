export type User = {
  id: number,
  first_name: string,
  last_name: string,
  mobile_number: string,
  about: string,
}

export type Event = {
  id: number,
  title: string,
  created_date: Date,
  event_date: Date,
  description: string,
  attendees: Array<User>,
  max_attendees: number | null,
  organiser: User | null,
}