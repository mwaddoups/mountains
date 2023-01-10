import { useCallback, useEffect, useState } from "react"
import { Star, StarFill } from "react-bootstrap-icons";
import api from "../../api"
import { Photo } from "../../models";

interface StarPhotoProps {
    photo: Photo
}

export default function StarPhoto({ photo }: StarPhotoProps) {
  const [starred, setStarred] = useState(photo.starred);

  useEffect(() => {
    api.get(
        `photos/${photo.id}/`
    ).then(
        res => setStarred(res.data.starred)
    );
  }, [photo])

  const toggleStarred = useCallback(e => {
    e.stopPropagation();

    api.post(
        `photos/${photo.id}/star/`, { }
    ).then(
        res => setStarred(res.data.starred)
    ); 
  }, [photo])

    return (
        <button className="ml-2" onClick={toggleStarred}>
            {starred ? <StarFill className="inline" /> : <Star className="inline" />}
        </button>
    )
}