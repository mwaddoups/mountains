import { useEffect, useState } from "react";
import api from "../../api";
import { Kit } from "../../models";
import Loading from "../Loading";

export default function Inventory() {
    const [kitList, setKitList] = useState<Array<Kit>>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        api.get("kit/inventory").then(response => {
            setKitList(response.data);
            setLoading(false);
        });
    }, [setKitList])

    // TODO: Add kit adding to bottom here

    return (
        <Loading loading={loading}>
            {kitList 
            ? (
                <table>
                    <thead>
                        <tr></tr>
                    </thead>
                </table>

            )
            : <p>No kit found!</p>
            }
        </Loading>
    )

}