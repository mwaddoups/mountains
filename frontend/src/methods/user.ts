import { User } from "../models"

export function getName(user: User): string {
  if (!user) {
    return "<Deleted user>"
  } else if (!user.first_name && !user.last_name) {
    return "<Blank name>"
  } else {
    return `${user.first_name} ${user.last_name}`
  }
}