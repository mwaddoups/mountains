import { Link } from "react-router-dom";
import { useAuth } from "../Layout";
import { Calendar, ListTask } from "react-bootstrap-icons";

export default function EventsHeader() {
  const { currentUser } = useAuth();

  return (
    <div className="md:flex items-center">
      <div className="flex w-full items-center">
        <h1 className="text-xl md:text-3xl font-medium">Upcoming Events</h1>
        {(currentUser?.is_site_admin || currentUser?.is_walk_coordinator) && (
          <Link to="../new">
            <button className="ml-4 rounded bg-blue-500 hover:bg-blue-700 text-white text-sm p-2">
              Create event
            </button>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-2 md:justify-end w-full my-1">
        <Link to="..">
          <button className="flex items-center gap-1 border-2 border-blue-500 rounded hover:border-blue-700 hover:bg-gray-100 p-2">
            <ListTask /> <span>List</span>
          </button>
        </Link>
        <Link to="../calendar">
          <button className="flex items-center gap-1 border-2 border-blue-500 rounded hover:border-blue-700 hover:bg-gray-100 p-2">
            <Calendar /> <span>Calendar</span>
          </button>
        </Link>
      </div>
    </div>
  );
}
