import { NamedProfileUser } from "../models"

export function getName(user: NamedProfileUser | undefined): string {
  if (!user) {
    return "<Deleted user>"
  } else if (!user.first_name && !user.last_name) {
    return "<Blank name>"
  } else {
    return `${user.first_name} ${user.last_name}`
  }
}

export function searchUsers<Type extends NamedProfileUser>(userList: Array<Type>, searchString: string): Array<Type> {
    return userList
      .filter(user => 
        searchString.split(" ").filter(k => k).some(keyword => (
            user.first_name.toLowerCase().includes(keyword.toLowerCase()) || user.last_name.toLowerCase().includes(keyword.toLowerCase())
          )
        )
      )
}